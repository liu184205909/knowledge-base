/**
 * 删除 horoscope 月运文章 content 末尾的手动导航段。
 *
 * WoodMart 主题原生提供 prev/next 导航，手动段冗余，且 Next 常指向未发布的 future 文章（死链）。
 *
 * 导航标签词（同义"前一篇/后一篇/总览"，全部要删）：
 *   Previous, Next, Overview, Recap, Preview, Review, Zoom out, Year view
 *
 * 已知 4 种包裹格式（144 篇中 108 篇有导航，36 篇已干净）：
 *   A) 96篇  <em>Previous:...Overview:...</em></p>          （纯文本，p/em 包裹，</p> 收尾）
 *   B) 12篇  <p style="..."><em>Recap:<a>...Zoom out:<a>...</em></p>  （jan 带链接，p style 包裹）
 *   C) 12篇  <em>Previous:<a>...Overview:<a>...</em>  <hr>   （feb/apr/may 带链接，em 包裹，hr 收尾）
 *   D) 12篇  <p>Recap:...Preview:...Zoom out:...</p>          （march 带链接，p 包裹，&middot; 分隔）
 *
 * 策略：找含导航标签词的 <em>...</em> 或 <p...>...</p> 整段，
 *       向前吸收紧邻的开标签（若 em 已在 p 内则一起），向后吸收紧邻的 </p> 或 <hr>。
 *       不动 <h2>Related</h2>、<ul>、<p>More for...</p>、disclaimer。
 *
 * 用法：
 *   node remove-nav-segment.js --dry-run
 *   node remove-nav-segment.js
 *   node remove-nav-segment.js --slug=aries-january-2026
 */
const fs = require('fs'), path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '..', 'articles');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

// 导航标签词（含冒号）
const NAV_KW = [
  'Previous:', 'Next:', 'Overview:',
  'Recap:', 'Preview:', 'Review:',
  'Zoom out:', 'Year view:'
];

// 匹配 <em>...</em> 或 <p ...>...</p>（非贪婪，允许内部任意字符含嵌套标签）
const reBlock = /<(em|p)(\s+[^>]*)?>[\s\S]*?<\/\1>/gi;

function isNavBlock(seg) {
  return NAV_KW.some(k => seg.includes(k));
}

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json')).sort();
const sel = slugArg ? files.filter(f => f === slugArg + '.json') : files;

let removed = 0, alreadyClean = 0, warned = 0;
const warnings = [];

for (const file of sel) {
  const fp = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const orig = a.content || '';

  reBlock.lastIndex = 0;
  let m;
  let navBlock = null;     // {start, end}
  let blockCount = 0;

  while ((m = reBlock.exec(orig)) !== null) {
    blockCount++;
    const seg = m[0];
    if (!isNavBlock(seg)) continue;
    if (navBlock) {
      // 一篇内出现第二个导航块，告警
      warnings.push(file + ': 出现多个导航块，仅删第一个');
      break;
    }
    navBlock = { start: m.index, end: m.index + seg.length, raw: seg };
  }

  if (!navBlock) {
    if (NAV_KW.some(k => orig.includes(k))) {
      warned++;
      warnings.push(file + ': 含导航关键词但未匹配到 em/p 块');
    } else {
      alreadyClean++;
    }
    continue;
  }

  // 边界吸收
  let start = navBlock.start;
  let end = navBlock.end;

  // 若导航块是 <em> 且前方紧邻 <p>/<p style> 开标签（中间仅空白），吸收 <p>
  const isOpenEm = /^<em/i.test(navBlock.raw);
  if (isOpenEm) {
    const headRegion = orig.slice(Math.max(0, start - 100), start);
    const leadM = headRegion.match(/(\s*<p(?:\s+[^>]*)?>\s*)$/i);
    if (leadM) start = start - leadM[1].length;
  }

  // 向后吸收 </p> 或 <hr>（中间仅空白）
  const tailRegion = orig.slice(end, end + 40);
  const trailM = tailRegion.match(/^(\s*(?:<\/p>|<hr\s*\/?>)\s*)/i);
  if (trailM) end = end + trailM[1].length;

  const removedText = orig.slice(start, end);
  const newContent = orig.slice(0, start) + orig.slice(end);

  // 残留检查
  const residue = NAV_KW.filter(k => newContent.includes(k));
  if (residue.length) {
    warned++;
    warnings.push(file + ': 删除后残留 ' + JSON.stringify(residue));
    continue;
  }

  removed++;
  if (dryRun) {
    if (removed <= 8 || removed % 20 === 0) {
      console.log('DRY [' + removed + '] ' + file + ' -' + removedText.length + 'c: ' + removedText.slice(0, 70).replace(/\n/g, ' '));
    }
  } else {
    a.content = newContent;
    fs.writeFileSync(fp, JSON.stringify(a, null, 2), 'utf8');
    if (removed <= 8 || removed % 20 === 0) console.log('✅ [' + removed + '] ' + file + ' 删 ' + removedText.length + ' 字符');
  }
}

console.log('\n=== remove-nav-segment ' + (dryRun ? '(DRY-RUN)' : '(WRITE)') + ' ===');
console.log('processed : ' + sel.length);
console.log('removed   : ' + removed);
console.log('clean     : ' + alreadyClean + ' (本就无导航)');
console.log('warned    : ' + warned);
if (warnings.length) {
  console.log('--- warnings ---');
  warnings.forEach(w => console.log('  ' + w));
}
