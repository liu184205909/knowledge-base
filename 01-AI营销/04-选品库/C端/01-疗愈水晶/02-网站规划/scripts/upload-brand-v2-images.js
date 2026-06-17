/**
 * Upload Earthward brand v2 images and update the central image registry.
 *
 * Scope:
 * - Homepage v2 narrative images
 * - About v2 narrative images
 *
 * This script only uploads media assets and updates assets/site-images.js.
 * It does not create or update WordPress pages.
 */

const fs = require('fs');
const path = require('path');
const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

const WP_UPLOAD_BASE = 'https://goearthward.com/wp-content/uploads/2026/05';
const GENERATED_DIR = path.resolve(__dirname, '../assets/images/generated');
const REGISTRY_PATH = path.resolve(__dirname, '../assets/site-images.js');
const RESULTS_PATH = path.resolve(__dirname, '../assets/upload-results-brand-v2-images.json');

const IMAGE_LIST = [
  { section: 'home', key: 'hero', file: 'home-hero-intentional-living-v2.png' },
  { section: 'home', key: 'intentionCalm', file: 'home-intention-calm-v2.png' },
  { section: 'home', key: 'intentionLove', file: 'home-intention-love-v2.png' },
  { section: 'home', key: 'intentionAbundance', file: 'home-intention-abundance-v2.png' },
  { section: 'home', key: 'intentionGrounding', file: 'home-intention-grounding-v2.png' },
  { section: 'home', key: 'intentionSleep', file: 'home-intention-sleep-v2.png' },
  { section: 'home', key: 'intentionFocus', file: 'home-intention-focus-v2.png' },
  { section: 'home', key: 'quiz', file: 'home-crystal-guide-entry-v2.png' },
  { section: 'home', key: 'brandStory', file: 'home-brand-story-workbench-v2.png' },
  { section: 'home', key: 'useCalm', file: 'home-usecase-calm-evening-v2.png' },
  { section: 'home', key: 'useWorkday', file: 'home-usecase-workday-grounding-v2.png' },
  { section: 'home', key: 'useCompassion', file: 'home-usecase-self-compassion-v2.png' },
  { section: 'home', key: 'newsletter', file: 'home-launch-cta-crystal-bracelets-v2.png' },

  { section: 'about', key: 'hero', file: 'about-hero-brand-story-v2.png' },
  { section: 'about', key: 'founder', file: 'about-intention-setting-workspace-v2.png' },
  { section: 'about', key: 'natural', file: 'about-icon-natural-crystals-v2.png' },
  { section: 'about', key: 'cleansing', file: 'about-icon-prepared-with-care-v2.png' },
  { section: 'about', key: 'packaging', file: 'about-icon-velvet-pouch-guide-v2.png' },
  { section: 'about', key: 'returns', file: 'about-icon-returns-care-v2.png' },
  { section: 'about', key: 'communityRose', file: 'about-usecase-rose-quartz-transition-v2.png' },
  { section: 'about', key: 'communityProtection', file: 'about-usecase-black-tourmaline-workday-v2.png' },
  { section: 'about', key: 'communityAmethyst', file: 'about-usecase-amethyst-evening-v2.png' },
  { section: 'about', key: 'communityCitrine', file: 'about-usecase-citrine-creative-courage-v2.png' },
  { section: 'about', key: 'cta', file: 'about-cta-find-your-crystal-v2.png' }
];

function jsString(value) {
  return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function updateRegistry(uploaded) {
  let content = fs.readFileSync(REGISTRY_PATH, 'utf8');

  for (const item of uploaded) {
    const oldUrlExpr = "GEN + '/" + item.file + "'";
    const expectedUrl = WP_UPLOAD_BASE + '/' + item.file;
    const newUrlExpr = item.source_url === expectedUrl ? oldUrlExpr : jsString(item.source_url);

    const oldUrlIndex = content.indexOf(oldUrlExpr);
    if (oldUrlIndex === -1) {
      throw new Error('Cannot find registry URL expression for ' + item.file);
    }

    if (newUrlExpr !== oldUrlExpr) {
      content = content.slice(0, oldUrlIndex) + newUrlExpr + content.slice(oldUrlIndex + oldUrlExpr.length);
    }

    const markerIndex = content.indexOf(newUrlExpr, Math.max(0, oldUrlIndex - 5));
    const statusIndex = content.indexOf('needs_generation', markerIndex);
    const nextAssetIndex = IMAGE_LIST
      .filter(candidate => candidate.file !== item.file)
      .map(candidate => content.indexOf("GEN + '/" + candidate.file + "'", markerIndex + 1))
      .filter(index => index !== -1)
      .sort((a, b) => a - b)[0];

    if (statusIndex === -1 || (nextAssetIndex !== undefined && statusIndex > nextAssetIndex)) {
      throw new Error('Cannot find needs_generation status for ' + item.file);
    }

    content = content.slice(0, statusIndex) + 'generated' + content.slice(statusIndex + 'needs_generation'.length);
  }

  fs.writeFileSync(REGISTRY_PATH, content, 'utf8');
}

async function main() {
  console.log('=== Upload Earthward brand v2 images ===');

  const connected = await E.checkConnection();
  if (!connected) {
    throw new Error('WordPress connection failed');
  }

  const missing = [];
  const files = IMAGE_LIST.map(item => {
    const filePath = path.join(GENERATED_DIR, item.file);
    if (!fs.existsSync(filePath)) missing.push(item.file);
    return {
      ...item,
      filePath,
      alt: IMAGES[item.section][item.key].alt
    };
  });

  if (missing.length) {
    console.error('Missing generated images:');
    missing.forEach(file => console.error('  - ' + file));
    throw new Error('Missing ' + missing.length + ' generated images in ' + GENERATED_DIR);
  }

  const uploaded = [];
  for (let index = 0; index < files.length; index++) {
    const item = files[index];
    console.log('[' + (index + 1) + '/' + files.length + '] Uploading: ' + item.file);
    const result = await E.uploadMedia(item.filePath, item.file, item.alt);
    if (!result || !result.source_url) {
      throw new Error('Upload failed: ' + item.file);
    }
    uploaded.push({
      section: item.section,
      key: item.key,
      file: item.file,
      id: result.id,
      source_url: result.source_url,
      alt_text: result.alt_text || item.alt
    });
  }

  fs.writeFileSync(RESULTS_PATH, JSON.stringify({
    uploaded_at: new Date().toISOString(),
    count: uploaded.length,
    images: uploaded
  }, null, 2), 'utf8');

  updateRegistry(uploaded);
  console.log('Uploaded ' + uploaded.length + ' images.');
  console.log('Wrote: ' + RESULTS_PATH);
  console.log('Updated: ' + REGISTRY_PATH);
}

main().catch(error => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
