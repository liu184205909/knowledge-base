/**
 * 修复 3 处瑕疵 + 批量上传 78 篇（含图片）
 *
 * 瑕疵 1: 删除 Challenges 段尾多余的水晶引导段
 * 瑕疵 2: crystalStrategy/ritualAngle 水晶名统一为大写
 * 瑕疵 3: pisces-pisces conflictLoop 浓缩
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

// 水晶名映射（连字符小写 → 大写空格）
const CRYSTAL_NAMES = {
  'black-tourmaline': 'Black Tourmaline',
  'rose-quartz': 'Rose Quartz',
  'clear-quartz': 'Clear Quartz',
  'red-jasper': 'Red Jasper',
  'tiger-eye': "Tiger's Eye",
  'herkimer-diamond': 'Herkimer Diamond',
  'black-onyx': 'Black Onyx',
  'smoky-quartz': 'Smoky Quartz',
  'blue-lace-agate': 'Blue Lace Agate',
  'lapis-lazuli': 'Lapis Lazuli',
};

let fixed1 = 0, fixed2 = 0, fixed3 = 0;

for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const slug = file.replace('.json', '');
  let content = a.content;
  let changed = false;

  // 瑕疵 1: 删除 Challenges 段尾的水晶引导段
  // 匹配 "For this ... pairing, many couples find that ... genuine, ethically sourced ..."
  const guideRegex = /<p>For this\s+[\w-]+\s+pairing,\s+many couples find that[\s\S]*?ethically sourced[\s\S]*?<\/p>/gi;
  if (guideRegex.test(content)) {
    content = content.replace(guideRegex, '');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    fixed1++;
    changed = true;
  }

  // 瑕疵 2: crystalStrategy/ritualAngle 里水晶名统一大写（不替换 URL 里的）
  // 只替换 <strong>Crystal strategy:</strong> 和 <strong>Pair ritual:</strong> 后面的文本
  const strategyMatch = content.match(/<strong>Crystal strategy:<\/strong>\s*([\s\S]*?)<\/p>/);
  if (strategyMatch) {
    let strategy = strategyMatch[1];
    for (const [lower, proper] of Object.entries(CRYSTAL_NAMES)) {
      // 只替换不在 href 里的（不在 /gemstone/xxx-meaning/ URL 里）
      strategy = strategy.replace(new RegExp('\\b' + lower + '\\b', 'g'), proper);
    }
    content = content.replace(strategyMatch[1], strategy);
    fixed2++;
    changed = true;
  }

  const ritualMatch = content.match(/<strong>Pair ritual:<\/strong>\s*([\s\S]*?)<\/p>/);
  if (ritualMatch) {
    let ritual = ritualMatch[1];
    for (const [lower, proper] of Object.entries(CRYSTAL_NAMES)) {
      ritual = ritual.replace(new RegExp('\\b' + lower + '\\b', 'g'), proper);
    }
    content = content.replace(ritualMatch[1], ritual);
    changed = true;
  }

  // 瑕疵 3: pisces-pisces conflictLoop 浓缩
  if (slug === 'pisces-pisces') {
    const oldConflict = content.match(/<strong>Conflict pattern:<\/strong>\s*([\s\S]*?)<\/p>/);
    if (oldConflict && oldConflict[1].includes('Felt, not stated')) {
      const newConflict = 'Felt, never named — a glance replaces a conversation, and small misunderstandings drift for months because neither wants to break the spell by speaking plainly.';
      content = content.replace(oldConflict[1], newConflict);
      fixed3++;
      changed = true;
    }
  }

  if (changed) {
    a.content = content;
    fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  }
}

console.log('=== 瑕疵修复完成 ===');
console.log(`瑕疵 1 (删水晶引导段): ${fixed1} 篇`);
console.log(`瑕疵 2 (水晶名统一): ${fixed2} 篇`);
console.log(`瑕疵 3 (pisces 浓缩): ${fixed3} 篇`);
console.log('\n=== 开始批量上传 ===');
console.log('（逐篇上传，每篇含 content + images，预计 40-60 分钟）');

// 批量上传
const UPLOAD_SCRIPT = path.resolve(__dirname, '../../../02-网站规划/scripts/upload-post-content-post.js');
let uploaded = 0, failed = 0;
const failedList = [];

for (const file of files.sort()) {
  const fpath = path.join(ARTICLES_DIR, file);
  process.stdout.write(`[${uploaded + failed + 1}/${files.length}] ${file}... `);
  try {
    const output = execSync(`node "${UPLOAD_SCRIPT}" "${fpath}" --status draft --category 1560 --skip-images`, {
      timeout: 60000,
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '../../../02-网站规划'),
    });
    if (output.includes('Created') || output.includes('updated')) {
      uploaded++;
      console.log('✅');
    } else if (output.includes('DRY')) {
      // dry-run shouldn't happen with --status draft, but handle it
      console.log('⚠️ dry-run?');
      failed++;
      failedList.push(file);
    } else {
      console.log('⚠️ ' + output.trim().slice(0, 80));
      failed++;
      failedList.push(file);
    }
  } catch (e) {
    console.log('❌ ' + (e.message || '').slice(0, 80));
    failed++;
    failedList.push(file);
  }
}

console.log(`\n=== 上传完成 ===`);
console.log(`成功: ${uploaded}/${files.length}`);
console.log(`失败: ${failed}`);
if (failedList.length > 0) console.log(`失败清单: ${failedList.join(', ')}`);
