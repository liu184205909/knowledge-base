/**
 * 从 390 个 crystal-meaning json 提取结构化水晶属性库（数据层核心）
 *
 * 数据源：04-内容生产/1.crystal-meaning/*.json
 *        每个 json 的 content HTML 末尾有 crystal-profile 侧边栏（Overview/Mineral dl + Safety badges）
 *        + "Best Crystals to Pair With" 搭配章节
 * 输出：07-互动工具/02-数据层/crystal-attributes.json
 *
 * 这是 Compatibility Checker 数据层的源头抽取——element/chakra/zodiac/intention/forms/mineral/safety/pairing
 * 全部来自站内 390 颗水晶，不依赖竞品。
 *
 * Usage: node extract-crystal-profile.js
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/1.crystal-meaning';
const OUT_PATH = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/crystal-attributes.json';

function stripTags(s) { return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

// 提取 <h4>X</h4><dl>...</dl> 块（Overview / Mineral）
function extractDlSections(html) {
  const sections = {};
  const sre = /<h4>([^<]+)<\/h4>\s*<dl>([\s\S]*?)<\/dl>/g;
  let m;
  while ((m = sre.exec(html)) !== null) {
    const name = m[1].trim();
    const dl = {};
    let p;
    const pre = /<dt>([^<]+)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g;
    while ((p = pre.exec(m[2])) !== null) {
      dl[p[1].trim()] = stripTags(p[2]);
    }
    sections[name] = dl;
  }
  return sections;
}

// 提取 Safety badges（Water/Sun/Salt）
function extractSafety(html) {
  const safety = {};
  const block = html.match(/<h4>Safety<\/h4>([\s\S]*?)(?:<\/div>\s*<p|<p><a class="cta-button)/);
  if (!block) return safety;
  const sr = /<span class="safety-badge[^"]*"[^>]*>([^<]+)<\/span>/g;
  let s;
  while ((s = sr.exec(block[1])) !== null) {
    const t = stripTags(s[1]);
    if (/^water/i.test(t)) safety.water = t;
    else if (/^sun/i.test(t)) safety.sun = t;
    else if (/^salt/i.test(t)) safety.salt = t;
    else (safety.other = safety.other || []).push(t);
  }
  return safety;
}

// 提取 "Best Crystals to Pair With X" 章节 → 站内搭配库
function extractPairings(html, selfSlug) {
  const pairs = [];
  const sec = html.match(/Best Crystals to Pair With[\s\S]*?<\/ul>/);
  if (!sec) return pairs;
  const are = /<a href="\/gemstone\/([^"/]+)-meaning[^"]*"[^>]*>([^<]+)<\/a>/g;
  let a;
  while ((a = are.exec(sec[0])) !== null) {
    if (a[1] !== selfSlug) pairs.push({ slug: a[1], name: stripTags(a[2]) });
  }
  return pairs;
}

function main() {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.json'));
  const crystals = {};
  let withProfile = 0, withPairing = 0, withSafety = 0, withMineral = 0;
  const missingProfile = [];

  for (const f of files) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(SRC_DIR, f), 'utf8')); }
    catch (e) { console.error('parse fail:', f); continue; }

    const c = data.content || '';
    const slug = data.slug || f.replace(/\.json$/, '');
    const sections = extractDlSections(c);
    const overview = sections['Overview'] || {};
    const mineral = sections['Mineral'] || {};
    const safety = extractSafety(c);
    const pairings = extractPairings(c, slug);

    const hasProfile = Object.keys(overview).length > 0;
    if (hasProfile) withProfile++; else missingProfile.push(slug);
    if (pairings.length) withPairing++;
    if (Object.keys(safety).length) withSafety++;
    if (Object.keys(mineral).length) withMineral++;

    crystals[slug] = {
      title: data.title || '',
      slug,
      link: (data._recovery && data._recovery.link) || ('https://goearthward.com/gemstone/' + slug + '/'),
      status: data.status || null,
      overview,
      mineral,
      safety,
      pairings
    };
  }

  const out = {
    _meta: {
      source: '04-内容生产/1.crystal-meaning/*.json (content HTML crystal-profile)',
      extracted_for: 'Compatibility Checker 数据层',
      total_files: files.length,
      with_profile: withProfile,
      with_mineral: withMineral,
      with_safety: withSafety,
      with_pairing: withPairing,
      missing_profile_count: missingProfile.length,
      missing_profile_sample: missingProfile.slice(0, 20)
    },
    crystals
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log('=== 抽取完成 ===');
  console.log('总文件:', files.length);
  console.log('有 Overview profile:', withProfile, '(' + (100 * withProfile / files.length).toFixed(1) + '%)');
  console.log('有 Mineral:', withMineral);
  console.log('有 Safety:', withSafety);
  console.log('有 pairing 搭配:', withPairing);
  console.log('缺 profile:', missingProfile.length, missingProfile.slice(0, 15).join(', '));
  console.log('输出:', OUT_PATH);
}

main();
