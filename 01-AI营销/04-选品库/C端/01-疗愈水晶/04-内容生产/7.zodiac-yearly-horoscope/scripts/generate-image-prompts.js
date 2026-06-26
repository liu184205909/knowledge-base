/**
 * 为 12 篇年运文章生成 images 字段（prompt + alt + file path）
 *
 * 每篇 3 张图：
 *   - featured: 星座符号 + 年度水晶 + 年度主题氛围
 *   - crystal_year: 年度水晶特写
 *   - ritual: 年度仪式场景
 *
 * 水晶来源：框架 §四 年度主轴表（硬编码，确保准确）
 * 用法：node generate-image-prompts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');

// 年度主轴表 — Crystal of the Year（框架§四，已交叉核对）
const CRYSTAL_OF_YEAR = {
  aries: 'Red Jasper',
  taurus: 'Moss Agate',
  gemini: 'Citrine',
  cancer: 'Rose Quartz',
  leo: 'Sunstone',
  virgo: 'Amazonite',
  libra: 'Lapis Lazuli',
  scorpio: 'Obsidian',
  sagittarius: 'Turquoise',
  capricorn: 'Garnet',
  aquarius: 'Amethyst',
  pisces: 'Aquamarine',
};

// 年度主题
const YEAR_THEME = {
  aries: 'structure, courage, and identity renewal',
  taurus: 'money, values, and spiritual foundation',
  gemini: 'communication, learning, and career visibility',
  cancer: 'relationships, home, and emotional maturity',
  leo: 'creativity, self-expression, and personal power',
  virgo: 'work transformation and deep partnership',
  libra: 'partnerships, wellness, and daily rhythm',
  scorpio: 'intimacy, healing, and professional reinvention',
  sagittarius: 'adventure, money, and creative expansion',
  capricorn: 'home, family, and career foundation',
  aquarius: 'partnerships, collaboration, and community',
  pisces: 'self-worth, money, and dream alignment',
};

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

const cap = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

let processed = 0;
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const slug = a.slug; // e.g. aries-2026

  // 从 slug 提取星座：aries-2026 → aries
  const sign = slug.replace(/-2026$/, '');
  const signCap = cap(sign);
  const crystal = CRYSTAL_OF_YEAR[sign];
  if (!crystal) { console.log(`⚠️ 跳过 ${slug}: 未知星座`); continue; }

  const theme = YEAR_THEME[sign];
  const tone = ELEMENT_TONES[sign];
  const sym = SYMBOLS[signCap];

  a.images = {
    featured: {
      file: `assets/images/generated/7.zodiac-yearly-horoscope/${slug}/${slug}-featured.webp`,
      source_type: 'scene',
      alt: `${signCap} 2026 yearly horoscope with ${crystal} as crystal of the year, zodiac symbol ${sym}, representing ${theme}`,
      prompt: `An editorial flat-lay for ${signCap} yearly horoscope 2026: a ${crystal} crystal resting on warm linen beside a subtle zodiac symbol ${sym}, with natural elements evoking ${theme}, ${tone} tones, soft morning light, astrological content aesthetic, no text, no watermark, no human face`,
    },
    crystal_year: {
      file: `assets/images/generated/7.zodiac-yearly-horoscope/${slug}/${slug}-crystal-year.webp`,
      source_type: 'closeup',
      alt: `${crystal} crystal of the year for ${signCap} 2026 horoscope`,
      prompt: `A macro close-up photograph of a ${crystal} crystal showing fine surface texture and natural inclusions, soft even studio light, ${tone} background gradient, editorial gemstone guide quality, representing the annual anchor stone for ${signCap}, no text, no watermark`,
    },
    ritual: {
      file: `assets/images/generated/7.zodiac-yearly-horoscope/${slug}/${slug}-ritual.webp`,
      source_type: 'lifestyle',
      alt: `Year-long crystal ritual for ${signCap} 2026 using ${crystal}`,
      prompt: `A serene lifestyle scene: a ${crystal} crystal placed on a wooden altar with a journal, a candle, and seasonal natural elements (spring flower, summer shell, autumn leaf, winter pine), representing a four-season crystal ritual practice, warm natural daylight, ${tone} accents, minimalist wellness aesthetic, no text, no watermark, no human face`,
    },
  };

  fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  processed++;
}

console.log(`✅ 为 ${processed} 篇年运文章生成 images 字段`);
console.log(`   每篇 3 张图：featured / crystal_year / ritual`);
console.log(`   下一步：批量调用 generate-crystal-images.js 生图`);
