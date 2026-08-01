/**
 * 上传 Tarot 场景文章 220 篇 + 配对文章 231 篇到 WP(draft)
 * 源: articles/*.md（解析 Brief/正文/质检三段式）
 * 图: articles-images.json[slug] → hero(featured+嵌content顶部) + crystals(嵌正文水晶段后)
 * category: tarot(主分类，复用 upload-tarot.js ensureCategory)
 * rank_math: createPost 后调 rankmath/v1/updateMeta
 * schema: Article + FAQPage(从正文提取) + BreadcrumbList + ItemList(crystals 指向 /gemstone/{slug}-meaning/，禁 Product)
 * URL: 根级 post（/the-fool-for-love/、/the-fool-and-the-magician/），slug 直接用文件名（已统一）
 * 用法：
 *   node upload-tarot-md.js --slug=the-fool-for-love          (单篇)
 *   node upload-tarot-md.js                                     (全量)
 *   node upload-tarot-md.js --type=scenario                     (仅场景)
 *   node upload-tarot-md.js --type=pair                         (仅配对)
 * 需 socks5(127.0.0.1:10808) + ~/.env(WP_USER/WP_APP_PASSWORD/WP_SITE)
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');

// ---------- env ----------
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const BASE = path.resolve(__dirname, '..');                                    // .../13.tarot/
const IMG_ROOT = path.resolve(__dirname, '../../../');                         // .../01-疗愈水晶/
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1];

// ---------- WP helpers（复用 upload-tarot.js 逻辑） ----------
function ensureCategory(slug, name) {
  let r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/categories?slug=' + slug + '&_fields=id" --max-time 15', { encoding: 'utf8' });
  let arr; try { arr = JSON.parse(r); } catch (e) { arr = []; }
  if (arr.length) return arr[0].id;
  const tmp = path.join(__dirname, '_tmp-cat.json');
  fs.writeFileSync(tmp, JSON.stringify({ name, slug }), 'utf8');
  r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/categories?_fields=id,name" --max-time 30', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  const j = JSON.parse(r);
  if (!j.id) throw new Error('建分类失败: ' + (j.message || r.slice(0, 120)));
  console.log('📁 创建分类 ' + name + ' → ' + j.id);
  return j.id;
}
function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt.replace(/"/g, '') + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 180', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 100)));
  return { id: j.id, url: j.source_url };
}
function createPost(data) {
  const tmp = path.join(__dirname, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status" --max-time 120', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}
function setRankMath(id, meta) {
  const tmp = path.join(__dirname, '_tmp-rm.json');
  fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta }), 'utf8');
  execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
}
function postSlugExists(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    return JSON.parse(r).length > 0;
  } catch (e) { return false; }
}
function getPost(slug) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id,slug,status,link,featured_media" --max-time 15', { encoding: 'utf8' });
  return JSON.parse(r);
}

// ---------- .md 解析 ----------
// 正文 = 第一个 `## 正文` 之后的章节，直到下一个 `## 质检`/`## 质检报告`/`## 生产元信息`
// 正文内可能含元信息引用块（> **URL**...），跳到第一个 # / ## / ### 标题行
function parseArticle(md, fileSlug) {
  const lines = md.split(/\r?\n/);
  // 定位 `## 正文`
  let i = lines.findIndex(l => /^##\s*正文\s*$/.test(l.trim()));
  if (i < 0) throw new Error('未找到 ## 正文');
  i++;
  // 跳过元信息引用块（> 开头）和空行，定位第一个标题行
  while (i < lines.length) {
    const l = lines[i].trim();
    if (!l || l.startsWith('>')) { i++; continue; }
    break;
  }
  // 正文真正起点：当前行
  let start = i;
  // 正文终点：下一个 `## 质检`/`## 质检报告`/`## 质检 `/`## 生产元信息`
  let end = lines.length;
  for (let j = start; j < lines.length; j++) {
    const l = lines[j].trim();
    if (/^##\s*质检(报告)?(\s|$)/.test(l) || /^##\s*生产元信息/.test(l)) { end = j; break; }
  }
  const bodyLines = lines.slice(start, end);
  // 去尾部空行
  while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) bodyLines.pop();

  // title = 正文第一个 `# ` H1 或 `## `/`### ` 标题
  let title = '';
  const headRe = /^(#{1,3})\s+(.+?)\s*$/;
  for (const l of bodyLines) {
    const m = l.match(headRe);
    if (m) { title = m[2].replace(/[`*]/g, '').trim(); break; }
  }
  if (!title) title = fileSlug;

  // focus_keyword：从 Brief 提取（大小写容错）
  const fullBrief = lines.slice(0, start).join('\n');
  let focusKeyword = '';
  const fk = fullBrief.match(/focus_keyword[^`]*[`']([^`']+)[`']/i);
  if (fk) focusKeyword = fk[1].trim();

  // 把 markdown 正文转 HTML（轻量：标题/段落/列表/加粗/链接/details-summary FAQ/hr）
  const html = mdToHtml(bodyLines);

  // rank_math_description：取正文第一段（去掉标题后的第一段纯文本）截 ~155 字符
  let firstPara = '';
  for (const l of bodyLines) {
    const t = l.trim();
    if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|') || /^[-*]\s/.test(t) || /^[-*]{3,}$/.test(t) || t.startsWith('![')) continue;
    // 去掉 markdown 加粗/链接标记取纯文本
    firstPara = t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
    if (firstPara) break;
  }
  const desc = firstPara ? (firstPara.length > 155 ? firstPara.slice(0, 152) + '...' : firstPara) : title;

  return { title, focusKeyword, html, description: desc };
}

// 轻量 markdown→HTML（覆盖这些文章用到的语法）
function mdToHtml(bodyLines) {
  const out = [];
  let inList = false, inOrderedList = false;
  const closeList = () => { if (inList || inOrderedList) { out.push(inOrderedList ? '</ol>' : '</ul>'); inList = false; inOrderedList = false; } };
  for (let i = 0; i < bodyLines.length; i++) {
    let line = bodyLines[i];
    const t = line.trim();
    // 标题
    const h = t.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      closeList();
      const lvl = Math.min(h[1].length, 6);
      out.push('<h' + lvl + '>' + inline(h[2]) + '</h' + lvl + '>');
      continue;
    }
    // hr
    if (/^[-*]{3,}$/.test(t)) { closeList(); out.push('<hr>'); continue; }
    // 表格（整块 | ... |）
    if (t.startsWith('|')) {
      closeList();
      out.push(line);
      continue;
    }
    // 无序列表
    if (/^[-*]\s+/.test(t)) {
      if (inOrderedList) { out.push('</ol>'); inOrderedList = false; }
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + inline(t.replace(/^[-*]\s+/, '')) + '</li>');
      continue;
    }
    // 有序列表
    if (/^\d+\.\s+/.test(t)) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (!inOrderedList) { out.push('<ol>'); inOrderedList = true; }
      out.push('<li>' + inline(t.replace(/^\d+\.\s+/, '')) + '</li>');
      continue;
    }
    // 空行
    if (!t) { closeList(); continue; }
    // 普通段落
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
function buildSchema({ title, description, content, url, crystals, isPair }) {
  const schemas = [];
  schemas.push({
    "@context": "https://schema.org", "@type": "Article",
    "headline": title, "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "description": description, "url": url,
    "author": { "@type": "Organization", "name": "Earthward" },
    "publisher": { "@type": "Organization", "name": "Earthward" },
  });
  // FAQPage：从正文 <strong>问？</strong> 段或 H3 FAQ 段提取（这里匹配 FAQ 段后的 Q 段落）
  // 简化：匹配以 **...?** 开头且紧跟段落的问答对
  const faqBlock = content.match(/<h[23][^>]*>FAQ[\s\S]*?(?=<h[23]|<hr|$)/i);
  const qs = [];
  if (faqBlock) {
    const paras = faqBlock[0].split(/<\/?p>/);
    let cur = null;
    for (const p of paras) {
      const pt = p.replace(/<[^>]+>/g, '').trim();
      if (!pt) continue;
      const qm = p.match(/<strong>([^<]{8,120}\?)<\/strong>/);
      if (qm) { cur = { q: qm[1].trim(), a: '' }; qs.push(cur); }
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
  // ItemList：crystals 指向 /gemstone/{slug}-meaning/（禁 Product）
  if (crystals && crystals.length) {
    const seen = new Set();
    let pos = 0;
    const items = [];
    for (const c of crystals) {
      if (!c.slug || seen.has(c.slug)) continue;
      seen.add(c.slug);
      pos++;
      items.push({
        "@type": "ListItem", "position": pos,
        "item": {
          "@type": "Article",
          "name": prettyName(c.slug),
          "url": "https://" + SITE + "/gemstone/" + c.slug + "-meaning/"
        }
      });
    }
    if (items.length) schemas.push({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": items });
  }
  // BreadcrumbList: Home → Tarot → 本篇
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
function prettyName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- 主流程 ----------
const CAT_ID = ensureCategory('tarot', 'Tarot');
console.log('分类 tarot → ' + CAT_ID + '\n');

// 遍历 articles/*.md
const articlesDir = path.join(BASE, 'articles');
const imagesMap = JSON.parse(fs.readFileSync(path.join(BASE, 'configs', 'articles-images.json'), 'utf8'));
const mdFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('README'));

let targets = mdFiles.map(f => {
  const fileSlug = f.replace(/\.md$/, '');
  // postSlug：场景正位 the-fool-for-love；场景逆位 the-fool-for-spiritual-growth-reversed；配对 the-fool-and-the-magician-combination → 去 -combination
  let postSlug = fileSlug;
  if (postSlug.endsWith('-combination')) postSlug = postSlug.replace(/-combination$/, '');
  return { file: f, fileSlug, postSlug };
});

// --type 过滤
if (typeArg) {
  targets = targets.filter(t => {
    const type = imagesMap[t.fileSlug]?.type || '';
    if (typeArg === 'scenario') return type.startsWith('scenario');
    if (typeArg === 'pair') return type === 'pair';
    return true;
  });
}
// --slug 过滤
if (slugArg) {
  targets = targets.filter(t => t.postSlug === slugArg || t.fileSlug === slugArg);
}

let ok = 0, fail = 0, skip = 0;
const results = [];
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
    // 图清单 key：配对文章 key 无 -combination 后缀（= postSlug）；场景文章 key = fileSlug
    const imgInfo = imagesMap[t.fileSlug] || imagesMap[t.postSlug];
    if (!imgInfo || !imgInfo.hero) throw new Error('articles-images.json 无该 slug 或无 hero (fileSlug=' + t.fileSlug + ', postSlug=' + t.postSlug + ')');

    // 1. 上传 hero
    const heroPath = path.join(IMG_ROOT, imgInfo.hero.replace(/\//g, path.sep));
    if (!fs.existsSync(heroPath)) throw new Error('hero 图不存在: ' + heroPath);
    const hero = uploadMedia(heroPath, parsed.title);

    // 2. 上传 crystals（去重 by slug 避免一石双役重复传）
    const crystalsUploaded = [];
    const seenSlug = new Set();
    for (const c of (imgInfo.crystals || [])) {
      if (!c.slug || seenSlug.has(c.slug)) continue;
      seenSlug.add(c.slug);
      const cPath = path.join(IMG_ROOT, c.img.replace(/\//g, path.sep));
      if (!fs.existsSync(cPath)) { console.log('  ⚠ crystal 图不存在,跳过: ' + c.slug); continue; }
      const up = uploadMedia(cPath, prettyName(c.slug));
      crystalsUploaded.push({ slug: c.slug, id: up.id, url: up.url });
    }

    // 3. 组装 content：hero 顶部 + 正文 + crystals 末尾
    const heroImg = '<img src="' + hero.url + '" alt="' + escapeAttr(parsed.title) + '" style="' + IMG_STYLE + '" loading="lazy">';
    // (escapeAttr 定义在文件末尾 helper 区)
    let content = heroImg + '\n' + parsed.html;
    if (crystalsUploaded.length) {
      const crystalImgs = crystalsUploaded.map(c =>
        '<figure style="margin:16px 0;"><img src="' + c.url + '" alt="' + prettyName(c.slug) + ' crystal" style="' + IMG_STYLE + '" loading="lazy"><figcaption style="text-align:center;font-style:italic;">' + prettyName(c.slug) + '</figcaption></figure>'
      ).join('\n');
      content += '\n\n<h2>Crystals Referenced in This Reading</h2>\n' + crystalImgs;
    }

    // 4. schema 嵌入
    const url = 'https://' + SITE + '/' + t.postSlug + '/';
    const schemaHtml = buildSchema({
      title: parsed.title, description: parsed.description, content,
      url, crystals: imgInfo.crystals, isPair: imgInfo.type === 'pair'
    }).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
    content += '\n\n' + schemaHtml;

    // 5. createPost
    const post = createPost({
      title: parsed.title, slug: t.postSlug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id,
      excerpt: parsed.description,
    });

    // 6. rank_math
    setRankMath(post.id, {
      rank_math_title: parsed.title,
      rank_math_description: parsed.description,
      rank_math_focus_keyword: parsed.focusKeyword,
    });

    ok++;
    results.push({ slug: t.postSlug, id: post.id, link: post.link, hero: hero.id, crystals: crystalsUploaded.map(c => c.id), status: 'ok' });
    console.log('✅ ' + t.postSlug + ' → post:' + post.id + ' (hero:' + hero.id + ', crystals:[' + crystalsUploaded.map(c => c.id).join(',') + '], fk="' + parsed.focusKeyword + '")');
  } catch (e) {
    fail++;
    results.push({ slug: t.postSlug, error: e.message.slice(0, 200), status: 'fail' });
    console.log('❌ ' + t.postSlug + ': ' + e.message.slice(0, 200));
  }
}

fs.writeFileSync(path.join(BASE, '_qc', 'upload-md-results.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
