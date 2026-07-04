/**
 * 上传 MBTI 16 型 hub 文章到 WP（draft）
 * 源：articles/*.md（解析 Brief/正文/质检三段式）
 * 图：configs/articles-images.json[slug].hero（featured + 嵌 content 顶部，context=edit 避覆盖）
 * category：mbti-tarot（如不存在自动创建）
 * rank_math：createPost 后调 rankmath/v1/updateMeta（UA: curl/8.0.0 避 CF 拦截）
 * schema：Article + FAQPage + BreadcrumbList + ItemList(crystals 指向 /{slug}-meaning/)
 * URL：根级 post（/mbti-{type}-tarot/），slug 直接用文件名
 * 嵌图：media 上传用 context=edit（避免 50808 覆盖事故）
 * 用法：
 *   node upload-mbti-md.js --slug=mbti-intj-tarot   # 单篇
 *   node upload-mbti-md.js                            # 全量
 * 需 socks5(127.0.0.1:10808) + ~/.env
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');

// env
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const BASE = path.resolve(__dirname, '..');
const IMG_ROOT = path.resolve(__dirname, '../../../02-网站规划');
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

// WP helpers
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
  // context=edit 避免覆盖已存在 alt/title
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt.replace(/"/g, '') + '" "https://' + SITE + '/wp-json/wp/v2/media?context=edit" --max-time 180', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
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
  // UA: curl/8.0.0 避 CF 拦截 Python urllib 默认 UA
  const tmp = path.join(__dirname, '_tmp-rm.json');
  fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta }), 'utf8');
  execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -H "User-Agent: curl/8.0.0" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
}
function postSlugExists(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    return JSON.parse(r).length > 0;
  } catch (e) { return false; }
}

// .md 解析（复用 upload-tarot-md.js 逻辑）
function parseArticle(md, fileSlug) {
  const lines = md.split(/\r?\n/);
  let i = lines.findIndex(l => /^##\s*正文\s*$/.test(l.trim()));
  if (i < 0) throw new Error('未找到 ## 正文');
  i++;
  while (i < lines.length) {
    const l = lines[i].trim();
    if (!l || l.startsWith('>')) { i++; continue; }
    break;
  }
  let start = i;
  let end = lines.length;
  for (let j = start; j < lines.length; j++) {
    const l = lines[j].trim();
    if (/^##\s*质检(报告)?(\s|$)/.test(l) || /^##\s*生产元信息/.test(l)) { end = j; break; }
  }
  const bodyLines = lines.slice(start, end);
  while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) bodyLines.pop();

  let title = '';
  const headRe = /^(#{1,3})\s+(.+?)\s*$/;
  for (const l of bodyLines) {
    const m = l.match(headRe);
    if (m) { title = m[2].replace(/[`*]/g, '').trim(); break; }
  }
  if (!title) title = fileSlug;

  const fullBrief = lines.slice(0, start).join('\n');
  let focusKeyword = '';
  const fk = fullBrief.match(/focus_keyword[^`]*[`']([^`']+)[`']/i);
  if (fk) focusKeyword = fk[1].trim();

  const html = mdToHtml(bodyLines);

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
function mdToHtml(bodyLines) {
  const out = [];
  let inList = false, inOrderedList = false;
  const closeList = () => { if (inList || inOrderedList) { out.push(inOrderedList ? '</ol>' : '</ul>'); inList = false; inOrderedList = false; } };
  for (let i = 0; i < bodyLines.length; i++) {
    let line = bodyLines[i];
    const t = line.trim();
    const h = t.match(/^(#{1,6})\s+(.+)$/);
    if (h) { closeList(); const lvl = Math.min(h[1].length, 6); out.push('<h' + lvl + '>' + inline(h[2]) + '</h' + lvl + '>'); continue; }
    if (/^[-*]{3,}$/.test(t)) { closeList(); out.push('<hr>'); continue; }
    if (t.startsWith('|')) { closeList(); out.push(line); continue; }
    if (/^[-*]\s+/.test(t)) {
      if (inOrderedList) { out.push('</ol>'); inOrderedList = false; }
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + inline(t.replace(/^[-*]\s+/, '')) + '</li>'); continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      if (inList) { out.push('</ul>'); inList = false; }
      if (!inOrderedList) { out.push('<ol>'); inOrderedList = true; }
      out.push('<li>' + inline(t.replace(/^\d+\.\s+/, '')) + '</li>'); continue;
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

// schema
function buildSchema({ title, description, content, url, crystals }) {
  const schemas = [];
  schemas.push({
    "@context": "https://schema.org", "@type": "Article",
    "headline": title, "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "description": description, "url": url,
    "author": { "@type": "Organization", "name": "Earthward" },
    "publisher": { "@type": "Organization", "name": "Earthward" }
  });
  // FAQPage
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
      "mainEntity": qs.map(x => ({ "@type": "Question", "name": x.q, "acceptedAnswer": { "@type": "Answer", "text": x.a.slice(0, 400) } }))
    });
  }
  // ItemList: crystals 指向 /{slug}-meaning/
  if (crystals && crystals.length) {
    const seen = new Set(); let pos = 0; const items = [];
    for (const c of crystals) {
      if (!c.slug || seen.has(c.slug)) continue;
      seen.add(c.slug); pos++;
      items.push({ "@type": "ListItem", "position": pos, "item": { "@type": "Article", "name": prettyName(c.slug), "url": "https://" + SITE + "/" + c.slug + "-meaning/" } });
    }
    if (items.length) schemas.push({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": items });
  }
  // BreadcrumbList: Home → MBTI Tarot → 本篇
  schemas.push({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" },
      { "@type": "ListItem", "position": 2, "name": "MBTI Tarot", "item": "https://" + SITE + "/category/mbti-tarot/" },
      { "@type": "ListItem", "position": 3, "name": title, "item": url }
    ]
  });
  return schemas.map(s => JSON.stringify(s)).join('\n');
}
function prettyName(slug) { return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); }
function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// 主流程
const CAT_ID = ensureCategory('mbti-tarot', 'MBTI Tarot');
console.log('分类 mbti-tarot → ' + CAT_ID + '\n');

const articlesDir = path.join(BASE, 'articles');
const imgMap = JSON.parse(fs.readFileSync(path.join(BASE, 'configs', 'articles-images.json'), 'utf8'));
const mdFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('README'));

let targets = mdFiles.map(f => ({ file: f, fileSlug: f.replace(/\.md$/, '') }));
if (slugArg) targets = targets.filter(t => t.fileSlug === slugArg);

let ok = 0, fail = 0, skip = 0;
const results = [];
for (const t of targets) {
  try {
    if (postSlugExists(t.fileSlug)) {
      console.log('⏭ ' + t.fileSlug + ' (已存在)');
      skip++; results.push({ slug: t.fileSlug, status: 'skip' }); continue;
    }
    const md = fs.readFileSync(path.join(articlesDir, t.file), 'utf8');
    const parsed = parseArticle(md, t.fileSlug);
    const imgInfo = imgMap.articles[t.fileSlug];
    if (!imgInfo || !imgInfo.hero) throw new Error('articles-images.json 无该 slug 或无 hero');

    // 1. 上传 hero（context=edit）
    const heroPath = path.join(IMG_ROOT, imgInfo.hero.file.replace(/\//g, path.sep));
    if (!fs.existsSync(heroPath)) throw new Error('hero 图不存在: ' + heroPath);
    const hero = uploadMedia(heroPath, parsed.title);

    // 2. 组装 content：hero 顶部 + 正文
    const heroImg = '<img src="' + hero.url + '" alt="' + escapeAttr(parsed.title) + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + parsed.html;

    // 3. schema
    const url = 'https://' + SITE + '/' + t.fileSlug + '/';
    const schemaHtml = buildSchema({
      title: parsed.title, description: parsed.description, content,
      url, crystals: imgInfo.crystals
    }).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
    content += '\n\n' + schemaHtml;

    // 4. createPost
    const post = createPost({
      title: parsed.title, slug: t.fileSlug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id,
      excerpt: parsed.description
    });

    // 5. rank_math（UA: curl/8.0.0）
    setRankMath(post.id, {
      rank_math_title: parsed.title,
      rank_math_description: parsed.description,
      rank_math_focus_keyword: parsed.focusKeyword
    });

    ok++;
    results.push({ slug: t.fileSlug, id: post.id, link: post.link, hero: hero.id, status: 'ok', title: parsed.title, fk: parsed.focusKeyword });
    console.log('✅ ' + t.fileSlug + ' → post:' + post.id + ' (hero:' + hero.id + ', fk="' + parsed.focusKeyword + '")');
  } catch (e) {
    fail++;
    results.push({ slug: t.fileSlug, error: e.message.slice(0, 200), status: 'fail' });
    console.log('❌ ' + t.fileSlug + ': ' + e.message.slice(0, 200));
  }
}

fs.writeFileSync(path.join(BASE, '_qc', 'upload-results.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
