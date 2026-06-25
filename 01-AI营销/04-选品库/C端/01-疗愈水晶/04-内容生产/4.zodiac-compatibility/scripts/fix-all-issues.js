/**
 * 综合修复脚本 — 一次修复 4 类系统性问题
 *
 * Fix 1: CRYSTAL_MISSING — 在 Challenges 模块末尾插入水晶提及段
 * Fix 2: EMPTY_TABLE — 重新生成模块14 Other Signs 表格（修复 ORDER 大小写 bug）
 * Fix 3: GRAMMAR — 同星座配对 Famous Couples 段语法修正
 * Fix 4: DUPLICATE_LINKS — 同星座配对 Related 去重
 *
 * 用法：node fix-all-issues.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const PAIRING_FILE = path.join(ROOT, 'pairing-data.json');
const pd = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf8'));

const cap = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const ORDER_LC = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const SIGN_NAMES = { aries:'Aries',taurus:'Taurus',gemini:'Gemini',cancer:'Cancer',leo:'Leo',virgo:'Virgo',libra:'Libra',scorpio:'Scorpio',sagittarius:'Sagittarius',capricorn:'Capricorn',aquarius:'Aquarius',pisces:'Pisces' };

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
let fix1=0, fix2=0, fix3=0, fix4=0;

for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const slug = file.replace('.json', '');
  const p = pd.pairs[slug];
  if (!p) continue;
  let content = a.content;
  let modified = false;
  const [signA, signB] = p.signs;
  const isSameSign = signA === signB;
  const c = p.crystals;

  // ── Fix 1: CRYSTAL_MISSING — 在 Challenges 模块末尾插入水晶段 ──
  const challengeEnd = content.indexOf('<h2>Best Crystal Pair');
  const mod49Start = content.indexOf('<h2>' + signA + ' and ' + signB + ': Love');
  if (challengeEnd > -1 && mod49Start > -1) {
    const mod49Text = content.slice(mod49Start, challengeEnd).toLowerCase();
    const missingStones = [];
    for (const [role, stone] of [['signA', c.signA], ['signB', c.signB], ['harmony', c.harmony]]) {
      if (!mod49Text.includes(stone.replace(/-/g, ' ')) && !mod49Text.includes(stone)) {
        missingStones.push({ role, stone });
      }
    }
    if (missingStones.length > 0) {
      // 在 Challenges 模块末尾（<h2>Best Crystal Pair 之前）插入
      const insertHtml = `\n<p>For this ${p.phase.toLowerCase()} pairing, many couples find that <a href="/gemstone/${c.signA}-meaning/">${cap(c.signA)}</a> (traditionally tied to ${signA}'s ${p.elements[0]} energy), <a href="/gemstone/${c.signB}-meaning/">${cap(c.signB)}</a> (for ${signB}'s ${p.elements[1]} nature), and <a href="/gemstone/${c.harmony}-meaning/">${cap(c.harmony)}</a> (the harmonizer that bridges their dynamic) offer tangible anchors for the growth work above. Each stone is genuine, ethically sourced, and real — not dyed, not glass.</p>\n`;
      content = content.slice(0, challengeEnd) + insertHtml + content.slice(challengeEnd);
      fix1++;
      modified = true;
    }
  }

  // ── Fix 2: EMPTY_TABLE — 重新生成模块14 ──
  if (content.includes('<tbody></tbody>') || content.match(/<tbody>\s*<\/tbody>/)) {
    const generateTable = (sign) => {
      const sa = sign.toLowerCase();
      const rows = ORDER_LC.filter(s => s !== sa).map(partner => {
        const key = ORDER_LC.indexOf(sa) <= ORDER_LC.indexOf(partner) ? `${sa}-${partner}` : `${partner}-${sa}`;
        const data = pd.pairs[key];
        if (!data) return '';
        const tier = data.score >= 80 ? 'High' : data.score >= 55 ? 'Medium' : 'Low';
        const color = data.score >= 80 ? '#2D6A4F' : data.score >= 55 ? '#A66A43' : '#B5715A';
        return `<tr><td style="padding:6px 12px;"><a href="/zodiac-compatibility/${key}/" style="color:#2D6A4F;text-decoration:none;">${SIGN_NAMES[partner]}</a></td><td style="padding:6px 12px;color:${color};font-weight:600;">${tier} (${data.score})</td></tr>`;
      }).join('');
      return rows;
    };

    const tableA = generateTable(signA);
    const tableB = isSameSign ? '' : generateTable(signB);

    // 替换两个 tbody
    let tbodyCount = 0;
    content = content.replace(/<tbody>\s*<\/tbody>/g, () => {
      tbodyCount++;
      return `<tbody>\n${tbodyCount === 1 ? tableA : tableB}\n</tbody>`;
    });
    fix2++;
    modified = true;
  }

  // ── Fix 3: GRAMMAR — 同星座 Famous Couples 语法修正 ──
  if (isSameSign) {
    const oldText = `${signA}'s mirrored energy meeting ${signB}'s its own reflection`;
    const newText = `${signA}'s energy meeting its own reflection — a true mirror`;
    if (content.includes(oldText) || content.includes('its own reflection')) {
      content = content.replace(/its own reflection/g, 'its own reflection — a true mirror');
      // 去掉可能导致重复的修饰
      content = content.replace(`${signA}'s mirrored energy meeting ${signB}'s its own reflection — a true mirror`,
        `${signA}'s energy meeting its own reflection — a true mirror`);
      fix3++;
      modified = true;
    }
  }

  // ── Fix 4: DUPLICATE_LINKS — 同星座 Related 去重 ──
  if (isSameSign) {
    const sa = signA.toLowerCase();
    // Related 段里的 /{sa}-crystals/ 和 /zodiac/{sa}/ 各出现两次 → 去重
    const relatedSection = content.match(/(<h2>Related<\/h2>[\s\S]*$)/);
    if (relatedSection) {
      let related = relatedSection[1];
      // 去重：只保留每个 href 的第一次出现
      const seen = new Set();
      related = related.replace(/<li>(<a href="[^"]+">[^<]+<\/a>)<\/li>/g, (match, link) => {
        const href = link.match(/href="([^"]+)"/)[1];
        if (seen.has(href)) return '';
        seen.add(href);
        return match;
      });
      // 清理空行
      related = related.replace(/\n\s*\n\s*\n/g, '\n');
      content = content.slice(0, content.indexOf('<h2>Related</h2>')) + related;
      fix4++;
      modified = true;
    }
  }

  if (modified) {
    a.content = content;
    fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  }
}

console.log(`✅ 综合修复完成：`);
console.log(`   Fix 1 CRYSTAL_MISSING: ${fix1} 篇修复`);
console.log(`   Fix 2 EMPTY_TABLE:     ${fix2} 篇修复`);
console.log(`   Fix 3 GRAMMAR:         ${fix3} 篇修复`);
console.log(`   Fix 4 DUPLICATE_LINKS: ${fix4} 篇修复`);
