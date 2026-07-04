/**
 * 恢复 3 篇被 embed 脚本破坏的 yesno future post content（50808/50852/50853）
 * embed 脚本首版 getPost 未带 context=edit，content.raw=undefined 误判为空，update 覆盖成只剩 hero img
 *
 * 恢复：复用 upload-yesno-md.js 的 parseArticle + buildSchema 从 markdown 重建 content
 *       → 嵌 hero img（已上传的 media id 对应 url）+ 重建正文 + schema
 *       → update featured_media + content（保持 status=future）
 *
 * 用法：node restore-3-broken-yesno.js
 * 需 socks5 + ~/.env
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');

// ---------- env ----------
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const PROXY = 'socks5://127.0.0.1:10808';
const BASE = path.resolve(__dirname, '..');
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

function curl(args, payload) {
  const r = spawnSync('curl', args, { encoding: 'utf8', input: payload, maxBuffer: 20 * 1024 * 1024 });
  if (r.status !== 0) throw new Error('curl exit ' + r.status + ' ' + (r.stderr || '').slice(0, 120));
  return r.stdout || '';
}
function getMediaUrl(mediaId) {
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '20',
    'https://' + SITE + '/wp-json/wp/v2/media/' + mediaId + '?_fields=id,source_url']);
  return JSON.parse(out).source_url;
}
function getPost(id) {
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '25',
    'https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=id,slug,status,featured_media,content']);
  return JSON.parse(out);
}
function updatePost(id, data) {
  const payload = JSON.stringify(data);
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P,
    '-H', 'Content-Type: application/json', '--data', '@-',
    '-w', '\n%{http_code}', '--max-time', '120',
    'https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,featured_media,status'],
    payload);
  const arr = out.trim().split(/\n/);
  const code = arr[arr.length - 1].trim();
  const body = arr.slice(0, -1).join('');
  if (code !== '200') throw new Error('updatePost HTTP ' + code + ' body=' + body.slice(0, 200));
  return JSON.parse(body);
}

// ---------- parseArticle + mdToHtml + buildSchema（从 upload-yesno-md.js 复制）----------
function parseArticle(md, fileSlug) {
  const lines = md.split(/\r?\n/);
  let start = -1;
  const bodyIdx = lines.findIndex(l => /^##\s*正文\s*$/.test(l.trim()));
  if (bodyIdx >= 0) {
    start = bodyIdx + 1;
    while (start < lines.length) { const l = lines[start].trim(); if (!l || l.startsWith('>')) { start++; continue; } break; }
  } else {
    let briefIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) { if (/^##\s*Brief\s*$/.test(lines[i].trim())) { briefIdx = i; break; } }
    if (briefIdx < 0) throw new Error('未找到 ## 正文 也未找到 ## Brief');
    for (let i = briefIdx + 1; i < lines.length; i++) { if (/^#\s+.+/.test(lines[i].trim())) { start = i; break; } }
    if (start < 0) throw new Error('Brief 后未找到 H1 正文起点');
  }
  let end = lines.length;
  for (let j = start; j < lines.length; j++) { const l = lines[j].trim(); if (/^##\s*质检(报告)?(\s|$)/.test(l) || /^##\s*生产元信息/.test(l)) { end = j; break; } }
  const bodyLines = lines.slice(start, end);
  while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) bodyLines.pop();
  if (!bodyLines.length) throw new Error('正文为空');
  let title = '';
  const headRe = /^(#{1,3})\s+(.+?)\s*$/;
  for (const l of bodyLines) { const m = l.match(headRe); if (m) { title = m[2].replace(/[`*]/g, '').trim(); break; } }
  if (!title) title = fileSlug;
  let focusKeyword = '';
  let fk = md.match(/\*{0,2}focus_keyword\*{0,2}\s*[:：]\s*`?([^\n|，,]+)/i);
  if (fk) focusKeyword = fk[1].replace(/[`*]/g, '').trim();
  if (!focusKeyword) { fk = md.match(/focus_keyword[^`]*?[`']([^`']+)[`']/i); if (fk) focusKeyword = fk[1].trim(); }
  const html = mdToHtml(bodyLines);
  let firstPara = '';
  for (const l of bodyLines) { const t = l.trim(); if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|') || /^[-*]\s/.test(t) || /^[-*]{3,}$/.test(t) || t.startsWith('![')) continue; firstPara = t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim(); if (firstPara) break; }
  const desc = firstPara ? (firstPara.length > 155 ? firstPara.slice(0, 152) + '...' : firstPara) : title;
  return { title, focusKeyword, html, description: desc };
}
function mdToHtml(bodyLines) {
  const out = []; let inList = false, inOrderedList = false;
  const closeList = () => { if (inList || inOrderedList) { out.push(inOrderedList ? '</ol>' : '</ul>'); inList = false; inOrderedList = false; } };
  for (let i = 0; i < bodyLines.length; i++) {
    let line = bodyLines[i]; const t = line.trim();
    const h = t.match(/^(#{1,6})\s+(.+)$/);
    if (h) { closeList(); const lvl = Math.min(h[1].length, 6); out.push('<h' + lvl + '>' + inline(h[2]) + '</h' + lvl + '>'); continue; }
    if (/^[-*]{3,}$/.test(t)) { closeList(); out.push('<hr>'); continue; }
    if (t.startsWith('|')) { closeList(); out.push(line); continue; }
    if (/^[-*]\s+/.test(t)) { if (inOrderedList) { out.push('</ol>'); inOrderedList = false; } if (!inList) { out.push('<ul>'); inList = true; } out.push('<li>' + inline(t.replace(/^[-*]\s+/, '')) + '</li>'); continue; }
    if (/^\d+\.\s+/.test(t)) { if (inList) { out.push('</ul>'); inList = false; } if (!inOrderedList) { out.push('<ol>'); inOrderedList = true; } out.push('<li>' + inline(t.replace(/^\d+\.\s+/, '')) + '</li>'); continue; }
    if (!t) { closeList(); continue; }
    closeList(); out.push('<p>' + inline(t) + '</p>');
  }
  closeList(); return out.join('\n');
}
function inline(s) {
  return s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="' + IMG_STYLE + '" loading="lazy">')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
function buildSchema({ title, description, content, url }) {
  const schemas = [];
  schemas.push({ "@context": "https://schema.org", "@type": "Article", "headline": title, "mainEntityOfPage": { "@type": "WebPage", "@id": url }, "description": description, "url": url, "author": { "@type": "Organization", "name": "Earthward" }, "publisher": { "@type": "Organization", "name": "Earthward" } });
  const qs = [];
  const faqStart = content.search(/<p><strong>FAQ<\/strong><\/p>|<h[1-6][^>]*>[^<]*FAQ[^<]*<\/h[1-6]>/i);
  if (faqStart >= 0) {
    const after = content.slice(faqStart);
    const nextSec = after.search(/<(?:h[1-6])\b/i, after.indexOf('>') + 1);
    const faqHtml = nextSec > 0 ? after.slice(0, nextSec) : after;
    const paras = faqHtml.split(/<\/?p>/);
    let cur = null;
    for (const p of paras) {
      const pt = p.replace(/<[^>]+>/g, '').trim();
      if (!pt) continue;
      if (/^FAQ$/i.test(pt)) continue;
      const qm = p.match(/<strong>([^<]{8,160}\??)<\/strong>/);
      if (qm && /\?\s*$/.test(qm[1])) { cur = { q: qm[1].trim(), a: '' }; qs.push(cur); }
      else if (cur && !cur.a) cur.a = pt;
    }
  }
  if (qs.length) schemas.push({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": qs.map(x => ({ "@type": "Question", "name": x.q, "acceptedAnswer": { "@type": "Answer", "text": x.a.slice(0, 400) } })) });
  schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" }, { "@type": "ListItem", "position": 2, "name": "Tarot", "item": "https://" + SITE + "/category/tarot/" }, { "@type": "ListItem", "position": 3, "name": title, "item": url }] });
  return schemas.map(s => JSON.stringify(s)).join('\n');
}
function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ---------- 3 篇恢复清单（postId / slug / mediaId）----------
const TARGETS = [
  { id: 50808, slug: 'is-the-fool-yes-or-no-love', mediaId: 51055, alt: 'The Fool yes or no love tarot card' },
  { id: 50852, slug: 'is-the-fool-yes-or-no-career', mediaId: 51055, alt: 'The Fool yes or no career tarot card' },
  { id: 50853, slug: 'is-the-fool-yes-or-no-decision', mediaId: 51055, alt: 'The Fool yes or no decision tarot card' },
];

(async () => {
  console.log('=== restore-3-broken-yesno ===\n');
  for (const t of TARGETS) {
    try {
      // 1. 当前状态
      const cur = getPost(t.id);
      console.log('当前 ' + t.slug + ' (id:' + t.id + ' status:' + cur.status + '): content 长度 ' + (cur.content && cur.content.raw ? cur.content.raw.length : 0));

      // 2. 从 markdown 重建
      const mdPath = path.join(BASE, 'articles', t.slug + '.md');
      if (!fs.existsSync(mdPath)) throw new Error('md 不存在: ' + mdPath);
      const parsed = parseArticle(fs.readFileSync(mdPath, 'utf8'), t.slug);
      console.log('  重建: title="' + parsed.title + '" fk="' + parsed.focusKeyword + '" 正文长度 ' + parsed.html.length);

      // 3. media url
      const mediaUrl = getMediaUrl(t.mediaId);
      console.log('  media:' + t.mediaId + ' → ' + mediaUrl);

      // 4. content = hero img + 正文 + schema
      const url = 'https://' + SITE + '/' + t.slug + '/';
      const schemaHtml = buildSchema({ title: parsed.title, description: parsed.description, content: parsed.html, url }).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
      const heroImg = '<img src="' + mediaUrl + '" alt="' + escapeAttr(t.alt) + '" style="' + IMG_STYLE + '" loading="lazy">';
      const content = '<!-- wp:html -->\n' + heroImg + '\n' + parsed.html + '\n\n' + schemaHtml + '\n<!-- /wp:html -->';

      // 5. update（保留 status=future，不传 date 避免改排期；WP 默认保留原 status）
      const up = updatePost(t.id, { featured_media: t.mediaId, content });
      console.log('  ✅ 恢复 → post:' + up.id + ' status:' + up.status + ' featured:' + up.featured_media + '\n');
    } catch (e) {
      console.log('  ❌ ' + t.slug + ': ' + e.message.slice(0, 200) + '\n');
    }
  }
  console.log('=== 恢复完成 ===');
})();
