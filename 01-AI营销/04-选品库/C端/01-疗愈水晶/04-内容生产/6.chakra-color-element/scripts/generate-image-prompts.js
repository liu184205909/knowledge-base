/**
 * chakra/color/element 图片 prompt 生成器(写入 article json 的 images 字段)
 * hero(23) + color Shade Guide(12) + element diagram(4) = 39张
 * M3 单品图复用 meaning(不在此生)
 * 用法：node generate-image-prompts.js → 跑 generate-crystal-images.js 生图
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(DIR, 'spoke-data.json'), 'utf8'));
const stones30 = require('../../../07-互动工具/crystal-compatibility-checker/data/crystal-stones-30.json').stones;
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;

const cap = s => s.split(/[-\s]/).map(w => w[0] ? w[0].toUpperCase() + w.slice(1) : w).join(' ');
const GEN = 'assets/images/generated/6.chakra-color-element';

// chakra 颜色基调(用于 hero prompt)
const CHAKRA_COLOR = { root: 'red and black', sacral: 'orange', 'solar-plexus': 'yellow', heart: 'green and pink', throat: 'blue', 'third-eye': 'indigo and purple', crown: 'violet and white' };
const ELEMENT_SYMBOL = { earth: 'earthy green and brown stones with natural raw texture', fire: 'warm red-orange stones with candlelight glow', air: 'light clear and pale stones with airy breath-like softness', water: 'blue and blue-green stones near calm water' };

let n = 0;
for (const sp of data.spokes) {
  const f = path.join(DIR, 'articles', sp.slug + '.json');
  if (!fs.existsSync(f)) continue;
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const top3 = sp.crystals.slice(0, 3).map(s => cap(stones30[s]?.name || s)).join(', ');

  if (sp.type === 'chakra') {
    const cc = CHAKRA_COLOR[sp.slug];
    a.images = {
      hero: {
        file: `${GEN}/${sp.slug}/${sp.slug}-hero.webp`,
        source_type: 'scene',
        alt: `A collection of ${cc} crystals for the ${sp.name} including ${top3}, arranged together on a natural surface with soft light, editorial crystal photography`,
      },
    };
  } else if (sp.type === 'color') {
    a.images = {
      hero: {
        file: `${GEN}/${sp.slug}/${sp.slug}-hero.webp`,
        source_type: 'scene',
        alt: `A collection of ${sp.name.toLowerCase()} crystals including ${top3} arranged together, showing the range of ${sp.name.toLowerCase()} tones, soft natural light, editorial product photography`,
      },
      shade_guide: {
        file: `${GEN}/${sp.slug}/${sp.slug}-shade-guide.webp`,
        source_type: 'scene',
        alt: `A shade guide of ${sp.name.toLowerCase()} crystals showing light, medium and deep ${sp.name.toLowerCase()} samples side by side for identification, even studio light, reference chart style`,
      },
    };
  } else { // element
    const es = ELEMENT_SYMBOL[sp.slug];
    a.images = {
      hero: {
        file: `${GEN}/${sp.slug}/${sp.slug}-hero.webp`,
        source_type: 'scene',
        alt: `Crystals for the ${sp.name} element — ${es} including ${top3}, arranged in a balanced composition with elemental symbolism, warm natural light, editorial photography`,
      },
      diagram: {
        file: `${GEN}/${sp.slug}/${sp.slug}-diagram.webp`,
        source_type: 'diagram',
        alt: `An ${sp.name} element concept diagram with the ${sp.name.toLowerCase()} symbol at center, surrounded by its core qualities, zodiac signs, chakras and colors in a clean minimalist layout`,
      },
    };
  }
  fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
  n++;
}
console.log(`✅ ${n} 篇写入 images 字段(hero${data.spokes.filter(s=>s.type==='chakra').length} + color hero+shade${data.spokes.filter(s=>s.type==='color').length*2} + element hero+diagram${data.spokes.filter(s=>s.type==='element').length*2})`);
console.log(`共 ${data.spokes.filter(s=>s.type==='chakra').length + data.spokes.filter(s=>s.type==='color').length*2 + data.spokes.filter(s=>s.type==='element').length*2} 张图待生 → 下步 generate-crystal-images.js`);
