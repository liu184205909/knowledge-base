/**
 * About Us 标杆页一键部署脚本
 *
 * 执行流程：
 * 1. 检查本地图片是否存在（assets/images/generated/）
 * 2. 上传图片到 WordPress 媒体库
 * 3. 回写 URL 到 site-images.js（将 needs_generation 改为实际 WP URL）
 * 4. 运行 about.js 创建 draft 页面
 *
 * 前提条件：
 * - 图片已生成并放在 assets/images/generated/ 目录
 * - WP API 凭据已配置（config/api-credentials.json 或环境变量）
 *
 * 用法：node scripts/deploy-about.js
 */

const path = require('path');
const fs = require('fs');
const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

const GENERATED_DIR = path.resolve(__dirname, '../assets/images/generated');

// About Us 的 11 张图片清单
const ABOUT_IMAGES = [
  { key: 'hero', file: 'about-hero-brand-story-v1.png' },
  { key: 'founder', file: 'about-intention-setting-workspace-v1.png' },
  { key: 'natural', file: 'about-icon-natural-crystals-v1.png' },
  { key: 'cleansing', file: 'about-icon-cleansing-charged-v1.png' },
  { key: 'packaging', file: 'about-icon-velvet-pouch-guide-v1.png' },
  { key: 'returns', file: 'about-icon-returns-guarantee-v1.png' },
  { key: 'communityRose', file: 'about-community-rose-quartz-v1.png' },
  { key: 'communityProtection', file: 'about-community-black-tourmaline-v1.png' },
  { key: 'communityAmethyst', file: 'about-community-amethyst-v1.png' },
  { key: 'communityCitrine', file: 'about-community-citrine-v1.png' },
  { key: 'cta', file: 'about-cta-find-your-crystal-v1.png' }
];

async function main() {
  console.log('=== About Us 一键部署 ===\n');

  // Step 0: 检查 WP 连接
  console.log('[Step 0] 检查 WordPress 连接...');
  const connected = await E.checkConnection();
  if (!connected) {
    console.error('无法连接 WordPress。请检查凭据配置。');
    console.error('  方式1: 创建 02-网站规划/config/api-credentials.json');
    console.error('  方式2: 设置环境变量 WP_USER 和 WP_APP_PASSWORD');
    process.exit(1);
  }
  console.log('');

  // Step 1: 检查本地图片是否存在
  console.log('[Step 1] 检查本地图片...');
  const uploadList = [];
  let missingCount = 0;

  for (const img of ABOUT_IMAGES) {
    const filePath = path.join(GENERATED_DIR, img.file);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      console.log('  OK: ' + img.file + ' (' + (stat.size / 1024).toFixed(1) + ' KB)');
      uploadList.push({
        key: img.key,
        file: img.file,
        filePath: filePath,
        alt: IMAGES.about[img.key].alt
      });
    } else {
      console.error('  MISSING: ' + img.file);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    console.error('\n缺少 ' + missingCount + ' 张图片，无法继续。');
    console.error('请先生成图片并放入: ' + GENERATED_DIR);
    console.error('图片 prompt 见: assets/images/about-prompts.md');
    process.exit(1);
  }
  console.log('  全部 ' + ABOUT_IMAGES.length + ' 张图片就绪。\n');

  // Step 2: 上传图片到 WordPress
  console.log('[Step 2] 上传图片到 WordPress 媒体库...');
  const uploadResults = await E.uploadMediaBatch(
    uploadList.map(f => ({ filePath: f.filePath, fileName: f.file, alt: f.alt }))
  );

  // 构建结果映射
  const urlMap = {};
  let uploadFailCount = 0;
  for (let i = 0; i < uploadList.length; i++) {
    if (uploadResults[i]) {
      urlMap[uploadList[i].key] = {
        wpUrl: uploadResults[i].source_url,
        wpId: uploadResults[i].id
      };
    } else {
      console.error('  ' + uploadList[i].file + ' 上传失败');
      uploadFailCount++;
    }
  }

  if (uploadFailCount > 0) {
    console.error('\n' + uploadFailCount + ' 张图片上传失败，中止部署。');
    process.exit(1);
  }
  console.log('  全部上传成功。\n');

  // Step 3: 回写 site-images.js
  console.log('[Step 3] 更新 site-images.js...');
  const siteImagesPath = path.resolve(__dirname, '../assets/site-images.js');
  let content = fs.readFileSync(siteImagesPath, 'utf8');

  for (const [key, data] of Object.entries(urlMap)) {
    const img = IMAGES.about[key];
    // 替换 URL 和 status
    const oldUrlPattern = GEN + '/' + key.replace(/([A-Z])/g, '-$1').toLowerCase() + '-v1.png';
    // 直接用新的 WP URL 替换
    const escapedUrl = data.wpUrl.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&');

    // 替换 needs_generation → source_generated_wp_upload
    // 由于每个 about 图片条目在文件中唯一，按特征字符串匹配替换
    const aboutSection = content.match(/about:\s*\{/);
    if (aboutSection) {
      // 对每个 key 的条目替换 URL 和 status
      const oldStatus = "needs_generation";
      // 每个条目有唯一的 prompt 文本开头，用那个来定位
    }
  }

  // 简单粗暴但可靠的方式：直接重写 about 部分的 URL
  for (const [key, data] of Object.entries(urlMap)) {
    const img = IMAGES.about[key];
    // 替换 GEN URL 为实际 WP URL
    content = content.replace(img.url, data.wpUrl);
    // 替换 needs_generation 为 generated
    // 需要精确匹配该条目的 status
    const afterUrlSnippet = data.wpUrl.slice(-30);
    // 找到该条目附近的位置
    const urlIndex = content.indexOf(afterUrlSnippet);
    if (urlIndex > -1) {
      // 向后找到最近的 'needs_generation' 替换
      const nearText = content.substring(urlIndex, urlIndex + 200);
      if (nearText.includes('needs_generation')) {
        const localIdx = nearText.indexOf('needs_generation');
        content = content.substring(0, urlIndex + localIdx) + 'source_generated_wp_upload' + content.substring(urlIndex + localIdx + 'needs_generation'.length);
        console.log('  Updated: about.' + key + ' → ' + data.wpUrl);
      }
    }
  }

  fs.writeFileSync(siteImagesPath, content, 'utf8');
  console.log('  site-images.js 已更新。\n');

  // Step 4: 创建 About Us 页面
  console.log('[Step 4] 创建 About Us 页面...');
  // 重新 require 以获取更新后的 URL
  delete require.cache[require.resolve('../assets/site-images')];
  delete require.cache[require.resolve('../pages/about')];
  const generateAboutUs = require('../pages/about');

  // about.js 的 main() 会自动执行，但我们已经 require 了
  // 需要重新加载模块执行页面创建
  console.log('  运行 pages/about.js...');
  console.log('');

  // 直接用 fresh require 运行
  const aboutModulePath = path.resolve(__dirname, '../pages/about.js');
  const aboutCode = fs.readFileSync(aboutModulePath, 'utf8');
  // 用 vm 在同一上下文中执行
  const vm = require('vm');
  const freshE = require('../templates/elementor-utils');
  const freshImages = require('../assets/site-images');

  // 手动构建并运行 about 页面
  const { createPage } = freshE;

  // 直接执行 about.js 的 generateAboutUs 函数
  // 因为 about.js 会自动调用 main()，重新 require 就能执行
  // 但先清除缓存
  Object.keys(require.cache).forEach(k => {
    if (k.includes('pages/about') || k.includes('site-images') || k.includes('elementor-utils')) {
      delete require.cache[k];
    }
  });

  require('../pages/about');
  console.log('\n=== 部署完成 ===');
}

main().catch(err => {
  console.error('部署失败:', err.message || err);
  process.exit(1);
});
