/**
 * Love & Relationships v3 test draft.
 *
 * Uses the generator aligned to the approved HTML UI prototype:
 *   ui-prototype-v1.html
 */

const E = require('../../../templates/elementor-utils');
const generateLoveRelationships = require('./love-relationships');

async function main() {
  const data = generateLoveRelationships();
  await E.createPage('Love & Relationships V3 Draft', 'love-relationships-v3', data, 'draft');
}

if (require.main === module) {
  main().catch(function (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}

module.exports = generateLoveRelationships;
