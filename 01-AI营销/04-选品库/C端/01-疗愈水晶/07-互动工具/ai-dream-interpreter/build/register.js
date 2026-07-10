/**
 * 注册 AI Dream Interpreter Code Snippet 到 WP(Code Snippets REST)。
 * M4 阶段 2: inactive 保存(验 PHP 被 Code Snippets 接受, 弥补本地无 php -l); 占位替换为 server-dream-digest base64。
 * 同名查重 → PUT 更新 / POST 新建。
 * Usage: node register.js
 */
const fs = require('fs');
const path = require('path');
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');

// 读 snippet.php(含 ___DIGEST_B64___ 占位)+ 替换为 server-dream-digest.json base64 内联
let PHP = fs.readFileSync(path.resolve(__dirname, 'snippet.php'), 'utf8');
const digest = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'server-dream-digest.json'));
const b64 = Buffer.from(digest).toString('base64');
PHP = PHP.replace("'___DIGEST_B64___'", "'" + b64 + "'");

const NAME = 'AI Dream Interpreter (ect_dream_interpret endpoint)';

async function run() {
  // 1) 查重(防双 active)
  const list = await E.apiRequest('/wp-json/code-snippets/v1/snippets?per_page=100', 'GET');
  const existing = Array.isArray(list) ? list.find(s => (s.name || '') === NAME) : null;

  const payload = {
    name: NAME,
    description: 'admin-ajax endpoint ect_dream_interpret: dream interpretation -> DeepSeek json_object. trigger_words match (C1), safe_fallback on block/determinism (Critical), CTA backend-filled (C3). Key server-side only. Per-IP + global rate limit. JSON repair no plaintext fallback.',
    code: PHP,
    scope: 'global',
    active: existing ? !!existing.active : false // Existing production snippets retain their live state.
  };

  if (existing && existing.id) {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets/' + existing.id, 'PUT', payload);
    console.log('UPDATED snippet id=' + r.id + ' | active=' + r.active + ' | name=' + r.name);
    verify(r);
  } else {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets', 'POST', payload);
    if (r && r.id) {
      console.log('CREATED snippet id=' + r.id + ' | active=' + r.active + ' | code len=' + (r.code || '').length);
      verify(r);
    } else {
      console.log('CREATE result:', JSON.stringify(r).slice(0, 600));
    }
  }
}

function verify(r) {
  const c = r.code || '';
  console.log('  --- PHP 接受验证(Code Snippets 保存成功 = 语法 OK) ---');
  console.log('  has handler edi_interpret_handler:', c.indexOf('edi_interpret_handler') >= 0);
  console.log('  has ect_dream_interpret action:', c.indexOf('ect_dream_interpret') >= 0);
  console.log('  has deepseek:', c.indexOf('deepseek') >= 0);
  console.log('  has safe_fallback:', c.indexOf('edi_safe_fallback') >= 0);
  console.log('  has determinism_blocks:', c.indexOf('determinism_blocks') >= 0);
  console.log('  digest b64 内联(非占位):', c.indexOf('___DIGEST_B64___') < 0 && c.length > 50000);
}
run().catch(e => console.error('ERR', e.message || e));
