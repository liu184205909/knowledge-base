/**
 * 导出所有 gemstone 的 slug + 发布日期到 JSON（供同步 Crystal Tracker 用）。
 * 只取 slug 和 date（URL 不从这里来——表格自己的相对路径拼域名即可）。
 * 输出 assets/gemstone-schedule.json：[{slug, date}, ...]
 */
const fs = require('fs');
const path = require('path');
const E = require('../templates/elementor-utils');

async function listByStatus(status) {
  let all = [], page = 1;
  while (true) {
    const items = await E.apiRequest(
      '/wp-json/wp/v2/gemstone?status=' + status + '&per_page=100&page=' + page + '&context=edit',
      'GET'
    );
    if (!items || !items.length) break;
    all = all.concat(items);
    if (items.length < 100) break;
    page++;
  }
  return all;
}

(async () => {
  const future = await listByStatus('future');
  const publish = await listByStatus('publish');
  const all = future.concat(publish).sort((a, b) => new Date(a.date) - new Date(b.date));
  const rows = all.map(p => ({ slug: p.slug, date: (p.date || '').slice(0, 10) }));
  const out = path.resolve(__dirname, '..', 'assets', 'gemstone-schedule.json');
  fs.writeFileSync(out, JSON.stringify(rows, null, 2));
  console.log('exported %d rows -> %s', rows.length, out);
})().catch(e => { console.error('ERR:', e.message); process.exit(1); });
