const E = require('../../../templates/elementor-utils');
const builder = require('../_shared/intention-page-builder');

async function main() {
  const cfg = builder.loadSource(__dirname + '/source.json');
  const data = builder.generateIntentionPage(cfg);
  await E.createPage('Calm & Mindfulness Draft', 'calm-mindfulness-draft', data, 'draft');
}

if (require.main === module) main().catch(function (err) { console.error('Error:', err.message || err); process.exit(1); });

