/**
 * 上传 20 篇 tarot-{slug}-crystals.md（Minor Arcana 牌义）到 WP（draft，文字先上线，图后补）
 * 复用 upload-yesno-md.js 的 WP REST + spawnSync + rank_math UA(curl/8.0.0) 框架
 *
 * 关键差异 vs upload-yesno-md.js：
 *   - glob: tarot-*-crystals.md（Minor 20 篇）
 *   - slug: 文件名去 .md（如 tarot-two-of-wands-crystals）= post slug = 根级 URL
 *   - focus_keyword: Brief 内 `**focus_keyword (rank_math)**: \`val\`` 反引号格式
 *   - schema 加 ItemList：Minor M4 有 5 颗角色水晶，从正文 `## Best Crystals for {Card}` 段提取
 *     `### {Stone} — {Role}` → ItemList（无 Product 前端渲染验证）
 *   - FAQ 抽取逻辑改写：Minor 是 `## Frequently Asked Questions` 下 `### {问?}` heading + 下一段答案
 *     （是与否是 `**FAQ**` 加粗段 + `<strong>问？</strong>`，逻辑不同）
 *   - 无图（本次文字上线，图后补）
 *
 * 红线：
 *   - draft 状态（不公开）
 *   - 已存在 post 跳过（slug 查 status=any）—— Minor slug（tarot-two-of-wands-crystals 等）
 *     与 Major（tarot-the-fool-crystals 等）slug 不同，但仍查重跳过
 *
 * 用法：
 *   node upload-minor-md.js                                (全量 20 篇)
 *   node upload-minor-md.js --slug=tarot-two-of-wands-crystals   (单篇)
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
const DRY = args.includes('--dry');

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

// ---------- .md 解析（Minor 格式） ----------
// 正文范围：`## 正文` 之后 → `## 质检`/`## 质检报告`/`## 生产元信息` 之前
// focus_keyword：Brief 内 `**focus_keyword (rank_math)**: \`val\`` 反引号格式
// M4 水晶段：`## Best Crystals for {Card}` 下，每颗 `### {Stone} — {Role}`（5 颗）
// FAQ 段：`## Frequently Asked Questions` 下，`### {问?}` heading + 下一段答案
function parseArticle(md, fileSlug) {
  const lines = md.split(/\r?\n/);

  const bodyIdx = lines.findIndex(l => /^##\s*正文\s*$/.test(l.trim()));
  if (bodyIdx < 0) throw new Error('未找到 ## 正文 标记');
  let start = bodyIdx + 1;
  // 跳过元信息引用块（> 开头）和空行
  while (start < lines.length) {
    const l = lines[start].trim();
    if (!l || l.startsWith('>')) { start++; continue; }
    break;
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

  // title = 正文首个 H1
  let title = '';
  const headRe = /^(#{1,3})\s+(.+?)\s*$/;
  for (const l of bodyLines) {
    const m = l.match(headRe);
    if (m) { title = m[2].replace(/[`*]/g, '').trim(); break; }
  }
  if (!title) title = fileSlug;

  // focus_keyword：`**focus_keyword (rank_math)**: \`val\`` 反引号格式
  let focusKeyword = '';
  let fk = md.match(/\*{0,2}focus_keyword[^:`]*\*{0,2}\s*[:：]\s*`?([^\n|`，,]+)/i);
  if (fk) focusKeyword = fk[1].replace(/[`*]/g, '').trim();

  // 正文 → HTML
  const html = mdToHtml(bodyLines);

  // M4 水晶段：`## Best Crystals for {Card}` 下，每颗 `### {Stone} — {Role}`
  // 信任段内所有 ### 项（Best Crystals 段内不会混入子 heading），名字 + 角色解析
  const crystals = [];
  let inBestSection = false;
  for (let i = 0; i < bodyLines.length; i++) {
    const t = bodyLines[i].trim();
    if (/^##\s+Best\s+Crystals/i.test(t)) { inBestSection = true; continue; }
    if (inBestSection && /^##\s+/.test(t)) { inBestSection = false; continue; }  // 下一个 H2 段，结束
    if (!inBestSection) continue;
    // `### {Stone} — {Role}` 或 `### {Stone} - {Role}` 或 `### {Stone}` 无破折号
    const m = t.match(/^###\s+(.+?)(?:\s+[—–-]\s+(.+))?$/);
    if (m) {
      const stone = m[1].replace(/[`*]/g, '').trim();
      const role = (m[2] || '').replace(/[`*]/g, '').trim();
      crystals.push({ name: stone, role });
    }
  }

  // rank_math_description：正文第一段纯文本
  let firstPara = '';
  for (const l of bodyLines) {
    const t = l.trim();
    if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|') || /^[-*]\s/.test(t) || /^[-*]{3,}$/.test(t) || t.startsWith('![')) continue;
    firstPara = t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
    if (firstPara) break;
  }
  const desc = firstPara ? (firstPara.length > 155 ? firstPara.slice(0, 152) + '...' : firstPara) : title;

  return { title, focusKeyword, html, description: desc, crystals };
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

// ---------- FAQ 提取（Minor 格式：## Frequently Asked Questions + ### 问? + 下一段） ----------
function extractFAQs(html) {
  const qs = [];
  // 截取 FAQ 段：从 ## Frequently Asked Questions 到下一个 ## 或文末
  const faqHeadRe = /<h2[^>]*>[^<]*Frequently\s+Asked\s+Questions[^<]*<\/h2>/i;
  const m = html.match(faqHeadRe);
  if (!m) return qs;
  const after = html.slice(html.indexOf(m[0]) + m[0].length);
  // 下一个 h2
  const nextH2 = after.search(/<h2\b/i);
  const faqHtml = nextH2 > 0 ? after.slice(0, nextH2) : after;
  // 切分为 h3 + 后续内容
  // 模式：<h3>问题？</h3>\n<p>答案</p>
  const parts = faqHtml.split(/(<h3[^>]*>[^<]*<\/h3>)/i).filter(s => s && s.trim());
  let curQ = null;
  for (const p of parts) {
    const h3m = p.match(/<h3[^>]*>([^<]+)<\/h3>/i);
    if (h3m) {
      const q = h3m[1].replace(/[`*]/g, '').trim();
      // 必须是问题（含 ? 或 ？）
      if (/[?？]\s*$/.test(q) || /\?\s/.test(q)) {
        curQ = q;
        qs.push({ q, a: '' });
      } else {
        curQ = null;
      }
    } else if (curQ && !qs[qs.length - 1].a) {
      // 取下一段 <p> 的纯文本作为答案
      const pm = p.match(/<p>([\s\S]*?)<\/p>/i);
      if (pm) {
        const a = pm[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        qs[qs.length - 1].a = a.slice(0, 400);
      }
    }
  }
  return qs.filter(x => x.a);
}

// ---------- schema ----------
// Article + FAQPage（Minor ### 问? 格式）+ BreadcrumbList + ItemList（M4 5 颗水晶，无 Product 前端渲染）
function buildSchema({ title, description, content, url, crystals, FAQs }) {
  const schemas = [];
  schemas.push({
    "@context": "https://schema.org", "@type": "Article",
    "headline": title, "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "description": description, "url": url,
    "author": { "@type": "Organization", "name": "Earthward" },
    "publisher": { "@type": "Organization", "name": "Earthward" },
  });

  // FAQPage
  if (FAQs.length) {
    schemas.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": FAQs.map(x => ({
        "@type": "Question", "name": x.q,
        "acceptedAnswer": { "@type": "Answer", "text": x.a }
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

  // ItemList（M4 水晶，无 Product 前端渲染验证）
  if (crystals.length) {
    schemas.push({
      "@context": "https://schema.org", "@type": "ItemList",
      "name": "Best Crystals",
      "itemListElement": crystals.map((c, i) => ({
        "@type": "ListItem", "position": i + 1,
        "name": c.name,
        "description": c.role || c.name,
      }))
    });
  }

  return schemas.map(s => JSON.stringify(s)).join('\n');
}

// ---------- 主流程 ----------
const CAT_ID = 1570; // tarot
console.log('分类 tarot → ' + CAT_ID + '（Minor 20 篇文字上线，图后补）\n');

const articlesDir = path.join(BASE, 'articles');
const mdFiles = fs.readdirSync(articlesDir)
  .filter(f => /^tarot-.+-crystals\.md$/.test(f));

let targets = mdFiles.map(f => ({ file: f, fileSlug: f.replace(/\.md$/, ''), postSlug: f.replace(/\.md$/, '') }));
if (slugArg) {
  targets = targets.filter(t => t.postSlug === slugArg || t.fileSlug === slugArg);
}

if (!fs.existsSync(QC_DIR)) fs.mkdirSync(QC_DIR, { recursive: true });

let ok = 0, fail = 0, skip = 0, fkOk = 0, fkEmpty = 0, schemaFaqTotal = 0, schemaItemListTotal = 0;
const results = [];
const failList = [];
const noFKList = [];
const noCrystalsList = [];

for (const t of targets) {
  const mdPath = path.join(articlesDir, t.file);
  try {
    if (!DRY && postSlugExists(t.postSlug)) {
      console.log('⏭ ' + t.postSlug + ' (已存在,跳过)');
      skip++; results.push({ slug: t.postSlug, status: 'skip' });
      continue;
    }
    const md = fs.readFileSync(mdPath, 'utf8');
    const parsed = parseArticle(md, t.fileSlug);

    if (!parsed.focusKeyword) { fkEmpty++; noFKList.push(t.postSlug); }
    else fkOk++;

    if (!parsed.crystals.length) noCrystalsList.push(t.postSlug);

    // FAQ 提取
    const FAQs = extractFAQs(parsed.html);
    schemaFaqTotal += FAQs.length;
    schemaItemListTotal += parsed.crystals.length;

    if (DRY) {
      ok++;
      results.push({ slug: t.postSlug, status: 'dry',
        fk: parsed.focusKeyword, title: parsed.title,
        faqCount: FAQs.length, crystalCount: parsed.crystals.length,
        crystals: parsed.crystals.map(c => c.name + (c.role ? '(' + c.role + ')' : ''))
      });
      console.log('[DRY] ' + t.postSlug + ' fk="' + parsed.focusKeyword + '" faq:' + FAQs.length + ' crystals:' + parsed.crystals.length + ' [' + parsed.crystals.map(c => c.name).join(', ') + ']');
      continue;
    }

    // schema
    const url = 'https://' + SITE + '/' + t.postSlug + '/';
    const schemaHtml = buildSchema({
      title: parsed.title, description: parsed.description,
      content: parsed.html, url, crystals: parsed.crystals, FAQs
    }).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');

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
      fk: parsed.focusKeyword, title: parsed.title,
      faqCount: FAQs.length, crystalCount: parsed.crystals.length,
      crystals: parsed.crystals.map(c => c.name)
    });
    console.log('✅ ' + t.postSlug + ' → post:' + post.id + ' (fk="' + parsed.focusKeyword + '", faq:' + FAQs.length + ', crystals:' + parsed.crystals.length + ')');
  } catch (e) {
    fail++;
    const msg = e.message.slice(0, 200);
    failList.push(t.postSlug + ': ' + msg);
    results.push({ slug: t.postSlug, error: msg, status: 'fail' });
    console.log('❌ ' + t.postSlug + ': ' + msg);
  }
}

fs.writeFileSync(path.join(QC_DIR, 'upload-minor-results.json'), JSON.stringify(results, null, 2), 'utf8');

console.log('\n========== Minor 20 篇 upload 报告 ==========');
console.log('目标篇数: ' + targets.length);
console.log('成功(upload): ' + ok);
console.log('失败: ' + fail);
console.log('跳过(已存在): ' + skip);
console.log('focus_keyword 写入: ' + fkOk + ' / 空: ' + fkEmpty);
console.log('FAQ 抽取总条数: ' + schemaFaqTotal);
console.log('ItemList 水晶总条数(5角色/篇): ' + schemaItemListTotal);
console.log('schema: Article + FAQPage(条件触发) + BreadcrumbList + ItemList(条件触发,无Product)');
console.log('图: 本次不传，featured/media 空，图后补');
if (noFKList.length) console.log('无 fk 明细(' + noFKList.length + '): ' + noFKList.join(', '));
if (noCrystalsList.length) console.log('无水晶(ItemList空)明细(' + noCrystalsList.length + '): ' + noCrystalsList.join(', '));
if (failList.length) {
  console.log('\n失败明细(' + failList.length + '):');
  failList.forEach(s => console.log('  ' + s));
}
console.log('结果已写: _qc/upload-minor-results.json');
