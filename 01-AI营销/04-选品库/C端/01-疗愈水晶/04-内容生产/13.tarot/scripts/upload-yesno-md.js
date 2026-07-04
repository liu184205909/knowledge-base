/**
 * 上传 100 篇 is-*-yes-or-no-*.md 到 WP（draft，文字先上线，图后补）
 * 复用 upload-tarot-md.js 模式（spawnSync 数组参数 + stdin payload + UA curl/8.0.0）
 *
 * 关键差异 vs upload-tarot-md.js：
 *   - 无图（articles-images.json 无 yes-no 图数据）→ featured/media 全空，图后补
 *   - .md 格式两套：99 篇有 `## 正文` 标记；1 篇(is-the-sun-yes-or-no-career)无，用 Brief 后首个 H1 fallback
 *   - Brief 两套格式：Fool 风格(`**key**: val`) / Sun 风格(`**key**：val | ...`)→ focus_keyword 解析兼容两种
 *   - FAQ 段两种：`**FAQ**` 加粗(98) / `## Free Will & FAQ` heading(2)→ 提取兼容两种
 *   - 正文末尾的 `*Explore more: ...*` 内链段落保留（已写好的内链，非配方表）
 *   - 排除：质检报告 + `### 内链配方` markdown 表格（在质检报告之后，正文终点 `## 质检` 已切断）
 *   - schema: Article + FAQPage(从正文提取) + BreadcrumbList（无 ItemList，因无 crystals 图）
 *   - rank_math UA = curl/8.0.0（CF 拦截 Python/默认 UA → 403 假象）
 *
 * 用法：
 *   node upload-yesno-md.js                         (全量 100 篇)
 *   node upload-yesno-md.js --slug=is-the-fool-yes-or-no-love   (单篇)
 * 需 socks5(127.0.0.1:10808) + ~/.env(WP_USER/WP_APP_PASSWORD/WP_SITE)
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
const BASE = path.resolve(__dirname, '..');                                    // .../13.tarot/
const QC_DIR = path.join(BASE, '_qc');

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

// ---------- WP helpers（spawnSync + 数组参数 + stdin payload，禁 execSync shell 引号） ----------
function curl(args, payload) {
  const r = spawnSync('curl', args, { encoding: 'utf8', input: payload });
  if (r.status !== 0) throw new Error('curl exit ' + r.status + ' ' + (r.stderr || '').slice(0, 120));
  return (r.stdout || '');
}

function postSlugExists(slug) {
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P,
    'https://' + SITE + '/wp-json/wp/v2/posts?slug=' + encodeURIComponent(slug) + '&status=any&_fields=id',
    '--max-time', '20']);
  try { return JSON.parse(out).length > 0; } catch (e) { return false; }
}

function createPost(data) {
  const payload = JSON.stringify(data);
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P,
    '-H', 'Content-Type: application/json', '--data', '@-',
    '-w', '\n%{http_code}', '--max-time', '120',
    'https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status'],
    payload);
  const arr = out.trim().split(/\n/);
  const code = arr[arr.length - 1].trim();
  const body = arr.slice(0, -1).join('');
  if (code !== '201' && code !== '200') throw new Error('createPost HTTP ' + code + ' body=' + body.slice(0, 160));
  return JSON.parse(body);
}

function setRankMath(id, meta) {
  // 必须带 User-Agent: curl/8.0.0（CF 拦截默认 UA → 403）
  const payload = JSON.stringify({ objectType: 'post', objectID: String(id), meta });
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P,
    '-X', 'POST', '-H', 'Content-Type: application/json',
    '-H', 'User-Agent: curl/8.0.0',
    '--data', '@-', '-w', '\n%{http_code}', '--max-time', '60',
    'https://' + SITE + '/wp-json/rankmath/v1/updateMeta'], payload);
  const arr = out.trim().split(/\n/);
  const code = arr[arr.length - 1].trim();
  if (code !== '200') throw new Error('setRankMath HTTP ' + code + ' body=' + arr.slice(0, -1).join('').slice(0, 160));
  return code;
}

// ---------- .md 解析 ----------
// 正文范围：
//   主路径：`## 正文` 之后 → `## 质检`/`## 质检报告` 之前
//   fallback（无 ## 正文，如 is-the-sun-yes-or-no-career）：最后一个 `## Brief` 之后首个 `# ` H1 → `## 质检` 之前
// focus_keyword：
//   兼容 `**focus_keyword**: val`(Fool) / `**focus_keyword**：val | ...`(Sun) / `focus_keyword \`val\``(既有)
function parseArticle(md, fileSlug) {
  const lines = md.split(/\r?\n/);
  let start = -1;

  const bodyIdx = lines.findIndex(l => /^##\s*正文\s*$/.test(l.trim()));
  if (bodyIdx >= 0) {
    start = bodyIdx + 1;
    // 跳过元信息引用块（> 开头）和空行
    while (start < lines.length) {
      const l = lines[start].trim();
      if (!l || l.startsWith('>')) { start++; continue; }
      break;
    }
  } else {
    // fallback：找最后一个 `## Brief`，往后找首个 `# ` H1
    let briefIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (/^##\s*Brief\s*$/.test(lines[i].trim())) { briefIdx = i; break; }
    }
    if (briefIdx < 0) throw new Error('未找到 ## 正文 也未找到 ## Brief');
    for (let i = briefIdx + 1; i < lines.length; i++) {
      if (/^#\s+.+/.test(lines[i].trim())) { start = i; break; }
    }
    if (start < 0) throw new Error('Brief 后未找到 H1 正文起点');
  }

  // 正文终点：`## 质检` / `## 质检报告` / `## 生产元信息`
  let end = lines.length;
  for (let j = start; j < lines.length; j++) {
    const l = lines[j].trim();
    if (/^##\s*质检(报告)?(\s|$)/.test(l) || /^##\s*生产元信息/.test(l)) { end = j; break; }
  }
  const bodyLines = lines.slice(start, end);
  while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) bodyLines.pop();
  if (!bodyLines.length) throw new Error('正文为空');

  // title = 正文首个 H1（兼容 ## / ###）
  let title = '';
  const headRe = /^(#{1,3})\s+(.+?)\s*$/;
  for (const l of bodyLines) {
    const m = l.match(headRe);
    if (m) { title = m[2].replace(/[`*]/g, '').trim(); break; }
  }
  if (!title) title = fileSlug;

  // focus_keyword：兼容三种格式
  //   ① `**focus_keyword**: val`（Fool 风格，无反引号，到行尾）
  //   ② `**focus_keyword**：val | ...`（Sun 风格，| 分隔）
  //   ③ `focus_keyword \`val\``（既有带反引号）
  const fullText = md;
  let focusKeyword = '';
  let fk = fullText.match(/\*{0,2}focus_keyword\*{0,2}\s*[:：]\s*`?([^\n|，,]+)/i);
  if (fk) focusKeyword = fk[1].replace(/[`*]/g, '').trim();
  if (!focusKeyword) {
    fk = fullText.match(/focus_keyword[^`]*?[`']([^`']+)[`']/i);
    if (fk) focusKeyword = fk[1].trim();
  }

  // 正文 → HTML
  const html = mdToHtml(bodyLines);

  // rank_math_description：正文第一段纯文本（去标题/列表/表格/图）
  let firstPara = '';
  for (const l of bodyLines) {
    const t = l.trim();
    if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|') || /^[-*]\s/.test(t) || /^[-*]{3,}$/.test(t) || t.startsWith('![')) continue;
    firstPara = t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
    if (firstPara) break;
  }
  const desc = firstPara ? (firstPara.length > 155 ? firstPara.slice(0, 152) + '...' : firstPara) : title;

  return { title, focusKeyword, html, description: desc };
}

// 轻量 markdown→HTML（同 upload-tarot-md.js）
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';
function mdToHtml(bodyLines) {
  const out = [];
  let inList = false, inOrderedList = false;
  const closeList = () => { if (inList || inOrderedList) { out.push(inOrderedList ? '</ol>' : '</ul>'); inList = false; inOrderedList = false; } };
  for (let i = 0; i < bodyLines.length; i++) {
    let line = bodyLines[i];
    const t = line.trim();
    const h = t.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      closeList();
      const lvl = Math.min(h[1].length, 6);
      out.push('<h' + lvl + '>' + inline(h[2]) + '</h' + lvl + '>');
      continue;
    }
    if (/^[-*]{3,}$/.test(t)) { closeList(); out.push('<hr>'); continue; }
    if (t.startsWith('|')) { closeList(); out.push(line); continue; }
    if (/^[-*]\s+/.test(t)) {
      if (inOrderedList) { out.push('</ol>'); inOrderedList = false; }
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + inline(t.replace(/^[-*]\s+/, '')) + '</li>');
      continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (!inOrderedList) { out.push('<ol>'); inOrderedList = true; }
      out.push('<li>' + inline(t.replace(/^\d+\.\s+/, '')) + '</li>');
      continue;
    }
    if (!t) { closeList(); continue; }
    closeList();
    out.push('<p>' + inline(t) + '</p>');
  }
  closeList();
  return out.join('\n');
}
function inline(s) {
  return s
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="' + IMG_STYLE + '" loading="lazy">')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// ---------- schema ----------
// Article + FAQPage（兼容 **FAQ** 加粗段 / ## ... FAQ heading）+ BreadcrumbList（无 ItemList，无 crystals 图）
function buildSchema({ title, description, content, url }) {
  const schemas = [];
  schemas.push({
    "@context": "https://schema.org", "@type": "Article",
    "headline": title, "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "description": description, "url": url,
    "author": { "@type": "Organization", "name": "Earthward" },
    "publisher": { "@type": "Organization", "name": "Earthward" },
  });

  // FAQPage：定位 FAQ 段（**FAQ** 加粗 或 ## ...FAQ... heading），提取 <strong>问？</strong>+下一段
  // HTML 里 **FAQ** → <p><strong>FAQ</strong></p>；**问？** → <p><strong>...？</strong></p>
  const qs = [];
  // 截取 FAQ 段：从 FAQ 标记到下一个 <h[1-6]> 或 <hr> 或文末
  const faqStart = content.search(/<p><strong>FAQ<\/strong><\/p>|<h[1-6][^>]*>[^<]*FAQ[^<]*<\/h[1-6]>/i);
  if (faqStart >= 0) {
    const after = content.slice(faqStart);
    const nextSec = after.search(/<(?:h[1-6])\b/i, after.indexOf('>') + 1);
    const faqHtml = nextSec > 0 ? after.slice(0, nextSec) : after;
    // 段落切分
    const paras = faqHtml.split(/<\/?p>/);
    let cur = null;
    for (const p of paras) {
      const pt = p.replace(/<[^>]+>/g, '').trim();
      if (!pt) continue;
      // 跳过纯 "FAQ" 标记段
      if (/^FAQ$/i.test(pt)) continue;
      const qm = p.match(/<strong>([^<]{8,160}\??)<\/strong>/);
      if (qm && /\?\s*$/.test(qm[1])) { cur = { q: qm[1].trim(), a: '' }; qs.push(cur); }
      else if (cur && !cur.a) cur.a = pt;
    }
  }
  if (qs.length) {
    schemas.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": qs.map(x => ({
        "@type": "Question", "name": x.q,
        "acceptedAnswer": { "@type": "Answer", "text": x.a.slice(0, 400) }
      }))
    });
  }

  schemas.push({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" },
      { "@type": "ListItem", "position": 2, "name": "Tarot", "item": "https://" + SITE + "/category/tarot/" },
      { "@type": "ListItem", "position": 3, "name": title, "item": url },
    ]
  });
  return schemas.map(s => JSON.stringify(s)).join('\n');
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- 主流程 ----------
const CAT_ID = 1570; // tarot（已确认）
console.log('分类 tarot → ' + CAT_ID + '（yes-no 文字上线，图后补）\n');

const articlesDir = path.join(BASE, 'articles');
const mdFiles = fs.readdirSync(articlesDir)
  .filter(f => /^is-.*-yes-or-no-.*\.md$/.test(f));

let targets = mdFiles.map(f => ({ file: f, fileSlug: f.replace(/\.md$/, ''), postSlug: f.replace(/\.md$/, '') }));
if (slugArg) {
  targets = targets.filter(t => t.postSlug === slugArg || t.fileSlug === slugArg);
}

if (!fs.existsSync(QC_DIR)) fs.mkdirSync(QC_DIR, { recursive: true });

let ok = 0, fail = 0, skip = 0, fkOk = 0, fkEmpty = 0, schemaFaqTotal = 0;
const results = [];
const failList = [];
const noFKList = [];

for (const t of targets) {
  const mdPath = path.join(articlesDir, t.file);
  try {
    if (postSlugExists(t.postSlug)) {
      console.log('⏭ ' + t.postSlug + ' (已存在,跳过)');
      skip++; results.push({ slug: t.postSlug, status: 'skip' });
      continue;
    }
    const md = fs.readFileSync(mdPath, 'utf8');
    const parsed = parseArticle(md, t.fileSlug);

    if (!parsed.focusKeyword) { fkEmpty++; noFKList.push(t.postSlug); }
    else fkOk++;

    // schema
    const url = 'https://' + SITE + '/' + t.postSlug + '/';
    const schemaHtml = buildSchema({
      title: parsed.title, description: parsed.description,
      content: parsed.html, url
    }).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');

    // FAQ 抽取计数（用于报告）
    const faqCount = (parsed.html.match(/<strong>[^<]{8,160}\?<\/strong>/g) || []).length;
    schemaFaqTotal += faqCount;

    // content = 正文 + schema（无图，图后补）
    const content = parsed.html + '\n\n' + schemaHtml;

    // createPost（draft）
    const post = createPost({
      title: parsed.title,
      slug: t.postSlug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft',
      categories: [CAT_ID],
      excerpt: parsed.description,
    });

    // rank_math TKD（UA=curl/8.0.0）
    setRankMath(post.id, {
      rank_math_title: parsed.title,
      rank_math_description: parsed.description,
      rank_math_focus_keyword: parsed.focusKeyword,
    });

    ok++;
    results.push({
      slug: t.postSlug, id: post.id, link: post.link, status: 'ok',
      fk: parsed.focusKeyword, title: parsed.title, faqCount
    });
    console.log('✅ ' + t.postSlug + ' → post:' + post.id + ' (fk="' + parsed.focusKeyword + '", faq:' + faqCount + ')');
  } catch (e) {
    fail++;
    const msg = e.message.slice(0, 200);
    failList.push(t.postSlug + ': ' + msg);
    results.push({ slug: t.postSlug, error: msg, status: 'fail' });
    console.log('❌ ' + t.postSlug + ': ' + msg);
  }
}

fs.writeFileSync(path.join(QC_DIR, 'upload-yesno-results.json'), JSON.stringify(results, null, 2), 'utf8');

console.log('\n========== 是与否 100 篇 upload 报告 ==========');
console.log('目标篇数: ' + targets.length);
console.log('成功(upload): ' + ok);
console.log('失败: ' + fail);
console.log('跳过(已存在): ' + skip);
console.log('focus_keyword 写入: ' + fkOk + ' / 空: ' + fkEmpty);
console.log('FAQ 抽取总条数(原文<strong>问？</strong>): ' + schemaFaqTotal);
console.log('schema: Article + FAQPage(条件触发) + BreadcrumbList，每篇嵌 content 末尾 <!-- wp:html --> 块内');
console.log('图: 本次不传（articles-images.json 无 yes-no 数据），featured/media 空，图后补');
if (noFKList.length) console.log('无 fk 明细(' + noFKList.length + '): ' + noFKList.join(', '));
if (failList.length) {
  console.log('\n失败明细(' + failList.length + '):');
  failList.forEach(s => console.log('  ' + s));
}
console.log('结果已写: _qc/upload-yesno-results.json');
