/**
 * 全局修复 URL 结构 + 重新上传工具页面
 *
 * 1. /zodiac-compatibility/{signA}-{signB}/ → /{signA}-{signB}/
 * 2. /crystal-combinations/{a}-and-{b}/ → /{a}-and-{b}/
 * 3. Crystal Checker 只保留一个 SEO 按钮
 * 4. 重新上传 page 43180 + 43246
 */
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶';
const signs = 'aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces';

// 星座配对 URL 替换：/aries-taurus → /aries-taurus
const reZodiac = new RegExp('/zodiac-compatibility/(?=(' + signs + ')[-_])', 'g');
// 水晶配对 URL 替换：/amethyst-and-citrine → /amethyst-and-citrine
const reCrystal = /\/crystal-combinations\/(?=[a-z]+-and-[a-z])/g;

function walkDir(dir, exts) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results.push(...walkDir(full, exts));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).slice(1);
      if (exts.includes(ext)) results.push(full);
    }
  }
  return results;
}

const files = walkDir(ROOT, ['js', 'html', 'json', 'md']);
let totalZodiac = 0, totalCrystal = 0, modifiedFiles = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  const zodiacMatches = content.match(reZodiac);
  if (zodiacMatches) {
    content = content.replace(reZodiac, '/');
    totalZodiac += zodiacMatches.length;
    changed = true;
  }

  const crystalMatches = content.match(reCrystal);
  if (crystalMatches) {
    content = content.replace(reCrystal, '/');
    totalCrystal += crystalMatches.length;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    modifiedFiles++;
  }
}

console.log('=== URL 全局修复完成 ===');
console.log('星座配对: ' + totalZodiac + ' 处替换');
console.log('水晶配对: ' + totalCrystal + ' 处替换');
console.log('修改文件: ' + modifiedFiles + ' 个');

// 验证
const sample = fs.readFileSync(ROOT + '/04-内容生产/4.zodiac-compatibility/articles/aries-taurus.json', 'utf8');
console.log('\n=== 验证 aries-taurus.json ===');
const urlMatch = sample.match(/\/zodiac-compatibility\//g);
console.log('残留 /zodiac-compatibility/:', urlMatch ? urlMatch.length : 0);
const rootUrl = sample.match(/\/aries-taurus\//g);
console.log('根级 /aries-taurus/:', rootUrl ? rootUrl.length : 0);

// 上传工具页面
const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(env.match(/WP_USER=(.+)/)[1].trim() + ':' + env.match(/WP_APP_PASSWORD=(.+)/)[1].trim()).toString('base64');

function uploadPage(pageId, content) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ content });
    const req = https.request({
      hostname: SITE, path: '/wp-json/wp/v2/pages/' + pageId, method: 'POST',
      headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 120000
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { const r = JSON.parse(d); resolve(r.id ? 'OK ' + r.id : 'FAIL'); }
        catch (e) { resolve('FAIL: ' + d.slice(0, 100)); }
      });
    });
    req.write(body); req.end();
  });
}

async function main() {
  const visualDir = ROOT + '/07-互动工具/03-视觉层';

  // Crystal Checker — 只一个 SEO 按钮
  const toolHtml = fs.readFileSync(visualDir + '/crystal-checker.html', 'utf8');
  const seoHtml = fs.readFileSync(visualDir + '/seo-content.html', 'utf8');
  const crystalContent = '<!-- wp:html -->\n' + toolHtml + '\n<!-- /wp:html -->\n\n<!-- wp:html -->\n<details style="margin-top:40px;"><summary style="cursor:pointer;font-size:18px;font-weight:600;color:#1A1A2E;padding:16px 20px;background:#E8E8E8;border:1px solid #DDD;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.08);">Learn More About Crystal Compatibility</summary><div style="padding:20px 0;">\n' + seoHtml + '\n</div></details>\n<!-- /wp:html -->';

  console.log('\n=== 上传 Crystal Checker (1 个 SEO 按钮) ===');
  const r1 = await uploadPage(43180, crystalContent);
  console.log('Crystal Checker:', r1);

  // Zodiac Checker
  const zodiacHtml = fs.readFileSync(visualDir + '/zodiac-checker.html', 'utf8');
  const zodiacContent = '<!-- wp:html -->\n' + zodiacHtml + '\n<!-- /wp:html -->';
  console.log('\n=== 上传 Zodiac Checker ===');
  const r2 = await uploadPage(43246, zodiacContent);
  console.log('Zodiac Checker:', r2);

  // 验证 Crystal Checker SEO 按钮数量
  const verify = await new Promise(resolve => {
    https.get({ hostname: SITE, path: '/wp-json/wp/v2/pages/43180', headers: { Authorization: AUTH } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        const c = JSON.parse(d).content?.rendered || '';
        resolve((c.match(/Learn More About Crystal Compatibility/g) || []).length);
      });
    });
  });
  console.log('\nCrystal Checker SEO 按钮数量:', verify);
}

main().catch(e => console.error(e.message));
