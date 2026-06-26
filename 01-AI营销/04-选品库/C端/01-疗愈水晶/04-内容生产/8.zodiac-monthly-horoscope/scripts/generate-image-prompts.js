/**
 * 为 144 篇月运文章生成 images 字段（prompt + alt + file path）
 *
 * 每篇 3 张图：
 *   - featured: 星座符号 + 月度水晶 + 月度能量氛围
 *   - crystal_month: 月度水晶特写
 *   - ritual: 月度仪式场景
 *
 * 水晶来源：从文章 content 中词频提取（出现次数最多的水晶名）
 * 用法：node generate-image-prompts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const ASTRO_FILE = path.join(ROOT, 'data', 'monthly-astrology-2026.json');
const astro = JSON.parse(fs.readFileSync(ASTRO_FILE, 'utf8'));

// 所有水晶名称（按长度降序，避免短名匹配干扰）
// 注意：移除独立的 Quartz / Tourmaline / Aventurine，因为它们的长名称已在列表中
const ALL_CRYSTALS = [
  'Black Tourmaline', 'Green Aventurine', 'Blue Lace Agate', 'Red Jasper',
  'Rose Quartz', 'Clear Quartz', 'Smoky Quartz', "Tiger's Eye", 'Tigers Eye',
  'Lapis Lazuli', 'Moonstone', 'Sunstone', 'Bloodstone',
  'Aquamarine', 'Rhodonite', 'Carnelian', 'Fluorite', 'Amethyst', 'Selenite',
  'Hematite', 'Obsidian', 'Labradorite', 'Lepidolite', 'Malachite', 'Pyrite',
  'Garnet', 'Citrine', 'Jade', 'Opal', 'Turquoise', 'Angelite', 'Apatite',
  'Kyanite', 'Larimar', 'Ruby',
].sort((a, b) => b.length - a.length);

// 星座符号
const SYMBOLS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

// 元素色调
const ELEMENT_TONES = {
  aries: 'warm red, orange and golden',
  leo: 'warm gold, orange and amber',
  sagittarius: 'warm purple, indigo and teal',
  taurus: 'warm brown, olive and terracotta',
  virgo: 'warm brown, olive and forest green',
  capricorn: 'warm brown, charcoal and deep green',
  gemini: 'soft blue, silver and pale lavender',
  libra: 'soft pink, ivory and pale blue',
  aquarius: 'soft blue, silver and electric teal',
  cancer: 'deep blue, teal and seafoam green',
  scorpio: 'deep red, black and dark teal',
  pisces: 'deep blue, teal and lavender',
};

// 月度氛围
const MONTH_MOOD = {
  january: 'crisp winter morning with fresh snow and evergreen',
  february: 'late winter with frost and early signs of spring',
  march: 'early spring thaw with budding branches and soft rain',
  april: 'fresh spring with new blooms and bright green leaves',
  may: 'lush spring with abundant flowers and warm sunshine',
  june: 'early summer with long days and golden evening light',
  july: 'high summer with warm breezes and vibrant greenery',
  august: 'late summer with harvest gold and deep warm tones',
  september: 'early autumn with amber leaves and cozy atmosphere',
  october: 'mid autumn with rich colors and misty mornings',
  november: 'late autumn with bare branches and candlelight warmth',
  december: 'deep winter with pine, cinnamon and festive stillness',
};

const cap = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

function extractCrystal(content) {
  const counts = {};
  for (const c of ALL_CRYSTALS) {
    // 用全局匹配避免子串重复计数
    const re = new RegExp(c.replace(/'/g, "['']"), 'gi');
    const matches = content.match(re);
    if (matches) counts[c] = matches.length;
  }
  // 取出现最多的
  let best = null, max = 0;
  for (const [c, n] of Object.entries(counts)) {
    if (n > max) { best = c; max = n; }
  }
  // 标准化 Tiger's Eye
  if (best === "Tigers Eye") best = "Tiger's Eye";
  return best || 'Clear Quartz';
}

function getMonthEnergy(monthKey) {
  const m = astro.months[monthKey];
  if (!m) return 'transition and growth';
  return m.energy_theme || 'transition and growth';
}

let processed = 0;
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const slug = a.slug; // e.g. aries-january-2026

  // 解析 slug: {sign}-{month}-{year}
  const parts = slug.split('-');
  if (parts.length < 3) continue;
  const sign = parts[0];
  const month = parts[1];
  const year = parts[2];
  const signCap = cap(sign);
  const monthCap = cap(month);
  const crystal = extractCrystal(a.content);
  const mood = MONTH_MOOD[month] || 'natural and serene';
  const tone = ELEMENT_TONES[sign] || 'warm earthy';
  const energy = getMonthEnergy(month);
  const sym = SYMBOLS[signCap];

  a.images = {
    featured: {
      file: `assets/images/generated/8.zodiac-monthly-horoscope/${slug}/${slug}-featured.webp`,
      source_type: 'scene',
      alt: `${signCap} ${monthCap} ${year} monthly horoscope with ${crystal} as crystal of the month, zodiac symbol ${sym}`,
      prompt: `An editorial flat-lay for ${signCap} ${monthCap} horoscope: a ${crystal} crystal resting on natural linen beside a subtle zodiac symbol ${sym}, with elements evoking ${mood}, ${tone} tones, soft natural light, representing ${energy}, no text, no watermark, no human face`,
    },
    crystal_month: {
      file: `assets/images/generated/8.zodiac-monthly-horoscope/${slug}/${slug}-crystal-month.webp`,
      source_type: 'closeup',
      alt: `${crystal} crystal of the month for ${signCap} ${monthCap} ${year} horoscope`,
      prompt: `A macro close-up photograph of a ${crystal} crystal showing fine surface texture and natural beauty, soft even studio light, ${tone} background, editorial gemstone guide quality, representing the monthly anchor stone for ${signCap} in ${monthCap}, no text, no watermark`,
    },
    ritual: {
      file: `assets/images/generated/8.zodiac-monthly-horoscope/${slug}/${slug}-ritual.webp`,
      source_type: 'lifestyle',
      alt: `Monthly crystal ritual for ${signCap} ${monthCap} ${year} using ${crystal}`,
      prompt: `A serene lifestyle scene: a ${crystal} crystal placed on a wooden surface with a journal, a candle, and seasonal elements evoking ${mood}, representing a new moon or full moon crystal ritual, warm natural daylight, ${tone} accents, minimalist wellness aesthetic, no text, no watermark, no human face`,
    },
  };

  fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  processed++;
}

console.log(`✅ 为 ${processed} 篇月运文章生成 images 字段`);
console.log(`   每篇 3 张图：featured / crystal_month / ritual`);
console.log(`   水晶来源：文章 content 词频提取`);
console.log(`   下一步：批量调用 generate-crystal-images.js 生图`);
