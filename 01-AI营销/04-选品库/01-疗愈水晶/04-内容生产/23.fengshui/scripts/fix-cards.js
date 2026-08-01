/**
 * 修正 hub + black-tourmaline 水晶卡片五行错误（M3/M4 审核发现）
 * 按位置定位 <p>...</p> 替换，避免 Edit 工具 JSON 编码匹配问题
 * 用法：node fix-cards.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles-mainpages');
function fix(file, stone, newP) {
  const fp = path.join(DIR, file);
  let c = fs.readFileSync(fp, 'utf8');
  const i = c.indexOf('/' + stone + '-meaning/');
  if (i < 0) { console.log('✗ ' + stone + ' 未找到href'); return; }
  const ps = c.indexOf('<p>', i);
  const pe = c.indexOf('</p>', ps);
  if (ps < 0 || pe < 0) { console.log('✗ ' + stone + ' 未找到<p>'); return; }
  c = c.slice(0, ps) + newP + c.slice(pe + 4);
  fs.writeFileSync(fp, c, 'utf8');
  // 验证 JSON 合法
  try { JSON.parse(c); console.log('✅ ' + file + ' ' + stone + ' (JSON合法)'); }
  catch (e) { console.log('❌ ' + file + ' JSON破坏: ' + e.message.slice(0, 80)); }
}

fix('feng-shui.json', 'quartz', `<p><strong>Clear quartz</strong> is silicon dioxide in a trigonal lattice, valued for its clarity and amplifying quality. In feng shui it carries the <strong>Metal element</strong>, which governs the Helpful People &amp; Travel and Children &amp; Creativity areas of the bagua. Many people set a clear point near an entry or workspace as a bright, clean focal point that supports precision, fresh ideas, and a sense of order.</p>`);

fix('feng-shui.json', 'citrine', `<p><strong>Citrine</strong> takes its golden hue from trace iron within the quartz lattice, carrying warm <strong>Earth element</strong> energy. It is the traditional merchant's stone for the Wealth corner (far back-left in BTB), where it is placed as an anchor for abundance; its earthy warmth also suits the central Health area. Many keep a small cluster near a desk or cash box as a steady reminder of generous, grounded intention.</p>`);

fix('feng-shui.json', 'jade', `<p><strong>Jade</strong> forms from dense, interlocking silicate fibers, a structure long associated with resilience and longevity. It carries the <strong>Wood element</strong> and is traditionally placed in the Family &amp; Health area (middle-left) to support harmony and steady growth; it is also welcomed in the Wealth corner, where Wood energy invites abundance. Many keep a carved piece nearby as a grounding touchstone rooted in East Asian tradition.</p>`);

fix('black-tourmaline-in-feng-shui.json', 'hematite', `<p><strong>Hematite</strong> is an iron oxide mineral prized for its weight and metallic gray luster. In feng shui it carries the <strong>Metal element</strong>, which governs the Helpful People &amp; Travel and Children &amp; Creativity areas, and it is often placed alongside protective stones to add a grounding, clarifying presence. Many keep a polished specimen on a desk or near an entry as a quiet anchor for focused, orderly energy.</p>`);
