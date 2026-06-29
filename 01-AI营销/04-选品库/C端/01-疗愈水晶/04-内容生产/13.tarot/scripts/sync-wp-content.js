/**
 * 把本地已修复的禁词替换同步到 WP 线上 (GET content → 精准替换 → PUT)
 * 复用 fix-softbanned.js 的 EDITS 表，保证线上线下一致；保留所有图片/schema/包装层
 * 用法：node scripts/sync-wp-content.js   需 socks5 + disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os'), { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE;
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';

// post id 映射 (来自 status=any 查询)
const ID = {
  the_chariot: 47848, the_fool: 47895, the_world: 47890, the_magician: 47830,
  the_hermit: 47854, the_tower: 47875, the_moon: 47881, the_star: 47878, strength: 47851,
};

// 复用与本地完全相同的 EDITS（slug 用下划线变体映射）
const EDITS = [
  ['the_chariot', 'the triumph that comes not from raw force but from harnessing opposing pulls toward a single aim', 'the triumph that comes not from raw force but from directing opposing pulls toward a single aim'],
  ['the_chariot', 'the more difficult victory of <em>harnessing</em> — of taking the two sphinxes within', 'the more difficult victory of <em>direction</em> — of taking the two sphinxes within'],
  ['the_chariot', 'Then name the single aim that, if you committed to it, could harness both.', 'Then name the single aim that, if you committed to it, could coordinate both.'],
  ['the_chariot', "matching the card's theme of harnessed momentum", "matching the card's theme of focused momentum"],
  ['the_chariot', 'the same energy, harnessed rather than spent. Hold a piece while naming the one aim', 'the same energy, focused rather than spent. Hold a piece while naming the one aim'],
  ['the_chariot', 'the same energy, harnessed rather than spent. <a href="/gemstone/carnelian-meaning/">', 'the same energy, focused rather than spent. <a href="/gemstone/carnelian-meaning/">'],
  ['the_chariot', 'a quiet support for the discipline that harnessed momentum requires.', 'a quiet support for the discipline that focused momentum requires.'],
  ['the_chariot', 'Then name the single goal that could, if you let it, harness both pulls rather than split you between them.', 'Then name the single goal that could, if you let it, direct both pulls rather than split you between them.'],
  ['the_chariot', "The Chariot's triumph is the harnessing sustained, not the force declared.", "The Chariot's triumph is the direction sustained, not the force declared."],
  ['the_chariot', 'that every meaningful pursuit requires you to harness rather than suppress.', 'that every meaningful pursuit requires you to coordinate rather than suppress.'],
  ['the_chariot', 'The Chariot reminds you that triumph comes from harnessing, not from pushing;', 'The Chariot reminds you that triumph comes from focused direction, not from pushing;'],
  ['the_chariot', "The Chariot's theme of harnessing opposing forces resonates with the Eastern principle of", "The Chariot's theme of directing opposing forces resonates with the Eastern principle of"],
  ['the_chariot', "each piece can serve as a daily reminder of The Chariot's invitation to harness opposing pulls toward one aim.", "each piece can serve as a daily reminder of The Chariot's invitation to direct opposing pulls toward one aim."],
  ['the_chariot', 'the archetype of victory through mastery — the harnessing of opposing forces toward a single aim.', 'the archetype of victory through mastery — the coordination of opposing forces toward a single aim.'],
  ['the_chariot', 'It suggests that competing demands can be harnessed toward a single aim,', 'It suggests that competing demands can be aligned toward a single aim,'],
  ['the_chariot', 'The principle across references is focused, directed, harnessed energy.', 'The principle across references is focused, directed, coordinated energy.'],
  ['the_chariot', 'the momentum available when competing pulls are harnessed — but the aim you choose,', 'the momentum available when competing pulls are aligned — but the aim you choose,'],
  ['the_chariot', 'the kind of harnessed will that actually carries a life forward.', 'the kind of focused will that actually carries a life forward.'],
  ['strength', 'the complement to The Chariot, where triumph came from harnessing outward force.', 'the complement to The Chariot, where triumph came from directing outward force.'],
  ['the_fool', 'The satchel holds the hidden tools the journey will eventually reveal.', 'The satchel holds the hidden tools the path will eventually reveal.'],
  ['the_fool', 'It is traditionally read as the start of a journey — literal or symbolic — undertaken before the whole path is known.', 'It is traditionally read as the start of a new chapter — literal or symbolic — undertaken before the whole path is known.'],
  ['the_fool', 'The Fool is the card that begins the whole journey — and the one we are invited to return to whenever life asks for a fresh start.', 'The Fool is the card that begins the whole sequence — and the one we are invited to return to whenever life asks for a fresh start.'],
  ['the_world', 'The scene marks an ending that is also a fulfillment: the journey that began with The Fool\'s cliff-edge leap has come full circle,', "The scene marks an ending that is also a fulfillment: the arc that began with The Fool's cliff-edge leap has come full circle,"],
  ['the_hermit', 'At this stage of the journey, the guidance has to be your own, found in the quiet.', 'At this stage of the path, the guidance has to be your own, found in the quiet.'],
  ['the_magician', 'What is grasped in the realm of idea can be brought down into form,', 'What is grasped in the domain of idea can be brought down into form,'],
  ['the_magician', 'Worn as a bracelet or ring, it serves as a daily reminder to act on what you say you will, keeping the card\'s resourcefulness in motion rather than locked in planning.', 'Worn as a bracelet or ring, it acts as a daily reminder to act on what you say you will, keeping the card\'s resourcefulness in motion rather than locked in planning.'],
  ['the_magician', "Worn as jewelry, it serves as a daily reminder to act on what you say you will — keeping The Magician's resourcefulness in motion.", "Worn as jewelry, it acts as a daily reminder to act on what you say you will — keeping The Magician's resourcefulness in motion."],
  ['the_fool', 'Worn as a bracelet or pendant, it serves as a quiet daily reminder to stay open to change without losing your footing — the kind of subtle, ongoing support a jewelry piece can offer that a raw stone in a drawer cannot.', 'Worn as a bracelet or pendant, it acts as a quiet daily reminder to stay open to change without losing your footing — the kind of subtle, ongoing support a jewelry piece can offer that a raw stone in a drawer cannot.'],
  ['the_fool', 'Worn as jewelry, it serves as a quiet daily reminder to stay open to change without losing your footing.', 'Worn as jewelry, it acts as a quiet daily reminder to stay open to change without losing your footing.'],
  ['the_tower', 'and Labradorite for the transformative will of the Solar Plexus.', 'and Labradorite for the catalytic will of the Solar Plexus.'],
  ['the_moon', 'let its steady, transformative presence support the clear seeing the moment requires', 'let its steady, grounding presence support the clear seeing the moment requires'],
  ['the_star', 'and the ability to navigate difficulty without collapsing into despair.', 'and the ability to move through difficulty without collapsing into despair.'],
];

const byId = {};
for (const [slug, o, n] of EDITS) (byId[ID[slug]] = byId[ID[slug]] || []).push([o, n]);

// decode WP rendered HTML 实体到本地一致的文本
const decode = s => s
  .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
  .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
  .replace(/&#038;/g, '&').replace(/&amp;/g, '&')
  .replace(/&#8230;/g, '…').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—');

let okCount = 0, failCount = 0;
const TMP = path.join(__dirname, '_tmp_payload.json');

for (const [id, edits] of Object.entries(byId)) {
  process.stdout.write(`\n[post ${id}] GET... `);
  let post;
  try {
    const r = execSync(`curl -s ${PROXY} ${AUTH} "https://${SITE}/wp-json/wp/v2/posts/${id}?_fields=id,slug,title,content" --max-time 30`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    post = JSON.parse(r);
    if (!post || post.code || !post.content) throw new Error('bad resp: ' + r.slice(0, 120));
  } catch (e) { console.log('GET FAIL: ' + e.message); failCount++; continue; }

  // content.rendered 已被 WP 转义(&#8217; 等)，decode 后才能与本地 oldStr 匹配
  let content = post.content && post.content.raw ? post.content.raw : (post.content ? post.content.rendered : '');
  const wasEncoded = !post.content || !post.content.raw; // raw 模式无需 decode
  if (wasEncoded) content = decode(content);

  // 全局替换 (split/join)：覆盖正文 + schema JSON-LD 内复用的同样句子
  let applied = 0, totalReplaced = 0, missed = [];
  for (const [o, n] of edits) {
    const cnt = content.split(o).length - 1;
    if (cnt >= 1) { content = content.split(o).join(n); applied++; totalReplaced += cnt; }
    else missed.push(o.slice(0, 50));
  }
  if (missed.length) {
    console.log(`PARTIAL applied ${applied}/${edits.length} (replaced ${totalReplaced} occ); missed: ` + JSON.stringify(missed).slice(0, 200));
  } else {
    process.stdout.write(`replaced ${applied} patterns / ${totalReplaced} occ, PUT... `);
  }
  if (applied === 0) { failCount++; continue; }

  // PUT: 只送 content (wp:html 块包装, 与原 upload 一致)
  const payload = JSON.stringify({ content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->' });
  fs.writeFileSync(TMP, payload);
  try {
    const pr = execSync(`curl -s ${PROXY} ${AUTH} -X POST -H "Content-Type: application/json" -d @"${TMP}" "https://${SITE}/wp-json/wp/v2/posts/${id}?_fields=id,slug,modified" --max-time 60`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    const pj = JSON.parse(pr);
    if (pj && pj.id) { console.log(`OK slug=${pj.slug} modified=${pj.modified}`); okCount++; }
    else { console.log('PUT FAIL: ' + pr.slice(0, 200)); failCount++; }
  } catch (e) { console.log('PUT ERR: ' + e.message); failCount++; }
}
try { fs.unlinkSync(TMP); } catch (e) {}
console.log(`\n===== 同步结果: 成功 ${okCount} 篇, 失败 ${failCount} 篇 =====`);
