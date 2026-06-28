/**
 * 嵌图：crystal + ritual 嵌入 horoscope content
 * - crystal_year  -> <h2>Crystal of the Year...</h2> 后
 * - crystal_month -> <h2>Crystal of the Month...</h2> 后
 * - ritual (yearly)  -> <h2>Year-Long Crystal Ritual...</h2> 后
 * - ritual (monthly) -> <h2>Monthly Crystal Ritual...</h2> 后
 * 插入位置：H2 闭合 </h2>\n\n 之后，紧接 figure
 * 仅当图文件存在 + content 尚未嵌入该图时才嵌（幂等）
 * 用法：
 *   node embed-crystal-ritual-images.js              # 全部
 *   node embed-crystal-ritual-images.js --slug=aquarius-april-2026
 *   node embed-crystal-ritual-images.js --dry=1      # 只统计不写
 */
const fs = require('fs'), path = require('path');

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const dry = args.includes('--dry=1') || args.some(a => a.startsWith('--dry=1'));

const KB = 'D:/Code/knowledge-base';
const PROJECT_ROOT = path.join(KB, '02-网站规划');
const YEARLY_DIR = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/7.zodiac-yearly-horoscope/articles');
const MONTHLY_DIR = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/8.zodiac-monthly-horoscope/articles');

function buildFigure(img, absFile) {
  // 相对 WP 的 URL：goearthward.com wp-content/uploads/horoscope/...
  // 这里只构造本地 content 嵌入用的相对路径标记，WP 上传后由 upload 脚本替换为绝对 URL
  // 但本地 json content 用相对 file 路径（publish 时 upload 脚本会替换）
  const src = img.file.replace(/^assets\/images\/generated\//, '/wp-content/uploads/horoscope/');
  const alt = (img.alt || '').replace(/"/g, '&quot;');
  return `<figure class="wp-block-image size-large"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" /></figure>`;
}

function findH2End(content, patterns) {
  // patterns: 数组 of regex，匹配 H2 标签
  for (const re of patterns) {
    const m = content.match(re);
    if (m) return m.index + m[0].length; // </h2> 结束位置
  }
  return -1;
}

function insertAfterH2(content, endIdx, figure) {
  // 在 </h2> 之后插入（处理紧跟的 \n\n）
  const before = content.slice(0, endIdx);
  const after = content.slice(endIdx);
  // after 通常以 \n\n 开头，图插在 H2 和下一段之间
  const nnMatch = after.match(/^\n{1,3}/);
  const sep = nnMatch ? nnMatch[0] : '\n\n';
  return before + sep + figure + '\n\n' + after.slice(sep.length);
}

function alreadyEmbedded(content, src) {
  return content.includes(src);
}

function processArticle(filePath) {
  const a = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!a.images || !a.content) return { slug: a.slug, skipped: 'no images/content' };
  let content = a.content;
  const report = [];
  const isYearly = filePath.includes('7.zodiac-yearly-horoscope');

  // crystal
  const crystalKey = isYearly ? 'crystal_year' : 'crystal_month';
  const crystalImg = a.images[crystalKey];
  if (crystalImg) {
    const absFile = path.join(PROJECT_ROOT, crystalImg.file);
    if (fs.existsSync(absFile)) {
      const src = crystalImg.file.replace(/^assets\/images\/generated\//, '/wp-content/uploads/horoscope/');
      if (!alreadyEmbedded(content, src)) {
        const figure = buildFigure(crystalImg, absFile);
        const patterns = isYearly
          ? [/<h2[^>]*>\s*Crystal of the Year[^<]*<\/h2>/i]
          : [/<h2[^>]*>\s*Crystal of the Month[^<]*<\/h2>/i];
        const endIdx = findH2End(content, patterns);
        if (endIdx > 0) {
          content = insertAfterH2(content, endIdx, figure);
          report.push(`${crystalKey}:embedded`);
        } else report.push(`${crystalKey}:H2_NOT_FOUND`);
      } else report.push(`${crystalKey}:already`);
    } else report.push(`${crystalKey}:file_missing`);
  }

  // ritual
  const ritualImg = a.images['ritual'];
  if (ritualImg) {
    const absFile = path.join(PROJECT_ROOT, ritualImg.file);
    if (fs.existsSync(absFile)) {
      const src = ritualImg.file.replace(/^assets\/images\/generated\//, '/wp-content/uploads/horoscope/');
      if (!alreadyEmbedded(content, src)) {
        const figure = buildFigure(ritualImg, absFile);
        const patterns = isYearly
          ? [/<h2[^>]*>\s*Year-Long Crystal Ritual[^<]*<\/h2>/i]
          : [/<h2[^>]*>\s*Monthly Crystal Ritual[^<]*<\/h2>/i];
        const endIdx = findH2End(content, patterns);
        if (endIdx > 0) {
          content = insertAfterH2(content, endIdx, figure);
          report.push(`ritual:embedded`);
        } else report.push(`ritual:H2_NOT_FOUND`);
      } else report.push(`ritual:already`);
    } else report.push(`ritual:file_missing`);
  }

  if (content !== a.content) {
    if (!dry) {
      a.content = content;
      fs.writeFileSync(filePath, JSON.stringify(a, null, 2));
    }
    return { slug: a.slug, report, changed: true };
  }
  return { slug: a.slug, report, changed: false };
}

const dirs = [{ dir: YEARLY_DIR }, { dir: MONTHLY_DIR }];
let total = 0, changed = 0, embedded = 0;
const issues = [];
for (const { dir } of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const fp = path.join(dir, f);
    const a0 = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (slugArg && a0.slug !== slugArg) continue;
    total++;
    const r = processArticle(fp);
    if (r.changed) { changed++; embedded += r.report.filter(x => x.endsWith(':embedded')).length; }
    if (r.report.some(x => x.includes('NOT_FOUND') || x.includes('file_missing'))) issues.push(`${r.slug}: ${r.report.join(',')}`);
    if (slugArg) console.log(JSON.stringify(r, null, 2));
  }
}
console.log(`\n=== EMBED ${dry ? '(DRY)' : ''} articles=${total} changed=${changed} figuresEmbedded=${embedded} ===`);
if (issues.length) { console.log('ISSUES:'); issues.forEach(x => console.log('  ' + x)); }
