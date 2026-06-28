/**
 * finalize-article.js：填充后处理
 * 1. FAQ schema 答案从 content 同步（页面与 schema 同源，框架 §12.3）
 * 2. 加 images 字段（生图/上传脚本读这个）
 * 用法：node finalize-article.js --slug=how-to-cleanse-crystals
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1] || 'how-to-cleanse-crystals';
const f = path.join(DIR, 'articles', slugArg + '.json');
const a = JSON.parse(fs.readFileSync(f, 'utf8'));

// 1. FAQ schema 答案从 content 同步（页面 = schema 同源）
const faq = a.faq_schema;
let synced = 0, missing = [];
for (let i = 0; i < faq.length; i++) {
  const q = faq[i].question;
  // content 里 FAQ 格式: <h3>question</h3>\n<p>answer</p>
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('<h3>' + escaped + '</h3>\\s*<p>([\\s\\S]*?)</p>');
  const m = a.content.match(re);
  if (m) {
    // 剥 HTML 成纯文本（schema answer 纯文本）
    let ans = m[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    faq[i].answer = ans;
    delete faq[i].answer_placeholder;
    synced++;
  } else {
    missing.push(q);
  }
}
console.log(`FAQ schema 同步: ${synced}/${faq.length}`);
if (missing.length) console.log('  ⚠️ 未找到:', missing.join(' | '));

// 2. images 字段（source_type=scene 真实水晶摄影无文字，How-to 不需画文字）
// file 相对 02-网站规划；hero 1536x864, 分步图+首饰图 1200x800
const slug = a.slug;
a.images = {
  hero: {
    file: `assets/images/generated/10.how-to/${slug}/${slug}-hero.webp`,
    source_type: 'scene',
    alt: `How to cleanse crystals — a serene still life of assorted healing crystals and a Tibetan singing bowl resting on a windowsill bathed in soft moonlight, calm muted background, balanced composition, natural crystal photography with visible texture and light refraction, editorial crystal care quality, no text, no watermark`
  },
  moonlight: {
    file: `assets/images/generated/10.how-to/${slug}/${slug}-moonlight.webp`,
    source_type: 'scene',
    alt: `Cleansing crystals with moonlight — several tumbled and raw stones arranged on a windowsill under soft nighttime moonlight, gentle blue-silver glow, calm and peaceful mood, realistic crystal photography, no text`
  },
  selenite: {
    file: `assets/images/generated/10.how-to/${slug}/${slug}-selenite.webp`,
    source_type: 'scene',
    alt: `A selenite charging plate holding a small collection of healing crystals and a gemstone bracelet resting on top, soft natural light, neutral calm background, realistic mineral photography showing the white selenite slab and the stones' natural texture, no text`
  },
  smoke: {
    file: `assets/images/generated/10.how-to/${slug}/${slug}-smoke.webp`,
    source_type: 'scene',
    alt: `Smoke cleansing crystals — a few healing crystals placed near a burning bundle of sage and cedar in an abalone shell, soft curling smoke drifting past the stones, warm earthy tones, ventilated peaceful ritual scene, realistic photography, no text`
  },
  jewelry: {
    file: `assets/images/generated/10.how-to/${slug}/${slug}-jewelry.webp`,
    source_type: 'scene',
    alt: `Crystal jewelry cleansing — a gemstone bracelet and a crystal necklace resting on a white selenite plate, soft daylight, clean minimal surface, realistic jewelry and mineral photography showing cord and metal settings, no text`
  }
};

fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
console.log(`✅ images 字段已加（hero + moonlight + selenite + smoke + jewelry 共 5 张）`);
console.log(`   source_type=scene（真实水晶摄影，无文字，How-to 不需画文字）`);
