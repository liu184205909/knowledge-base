/* AI Dream Interpreter — app.js (前端逻辑, 生成时 base64 包装进 wp:html 块) */
/* 职责: public-symbol-index 联想(trigger_words)/ ajax POST ect_dream_interpret / loading + 15s soft timeout / 渲染 6 模块 + crystal cards(cta_url 后端填) */
/* 不做: follow-up / journal / account(M3 最小闭环) */
(function () {
  'use strict';

  // ---- CSS 注入(避免 wp_kses 破坏 <style>; CSS 走 base64 JS 内) ----
  var CSS = '.edi-wrap{max-width:1140px;margin:0 auto;padding:24px 16px 88px;color:#222}'
    + '.edi-hero{padding:32px 0 30px}'
    + '.edi-hero h1{font-size:2em;margin:0 0 4px}'
    + '.edi-sub{color:#666;margin:0 0 20px}'
    + '.edi-hero textarea{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ccc;border-radius:8px;font-size:15px;resize:vertical;font-family:inherit}'
    + '.edi-suggest{font-size:13px;color:#888;margin:6px 0;min-height:18px}'
    + '.edi-suggest em{background:#f0ebe4;padding:1px 6px;border-radius:4px;font-style:normal;margin-right:4px}'
    + '.edi-form{padding-bottom:18px}'
    + '.edi-opts{display:flex;gap:16px;margin:12px 0 10px;flex-wrap:wrap;align-items:flex-end}'
    + '.edi-opts label{font-size:13px;color:#555;display:flex;flex-direction:column;gap:4px}'
    + '.edi-opts select{padding:6px;border:1px solid #ccc;border-radius:6px;font-family:inherit}'
    + '#edi-submit{background:#3a3a3a;color:#fff;border:0;padding:12px 28px;border-radius:8px;font-size:15px;cursor:pointer;font-family:inherit}'
    + '#edi-submit:hover{background:#222}'
    + '.edi-privacy{font-size:12px;color:#888;margin-top:12px}'
    + '.edi-loading{text-align:center;padding:40px 0}'
    + '.edi-skeleton{width:56px;height:56px;margin:0 auto 16px;border:4px solid #eee;border-top-color:#3a3a3a;border-radius:50%;animation:edi-spin 1s linear infinite}'
    + '@keyframes edi-spin{to{transform:rotate(360deg)}}'
    + '.edi-loading p{color:#666;font-style:italic}'
    + '.edi-error{background:#fef2f2;color:#991b1b;padding:14px;border-radius:8px;margin:16px 0}'
    + '.edi-result section{margin:20px 0}'
    + '.edi-result h2{font-size:1.4em;margin:0 0 8px}'
    + '.edi-result h3{font-size:1.1em;color:#444;margin:0 0 6px}'
    + '.edi-sym{padding:8px 0;border-bottom:1px solid #f0f0f0}'
    + '.edi-sym strong{display:block;color:#333;margin-bottom:2px}'
    + '.edi-sym span{font-size:14px;color:#555}'
    + '.edi-crystals{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}'
    + '.edi-crystal{background:#faf7f2;padding:14px;border-radius:8px;border:1px solid #eee}'
    + '.edi-crystal h4{margin:0 0 6px;color:#3a3a3a;font-size:1em}'
    + '.edi-crystal p{font-size:13px;color:#555;margin:0 0 10px;line-height:1.4}'
    + '.edi-cta{display:inline-block;font-size:13px;color:#3a3a3a;text-decoration:underline}'
    + '.edi-safety{font-size:13px;color:#777;background:#faf7f2;padding:12px;border-radius:8px;margin-top:20px;border-left:3px solid #ccc;line-height:1.5}'
    + '.edi-method,.edi-faq,.edi-symbols,.edi-types,.edi-hub,.edi-safety-section{margin:40px 0;padding:24px;background:#fff;border:1px solid #eee;border-radius:12px}'
    + '.edi-method h2,.edi-faq h2,.edi-symbols h2,.edi-types h2,.edi-hub h2,.edi-safety-section h2{font-size:1.5em;margin:0 0 12px;color:#3a3a3a}'
    + '.edi-method p,.edi-symbols p,.edi-hub p,.edi-safety-section p{color:#555;line-height:1.6;margin:8px 0}'
    + '.edi-method-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0}'
    + '.edi-method-card{background:#faf7f2;padding:14px;border-radius:8px}'
    + '.edi-method-card h4{margin:0 0 6px;color:#3a3a3a}'
    + '.edi-method-card p{font-size:13px;color:#666;margin:0}'
    + '.edi-method-note{font-size:13px;color:#777;background:#fef9f3;padding:12px;border-radius:8px;border-left:3px solid #d4a574}'
    + '.edi-faq details{border-bottom:1px solid #eee;padding:10px 0}'
    + '.edi-faq summary{font-weight:600;color:#3a3a3a;cursor:pointer;padding:4px 0}'
    + '.edi-faq details p{color:#555;line-height:1.5;margin:8px 0 4px}'
    + '.edi-symgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin:12px 0}'
    + '.edi-symcard{display:flex;flex-direction:column;gap:2px;padding:10px 12px;background:#faf7f2;border:1px solid #eee;border-radius:8px;text-decoration:none;color:#3a3a3a;font:inherit;font-size:14px;text-align:left;cursor:pointer}'
    + '.edi-symcard:hover{background:#f0ebe4;border-color:#d4a574}'
    + '.edi-symcat{font-size:10px;color:#999;text-transform:uppercase;letter-spacing:.5px}'
    + '.edi-symname{font-weight:500}'
    + '.edi-symaction{font-size:11px;color:#285c50;margin-top:3px}'
    + '.edi-typegrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:12px 0}'
    + '.edi-typecard{display:block;padding:14px;background:#faf7f2;border:1px solid #eee;border-radius:8px;text-decoration:none;color:#3a3a3a}'
    + '.edi-typecard:hover{background:#f0ebe4;border-color:#d4a574}'
    + '.edi-typecard h4{margin:0 0 4px}'
    + '.edi-typecard p{font-size:13px;color:#666;margin:0}'
    + '.edi-hub{text-align:center;background:linear-gradient(135deg,#faf7f2,#f0ebe4)}'
    + '.edi-hub-cta{display:inline-block;margin-top:12px;padding:10px 24px;background:#3a3a3a;color:#fff;text-decoration:none;border-radius:8px;font-weight:500}'
    + '.edi-hub-cta:hover{background:#222}';
  CSS += '.edi-hero{position:relative;padding:48px 0 36px;border-bottom:1px solid #e8e2da}'
    + '.edi-hero h1{font-family:Georgia,serif;font-size:clamp(2.25rem,5vw,3.9rem);font-weight:400;line-height:1.03;letter-spacing:0}'
    + '.edi-sub{font-size:1rem;letter-spacing:.08em;text-transform:uppercase;color:#7c766e}'
    + '.edi-form{background:#fffdf9;border:1px solid #ded7ce;border-radius:8px;padding:20px;box-shadow:0 14px 32px rgba(55,42,25,.06)}'
    + '#edi-submit{background:#285c50;border-radius:5px;font-weight:600;letter-spacing:.02em}'
    + '#edi-submit:hover{background:#19453b}'
    + '.edi-map-preview{margin:14px 0 2px;padding:12px 0 0;border-top:1px solid #eee6dd;min-height:26px;font-size:13px;color:#6d665e}'
    + '.edi-map-preview strong{font-weight:600;color:#285c50;margin-right:7px}.edi-map-chip{display:inline-block;margin:2px 4px 2px 0;padding:4px 8px;border:1px solid #cbd9d3;border-radius:999px;background:#f3f8f5;color:#285c50}'
    + '.edi-result{margin-top:28px;border-top:3px solid #285c50;padding-top:20px}.edi-result .edi-mod{padding:20px 0;margin:0;border-bottom:1px solid #ebe5dd}'
    + '.edi-result .edi-mod:first-child{padding-top:0}.edi-result h2{font-family:Georgia,serif;font-size:2rem;color:#1d3e36}.edi-result h3{color:#285c50;text-transform:uppercase;letter-spacing:.08em;font-size:.78rem}'
    + '.edi-summary-copy{font-family:Georgia,serif;font-size:1.25rem;line-height:1.6;color:#2f332f;max-width:780px}'
    + '.edi-deepen{margin:22px 0 0;padding:18px;background:#f3f8f5;border:1px solid #cbd9d3;border-radius:8px}.edi-deepen h3{margin:0 0 5px;color:#1d3e36}.edi-deepen p{margin:0 0 12px;color:#53665f}.edi-followups{display:flex;gap:8px;flex-wrap:wrap}.edi-followup{border:1px solid #8eaea3;background:#fff;color:#285c50;border-radius:999px;padding:8px 12px;cursor:pointer;font:inherit;font-size:13px}.edi-followup:hover{background:#285c50;color:#fff}'
    + '.edi-related-card{position:relative}.edi-related-card:after{content:"Read meaning";font-size:11px;color:#285c50;margin-top:4px}'
    + '.edi-recall{margin:14px 0 4px;padding:13px 0 0;border-top:1px solid #eee6dd}.edi-recall summary{cursor:pointer;font-size:13px;color:#285c50;font-weight:600}.edi-recall summary::marker{color:#285c50}.edi-recall em{font-style:normal;color:#8b8379;font-weight:400}.edi-recall>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.edi-recall input{min-width:0;width:100%;box-sizing:border-box;padding:9px 10px;border:1px solid #d9d2c8;border-radius:5px;background:#fff;font:inherit;font-size:13px}.edi-recall input:focus{outline:2px solid #b8d0c7;border-color:#285c50}'
    + '.edi-snapshot{margin:14px 0 0;border:1px solid #285c50;background:#fff;color:#285c50;padding:9px 13px;border-radius:5px;font:inherit;font-size:13px;cursor:pointer}.edi-snapshot:hover{background:#285c50;color:#fff}'
    + '@media (max-width:640px){.edi-hero{padding-top:30px}.edi-form{padding:15px}.edi-result h2{font-size:1.65rem}.edi-opts{gap:10px}.edi-recall>div{grid-template-columns:1fr}}';
  document.head.insertAdjacentHTML('beforeend', '<style>' + CSS + '</style>');

  // ---- public-symbol-index(联想/高亮用, 非权威) ----
  var INDEX = [];
  try { INDEX = JSON.parse(atob(document.getElementById('edi-index').textContent)); } catch (e) { INDEX = []; }

  var $ = function (id) { return document.getElementById(id); };
  var form = $('edi-form'), dream = $('edi-dream'), emotion = $('edi-emotion'), lens = $('edi-lens');
  var hp = $('edi-hp'), suggest = $('edi-suggest'), mapPreview = $('edi-map-preview'), lastResult = null, ARTICLE_MAP = window.EDI_ARTICLE_MAP || {};
  var loading = $('edi-loading'), loadingText = $('edi-loading-text');
  var errBox = $('edi-error'), result = $('edi-result');

  // ---- 联想(trigger_words 前缀匹配, 高亮, 非权威) ----
  if (dream) {
    dream.addEventListener('input', function () {
      var t = dream.value.toLowerCase().trim();
      if (t.length < 3) { suggest.innerHTML = ''; return; }
      var hits = [];
      for (var i = 0; i < INDEX.length && hits.length < 5; i++) {
        var o = INDEX[i], tws = o.trigger_words || [];
        for (var j = 0; j < tws.length; j++) {
          var tw = tws[j].toLowerCase();
          if (tw.indexOf(t) === 0 || t.indexOf(tw) !== -1) { hits.push(o.symbol); break; }
        }
      }
      suggest.innerHTML = hits.length
        ? '<span>Related: </span>' + hits.map(function (h) { return '<em>' + h + '</em>'; }).join('')
        : '';
      if (mapPreview) mapPreview.innerHTML = hits.length
        ? '<strong>Dream map forming</strong>' + hits.map(function (h) { return '<span class="edi-map-chip">' + esc(h) + '</span>'; }).join('')
        : '';
    });
  }

  // ---- loading + 15s soft timeout ----
  var LOADING_MSGS = ['Reading the symbols…', 'Weaving your reflection…', 'Listening to the dream…'];
  var loadingTimer = null, softTimeout = null, timedOut = false;
  function showLoading() {
    result.hidden = true; errBox.hidden = true; loading.hidden = false;
    var i = 0; loadingText.textContent = LOADING_MSGS[0];
    loadingTimer = setInterval(function () { i = (i + 1) % LOADING_MSGS.length; loadingText.textContent = LOADING_MSGS[i]; }, 3000);
  }
  function hideLoading() { loading.hidden = true; if (loadingTimer) { clearInterval(loadingTimer); loadingTimer = null; } }
  function showError(msg) { hideLoading(); errBox.textContent = msg || 'Something went wrong. Please try again.'; errBox.hidden = false; }

  // ---- XSS 转义 ----
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  // ---- 渲染 6 模块 + crystal cards(cta_url 后端填) ----
  function render(r) {
    hideLoading();
    lastResult = r;
    $('edi-summary').textContent = r.summary || '';
    var syms = (r.symbols || []).map(function (s) {
      return '<div class="edi-sym"><strong>' + esc(s.name) + '</strong><span>' + esc(s.meaning) + '</span></div>';
    }).join('');
    $('edi-symbols').innerHTML = syms;
    $('edi-psychological').textContent = r.psychological_lens || '';
    $('edi-spiritual').textContent = r.spiritual_lens || '';
    var cards = (r.crystal_matches || []).map(function (c) {
      var card = '<div class="edi-crystal"><h4>' + esc(c.name) + '</h4><p>' + esc(c.why) + '</p>';
      if (c.cta_url && /^(https?:\/\/|\/)/i.test(c.cta_url)) card += '<a class="edi-cta" href="' + esc(c.cta_url) + '">Explore ' + esc(c.name) + '</a>';
      card += '</div>';
      return card;
    }).join('');
    $('edi-crystals').innerHTML = cards;
    $('edi-reflection').textContent = r.reflection_prompt || '';
    renderFollowups(r.follow_up_questions || []);
    renderRelated(r.symbols || []);
    var safety = $('edi-safety');
    if (r.safety_note) { safety.textContent = r.safety_note; safety.hidden = false; } else { safety.hidden = true; }
    result.hidden = false;
    try { result.scrollIntoView({ behavior: 'smooth' }); } catch (e) {}
  }

  function renderFollowups(questions) {
    var holder = $('edi-followups');
    if (!holder) return;
    if (!Array.isArray(questions) || !questions.length) questions = ['Which feeling stayed with you most strongly after waking?', 'What detail felt most important in the dream scene?'];
    holder.innerHTML = questions.slice(0, 3).map(function (q) {
      return '<button class="edi-followup" type="button" data-prompt="' + esc(q) + '">' + esc(q) + '</button>';
    }).join('');
  }

  function snapshotText(r) {
    var symbol = r.symbols && r.symbols[0] ? r.symbols[0].name : 'your dream';
    var crystal = r.crystal_matches && r.crystal_matches[0] ? r.crystal_matches[0].name : 'a reflection ritual';
    return ['EARTHWARD | DREAM REFLECTION', '', 'CORE SYMBOL: ' + symbol, '', (r.summary || '').slice(0, 420), '', 'REFLECT: ' + (r.reflection_prompt || ''), '', 'RITUAL ANCHOR: ' + crystal, '', 'A personal reflection, not a prediction or diagnosis.'].join('\n');
  }

  function downloadSnapshot() {
    if (!lastResult) return;
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'), width = 1200, lineH = 44, pad = 76;
    var lines = snapshotText(lastResult).split('\n'), wrapped = [];
    ctx.font = '28px Georgia';
    lines.forEach(function (line) {
      if (!line) { wrapped.push(''); return; }
      var words = line.split(' '), current = '';
      words.forEach(function (word) { var trial = current ? current + ' ' + word : word; if (ctx.measureText(trial).width > width - pad * 2 && current) { wrapped.push(current); current = word; } else current = trial; });
      wrapped.push(current);
    });
    canvas.width = width; canvas.height = Math.max(720, pad * 2 + wrapped.length * lineH + 80);
    ctx.fillStyle = '#f7f4ee'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#285c50'; ctx.lineWidth = 6; ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
    ctx.fillStyle = '#285c50'; ctx.font = '600 18px Arial'; ctx.fillText('EARTHWARD / PRIVATE DREAM REFLECTION', pad, 92);
    var y = 150; ctx.font = '28px Georgia'; ctx.fillStyle = '#26332f';
    wrapped.forEach(function (line) { if (!line) { y += lineH / 2; return; } ctx.fillText(line, pad, y); y += lineH; });
    var a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'earthward-dream-reflection.png'; a.click();
  }

  function renderRelated(symbols) {
    var section = $('edi-related-section'), holder = $('edi-related');
    if (!section || !holder) return;
    var cards = [];
    symbols.forEach(function (s) {
      var name = (s.name || '').toLowerCase();
      for (var i = 0; i < INDEX.length; i++) {
        if (INDEX[i].symbol.toLowerCase() === name && cards.length < 3) {
          var url = ARTICLE_MAP[INDEX[i].symbol];
          if (url) cards.push('<a class="edi-symcard edi-related-card" href="' + esc(url) + '"><span class="edi-symcat">' + esc(INDEX[i].category) + '</span><span class="edi-symname">' + esc(INDEX[i].symbol) + '</span></a>');
          break;
        }
      }
    });
    holder.innerHTML = cards.join('');
    section.hidden = !cards.length;
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'edi-snapshot') { downloadSnapshot(); return; }
    var launcher = e.target.closest ? e.target.closest('.edi-symbol-launch') : null;
    if (launcher && dream) { dream.value = 'I dreamed about ' + launcher.getAttribute('data-symbol') + '.'; dream.focus(); try { dream.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (x) {} return; }
    var button = e.target.closest ? e.target.closest('.edi-followup') : null;
    if (!button || !dream) return;
    var prompt = button.getAttribute('data-prompt');
    if (!prompt) return;
    dream.value = dream.value.trim() + '\n\nMore context: ' + prompt;
    dream.focus();
    if (form && form.requestSubmit) form.requestSubmit();
  });

  // ---- submit → AJAX POST ect_dream_interpret ----
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = dream.value.trim();
      if (text.length < 10) { showError('Tell us a bit more about your dream.'); return; }
      var context = [];
      [['edi-person','Person or presence'], ['edi-place','Place or setting'], ['edi-action','Key action'], ['edi-afterfeel','Feeling after waking']].forEach(function (pair) { var field = $(pair[0]); if (field && field.value.trim()) context.push(pair[1] + ': ' + field.value.trim()); });
      if (context.length) text += '\n\nAdditional dream context:\n' + context.join('\n');
      showLoading();
      if (softTimeout) clearTimeout(softTimeout);
      timedOut = false;  // 重置(多次提交)
      // 15s soft timeout: 触发后置标志, 迟到响应被忽略(避免重复渲染竞态)
      softTimeout = setTimeout(function () { timedOut = true; showError('This is taking longer than usual. Please try again.'); }, 15000);

      var fd = new FormData();
      fd.append('action', 'ect_dream_interpret');
      fd.append('dream_text', text);
      fd.append('emotion', emotion.value);
      fd.append('lens', lens.value);
      fd.append('nonce', (window.EDI_WP && EDI_WP.nonce) ? EDI_WP.nonce : '');
      fd.append('edi_hp', hp ? hp.value : '');  // honeypot(空=人类)

      fetch(window.EDI_AJAX_URL || '/wp-admin/admin-ajax.php', { method: 'POST', body: fd, credentials: 'same-origin' })
        .then(function (res) { return res.json(); })
        .then(function (d) {
          if (timedOut) return;  // 15s 后忽略迟到响应(避免重复渲染)
          if (softTimeout) { clearTimeout(softTimeout); softTimeout = null; }
          if (d && d.success && d.data && d.data.result) { render(d.data.result); }
          else { showError(d && d.data && d.data.message ? d.data.message : 'Could not interpret this dream. Please try again.'); }
        })
        .catch(function () {
          if (timedOut) return;  // 15s 后忽略
          if (softTimeout) { clearTimeout(softTimeout); softTimeout = null; }
          showError('Could not reach the interpreter. Please try again.');
        });
    });
  }
})();
