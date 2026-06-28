/**
 * 一次性脚本：清除月运文章 content 末尾的中文 nav 残留
 *
 * 背景：96 篇 6 月批次起的文章 content 末尾带中文上下月导航
 *   <em>回顾：{上月} · 展望：{下月} · 升维：{年度}</em>
 *
 * 目标：转为英文
 *   <em>Previous: X - Next: Y - Overview: Z</em>
 *
 * 替换规则（按顺序执行，避免词级替换与全角冒号替换互相干扰）：
 *   1. 词级：  回顾： → Previous:   展望： → Next:   升维： → Overview:
 *   2. 兜底全角冒号 ：→ :
 *   3. 中文间隔号 · → -
 *
 * 注意：词级替换把 "回顾：" 整体替换掉（含它后面的全角冒号），
 *       所以第 2 步的全角冒号兜底只会处理其他位置残留的全角冒号（如有）。
 *
 * 用法： node fix-nav-chinese.js            # 全量修 articles/*.json
 *        node fix-nav-chinese.js --dry-run  # 只统计不写回
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '..', 'articles');
const dryRun = process.argv.includes('--dry-run');

// 词级替换（标签词 + 紧跟其后的全角或半角冒号 + 可选空格，兼容两种 nav 格式）
//   格式A（多数）：回顾：X · 展望：Y · 升维：Z   （全角冒号 + 中文间隔号）
//   格式B（2月）：回顾: X - 展望: Y - 升维: Z   （半角冒号 + 半角连字符，仅标签词是中文）
// 输出统一为 "Previous: "（半角冒号 + 一个空格）
const WORD_REPLACES = [
  [/回顾[：:]\s*/g, 'Previous: '],
  [/展望[：:]\s*/g, 'Next: '],
  [/升维[：:]\s*/g, 'Overview: '],
];

function fixContent(content) {
  let out = content;
  let changed = false;
  for (const [re, rep] of WORD_REPLACES) {
    const next = out.replace(re, rep);
    if (next !== out) { out = next; changed = true; }
  }
  // 兜底：剩余全角冒号 → 半角
  if (out.includes('：')) { out = out.replace(/：/g, ':'); changed = true; }
  // 中文间隔号 → 英文连字符（两侧带空格，符合英文排版）
  if (out.includes('·')) { out = out.replace(/\s*·\s*/g, ' - '); changed = true; }
  return { out, changed };
}

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json')).sort();
let fixed = 0, scanned = 0, unchanged = 0;
const samples = [];

for (const file of files) {
  scanned++;
  const fp = path.join(ARTICLES_DIR, file);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (typeof data.content !== 'string') continue;

  const before = data.content;
  const { out: after, changed } = fixContent(before);

  if (!changed) {
    unchanged++;
    continue;
  }

  fixed++;
  if (samples.length < 3) {
    // 抓取 nav 片段用于抽检
    const m = after.match(/<em>Previous:[^<]*<\/em>/);
    samples.push({ file, nav: m ? m[0] : '(nav pattern not found in result)' });
  }

  if (!dryRun) {
    data.content = after;
    fs.writeFileSync(fp, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
}

console.log('=== fix-nav-chinese ===');
console.log('mode        : ' + (dryRun ? 'DRY-RUN (no write)' : 'WRITE'));
console.log('scanned     : ' + scanned);
console.log('fixed       : ' + fixed);
console.log('unchanged   : ' + unchanged);
console.log('\nsamples:');
for (const s of samples) console.log('  ' + s.file + '\n    ' + s.nav);
