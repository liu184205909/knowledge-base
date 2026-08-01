const fs = require('fs');
const path = require('path');
const E = require('../../../02-网站规划/templates/elementor-utils');

(async function run() {
  const htmlPath = path.resolve(__dirname, 'ai-tarot-chat.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const content = '<!-- wp:html -->\n' + html + '\n<!-- /wp:html -->';
  const result = await E.apiRequest('/wp-json/wp/v2/pages/48154?context=edit', 'POST', {
    content,
    meta: {
      _elementor_edit_mode: '',
      _elementor_template_type: '',
      _elementor_data: '',
      _elementor_page_settings: {},
      _elementor_conditions: []
    }
  });
  const rendered = result && result.content && result.content.rendered ? result.content.rendered : '';
  console.log(JSON.stringify({
    id: result.id,
    modified: result.modified,
    link: result.link,
    hasNewMsgScroll: rendered.indexOf('Messages own the scrollbar') >= 0,
    hasOldPanelScroll: rendered.indexOf('chat panel scrolls as ONE unit') >= 0,
    hasEacLogFlex: rendered.indexOf('.eac-log{flex:1') >= 0,
    renderedLength: rendered.length,
    error: result.message || null
  }, null, 2));
})().catch(function (err) {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
