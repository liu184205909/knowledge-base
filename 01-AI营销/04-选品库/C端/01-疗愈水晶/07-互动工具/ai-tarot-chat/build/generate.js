/**
 * AI Tarot Chat v2.2 — Universal tarot readers, left-tab + right-chat layout, English only.
 *
 * Architecture: frontend HTML + base64 JS  ->  WP admin-ajax (action=ect_ai_chat)  ->  DeepSeek (key in PHP)
 *
 * v2.2 visual overhaul (light, aligned with site style — crystal-tarot-reading):
 *   - Light/white palette (transparent wrap over site bg, white cards, gold + brand-green accents)
 *   - Left reader tabs reuse the same typography hierarchy as the right chat header (name/title/tagline)
 *   - Chat panel: messages area flex:1 (large) + compact fixed-height input row at bottom
 *   - Generated reader portrait avatars (gpt-image-2, base64-embedded) retained
 *
 * v2.0/v2.1 retained: 4 universal English readers (Seraphina/Maverick/The Oracle/Elder Sage), left-tab +
 *   right-chat layout, responsive (mobile tabs row on top), all-English UI + personas, base64 JS (crown
 *   standard, bypass wp_kses) + asciiJSON (role data) + min font 16 + compliance. System prompt in PHP backend.
 *
 * Reference: crystal-tarot-reading (light site style); bracelet-size-calculator (base64 image embed).
 */
const fs = require('fs');
const path = require('path');

// reader portrait avatars (256x256 webp, gpt-image-2; base64-embedded for self-contained deploy)
function avatarData(id) {
  const p = path.resolve(__dirname, 'images/avatar-' + id + '.webp');
  if (!fs.existsSync(p)) return '';
  return 'data:image/webp;base64,' + fs.readFileSync(p).toString('base64');
}

// 4 universal tarot reader display metadata (English names, differentiated voice/crystals, NO Eastern perspective).
// system prompt lives in PHP backend; frontend only renders display metadata.
const ROLES = [
  {
    id: 'seraphina',
    name: 'Seraphina',
    title: 'The Healer',
    tagline: 'Gentle heart-centered empathy',
    desc: 'A warm listener who holds space for matters of the heart, emotion, and self-acceptance.',
    bias: 'Rose Quartz, Moonstone',
    accent: '#E0A0BC',
    accentSoft: 'rgba(224,160,188,0.16)',
    avatar: avatarData('seraphina'),
    initial: 'S'
  },
  {
    id: 'maverick',
    name: 'Maverick',
    title: 'The Guide',
    tagline: 'Direct, decisive, no-nonsense',
    desc: 'A clear-eyed strategist for choices, career, and seeing the cost of every road.',
    bias: 'Black Tourmaline, Tiger Eye',
    accent: '#6FA67E',
    accentSoft: 'rgba(111,166,126,0.16)',
    avatar: avatarData('maverick'),
    initial: 'M'
  },
  {
    id: 'oracle',
    name: 'The Oracle',
    title: 'The Mystic',
    tagline: 'Intuitive, imagistic, mysterious',
    desc: 'An intuitive reader for life direction, patterns, and the deeper why beneath the surface.',
    bias: 'Amethyst, Labradorite',
    accent: '#A99BD6',
    accentSoft: 'rgba(169,155,214,0.16)',
    avatar: avatarData('oracle'),
    initial: 'O'
  },
  {
    id: 'sage',
    name: 'Elder Sage',
    title: 'The Elder',
    tagline: 'Practical grounded lived wisdom',
    desc: 'A down-to-earth elder for family, relationships, and the everyday business of living.',
    bias: 'Jade, Carnelian',
    accent: '#D4A56A',
    accentSoft: 'rgba(212,165,106,0.16)',
    avatar: avatarData('sage'),
    initial: 'E',
    locked: true,
    unlockLine: 'Grounded elder wisdom for family, commitment, and hard practical choices.'
  },
  {
    id: 'luna',
    name: 'Cassian Vale',
    title: 'The Strategist',
    tagline: 'Career, money, action',
    desc: 'A pragmatic strategist for career moves, money questions, and turning tarot insight into a next step.',
    bias: 'Citrine, Pyrite',
    accent: '#B8902A',
    accentSoft: 'rgba(184,144,42,0.16)',
    avatar: '',
    initial: 'C',
    locked: true,
    unlockLine: 'Strategy readings for career choices, money pressure, timing, and the next concrete move.'
  },
  {
    id: 'valen',
    name: 'Valen Rose',
    title: 'The Love Mirror',
    tagline: 'Love, attachment, tenderness',
    desc: 'A relationship-focused reader for attraction, healing, boundaries, and emotional honesty.',
    bias: 'Rose Quartz, Rhodonite',
    accent: '#C9879A',
    accentSoft: 'rgba(201,135,154,0.16)',
    avatar: '',
    initial: 'V',
    locked: true,
    unlockLine: 'Relationship readings for love, longing, repair, and what the heart keeps circling.'
  }
];

function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const ROLES_B64 = Buffer.from(asciiJSON(ROLES), 'utf8').toString('base64');

// ---- APP JS (base64-wrapped, crown standard) ----
const APP_JS = `(function(){
  var ROLES = [];
  try { ROLES = JSON.parse(atob(document.getElementById('eac-roles').textContent)); } catch(e){ console.error('EAC roles parse failed', e); return; }
  var ROLE_MAP = {}; ROLES.forEach(function(r){ ROLE_MAP[r.id]=r; });

  var state = {
    role: null,            // selected reader id
    messages: [],          // [{role:'user'|'assistant', content, roleId}]
    sending: false,
    quota: null,           // remaining from backend
    lockedPreview: false
  };

  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function isLoggedIn(){ return document.body && document.body.classList && document.body.classList.contains('logged-in'); }
  function isRoleLocked(r){ return !!(r && r.locked && !isLoggedIn()); }

  // ---- render left role tabs ----
  function renderRoles(){
    var list = $('eac-role-list');
    if(!list) return;
    var h = '';
    ROLES.forEach(function(r){
      var av = r.avatar
        ? '<img class="eac-tab-avatar" src="'+r.avatar+'" alt="'+esc(r.name)+' portrait" loading="lazy"/>'
        : '<div class="eac-tab-avatar eac-tab-avatar-fallback">'+esc(r.initial)+'</div>';
      var locked = isRoleLocked(r);
      h += '<button type="button" class="eac-tab'+(locked?' eac-locked':'')+'" data-role="'+esc(r.id)+'" style="--eac-accent:'+r.accent+';--eac-accent-soft:'+r.accentSoft+'">'
        + av
        + '<div class="eac-tab-meta">'
        + '<div class="eac-tab-name">'+esc(r.name)+(r.locked?'<span class="eac-premium">'+(locked?'Premium':'Unlocked')+'</span>':'')+'</div>'
        + '<div class="eac-tab-title">'+esc(r.title)+'</div>'
        + '<div class="eac-tab-tag">'+esc(r.tagline)+'</div>'
        + '</div>'
        + '</button>';
    });
    list.innerHTML = h;
    var tabs = list.querySelectorAll('.eac-tab');
    for(var i=0;i<tabs.length;i++){
      (function(t){ t.addEventListener('click', function(){ selectRole(t.getAttribute('data-role')); }); })(tabs[i]);
    }
  }

  function avatarHtml(r){
    if(r.avatar){ return '<img class="eac-msg-avatar" src="'+r.avatar+'" alt="'+esc(r.name)+'" style="border-color:'+r.accent+'"/>'; }
    return '<div class="eac-msg-avatar eac-msg-avatar-fallback" style="background:'+r.accent+';border-color:'+r.accent+'">'+esc(r.initial)+'</div>';
  }

  function selectRole(id){
    if(!ROLE_MAP[id] || state.sending) return;
    state.role = id;
    var r = ROLE_MAP[id];
    var em = $('eac-empty'); if(em) em.style.display = 'none';   // hide empty placeholder so chat panel owns the space
    // highlight active tab
    var tabs = $('eac-role-list').querySelectorAll('.eac-tab');
    for(var i=0;i<tabs.length;i++){
      if(tabs[i].getAttribute('data-role')===id) tabs[i].classList.add('eac-active');
      else tabs[i].classList.remove('eac-active');
    }
    // chat header
    var hdr = $('eac-chat-hdr');
    if(hdr){
      hdr.style.display = 'flex';
      hdr.style.setProperty('--eac-accent', r.accent);
      var hdrAv = hdr.querySelector('.eac-hdr-avatar');
      if(r.avatar){
        hdrAv.innerHTML = '<img src="'+r.avatar+'" alt="'+esc(r.name)+'"/>';
        hdrAv.classList.remove('eac-hdr-avatar-fallback');
      } else {
        hdrAv.textContent = r.initial;
        hdrAv.classList.add('eac-hdr-avatar-fallback');
        hdrAv.style.background = r.accent;
      }
      hdr.querySelector('.eac-hdr-name').textContent = r.name;
      hdr.querySelector('.eac-hdr-title').textContent = r.title;
      hdr.querySelector('.eac-hdr-tag').textContent = r.tagline + ' · ' + r.bias;
    }
    $('eac-chat-panel').style.display = 'flex';
    if(isRoleLocked(r)){
      showLockedReader(r);
      scrollChat();
      return;
    }
    if(state.lockedPreview){
      var log = $('eac-log');
      if(log) log.innerHTML = '';
      state.lockedPreview = false;
    }
    setComposerLocked(false);
    // switch reader notice (keep history, new reader continues same conversation)
    if(state.messages.length===0){
      addSystemNotice('You are now with '+r.name+'. Ask your question below.', true);
    } else {
      addSystemNotice(r.name+' joins the conversation. The same question, seen through new eyes.', true);
    }
    setTimeout(function(){ var q=$('eac-question'); if(q) q.focus(); }, 200);
    scrollChat();
  }

  function showLockedReader(r){
    state.lockedPreview = true;
    var log = $('eac-log');
    if(log){
      log.innerHTML = '<div class="eac-unlock" style="--eac-accent:'+r.accent+';--eac-accent-soft:'+r.accentSoft+'">'
        + '<div class="eac-unlock-kicker">Premium reader</div>'
        + '<div class="eac-unlock-title">'+esc(r.name)+' is available after sign-up.</div>'
        + '<p>'+esc(r.unlockLine || 'Create an account to unlock this reader and continue your tarot conversation with a new voice.')+'</p>'
        + '<a class="eac-unlock-btn" href="/my-account/">Sign up free</a>'
        + '</div>';
    }
    setComposerLocked(true);
  }

  function setComposerLocked(locked){
    var input = $('eac-question');
    var btn = $('eac-send');
    if(input){
      input.disabled = !!locked;
      input.placeholder = locked ? 'Sign up to unlock this reader.' : 'Ask your question… (e.g. How do I move on after a breakup? Should I change careers?)';
      if(locked) input.value = '';
      autosizeInput(input);
    }
    if(btn){
      btn.disabled = false;
      btn.textContent = locked ? 'Unlock' : 'Send';
      btn.classList.toggle('eac-unlock-send', !!locked);
    }
  }

  function autosizeInput(input){
    if(!input) return;
    input.style.height = 'auto';
    var max = 160;
    var min = 56;
    var next = Math.max(min, Math.min(max, input.scrollHeight || min));
    input.style.height = next + 'px';
    input.style.overflowY = (input.scrollHeight > max) ? 'auto' : 'hidden';
  }

  function addSystemNotice(text, replaceReaderNotice){
    var log = $('eac-log');
    if(!log) return;
    if(replaceReaderNotice){
      var old = log.querySelectorAll('.eac-reader-notice');
      for(var i=0;i<old.length;i++){ old[i].parentNode.removeChild(old[i]); }
    }
    var d = document.createElement('div');
    d.className = 'eac-notice' + (replaceReaderNotice ? ' eac-reader-notice' : '');
    d.textContent = text;
    log.appendChild(d);
    scrollChat();
  }

  function addMessage(role, content, roleId){
    state.messages.push({ role: role, content: content, roleId: roleId });
    var log = $('eac-log');
    if(!log) return;
    var d = document.createElement('div');
    d.className = 'eac-msg eac-msg-'+role;
    if(role==='assistant'){
      var r = ROLE_MAP[roleId] || ROLE_MAP[state.role] || ROLES[0];
      d.style.setProperty('--eac-accent', r.accent);
      d.style.setProperty('--eac-accent-soft', r.accentSoft);
      d.innerHTML = avatarHtml(r)
        + '<div class="eac-msg-bubble"><div class="eac-msg-from">'+esc(r.name)+'</div><div class="eac-msg-text">'+esc(content)+'</div></div>';
    } else {
      d.innerHTML = '<div class="eac-msg-bubble eac-msg-user-bubble">'+esc(content)+'</div>';
    }
    log.appendChild(d);
    scrollChat();
  }

  function addTyping(){
    var log = $('eac-log');
    if(!log) return null;
    var r = ROLE_MAP[state.role] || ROLES[0];
    var d = document.createElement('div');
    d.className = 'eac-msg eac-msg-assistant eac-typing';
    d.style.setProperty('--eac-accent', r.accent);
    d.style.setProperty('--eac-accent-soft', r.accentSoft);
    d.id = 'eac-typing-msg';
    d.innerHTML = avatarHtml(r)
      + '<div class="eac-msg-bubble"><div class="eac-msg-from">'+esc(r.name)+'</div><div class="eac-msg-text"><span class="eac-dot"></span><span class="eac-dot"></span><span class="eac-dot"></span></div></div>';
    log.appendChild(d);
    scrollChat();
    return d;
  }

  function scrollChat(){
    var log = $('eac-log');
    if(log) log.scrollTop = log.scrollHeight;
  }

  function setQuota(remaining){
    state.quota = remaining;
    var q = $('eac-quota');
    if(q){
      if(remaining==null){ q.style.display='none'; }
      else {
        q.style.display='block';
        q.textContent = remaining + ' free readings left today';
        q.classList.toggle('eac-low', remaining<=1);
      }
    }
  }

  function lockUI(on){
    state.sending = on;
    var btn = $('eac-send');
    var input = $('eac-question');
    if(btn){ btn.disabled = on; btn.textContent = on ? 'Asking...' : 'Send'; }
    if(input){ input.disabled = on; }
  }

  function showError(msg){
    var log = $('eac-log');
    if(!log) return;
    var d = document.createElement('div');
    d.className = 'eac-notice eac-error';
    d.textContent = msg;
    log.appendChild(d);
    scrollChat();
  }

  // ---- send ----
  function send(){
    if(state.sending) return;
    if(!state.role){ addSystemNotice('Please choose a reader first.'); return; }
    if(isRoleLocked(ROLE_MAP[state.role])){ window.location.href = '/my-account/'; return; }
    var input = $('eac-question');
    var q = (input? input.value : '').trim();
    if(q.length<2){ addSystemNotice('Please enter your question.'); return; }
    if(q.length>600){ q = q.slice(0,600); }

    addMessage('user', q, null);
    if(input){ input.value = ''; autosizeInput(input); }

    // build history (last 4 turns, exclude current just-added)
    var hist = state.messages.slice(0, -1).slice(-4).map(function(m){
      return { role: m.role, content: m.content };
    });

    lockUI(true);
    var typing = addTyping();

    var body = new URLSearchParams();
    body.append('action', 'ect_ai_chat');
    body.append('role', state.role);
    body.append('question', q);
    body.append('history', JSON.stringify(hist));

    var ajaxUrl = (typeof window !== 'undefined' && window.EAC_AJAX_URL) ? window.EAC_AJAX_URL : '/wp-admin/admin-ajax.php';
    fetch(ajaxUrl, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: body
    }).then(function(r){ return r.json(); }).then(function(j){
      if(typing) typing.remove();
      if(j && j.success && j.data && j.data.answer){
        addMessage('assistant', j.data.answer, state.role);
        if(typeof j.data.remaining === 'number') setQuota(j.data.remaining);
      } else {
        var msg = (j && j.data && j.data.message) ? j.data.message : 'The reader is briefly unavailable. Please try again.';
        showError(msg);
        if(j && j.data && j.data.message && /limit/i.test(j.data.message)){ setQuota(0); }
      }
    }).catch(function(){
      if(typing) typing.remove();
      showError('Network error. Please try again.');
    }).finally(function(){ lockUI(false); });
  }

  function bind(){
    var btn = $('eac-send'); if(btn) btn.addEventListener('click', send);
    var input = $('eac-question');
    if(input){
      autosizeInput(input);
      input.addEventListener('input', function(){ autosizeInput(input); });
      input.addEventListener('keydown', function(e){
        if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); }
      });
    }
  }

  function init(){
    renderRoles();
    bind();
    setQuota(null);
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();`;

const APP_B64 = Buffer.from((function(s){
  return s.replace(/[^\x00-\x7F]/g, function(ch){ return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); });
})(APP_JS), 'utf8').toString('base64');

const HTML = `<!-- ===== Earthward AI Tarot Chat v2.2 (universal readers, left-tab + right-chat, light site style) ===== -->
<div id="eac-wrap">
  <h1 class="eac-h1">AI Tarot Chat</h1>
  <p class="eac-intro">Choose one of six tarot readers and ask what is on your heart. Three readers are open now, while Premium voices can be previewed and unlocked after sign-up. Each reader pairs a distinct voice with crystal guidance for your journey — honest AI, character-driven, not a prediction of fate but a mirror for self-reflection.</p>

  <div class="eac-layout">
    <!-- LEFT: reader tabs -->
    <aside class="eac-roles" aria-label="Choose your reader">
      <div class="eac-roles-lbl">Choose your reader</div>
      <div class="eac-role-list" id="eac-role-list"></div>
    </aside>

    <!-- RIGHT: chat panel -->
    <section class="eac-chat" aria-label="Chat with your reader">
      <div class="eac-chat-hdr" id="eac-chat-hdr" style="display:none">
        <div class="eac-hdr-avatar"></div>
        <div class="eac-hdr-info">
          <div class="eac-hdr-name"></div>
          <div class="eac-hdr-title"></div>
          <div class="eac-hdr-tag"></div>
        </div>
      </div>

      <div class="eac-chat-panel" id="eac-chat-panel" style="display:none">
        <div class="eac-log" id="eac-log"></div>
        <div class="eac-quota" id="eac-quota" style="display:none"></div>
        <div class="eac-input-row">
          <textarea id="eac-question" class="eac-input" rows="1" placeholder="Ask your question… (e.g. How do I move on after a breakup? Should I change careers?)" maxlength="600"></textarea>
          <button type="button" class="eac-send" id="eac-send">Send</button>
        </div>
        <p class="eac-hint">Press Enter to send · Shift+Enter for a new line · Free, AI-assisted, for self-reflection only.</p>
      </div>

      <div class="eac-empty" id="eac-empty">
        <div class="eac-empty-glyph">✦</div>
        <p>Select a reader on the left to begin your reading.</p>
      </div>
    </section>
  </div>

  <p class="eac-disclaim">Tarot here is a tool for self-reflection, not fortune-telling or medical, legal, or financial advice. Reversed or difficult cards point to a shadow aspect or an invitation to reflect — never a curse or bad luck. Your choices shape your path.</p>
</div>
<style>
/* ===== Site-native light palette (aligned with crystal-tarot-reading family) ===== */
#eac-wrap{
  --eac-gold:#CFAA3E;
  --eac-gold-soft:rgba(207,170,62,0.14);
  --eac-green:#2D6A4F;
  --eac-green-2:#1B4332;
  --eac-line:#E8E2D5;            /* warm light border */
  --eac-line-soft:#EFEAE0;
  --eac-text:#1A1A2E;            /* primary deep text (matches site) */
  --eac-text-mute:#5A5A6E;       /* secondary text */
  --eac-text-dim:#8A8A9A;        /* tertiary / hints */
  --eac-card:#FFFFFF;            /* raised card / panel */
  --eac-card-2:#FAFAFA;          /* subtle block */
  font-size:16px;color:var(--eac-text);max-width:1080px;margin:0 auto;
  /* transparent wrap → inherits the site's standard light background (no dark mystical bg) */
  border:1px solid var(--eac-line);border-radius:18px;padding:30px 28px;
  background:#FFFFFF;
  box-shadow:0 6px 24px rgba(26,26,46,0.06);
}
.eac-h1{font-size:32px;color:var(--eac-text);margin:0 0 12px;font-weight:700;line-height:1.2;letter-spacing:.01em}
.eac-intro{color:var(--eac-text-mute);font-size:16px;line-height:1.7;margin:0 0 24px;max-width:80ch}

/* ===== Layout: left tabs + right chat ===== */
.eac-layout{display:grid;grid-template-columns:260px 1fr;gap:22px;align-items:start}

/* LEFT: reader tabs — typography unified with right chat-header detail (same hierarchy) */
.eac-roles{background:var(--eac-card);border:1px solid var(--eac-line);border-radius:14px;padding:16px 12px;display:flex;flex-direction:column;height:680px;max-height:calc(100vh - 140px);min-height:560px;overflow:hidden}
.eac-roles-lbl{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--eac-green);margin:2px 6px 12px}
.eac-role-list{display:flex;flex-direction:column;gap:8px;flex:1;min-height:0;overflow-y:auto;padding:0 4px 2px 0;scrollbar-color:var(--eac-gold) transparent}
.eac-role-list::-webkit-scrollbar{width:8px}
.eac-role-list::-webkit-scrollbar-track{background:transparent}
.eac-role-list::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#CFAA3E 0%,#B8902A 100%);border-radius:6px}
#eac-wrap .eac-tab{
  display:flex;align-items:center;gap:8px;
  background:var(--eac-card-2);border:1.5px solid var(--eac-line-soft);border-radius:10px;padding:6px 8px;
  cursor:pointer;text-align:left;font-family:inherit;width:100%;text-transform:none;letter-spacing:0;
  transition:background .2s,border-color .2s,box-shadow .2s,transform .15s;
}
.eac-tab:hover{background:#FFFFFF;border-color:var(--eac-accent);transform:translateX(2px);box-shadow:0 4px 12px rgba(26,26,46,0.06)}
.eac-tab.eac-active{
  background:#FFFFFF;
  border-color:var(--eac-accent);
  /* mirror the right chat-header: 3px accent left bar + soft glow */
  box-shadow:inset 3px 0 0 var(--eac-accent),0 0 0 1px var(--eac-accent),0 6px 16px rgba(26,26,46,0.08);
}
.eac-tab-avatar{
  width:34px;height:34px;border-radius:50%;flex-shrink:0;object-fit:cover;object-position:center;
  border:2px solid var(--eac-accent);background:var(--eac-card-2);
}
.eac-tab-avatar-fallback{display:flex;align-items:center;justify-content:center;font-size:18px;color:#FFFFFF;font-weight:700;background:var(--eac-accent)}
.eac-tab-meta{flex:1;min-width:0}
/* tab name/title/tagline share the SAME typography hierarchy as the right chat header (unified, clean) */
#eac-wrap .eac-tab-name{font-size:14px!important;font-weight:700!important;color:var(--eac-text);line-height:1.16;letter-spacing:0!important;text-transform:none!important}
.eac-tab.eac-active .eac-tab-name{color:var(--eac-text)}
.eac-premium{display:inline-flex;align-items:center;margin-left:5px;padding:2px 5px;border-radius:999px;border:1px solid var(--eac-accent);color:var(--eac-accent);font-size:8.5px;font-weight:700;line-height:1;text-transform:uppercase;letter-spacing:.04em;vertical-align:middle}
.eac-tab.eac-locked{position:relative}
.eac-tab.eac-locked .eac-tab-avatar{filter:saturate(.75)}
#eac-wrap .eac-tab-title{font-size:12px!important;color:var(--eac-accent);font-weight:600!important;font-style:italic;margin-top:1px;line-height:1.18;text-transform:none!important;letter-spacing:0!important}
#eac-wrap .eac-tab-tag{font-size:11.5px!important;color:var(--eac-text-mute);line-height:1.28;margin-top:2px;text-transform:none!important;letter-spacing:0!important;white-space:normal;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}

/* RIGHT: chat panel */
.eac-chat{background:var(--eac-card);border:1px solid var(--eac-line);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;height:680px;max-height:calc(100vh - 140px);min-height:560px;overflow:hidden}
.eac-chat-hdr{display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--eac-line-soft);border-left:3px solid var(--eac-accent,var(--eac-gold));padding:4px 6px 12px;margin-bottom:12px;flex-shrink:0}
.eac-hdr-avatar{width:48px;height:48px;border-radius:50%;flex-shrink:0;overflow:hidden;border:2px solid var(--eac-accent);background:var(--eac-card-2)}
.eac-hdr-avatar img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
.eac-hdr-avatar-fallback{display:flex;align-items:center;justify-content:center;font-size:20px;color:#FFFFFF;font-weight:700}
.eac-hdr-info{flex:1;min-width:0}
/* right header detail — reference typography (tabs above now match this hierarchy) */
.eac-hdr-name{font-size:17px;font-weight:700;color:var(--eac-text);line-height:1.2}
.eac-hdr-title{font-size:14px;color:var(--eac-accent);font-style:italic;font-weight:600;margin-top:2px;line-height:1.25}
.eac-hdr-tag{font-size:13px;color:var(--eac-text-mute);margin-top:4px;line-height:1.4}

/* Messages own the scrollbar. The composer stays fixed at the bottom of the chat card. */
.eac-chat-panel{display:none;flex-direction:column;flex:1;min-height:0;overflow:hidden;padding-right:0}
.eac-log{flex:1;min-height:0;overflow-y:auto;padding:2px 8px 4px 0;scrollbar-color:var(--eac-gold) transparent}
.eac-log::-webkit-scrollbar{width:8px}
.eac-log::-webkit-scrollbar-track{background:transparent}
.eac-log::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#CFAA3E 0%,#B8902A 100%);border-radius:6px}
.eac-notice{font-size:14px;color:var(--eac-text-dim);text-align:center;font-style:italic;padding:8px 12px;margin:6px 0;background:var(--eac-card-2);border:1px solid var(--eac-line-soft);border-radius:8px}
.eac-notice.eac-error{color:#8B1A1A;background:#FFF0F0;border-color:rgba(200,60,60,0.35);font-style:normal}
.eac-unlock{margin:8px 0 0;background:linear-gradient(180deg,#FFFFFF 0%,var(--eac-accent-soft) 100%);border:1px solid var(--eac-line);border-left:3px solid var(--eac-accent);border-radius:12px;padding:18px 18px 16px;color:var(--eac-text)}
.eac-unlock-kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--eac-accent);margin-bottom:8px}
.eac-unlock-title{font-size:18px;font-weight:700;line-height:1.25;margin-bottom:8px}
.eac-unlock p{font-size:14px;line-height:1.6;color:var(--eac-text-mute);margin:0 0 14px}
.eac-unlock-btn{display:inline-flex;align-items:center;justify-content:center;background:var(--eac-green);color:#FFFFFF!important;text-decoration:none;border-radius:9px;padding:9px 16px;font-size:14px;font-weight:700}
.eac-msg{display:flex;margin:14px 0;gap:10px}
.eac-msg-user{justify-content:flex-end}
.eac-msg-avatar{width:40px;height:40px;border-radius:50%;flex-shrink:0;object-fit:cover;object-position:center;border:2px solid var(--eac-accent);background:var(--eac-card-2)}
.eac-msg-avatar-fallback{display:flex;align-items:center;justify-content:center;font-size:17px;color:#FFFFFF;font-weight:700}
.eac-msg-bubble{
  background:var(--eac-card-2);border:1px solid var(--eac-line);border-left:3px solid var(--eac-accent);border-radius:4px 14px 14px 14px;
  padding:12px 16px;max-width:80%;font-size:15px;line-height:1.7;color:var(--eac-text);
  white-space:pre-wrap;word-wrap:break-word;box-shadow:0 2px 8px rgba(26,26,46,0.04);
}
.eac-msg-from{font-size:13px;font-weight:700;color:var(--eac-accent);margin-bottom:4px;letter-spacing:.02em}
.eac-msg-user-bubble{
  background:linear-gradient(135deg,var(--eac-green) 0%,var(--eac-green-2) 100%);
  color:#FFFFFF;border:1px solid var(--eac-green-2);
  border-left:none;border-radius:14px 4px 14px 14px;max-width:80%;margin-left:auto;
  box-shadow:0 4px 12px rgba(45,106,79,0.18);
}
.eac-msg-user .eac-msg-bubble{margin-left:auto}
.eac-typing .eac-msg-text{display:flex;gap:5px;align-items:center;padding:4px 0}
.eac-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--eac-accent);opacity:.4;animation:eacBounce 1.2s infinite}
.eac-dot:nth-child(2){animation-delay:.2s}
.eac-dot:nth-child(3){animation-delay:.4s}
@keyframes eacBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}

.eac-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--eac-text-mute);text-align:center;gap:10px;padding:36px 20px}
.eac-empty-glyph{font-size:42px;color:var(--eac-gold)}
.eac-empty p{font-size:15px;margin:0}

.eac-quota{font-size:14px;color:var(--eac-green);text-align:center;margin-bottom:8px;font-weight:600}
.eac-quota.eac-low{color:#B8902A}

/* compact fixed composer */
.eac-input-row{flex-shrink:0;display:flex;gap:10px;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--eac-line-soft);background:var(--eac-card)}
.eac-input{
  flex:1;border:1px solid var(--eac-line);border-radius:9px;padding:8px 12px;font-size:16px;font-family:inherit;
  resize:none;min-height:56px;height:56px;max-height:160px;line-height:1.45;background:var(--eac-card-2);color:var(--eac-text);
}
#eac-wrap textarea.eac-input{
  min-height:56px!important;height:56px;max-height:160px!important;padding:9px 12px!important;
  line-height:1.45!important;font-size:16px!important;box-sizing:border-box!important;
}
.eac-input::placeholder{color:var(--eac-text-dim)}
.eac-input:focus{outline:none;border-color:var(--eac-gold);box-shadow:0 0 0 2px var(--eac-gold-soft);background:#FFFFFF}
.eac-send{
  background:linear-gradient(135deg,var(--eac-green) 0%,var(--eac-green-2) 100%);
  color:#FFFFFF !important;border:1px solid var(--eac-green-2);border-radius:9px;padding:0 22px;font-size:15px;font-weight:600;
  cursor:pointer;height:38px;font-family:inherit;min-width:84px;letter-spacing:.02em;flex-shrink:0;
  transition:background .2s,transform .2s,box-shadow .2s;
}
#eac-wrap button.eac-send{height:38px!important;min-height:38px!important;line-height:38px!important;padding:0 22px!important;display:inline-flex;align-items:center;justify-content:center}
.eac-send.eac-unlock-send{background:#BBB;border-color:#BBB}
.eac-send:hover:not(:disabled){box-shadow:0 0 0 2px var(--eac-gold-soft),0 4px 12px rgba(45,106,79,0.22);transform:translateY(-1px);border-color:var(--eac-gold)}
.eac-send:disabled{background:#BBB;border-color:#BBB;cursor:not-allowed}
.eac-hint{color:var(--eac-text-dim);font-size:12px;margin:6px 0 0;text-align:center;flex-shrink:0}
.eac-disclaim{color:var(--eac-text-dim);font-size:13px;line-height:1.65;margin-top:20px;border-left:2px solid var(--eac-gold);padding:4px 14px;background:var(--eac-card-2);border-radius:0 8px 8px 0}

/* Tablet */
@media(max-width:900px){
  .eac-layout{grid-template-columns:220px 1fr;gap:16px}
}
/* Mobile: tabs row on top + chat below */
@media(max-width:640px){
  #eac-wrap{padding:22px 16px;border-radius:14px}
  .eac-h1{font-size:26px}
  .eac-intro{font-size:15px;margin-bottom:18px}
  .eac-layout{grid-template-columns:1fr;gap:14px}
  .eac-roles{padding:12px}
  .eac-roles-lbl{margin:0 0 9px}
  .eac-role-list{flex-direction:row;overflow-x:auto;gap:9px;padding-bottom:4px;-webkit-overflow-scrolling:touch}
  .eac-tab{flex:0 0 auto;width:auto;min-width:200px}
  .eac-chat{min-height:560px;padding:14px}
  .eac-msg-bubble{max-width:88%;font-size:14.5px}
  .eac-input-row{flex-direction:column;align-items:stretch}
  .eac-send{width:100%}
}
</style>
<!-- reader display metadata (base64 ascii JSON; system prompt lives in backend PHP) -->
<script type="text/plain" id="eac-roles">${ROLES_B64}</script>
<!-- executable JS Base64-wrapped (crown standard, bypass WP wp_kses) -->
<script type="text/plain" id="eac-app">${APP_B64}</script>
<script>
window.EAC_AJAX_URL = (typeof EAC_WP !== 'undefined' && EAC_WP.ajaxUrl) ? EAC_WP.ajaxUrl : '/wp-admin/admin-ajax.php';
(function(){try{var s=atob(document.getElementById('eac-app').textContent);(0,eval)(s);}catch(e){console.error('EAC init failed',e);}})();
</script>
<!-- ===== End AI Tarot Chat v2 ===== -->`;

const OUT = path.resolve(__dirname, 'ai-tarot-chat.html');
fs.writeFileSync(OUT, HTML, 'utf8');
console.log('AI Tarot Chat v2.2 generated:', OUT, '|', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB | roles:', ROLES.length, '| avatars:', ROLES.filter(function(r){return !!r.avatar;}).length, '/4 | app b64:', APP_B64.length);
