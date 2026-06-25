/**
 * 修复 aries-crystals draft(43158) 的 5 条 404 内链 + 补写 Rank Math SEO meta。
 *
 * 404 根因：
 *   - /gemstone/quartz-meaning/、/gemstone/bloodstone-meaning/ —— 站上无 Clear Quartz / Bloodstone 的 meaning 页
 *   - /horoscope/aries-2026-07/、/aries-gemini/、/zodiac-crystals/ —— P2月运 / P1配对 / hub 尚未生产
 * 处理：摘掉这 5 条失效链接（保留有效内链 ≥8 条，仍满足框架"≥5 内链"）。集群页待 P1/P2/hub 上线后再加回。
 *
 * 用法：node fix-aries-links.js
 * 幂等：可重复运行（已删片段 NOT FOUND 跳过）。只更新 draft，不发布。
 */
const fs = require('fs');
const path = require('path');
const E = require('../templates/elementor-utils');

const JSON_PATH = path.resolve(__dirname, '../../04-内容生产/zodiac-crystals/aries-crystals.json');
const POST_ID = 43158;

// 待摘除片段（前导 \n 保证删后留干净空行）
const REMOVALS = [
  '\n<p>Learn more: <a href="/gemstone/quartz-meaning/">Clear Quartz Meaning: Complete Guide</a></p>',
  '\n<p>Learn more: <a href="/gemstone/bloodstone-meaning/">Bloodstone Meaning: Complete Guide</a></p>',
  '\n<li><a href="/horoscope/aries-2026-07/">Aries Monthly Horoscope + Crystal of the Month</a></li>',
  '\n<li><a href="/aries-gemini/">Aries and Gemini Compatibility + Crystal Pair</a></li>',
  '\n<li><a href="/zodiac-crystals/">Crystals for All Zodiac Signs</a></li>',
];

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  let content = data.content;
  const before = content.length;

  const report = [];
  for (const frag of REMOVALS) {
    if (content.includes(frag)) {
      content = content.replace(frag, '');
      report.push('REMOVED  : ' + frag.replace(/^\n/, '').slice(0, 70));
    } else {
      report.push('NOT-FOUND: ' + frag.replace(/^\n/, '').slice(0, 70));
    }
  }
  // 归一化多余空行
  content = content.replace(/\n{3,}/g, '\n\n');

  console.log('content: %d -> %d chars (delta %d)', before, content.length, content.length - before);
  report.forEach(l => console.log('  ' + l));

  // 写回本地 json 真源
  data.content = content;
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('wrote local json:', JSON_PATH);

  // 1) 更新线上 draft content（status 保持 draft，不发布）
  const r = await E.apiRequest('/wp-json/wp/v2/posts/' + POST_ID, 'POST', { content, status: 'draft' });
  if (!r.id) throw new Error('post update failed: ' + JSON.stringify(r).slice(0, 300));
  console.log('updated draft %s (status=%s, content_len=%d)', r.id, r.status, ((r.content && r.content.raw) || '').length);

  // 2) 补写 Rank Math SEO meta
  const meta = {
    rank_math_title: data.rank_math_title,
    rank_math_description: data.rank_math_description,
    rank_math_focus_keyword: data.rank_math_focus_keyword,
    rank_math_robots: ['index', 'follow']
  };
  const rm = await E.apiRequest('/wp-json/rankmath/v1/updateMeta', 'POST', { objectType: 'post', objectID: POST_ID, meta });
  console.log('rankmath updateMeta:', JSON.stringify(rm).slice(0, 300));

  // 3) 复核：剩余内链 + 残留占位符
  const links = [...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(u => u.startsWith('/'));
  const uniq = [...new Set(links)];
  console.log('--- post-fix internal links (%d unique) ---', uniq.length);
  uniq.forEach(u => console.log('  ' + u));
}

main().catch(e => { console.error(e.stack || e.message); process.exit(1); });
