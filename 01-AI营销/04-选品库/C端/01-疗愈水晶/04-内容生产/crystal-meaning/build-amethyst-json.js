/**
 * 组装 amethyst-meaning.json：读 content HTML + meta/sidebar/images/status → 输出 JSON
 * 用法：node build-amethyst-json.js
 * 注意：images.file 必须是相对 02-网站规划/ 的完整路径（upload 脚本 path.resolve(PROJECT_ROOT,...) 解析）。
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const contentHtml = fs.readFileSync(path.join(dir, 'amethyst-meaning-content.html'), 'utf8');

// 复用已上传图：读 upload-results 把占位符替换为真实 URL/id，re-upload 时用 --skip-images 不重复传
const resultsPath = path.resolve(__dirname, '../../02-网站规划/assets/upload-results-post-content-gemstone.json');
let resolvedContent = contentHtml;
if (fs.existsSync(resultsPath)) {
  const media = (JSON.parse(fs.readFileSync(resultsPath, 'utf8')).media) || {};
  const phMap = {
    featured: 'FEATURED',
    overview: 'OVERVIEW',
    properties: 'PROPERTIES',
    benefits: 'BENEFITS',
    how_to_use: 'HOW_TO_USE',
    form_bracelet: 'FORM_BRACELET',
  };
  let reused = 0;
  for (const [key, ph] of Object.entries(phMap)) {
    const m = media[key];
    if (m && m.source_url) {
      resolvedContent = resolvedContent.split(ph + '_IMAGE_URL').join(m.source_url);
      resolvedContent = resolvedContent.split('wp-image-' + ph + '_ID').join('wp-image-' + m.id);
      reused++;
    }
  }
  console.log('Reused ' + reused + ' uploaded images (--skip-images ready)');
} else {
  console.log('No upload-results yet — content keeps placeholders (use --upload-images)');
}

// 相对 02-网站规划/ 的图片目录（upload-post-content-gemstone.js PROJECT_ROOT = 02-网站规划）
const IMG = 'assets/images/generated/crystal-meaning/amethyst';

const data = {
  title: "Amethyst Meaning: Healing Properties & Uses",
  slug: "amethyst-meaning",
  status: "draft",
  excerpt: "Amethyst meaning, properties, and uses — the purple quartz of calm and clarity. Learn what amethyst is made of, its traditional symbolism, practical benefits, how to use it, and how to spot fakes.",
  rank_math_title: "Amethyst Meaning: Healing Properties & Uses",
  rank_math_description: "Complete guide to amethyst meaning, properties, and uses — mineral facts, traditional symbolism, practical benefits, chakra ties, how to tell real from fake, and care tips.",
  rank_math_focus_keyword: "amethyst meaning",
  content: resolvedContent,
  sidebar_profile: {
    overview: { chakra: "Crown, Third Eye", zodiac: "Pisces, Aquarius", element: "Air", number: "3", color: "Purple", intentions: "Calm, Spiritual Awareness, Protection", best_for: "Meditation, Sleep, Stress Relief", forms: "Bracelet, Pendant, Earrings, Anklet, Tumbled, Cluster" },
    mineral: { formula: "SiO₂", system: "Trigonal", hardness: "7", gravity: "2.65", luster: "Vitreous", transparency: "Transparent to translucent", origins: "Brazil, Uruguay, Zambia, Mexico" },
    safety: { water: "Brief rinse safe", sunlight: "Avoid prolonged sun", salt: "Avoid salt water" }
  },
  claim_policy: {
    disclaimer_present: true,
    medical_claims_audit: "pending_qa",
    scientific_lens_sources_verified: false,
    notes: "Properties section uses mineral facts only for the science subsection (SiO2/Fe3+ color/Mohs 7/heat to citrine & prasiolite). Boundary Note in intro + evidence-boundary sentence in mindfulness subsection. GIA/Mindat final verification pending step 4 QA."
  },
  eeat: { author: "", reviewed_by: "", fact_sources: [], status: "pending" },
  status: { brief_locked: true, draft_uploaded: false, qa_passed: false, published: false },
  images: {
    featured:   { file: IMG + "/amethyst-hero.webp",      alt: "Amethyst meaning guide with purple crystal cluster", source_type: "ai_generated", preferred_source_type: "real_crystal_closeup", wp_id: null },
    overview:   { file: IMG + "/amethyst-overview.webp",   alt: "Amethyst meaning and symbolism visual guide", source_type: "ai_generated", preferred_source_type: "real_scene_or_diagram", wp_id: null },
    properties: { file: IMG + "/amethyst-properties.webp", alt: "Amethyst color and texture close-up for crystal properties", source_type: "ai_generated", preferred_source_type: "real_crystal_closeup", wp_id: null },
    benefits:   { file: IMG + "/amethyst-benefits.webp",   alt: "Amethyst jewelry benefits for meditation and calm", source_type: "ai_generated", preferred_source_type: "real_product_or_wearing_photo", wp_id: null },
    how_to_use: { file: IMG + "/amethyst-how-to-use.webp", alt: "Amethyst used for meditation and daily intention setting", source_type: "ai_generated", preferred_source_type: "real_product_or_scene_photo", wp_id: null },
    form_bracelet: { file: IMG + "/amethyst-form-bracelet.webp", alt: "Amethyst bracelet worn on the wrist for daily use", source_type: "real_product_photo", preferred_source_type: "real_wearing_photo", wp_id: null }
  }
};

fs.writeFileSync(path.join(dir, 'amethyst-meaning.json'), JSON.stringify(data, null, 2), 'utf8');
console.log('OK Wrote amethyst-meaning.json');
console.log('  content length:', contentHtml.length, 'chars');
console.log('  image placeholders in content:', (contentHtml.match(/_IMAGE_URL/g) || []).length);
console.log('  images mapped:', Object.keys(data.images).join(', '));
