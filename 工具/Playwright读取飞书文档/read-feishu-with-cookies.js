/**
 * Playwright 读取飞书文档脚本
 *
 * 使用方法:
 * 1. 先运行 node get-feishu-cookies.js 查看如何获取 Cookies
 * 2. 将 Cookies 保存到 feishu-cookies.json
 * 3. 运行此脚本: node read-feishu-with-cookies.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function readFeishuDoc() {
  const browser = await chromium.launch({
    headless: false, // 显示浏览器窗口,方便调试
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  // 读取 Cookies 文件
  const cookiesPath = path.join(__dirname, 'feishu-cookies.json');

  if (!fs.existsSync(cookiesPath)) {
    console.error('❌ 找不到 feishu-cookies.json 文件');
    console.log('请先运行: node get-feishu-cookies.js');
    await browser.close();
    return;
  }

  const cookiesData = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));

  // 添加 Cookies
  await context.addCookies(cookiesData.cookies || cookiesData);

  console.log('✅ Cookies 已加载');

  // 访问飞书文档
  const url = 'https://waytoagi.feishu.cn/wiki/YVC3wnT3NixTF1kVC5RckX16ney';
  console.log(`📄 正在访问: ${url}`);

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // 等待页面加载
    await page.waitForTimeout(5000);

    // 检查是否需要登录
    const pageTitle = await page.title();
    console.log(`页面标题: ${pageTitle}`);

    // 尝试提取文档内容
    const content = await page.evaluate(() => {
      // 方法1: 尝试从 DOM 中提取
      const selectors = [
        '.wiki-content',
        '.content',
        '[class*="wiki"]',
        '[class*="document"]',
        'article',
        'main'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.length > 100) {
          return {
            method: 'DOM selector',
            selector,
            content: element.textContent.trim()
          };
        }
      }

      // 方法2: 获取整个 body
      return {
        method: 'body text',
        content: document.body.textContent.trim()
      };
    });

    if (content.content) {
      console.log('\n========================================');
      console.log('✅ 成功读取文档内容!');
      console.log('========================================\n');
      console.log(content.content);

      // 保存到文件
      const outputPath = path.join(__dirname, 'feishu-doc-content.txt');
      fs.writeFileSync(outputPath, content.content, 'utf-8');
      console.log(`\n📁 内容已保存到: ${outputPath}`);
    } else {
      console.log('❌ 未能提取到内容,可能需要手动登录');
    }

    // 截图保存
    const screenshotPath = path.join(__dirname, 'feishu-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 截图已保存到: ${screenshotPath}`);

    // 保持浏览器打开 30 秒,方便手动操作
    console.log('\n浏览器将保持打开 30 秒...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }

  await browser.close();
}

// 运行
readFeishuDoc().catch(console.error);
