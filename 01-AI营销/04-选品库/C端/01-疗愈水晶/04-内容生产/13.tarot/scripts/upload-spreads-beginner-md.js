/**
 * 上传 28 篇 tarot 牌阵(25)+新手(3) 文章到 WP（draft，文字先上线，图后补）
 * 复用 upload-yesno-md.js / upload-minor-md.js 的 WP REST + spawnSync + rank_math UA(curl/8.0.0) 框架
 *
 * 关键差异 vs 既有脚本：
 *   - glob: articles-spreads/*.md(25) + articles-beginner/*.md(3)
 *   - slug: 文件名去 .md（如 three-card-past-present-future / how-to-read-tarot）= post slug = 根级 URL
 *   - focus_keyword: Brief 内列表格式 `- focus_keyword: val`（无反引号，无 | 分隔，到行尾）
 *   - FAQ 段：`## FAQ` heading 下 `**问？**` 加粗段（与 yes-no 同形态）→ 复用 yes-no 的 FAQ 提取
 *   - 水晶段（牌阵 M3 / 新手）：
 *       `## Crystals for Each Position` 或 `## Crystals as Tactile Anchors ...`
 *       下每颗 `### {Position/Step} — {Stone} (Role)` 或 `### {Pos} — {Stone}` 或 `### {Past} — {Stone}`
 *     ⚠️ 同文件有两套 ### 破折号标题：Positions 段(描述) + Crystals 段(水晶)
 *        → 必须只在 ## Crystals 段内提取，水晶名 = 破折号右侧剥去尾部 (Role) 括号
 *   - schema: Article + FAQPage + BreadcrumbList + ItemList（牌阵/新手都有水晶位，ItemList 必触发）
 *
 * 红线（踩过的坑）：
 *   - draft 状态（不公开，排期 future 才公开）
 *   - rank_math UA = curl/8.0.0（CF UA 拦截 → 403 假象）
 *   - spawnSync 数组参数 + stdin payload（禁 execSync shell 引号）
 *   - 已存在 post 跳过（status=any 查）
 *   - 不嵌图（文字上线，图后补 moleapi reset；避免 update content 事故）
 *
 * 用法：
 *   node upload-spreads-beginner-md.js                           (全量 28 篇)
 *   node upload-spreads-beginner-md.js --slug=love-spread        (单篇)
 *   node upload-spreads-beginner-md.js --dry                     (dry run, 不写 WP)
 *   node upload-spreads-beginner-md.js --schedule                (上传后顺带排期 future)
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
const DO_SCHEDULE = args.includes('--schedule');

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

// 排期：update status=future + date（context=edit 取 raw，避免 content 被反序列化事故）
function scheduleFuture(id, dateISO) {
  const payload = JSON.stringify({ status: 'future', date: dateISO });
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P,
    '-X', 'POST', '-H', 'Content-Type: application/json', '--data', '@-',
    '-w', '\n%{http_code}', '--max-time', '60',
    'https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=id,slug,status,date'],
    payload);
  const arr = out.trim().split(/\n/);
  const code = arr[arr.length - 1].trim();
  const body = arr.slice(0, -1).join('');
  if (code !== '200') throw new Error('schedule HTTP ' + code + ' body=' + body.slice(0, 160));
  return JSON.parse(body);
}

// ---------- .md 解析（牌阵/新手格式） ----------
// 正文范围：`## 正文` 之后 → `## 质检`/`## 质检报告`/`## 生产元信息` 之前
// focus_keyword：Brief 内列表 `- focus_keyword: val`（到行尾）
// Crystals 段：`## Crystals for ...` 或 `## Crystals as ...` 下，每颗
//   `### {Position/Step} — {Stone} (Role)` / `### {Pos} — {Stone}` / `### {Past} — {Stone}`
//   ⚠️ 必须只在 Crystals 段内提取，水晶名 = 破折号右侧剥去尾部 (Role)
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

  // focus_keyword：Brief 列表 `- focus_keyword: val`（到行尾，无 | 分隔）
  let focusKeyword = '';
  let fk = md.match(/^-?\s*\*{0,2}focus_keyword\*{0,2}\s*[:：]\s*`?([^\n|`，,]+)/im);
  if (fk) focusKeyword = fk[1].replace(/[`*]/g, '').trim();

  // 正文 → HTML
  const html = mdToHtml(bodyLines);

  // Crystals 段：定位 `## Crystals for ...` 或 `## Crystals as ...` H2，到下一个 H2 结束
  // 提取每颗 `### {Pos/Step} — {Stone} (Role)` 或 `### {Pos} — {Stone}`
  // 水晶名 = 破折号右侧剥去尾部 (Role) 括号
  const crystals = [];
  let inCrystals = false;
  for (let i = 0; i < bodyLines.length; i++) {
    const t = bodyLines[i].trim();
    if (/^##\s+Crystals\b/i.test(t)) { inCrystals = true; continue; }
    if (inCrystals && /^##\s+/.test(t)) { inCrystals = false; continue; }   // 下一个 H2 段，结束
    if (!inCrystals) continue;
    // 必须含破折号 — – - 才算水晶项（避免无破折号的 ### 子标题混入）
    const m = t.match(/^###\s+(.+?)\s+[—–-]\s+(.+)$/);
    if (!m) continue;
    const position = m[1].replace(/[`*]/g, '').trim();
    // 水晶名 = 破折号右侧，剥去尾部 (Role) 或（Role）
    let stoneRaw = m[2].replace(/[`*]/g, '').trim();
    // 形如 "Black Tourmaline" / "Rose Quartz (or a second piece)" / "Selenite (Settling the Question)"
    // 剥尾部括号 role（可能多组，只剥第一组）
    let stone = stoneRaw.replace(/\s*\([^)]*\)\s*$/, '').trim();
    // 形如 "Moonstone (or second piece)" → "Moonstone"
    if (!stone) stone = stoneRaw;
    // 兜底：若剥后为空或过长（>40 字符说明不是水晶名），跳过
    if (!stone || stone.length > 50) continue;
    crystals.push({ name: stone, role: position });
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

// ---------- FAQ 提取（牌阵/新手 ## FAQ + <strong>问？</strong> 段，复用 yes-no 逻辑） ----------
function extractFAQs(html) {
  const qs = [];
  // 截取 FAQ 段：## FAQ heading 到下一个 H2 或文末
  const faqHeadRe = /<h2[^>]*>\s*FAQ\s*<\/h2>/i;
  const m = html.match(faqHeadRe);
  if (!m) return qs;
  const after = html.slice(html.indexOf(m[0]) + m[0].length);
  const nextH2 = after.search(/<h2\b/i);
  const faqHtml = nextH2 > 0 ? after.slice(0, nextH2) : after;
  // 段落切分：<p><strong>问？</strong></p> 下一段 <p>答案</p>
  const paras = faqHtml.split(/<\/?p>/);
  let cur = null;
  for (const p of paras) {
    const pt = p.replace(/<[^>]+>/g, '').trim();
    if (!pt) continue;
    if (/^FAQ$/i.test(pt)) continue;
    // 问题：<strong>问？</strong>（必须以 ? 或 ？ 结尾，长度 8-160）
    const qm = p.match(/<strong>([^<]{8,160}\??)<\/strong>/);
    if (qm && /\?\s*$/.test(qm[1])) { cur = { q: qm[1].trim(), a: '' }; qs.push(cur); }
    else if (cur && !cur.a) cur.a = pt;
  }
  return qs.filter(x => x.a);
}

// ---------- schema ----------
// Article + FAQPage + BreadcrumbList + ItemList（牌阵/新手水晶位，无 Product 前端渲染）
function buildSchema({ title, description, url, crystals, FAQs }) {
  const schemas = [];
  schemas.push({
    "@context": "https://schema.org", "@type": "Article",
    "headline": title, "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "description": description, "url": url,
    "author": { "@type": "Organization", "name": "Earthward" },
    "publisher": { "@type": "Organization", "name": "Earthward" },
  });

  if (FAQs.length) {
    schemas.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": FAQs.map(x => ({
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

  // ItemList（水晶位，无 Product 前端渲染验证）
  if (crystals.length) {
    schemas.push({
      "@context": "https://schema.org", "@type": "ItemList",
      "name": "Crystals for the Spread",
      "itemListElement": crystals.map((c, i) => ({
        "@type": "ListItem", "position": i + 1,
        "name": c.name,
        "description": c.role || c.name,
      }))
    });
  }

  return schemas.map(s => JSON.stringify(s)).join('\n');
}

// ---------- 主流程：upload ----------
const CAT_ID = 1570; // tarot
console.log('分类 tarot → ' + CAT_ID + '（牌阵 25 + 新手 3 = 28 篇文字上线，图后补）\n');

const spreadsDir = path.join(BASE, 'articles-spreads');
const beginnerDir = path.join(BASE, 'articles-beginner');
const spreadsFiles = fs.existsSync(spreadsDir) ? fs.readdirSync(spreadsDir).filter(f => /\.md$/.test(f)) : [];
const beginnerFiles = fs.existsSync(beginnerDir) ? fs.readdirSync(beginnerDir).filter(f => /\.md$/.test(f)) : [];

let targets = [];
for (const f of spreadsFiles) targets.push({ file: f, dir: spreadsDir, kind: 'spread', postSlug: f.replace(/\.md$/, '') });
for (const f of beginnerFiles) targets.push({ file: f, dir: beginnerDir, kind: 'beginner', postSlug: f.replace(/\.md$/, '') });

if (slugArg) {
  targets = targets.filter(t => t.postSlug === slugArg);
}

if (!fs.existsSync(QC_DIR)) fs.mkdirSync(QC_DIR, { recursive: true });

let ok = 0, fail = 0, skip = 0, fkOk = 0, fkEmpty = 0, schemaFaqTotal = 0, schemaItemListTotal = 0;
const results = [];
const failList = [];
const noFKList = [];
const noCrystalsList = [];

const uploaded = [];   // 用于排期（id, slug, kind）

for (const t of targets) {
  const mdPath = path.join(t.dir, t.file);
  try {
    if (!DRY && postSlugExists(t.postSlug)) {
      console.log('⏭ ' + t.postSlug + ' (已存在,跳过)');
      skip++; results.push({ slug: t.postSlug, status: 'skip' });
      continue;
    }
    const md = fs.readFileSync(mdPath, 'utf8');
    const parsed = parseArticle(md, t.postSlug);

    if (!parsed.focusKeyword) { fkEmpty++; noFKList.push(t.postSlug); }
    else fkOk++;

    if (!parsed.crystals.length) noCrystalsList.push(t.postSlug);

    const FAQs = extractFAQs(parsed.html);
    schemaFaqTotal += FAQs.length;
    schemaItemListTotal += parsed.crystals.length;

    if (DRY) {
      ok++;
      results.push({ slug: t.postSlug, kind: t.kind, status: 'dry',
        fk: parsed.focusKeyword, title: parsed.title,
        faqCount: FAQs.length, crystalCount: parsed.crystals.length,
        crystals: parsed.crystals.map(c => c.name + ' (' + c.role + ')')
      });
      console.log('[DRY] ' + t.postSlug + ' fk="' + parsed.focusKeyword + '" faq:' + FAQs.length + ' crystals:' + parsed.crystals.length + ' [' + parsed.crystals.map(c => c.name).join(', ') + ']');
      continue;
    }

    const url = 'https://' + SITE + '/' + t.postSlug + '/';
    const schemaHtml = buildSchema({
      title: parsed.title, description: parsed.description,
      url, crystals: parsed.crystals, FAQs
    }).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');

    const content = parsed.html + '\n\n' + schemaHtml;

    const post = createPost({
      title: parsed.title,
      slug: t.postSlug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft',
      categories: [CAT_ID],
      excerpt: parsed.description,
    });

    setRankMath(post.id, {
      rank_math_title: parsed.title,
      rank_math_description: parsed.description,
      rank_math_focus_keyword: parsed.focusKeyword,
    });

    ok++;
    uploaded.push({ id: post.id, slug: t.postSlug, kind: t.kind });
    results.push({
      slug: t.postSlug, id: post.id, link: post.link, status: 'ok', kind: t.kind,
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

fs.writeFileSync(path.join(QC_DIR, 'upload-spreads-beginner-results.json'), JSON.stringify(results, null, 2), 'utf8');

console.log('\n========== 牌阵+新手 28 篇 upload 报告 ==========');
console.log('目标篇数: ' + targets.length + ' (spreads=' + spreadsFiles.length + ', beginner=' + beginnerFiles.length + ')');
console.log('成功(upload): ' + ok);
console.log('失败: ' + fail);
console.log('跳过(已存在): ' + skip);
console.log('focus_keyword 写入: ' + fkOk + ' / 空: ' + fkEmpty);
console.log('FAQ 抽取总条数: ' + schemaFaqTotal);
console.log('ItemList 水晶总条数: ' + schemaItemListTotal);
console.log('schema: Article + FAQPage(条件触发) + BreadcrumbList + ItemList(条件触发,无Product)');
console.log('图: 本次不传，featured/media 空，图后补');
if (noFKList.length) console.log('无 fk 明细(' + noFKList.length + '): ' + noFKList.join(', '));
if (noCrystalsList.length) console.log('无水晶(ItemList空)明细(' + noCrystalsList.length + '): ' + noCrystalsList.join(', '));
if (failList.length) {
  console.log('\n失败明细(' + failList.length + '):');
  failList.forEach(s => console.log('  ' + s));
}
console.log('结果已写: _qc/upload-spreads-beginner-results.json');

// ---------- 排期 future（接 600 篇 future 最后 2027-06-23 之后，每天 2 篇） ----------
if (DO_SCHEDULE && !DRY && uploaded.length) {
  console.log('\n========== 排期 future ==========');
  // 1. 查现有 future 最晚日期（翻页拿全，起始日 = 它 +1）
  let allFuture = [], page = 1;
  while (true) {
    const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '30',
      'https://' + SITE + '/wp-json/wp/v2/posts?categories=' + CAT_ID + '&status=future&per_page=100&page=' + page + '&_fields=id,slug,date']);
    let arr; try { arr = JSON.parse(out); } catch (e) { break; }
    if (!Array.isArray(arr) || !arr.length) break;
    allFuture = allFuture.concat(arr);
    if (arr.length < 100) break;
    page++; if (page > 10) break;
  }
  const futureDates = allFuture.map(p => p.date).sort();
  const lastFuture = futureDates[futureDates.length - 1];
  const startISO = lastFuture || new Date().toISOString();
  console.log('现有 future 数: ' + allFuture.length + '，最晚: ' + (lastFuture || '(无)'));
  console.log('本次排期起始: ' + startFuture(startISO) + '（接 lastFuture +1 天）');

  // 2. 排序 uploaded：先新手(3)后牌阵(25)？还是按原顺序？任务说"接 120 篇最后"，按 upload 顺序即可
  //    新手作为入门指引优先排前；牌阵按字典序排后
  const sorted = uploaded.slice().sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'beginner' ? -1 : 1;  // beginner 先
    return a.slug.localeCompare(b.slug);
  });

  // 3. 生成定时日期（每天 2 篇，时间随机 9:00-20:59）
  const start = new Date(startISO);
  const slots = [];
  for (let i = 0; i < sorted.length; i++) {
    const dayOffset = Math.floor(i / 2);
    const d = new Date(start);
    d.setDate(d.getDate() + dayOffset + 1);
    const hour = 9 + Math.floor(Math.random() * 12);
    const min = Math.floor(Math.random() * 60);
    d.setHours(hour, min, 0, 0);
    slots.push(d.toISOString().replace(/\.\d+Z$/, ''));
  }
  console.log('排期范围: ' + slots[0] + ' → ' + slots[slots.length - 1] + ' (' + sorted.length + ' 篇, 每天 2 篇)');

  let sOk = 0, sFail = 0;
  const sResults = [];
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i];
    try {
      const r = scheduleFuture(u.id, slots[i]);
      const success = r.status === 'future';
      sResults.push({ slug: u.slug, id: u.id, date: slots[i], status: r.status, ok: success });
      if (success) { sOk++; console.log('✅ ' + u.slug + ' → ' + slots[i]); }
      else { sFail++; console.log('❌ ' + u.slug + ' → status=' + r.status); }
    } catch (e) {
      sFail++; sResults.push({ slug: u.slug, id: u.id, date: slots[i], error: e.message.slice(0, 120), ok: false });
      console.log('❌ ' + u.slug + ': ' + e.message.slice(0, 120));
    }
  }
  fs.writeFileSync(path.join(QC_DIR, 'schedule-spreads-beginner-results.json'), JSON.stringify(sResults, null, 2), 'utf8');
  console.log('\n=== 排期完成: ' + sOk + ' OK, ' + sFail + ' ERR / ' + sorted.length + ' ===');
  console.log('排期范围: ' + slots[0] + ' → ' + slots[slots.length - 1]);
}

function startFuture(iso) {
  const d = new Date(iso); d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d.toISOString().replace(/\.\d+Z$/, '');
}
