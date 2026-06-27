/**
 * 批量生图 — 遍历目录下所有文章 JSON，逐篇调用生图 API
 *
 * Usage:
 *   node batch-generate-images.js <articlesDir> [--quality low] [--skip-existing]
 *
 * --skip-existing: 如果 webp 文件已存在则跳过（断点续跑）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const dir = path.resolve(args.find((a, i) => !a.startsWith('--') && args[i-1] !== '--quality'));
const quality = args.includes('--quality') ? args[args.indexOf('--quality')+1] : 'low';
const skipExisting = args.includes('--skip-existing');

if (!dir || !fs.existsSync(dir)) {
  console.error('Usage: node batch-generate-images.js <articlesDir> [--quality low] [--skip-existing]');
  process.exit(1);
}

const scriptPath = path.resolve(__dirname, 'generate-crystal-images.js');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const PROJECT_ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.join(PROJECT_ROOT, 'assets/images/generated');

// 推断输出目录名（和 generate-crystal-images.js 同逻辑）
const parentName = path.basename(path.dirname(dir));
const prodDir = parentName === 'articles' ? path.basename(path.dirname(path.dirname(dir))) : parentName;

console.log(`批量生图: ${files.length} 篇文章`);
console.log(`输出目录: ${GENERATED_DIR}/${prodDir}/`);
console.log(`质量: ${quality}`);
console.log(`跳过已有: ${skipExisting}`);
console.log('---');

let generated = 0, skipped = 0, failed = 0;
const startTime = Date.now();

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const jsonPath = path.join(dir, file);
  const a = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const slug = a.slug || file.replace('.json', '');

  // 检查是否所有图片都已存在
  if (skipExisting && a.images) {
    const outDir = path.join(GENERATED_DIR, prodDir, slug.replace(/-meaning$|-crystals$/, ''));
    const allExist = Object.values(a.images).every(img => {
      if (!img.file) return false;
      const fullPath = path.join(PROJECT_ROOT, img.file);
      return fs.existsSync(fullPath);
    });
    if (allExist) {
      skipped++;
      continue;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  process.stdout.write(`[${i+1}/${files.length}] ${slug} (${elapsed}s)... `);

  try {
    execSync(`node "${scriptPath}" "${jsonPath}" --quality ${quality}`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 300000, // 5 分钟超时
    });
    generated++;
    console.log('✓');
  } catch (e) {
    failed++;
    const msg = (e.stderr || e.stdout || e.message || '').toString().slice(-200);
    console.log(`✗ ${msg.replace(/\n/g, ' ').slice(0, 100)}`);
  }

  // 每 10 篇输出进度
  if ((i + 1) % 10 === 0) {
    const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const avg = (totalElapsed / (i + 1)).toFixed(1);
    console.log(`  --- 进度 ${i+1}/${files.length}, 平均 ${avg}s/篇, 生成=${generated} 跳过=${skipped} 失败=${failed} ---`);
  }
}

const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
console.log(`\n=== 完成 ===`);
console.log(`总计: ${files.length} 篇`);
console.log(`生成: ${generated}`);
console.log(`跳过: ${skipped}`);
console.log(`失败: ${failed}`);
console.log(`耗时: ${totalTime}s (${(totalTime/60).toFixed(1)}min)`);
