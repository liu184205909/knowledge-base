/**
 * 批量上传文章到 WordPress — 遍历目录下所有 JSON，逐篇调用 upload-post-content-post.js
 *
 * Usage:
 *   node batch-upload-posts.js <articlesDir> --status draft --upload-images [--category <id>]
 *   node batch-upload-posts.js <articlesDir> --publish --upload-images [--category <id>]
 *   node batch-upload-posts.js <articlesDir> --schedule "2026-07-01T09:00:00" --upload-images [--category <id>]
 *
 * 注意：
 *   - 默认 dry-run（不连 WP）
 *   - --upload-images: 上传 featured 图为 featured_media
 *   - --category: 设置 WP 分类 ID
 *   - 跳过已上传的文章（检查 slug 是否已存在）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const dir = args.find(a => !a.startsWith('--'));
if (!dir) {
  console.error('Usage: node batch-upload-posts.js <articlesDir> --status draft --upload-images [--category <id>]');
  process.exit(1);
}

const statusIdx = args.indexOf('--status');
const statusVal = statusIdx >= 0 ? args[statusIdx + 1] : null;
const publish = args.includes('--publish');
const scheduleIdx = args.indexOf('--schedule');
const scheduleDate = scheduleIdx >= 0 ? args[scheduleIdx + 1] : null;
const uploadImages = args.includes('--upload-images');
const categoryIdx = args.indexOf('--category');
const categoryId = categoryIdx >= 0 ? args[categoryIdx + 1] : null;

const scriptPath = path.resolve(__dirname, 'upload-post-content-post.js');
const files = fs.readdirSync(path.resolve(dir)).filter(f => f.endsWith('.json')).sort();

console.log(`批量上传: ${files.length} 篇文章`);
console.log(`目录: ${dir}`);
console.log(`状态: ${publish ? 'publish' : scheduleDate ? 'future' : statusVal || 'dry-run'}`);
console.log(`上传图片: ${uploadImages}`);
console.log(`分类 ID: ${categoryId || '(不设置)'}`);
if (scheduleDate) console.log(`定时: ${scheduleDate}`);
console.log('---\n');

let uploaded = 0, failed = 0;
const startTime = Date.now();

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const jsonPath = path.resolve(dir, file);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

  process.stdout.write(`[${i+1}/${files.length}] ${file} (${elapsed}s)... `);

  // 构建命令参数
  const cmdParts = ['node', `"${scriptPath}"`, `"${jsonPath}"`];
  if (publish) cmdParts.push('--publish');
  else if (scheduleDate) cmdParts.push('--schedule', `"${scheduleDate}"`);
  else if (statusVal) cmdParts.push('--status', statusVal);
  if (uploadImages) cmdParts.push('--upload-images');
  if (categoryId) cmdParts.push('--category', categoryId);

  try {
    const output = execSync(cmdParts.join(' '), {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 120000,
    });
    const lines = output.toString().split('\n').filter(l => l.trim());
    // 取最后几行作为结果
    const lastLines = lines.slice(-3).join(' | ');
    console.log('✓ ' + lastLines.slice(0, 120));
    uploaded++;
  } catch (e) {
    failed++;
    const msg = (e.stderr || e.stdout || e.message || '').toString();
    const lastLine = msg.split('\n').filter(l => l.trim()).pop() || msg;
    console.log(`✗ ${lastLine.slice(0, 120)}`);
  }

  // 每 10 篇进度
  if ((i + 1) % 10 === 0) {
    const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    console.log(`  --- 进度 ${i+1}/${files.length}, ${totalElapsed}s, 成功=${uploaded} 失败=${failed} ---`);
  }
}

const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
console.log(`\n=== 完成 ===`);
console.log(`总计: ${files.length}`);
console.log(`成功: ${uploaded}`);
console.log(`失败: ${failed}`);
console.log(`耗时: ${totalTime}s (${(totalTime/60).toFixed(1)}min)`);
