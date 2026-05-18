/**
 * Upload B1a generated images and update the central image registry.
 *
 * Scope:
 * - About Us: 11 images
 * - Ethical Sourcing: 8 images
 *
 * This script does not create or update pages. It only uploads media assets and
 * changes matching site-images.js entries from needs_generation to generated.
 */

const fs = require('fs');
const path = require('path');
const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

const WP_UPLOAD_BASE = 'https://luckycrystals.org/wp-content/uploads/2026/05';
const GENERATED_DIR = path.resolve(__dirname, '../assets/images/generated');
const REGISTRY_PATH = path.resolve(__dirname, '../assets/site-images.js');
const RESULTS_PATH = path.resolve(__dirname, '../assets/upload-results-b1a-images.json');

const IMAGE_LIST = [
  { section: 'about', key: 'hero', file: 'about-hero-brand-story-v1.png' },
  { section: 'about', key: 'founder', file: 'about-intention-setting-workspace-v1.png' },
  { section: 'about', key: 'natural', file: 'about-icon-natural-crystals-v1.png' },
  { section: 'about', key: 'cleansing', file: 'about-icon-cleansing-charged-v1.png' },
  { section: 'about', key: 'packaging', file: 'about-icon-velvet-pouch-guide-v1.png' },
  { section: 'about', key: 'returns', file: 'about-icon-returns-guarantee-v1.png' },
  { section: 'about', key: 'communityRose', file: 'about-community-rose-quartz-v1.png' },
  { section: 'about', key: 'communityProtection', file: 'about-community-black-tourmaline-v1.png' },
  { section: 'about', key: 'communityAmethyst', file: 'about-community-amethyst-v1.png' },
  { section: 'about', key: 'communityCitrine', file: 'about-community-citrine-v1.png' },
  { section: 'about', key: 'cta', file: 'about-cta-find-your-crystal-v1.png' },
  { section: 'sourcing', key: 'hero', file: 'sourcing-hero-earth-to-wrist-v1.png' },
  { section: 'sourcing', key: 'mining', file: 'sourcing-step-mining-origins-v1.png' },
  { section: 'sourcing', key: 'selection', file: 'sourcing-step-hand-selection-v1.png' },
  { section: 'sourcing', key: 'cleansing', file: 'sourcing-step-energy-cleansing-v1.png' },
  { section: 'sourcing', key: 'inspection', file: 'sourcing-step-quality-inspection-v1.png' },
  { section: 'sourcing', key: 'packaging', file: 'sourcing-step-eco-packaging-v1.png' },
  { section: 'sourcing', key: 'delivery', file: 'sourcing-step-delivery-reveal-v1.png' },
  { section: 'sourcing', key: 'cta', file: 'sourcing-cta-shop-ethical-v1.png' }
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
  console.log('=== Upload B1a generated images ===');

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
    throw new Error('Missing generated images: ' + missing.join(', '));
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
