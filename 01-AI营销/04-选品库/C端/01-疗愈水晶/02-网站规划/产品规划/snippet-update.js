const E = require('../templates/elementor-utils');
const code = `add_action('wp_head', function() { echo '<style>
.single-post .wd-entry-content h2{padding-left:16px;border-left:4px solid #2D6A4F;font-size:1.6rem;font-weight:600;color:#1a1a2e;margin:2.5rem 0 1rem 0;line-height:1.3;}
.single-post .wd-entry-content h3{font-size:1.22rem;font-weight:600;color:#1a1a2e;margin:1.65rem 0 0.7rem 0;line-height:1.35;}
.single-post .wd-entry-content p{line-height:1.8;color:#444;}
.single-post .wd-entry-content ul li::marker{color:#2D6A4F;}
.single-post .wd-entry-content ul li strong{color:#2D6A4F;}
.single-post .wd-entry-content table th{background:#f0f7f4;color:#2D6A4F;text-align:left;padding:8px 10px;font-weight:600;border-bottom:2px solid #2D6A4F;}
.single-post .wd-entry-content table td{padding:8px 10px;}
.single-post .wd-entry-content .wp-block-image figcaption{display:none;}
</style>'; });`;

E.apiRequest('/wp-json/code-snippets/v1/snippets/13', 'PUT', {
  name: 'Post 全局样式细化（H2/H3/p/list/table/figcaption）',
  description: '全局 single-post 内容区 CSS：H2绿竖线 + H3排版(水晶名/FAQ问) + 段落行距1.8 + list marker/标签绿 + table表头绿 + 隐藏图片figcaption。对齐 Crystal Meaning 风格。',
  code: code,
  scope: 'global',
  active: true
}).then(function(r) {
  console.log('updated:', r.active, '| name:', r.name);
  console.log('H3:', r.code.indexOf('h3{') >= 0, '| marker:', r.code.indexOf('::marker') >= 0, '| table th:', r.code.indexOf('table th') >= 0);
}).catch(function(e) { console.error('ERR', e.message); });
