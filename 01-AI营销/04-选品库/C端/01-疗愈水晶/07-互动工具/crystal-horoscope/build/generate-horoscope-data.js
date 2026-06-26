/**
 * Crystal Horoscope 数据生成（H-1）
 * 每月改 MONTH_ASTRO 输入 → 生成 12 星座当月运势×水晶 JSON
 *
 * 依据：星象数据参考-2026-2027.md（已交叉核对）+ 模板-星座运势×水晶框架（选石矩阵+宫位差异）
 * 工具版简化（非月运长文）：theme + crystal_of_month + 四象限 + power_stones + affirmation + key_dates
 *
 * 输出：../data/horoscope-{YYYY-MM}.json
 */
const fs = require('fs');
const path = require('path');

// 读 search-data 拿水晶 img/shop（复用 T2 提取的）
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const STONE_MAP = {};
for (const c of SD.crystals) STONE_MAP[c.slug] = c;
function stone(slug) {
  const s = STONE_MAP[slug] || {};
  return { slug, name: s.name || slug, img: s.img || '', link: s.link || ('/gemstone/' + slug + '-meaning/'), shop: s.shop || '/product-category/healing-crystals-jewelry/' };
}

// ===== 当月星象（每月改这里）=====
const MONTH_ASTRO = {
  month: '2026-06',
  monthName: 'June',
  year: 2026,
  newMoon: { date: 'Jun 14', sign: 'Gemini', theme: 'fresh ideas, communication, learning' },
  fullMoon: { date: 'Jun 29', sign: 'Capricorn', theme: 'career culmination, structure, release' },
  highlights: [
    'Jupiter enters Leo on Jun 29 — expansion shifts to creativity, courage, self-expression',
    'Mercury turns retrograde in Cancer on Jun 29 (to Jul 23) — review home, family, old conversations',
    'Chiron enters Taurus on Jun 19 — healing themes move to money, values, the body',
  ],
};

// ===== 12 星座：whole-sign 宫位（新月 Gemini 落第几宫）+ 选石（宫位主题×元素）=====
// 宫位 = Gemini(3) - 太阳序号 + 1（whole-sign，太阳=1宫）；新月激活该宫生活领域
const SIGNS = [
  { sign: 'aries',       name: 'Aries',       symbol: '♈', element: 'fire',  house: 3,  area: 'communication, learning, short trips',   crystal: 'carnelian',       reason: 'Carnelian fuels the confident self-expression the Gemini New Moon asks of your third house — and keeps momentum when Mercury slows.' },
  { sign: 'taurus',      name: 'Taurus',      symbol: '♉', element: 'earth', house: 2,  area: 'money, values, self-worth',                crystal: 'green-aventurine',reason: 'With Chiron entering your sign this month, Green Aventurine grounds the second-house money theme in calm abundance rather than anxiety.' },
  { sign: 'gemini',      name: 'Gemini',      symbol: '♊', element: 'air',   house: 1,  area: 'self, identity, new beginnings',           crystal: 'clear-quartz',    reason: 'The Gemini New Moon is your annual reset — Clear Quartz clarifies first-house intentions and amplifies the fresh start.' },
  { sign: 'cancer',      name: 'Cancer',      symbol: '♋', element: 'water', house: 12, area: 'rest, intuition, closure',                 crystal: 'moonstone',       reason: 'Mercury retrogrades in your sign from the 29th — Moonstone softens the twelfth-house inward turn and supports intuitive review.' },
  { sign: 'leo',         name: 'Leo',         symbol: '♌', element: 'fire',  house: 11, area: 'community, dreams, future vision',         crystal: 'sunstone',        reason: 'Jupiter enters your sign on the 29th — Sunstone matches that incoming fire and magnetizes eleventh-house networks.' },
  { sign: 'virgo',       name: 'Virgo',       symbol: '♍', element: 'earth', house: 10, area: 'career, reputation, public role',          crystal: 'garnet',          reason: 'The Capricorn Full Moon lights your tenth house — Garnet grounds ambition and steadies professional footing under the spotlight.' },
  { sign: 'libra',       name: 'Libra',       symbol: '♎', element: 'air',   house: 9,  area: 'beliefs, learning, big-picture',           crystal: 'lapis',           reason: 'A ninth-house New Moon expands your mind — Lapis Lazuli supports clear, wise communication as you revise old stories.' },
  { sign: 'scorpio',     name: 'Scorpio',     symbol: '♏', element: 'water', house: 8,  area: 'transformation, shared resources, depth',  crystal: 'obsidian',        reason: 'Eighth-house depth work this month — Obsidian offers truth-facing protection as you release what is no longer yours to carry.' },
  { sign: 'sagittarius', name: 'Sagittarius', symbol: '♐', element: 'fire',  house: 7,  area: 'partnerships, contracts, significant others', crystal: 'turquoise',     reason: 'A seventh-house New Moon reframes relationships — Turquoise supports honest, adventurous communication with partners.' },
  { sign: 'capricorn',   name: 'Capricorn',   symbol: '♑', element: 'earth', house: 6,  area: 'routine, health, daily work',              crystal: 'smoky-quartz',    reason: 'The Full Moon in your sign on the 29th is a release point — Smoky Quartz clears sixth-house overload and grounds the letting-go.' },
  { sign: 'aquarius',    name: 'Aquarius',    symbol: '♒', element: 'air',   house: 5,  area: 'creativity, romance, play',                crystal: 'amethyst',        reason: 'A fifth-house New Moon sparks creativity — Amethyst channels that inspiration into focused, inspired work rather than scattered ideas.' },
  { sign: 'pisces',      name: 'Pisces',      symbol: '♓', element: 'water', house: 4,  area: 'home, family, emotional roots',             crystal: 'rose-quartz',     reason: 'A fourth-house New Moon softens home and family — Rose Quartz warms domestic bonds during the retrograde review.' },
];

// 四象限水晶（元素 × 象限，简化差异化）
function quadrantStones(el) {
  const base = {
    love: 'rose-quartz', career: 'citrine', wellness: 'amethyst', spirituality: 'clear-quartz',
  };
  const byEl = {
    fire:  { love: 'rose-quartz', career: 'citrine',     wellness: 'bloodstone',   spirituality: 'sunstone' },
    earth: { love: 'rose-quartz', career: 'green-aventurine', wellness: 'smoky-quartz', spirituality: 'tourmalinated-quartz' },
    air:   { love: 'rose-quartz', career: 'citrine',     wellness: 'fluorite',     spirituality: 'amethyst' },
    water: { love: 'rose-quartz', career: 'pyrite',      wellness: 'moonstone',    spirituality: 'amethyst' },
  };
  return byEl[el] || base;
}

function ord(n) { return ['zeroth','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth'][n]; }

// 文本模板（宫位/星象/元素变量，差异化）
function themeFor(s) {
  const el = s.element === 'fire' ? 'Momentum builds' : s.element === 'earth' ? 'Slow, tangible progress unfolds' : s.element === 'air' ? 'Ideas and conversations spark' : 'Feelings deepen';
  return `The ${MONTH_ASTRO.newMoon.sign} New Moon (${MONTH_ASTRO.newMoon.date}) activates your ${ord(s.house)} house of ${s.area}. ${el}, but Mercury turns retrograde on the 29th — review and refine rather than push.`;
}
function quadrantFor(s, area) {
  const q = {
    love: `Your ${ord(s.house)} house keeps relationships in motion. Pause before committing during the retrograde; reconnect after the Full Moon.`,
    career: `The Capricorn Full Moon (Jun 29) brings a career or structure moment. Solidify what the New Moon started, release what is not working.`,
    wellness: `Chiron entering Taurus on the 19th invites a gentler pace. Rest is productive this month — protect your sleep and body rituals.`,
    spirituality: `The retrograde favors inner work. Journaling, dream notes, and time alone sharpen the intuition the New Moon is opening.`,
  };
  return q[area];
}

// ===== 生成 =====
const out = {
  _meta: {
    month: MONTH_ASTRO.month,
    monthName: MONTH_ASTRO.monthName,
    year: MONTH_ASTRO.year,
    astrology: MONTH_ASTRO,
    disclaimer: 'Astrology and crystal meanings are offered for entertainment, reflection, and spiritual inspiration. Crystals carry traditional symbolic qualities but are not a substitute for medical, financial, or professional advice.',
    source: '星象数据参考-2026-2027.md (交叉核对 Cafe Astrology/Astro-Seek/CHANI/NASA) + 模板-星座运势×水晶框架',
  },
  signs: SIGNS.map(s => {
    const qs = quadrantStones(s.element);
    return {
      sign: s.sign, name: s.name, symbol: s.symbol, element: s.element,
      theme: themeFor(s),
      crystal_of_month: { ...stone(s.crystal), reason: s.reason },
      quadrants: {
        love:        { text: quadrantFor(s, 'love'),        crystal: stone(qs.love) },
        career:      { text: quadrantFor(s, 'career'),      crystal: stone(qs.career) },
        wellness:    { text: quadrantFor(s, 'wellness'),    crystal: stone(qs.wellness) },
        spirituality:{ text: quadrantFor(s, 'spirituality'),crystal: stone(qs.spirituality) },
      },
      power_stones: [stone(s.crystal), stone(qs.career), stone(qs.wellness)],
      affirmation: {
        fire: `I act on what matters and release what does not.`,
        earth: `I build steadily and trust the value I carry.`,
        air: `I speak my truth clearly and stay open to new perspectives.`,
        water: `I honor my feelings and let intuition guide my next step.`,
      }[s.element],
      key_dates: [
        { date: MONTH_ASTRO.newMoon.date, event: `New Moon in ${MONTH_ASTRO.newMoon.sign}`, focus: `Set intentions around ${s.area}`, do: 'Write down one goal', avoid: 'Rushing decisions' },
        { date: MONTH_ASTRO.fullMoon.date, event: `Full Moon in ${MONTH_ASTRO.fullMoon.sign}`, focus: `Release and culminate`, do: 'Acknowledge what you have completed', avoid: 'Forcing closure before it is ready' },
        { date: 'Jun 29', event: 'Mercury turns retrograde', focus: 'Review, do not launch', do: 'Revisit old conversations and plans', avoid: 'Signing new contracts blind' },
      ],
    };
  }),
};

const OUT = path.resolve(__dirname, '../data/horoscope-' + MONTH_ASTRO.month + '.json');
fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
console.log(`✅ ${MONTH_ASTRO.month} Horoscope 数据生成 → ${OUT}`);
console.log(`   12 星座 | ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
console.log(`   当月星象: 新月${MONTH_ASTRO.newMoon.sign} / 满月${MONTH_ASTRO.fullMoon.sign} / 水逆${MONTH_ASTRO.monthName}29起`);
