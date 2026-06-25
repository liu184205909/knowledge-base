/**
 * 为 78 篇文章生成 images 字段（prompt + alt + file path）
 * 参考 aries-crystals.json 的 images 结构
 *
 * 每篇 3 张图：
 *   - featured: 两星座符号 + 配对水晶 + 元素互动场景
 *   - crystal_pair: 三石组合图（signA 石 + signB 石 + harmony 石）
 *   - how_to_use: 情侣共戴/共摆场景
 *
 * 输出：写入每篇文章 JSON 的 images 字段
 * 用法：node generate-image-prompts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const PAIRING_FILE = path.join(ROOT, 'pairing-data.json');
const pd = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf8'));

const cap = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// 星座符号
const SYMBOLS = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋', Leo:'♌', Virgo:'♍',
  Libra:'♎', Scorpio:'♏', Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓'
};

// 元素色调
const ELEMENT_TONES = {
  fire: 'warm red, orange and golden',
  earth: 'warm brown, olive and terracotta',
  air: 'soft blue, silver and pale lavender',
  water: 'deep blue, teal and seafoam green',
};

// 相位氛围
const PHASE_MOOD = {
  'Trine': 'harmonious warm',
  'Sextile': 'bright and energizing',
  'Conjunction': 'intense focused',
  'Opposition': 'dramatic contrasting',
  'Square': 'tense dynamic',
  'Semi-sextile': 'soft transitional',
  'Quincunx': 'mysterious subtle',
};

let processed = 0;
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const slug = a.slug;
  const p = pd.pairs[slug];
  if (!p) continue;

  const [signA, signB] = p.signs;
  const c = p.crystals;
  const stoneA = cap(c.signA), stoneB = cap(c.signB), stoneH = cap(c.harmony);
  const toneA = ELEMENT_TONES[p.elements[0]] || 'warm earthy';
  const toneB = ELEMENT_TONES[p.elements[1]] || 'warm earthy';
  const mood = PHASE_MOOD[p.phase] || 'warm natural';
  const symA = SYMBOLS[signA] || '';
  const symB = SYMBOLS[signB] || '';

  a.images = {
    featured: {
      file: `assets/images/generated/zodiac-compatibility/${slug}/${slug}-featured.webp`,
      source_type: 'scene',
      alt: `${signA} and ${signB} compatibility with ${stoneA}, ${stoneB}, and ${stoneH} crystals arranged with zodiac symbols ${symA} and ${symB}`,
      prompt: `A flat-lay of ${stoneA}, ${stoneB}, and ${stoneH} crystals arranged between two subtle zodiac symbols (${symA} for ${signA} and ${symB} for ${signB}) on ${mood} linen with ${toneA} and ${toneB} tones, soft natural light, editorial product photography style, no text, no watermark`,
    },
    crystal_pair: {
      file: `assets/images/generated/zodiac-compatibility/${slug}/${slug}-crystal-pair.webp`,
      source_type: 'closeup',
      alt: `The best crystal pair for ${signA} and ${signB}: ${stoneA}, ${stoneB}, and ${stoneH} shown together`,
      prompt: `A clean overhead flat-lay of three crystals — ${stoneA}, ${stoneB}, and ${stoneH} — arranged in a triangle on a warm neutral stone surface, soft even studio light, editorial gemstone guide aesthetic, ${toneA} and ${toneB} tones, no text, no watermark`,
    },
    how_to_use: {
      file: `assets/images/generated/zodiac-compatibility/${slug}/${slug}-how-to-use.webp`,
      source_type: 'lifestyle',
      alt: `How ${signA} and ${signB} can use crystals together: two crystal bracelets side by side`,
      prompt: `Two crystal bracelets — one with ${stoneA} beads and one with ${stoneB} beads — resting side by side on light wood with soft daylight, minimalist wellness aesthetic, representing a couple's shared crystal practice, warm natural tones, no text, no watermark`,
    },
  };

  fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  processed++;
}

console.log(`✅ 为 ${processed} 篇文章生成 images 字段（prompt + alt + file path）`);
console.log(`   每篇 3 张图：featured / crystal_pair / how_to_use`);
console.log(`   下一步：用 banana-claude 或图片生成工具批量跑 prompt`);
