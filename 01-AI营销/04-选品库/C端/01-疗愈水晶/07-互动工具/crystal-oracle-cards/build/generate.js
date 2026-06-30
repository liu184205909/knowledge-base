/**
 * Crystal Oracle Cards v10 — 升级 v10 抽牌标准(对齐皇冠 crystal-tarot-draw v10)
 * v10 改进(对比旧 v7 引擎):
 *   1) 卡牌左右滚动: deck flex 横向 + overflow-x:auto(大牌 150px), 金色滚动条; 移动端(640px 以下)flex-wrap(105px)
 *   2) focus 必选: intent select 加 placeholder(第一个 option value="" disabled selected), 未选意图点牌无效 + 红色提示
 *      focus = 意图选择(love/protection/wealth/healing/guidance), 明确第一步
 *   3) 默认洗牌: init 即 buildDeck(initial 态可选牌, revealed 态拦截); 点牌直接有效, 不再需 Shuffle/Cut/Validate
 *   4) 选满自动翻牌(去 Validate 强制): 选满 → 0.5s 后自动 revealAll + Shuffle Again 变 "Reveal" 高亮
 *   5) 按钮栏下方居中(justify-content:center)
 * 保留: 390 水晶牌面 + 意图筛选 + 水晶信息(含义/脉轮/意图/element) + Shop CTA(直接卖该水晶)
 * 数据: crystal-meaning-search/data/search-data.json (390: name/img/excerpt/intentions/chakras/element/shop/link)
 * 约束: base64 包装 JS + asciiJSON 数据块 + 翻牌 scrollIntoView({block:'nearest'}) + 字体 min14 + self-reflection 合规 + CSS 前缀 eoc-
 * URL /tools/crystal-oracle-cards/ (page 48074). Shop 三级降级. 输出: ./crystal-oracle-cards.html
 */
const fs = require('fs');
const path = require('path');

const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));

// 意图 → 数据 intentions 子集映射(用户5意图映射到数据8种intentions)
const INTENT_MAP = {
  love:       { intentions: ['love'],                       label: 'Love & Relationships', blurb: 'matters of the heart, compassion, and connection' },
  protection: { intentions: ['protection'],                 label: 'Protection & Grounding', blurb: 'shielding, boundaries, and feeling safe' },
  wealth:     { intentions: ['abundance', 'new-beginnings'], label: 'Abundance & New Paths', blurb: 'prosperity, opportunity, and fresh starts' },
  healing:    { intentions: ['health', 'calm'],             label: 'Healing & Calm', blurb: 'release, restoration, and emotional ease' },
  guidance:   { intentions: ['spiritual'],                  label: 'Inner Guidance', blurb: 'intuition, clarity, and spiritual direction' },
};

// 构建 CARDS: 390 颗精简字段
const CARDS = SD.crystals.map(c => ({
  slug: c.slug,
  name: c.name,
  img: c.img || '',
  excerpt: (c.excerpt || '').slice(0, 280),
  intentions: c.intentions || [],
  chakras: c.chakras || [],
  element: c.element || '',
  shop: c.shop || ('/shop/?s=' + c.slug),
  link: c.link || '',
}));

// 按意图建索引: intentKey → [cardIdx,...]
const INTENT_INDEX = {};
Object.keys(INTENT_MAP).forEach(k => {
  const want = INTENT_MAP[k].intentions;
  INTENT_INDEX[k] = CARDS.map((c, i) => (c.intentions.some(it => want.indexOf(it) > -1) ? i : -1)).filter(i => i > -1);
});

const INTENT_LABEL = {
  love: 'Love', protection: 'Protection', 'new-beginnings': 'New Beginnings',
  calm: 'Calm', health: 'Healing', abundance: 'Abundance',
  'personal-power': 'Personal Power', spiritual: 'Spiritual',
};
const CHAKRA_LABEL = {
  root: 'Root', sacral: 'Sacral', 'solar-plexus': 'Solar Plexus', heart: 'Heart',
  throat: 'Throat', 'third-eye': 'Third Eye', crown: 'Crown',
};
const ELEMENT_LABEL = { earth: 'Earth', air: 'Air', fire: 'Fire', water: 'Water', ether: 'Ether' };

function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({
  cards: CARDS,
  intentIndex: INTENT_INDEX,
  intentMap: Object.keys(INTENT_MAP).reduce((a, k) => { a[k] = { label: INTENT_MAP[k].label, blurb: INTENT_MAP[k].blurb }; return a; }, {}),
  intentLabel: INTENT_LABEL,
  chakraLabel: CHAKRA_LABEL,
  elementLabel: ELEMENT_LABEL,
});

const GENTLE = 'Crystal oracle cards are a tool for self-reflection and gentle guidance — not a prediction of fixed outcomes, and never a substitute for medical, financial, or professional advice. The crystal that appears is an invitation to notice what is already moving within you; let it sit as a question rather than a verdict.';

// v10 APP_JS: flex 左右滚动 + focus 必选 + 默认洗牌 + 选满 0.5s 自动翻牌(去 Validate 强制)
const APP_JS = `(function(){
  var rawData = document.getElementById('eoc-data');
  var parsed;
  try { parsed = JSON.parse(rawData.textContent); } catch(e){ console.error('EOC data parse failed', e); return; }
  var CARDS = parsed.cards || [];
  var INTENT_INDEX = parsed.intentIndex || {};
  var INTENT_MAP = parsed.intentMap || {};
  var INTENT_LABEL = parsed.intentLabel || {};
  var CHAKRA_LABEL = parsed.chakraLabel || {};
  var ELEMENT_LABEL = parsed.elementLabel || {};
  var POSITIONS = ['Past', 'Present', 'Future'];
  var state = 'initial'; // v10: initial(可选牌, 需先选 intent) -> revealed (默认洗好)
  var deck = [];   // 当前意图洗牌后的 {cardIdx} 序列(按位置)
  var picked = [];
  var autoRevealTimer = null; // v10: 选满 0.5s 自动翻牌定时器

  function needed() { var s = document.getElementById('eoc-spread'); return (s && s.value === 'three') ? 3 : 1; }

  // v10: focus(intent) 必选检查 — 未选 intent(value==="") 返回 false
  function focusReady() {
    var f = document.getElementById('eoc-intent');
    if (!f) return true;
    var v = f.value;
    return v && v !== '';
  }
  function currentIntent() { var s = document.getElementById('eoc-intent'); return s ? s.value : ''; }

  function shuffleArr(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function buildDeck() {
    var intent = currentIntent();
    var idxs = INTENT_INDEX[intent] || [];
    var pool = idxs.slice();
    deck = shuffleArr(pool);
    if (deck.length > 4) {
      // 切牌: 前 ~1/3 移到末尾
      var cutAt = Math.floor(deck.length * (0.3 + Math.random() * 0.2));
      var top = deck.slice(0, cutAt);
      var rest = deck.slice(cutAt);
      deck = rest.concat(top);
    }
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function renderDeck() {
    var el = document.getElementById('eoc-deck');
    if (!el) return;
    var n = Math.min(deck.length, 36); // 最多铺 36 张牌背(够选 1-3)
    var h = '';
    for (var i = 0; i < n; i++) {
      h += '<div class="eoc-card-back eoc-enter" data-pos="' + i + '">'
        + '<div class="eoc-back-inner">'
        + '<div class="eoc-back-crystal">'
        + '<div class="eoc-crystal-top"></div>'
        + '<div class="eoc-crystal-face eoc-crystal-m"></div>'
        + '<div class="eoc-crystal-side eoc-crystal-l"></div>'
        + '<div class="eoc-crystal-side eoc-crystal-r"></div>'
        + '<div class="eoc-crystal-base"></div>'
        + '</div>'
        + '<div class="eoc-back-label">Crystal Oracle</div>'
        + '<div class="eoc-back-spark">\\u2737</div>'
        + '</div></div>';
    }
    el.innerHTML = h;
    var backs = el.querySelectorAll('.eoc-card-back');
    for (var k = 0; k < backs.length; k++) {
      (function (b) { b.addEventListener('click', function () { pickCard(parseInt(b.getAttribute('data-pos'), 10)); }); })(backs[k]);
    }
    var countEl = document.getElementById('eoc-deck-count');
    if (countEl) countEl.textContent = deck.length + ' stones in this deck';
  }

  function setStage(s) {
    state = s;
    var deckEl = document.getElementById('eoc-deck');
    var shuffleBtn = document.getElementById('eoc-shuffle-btn');
    var hint = document.getElementById('eoc-stage-hint');
    var n = needed();
    if (deckEl) {
      if (s === 'revealed') { deckEl.classList.remove('eoc-deck-pickable'); }
      else { deckEl.classList.add('eoc-deck-pickable'); }
    }
    if (shuffleBtn && s === 'revealed') { shuffleBtn.classList.remove('eoc-btn-reveal'); shuffleBtn.textContent = 'Shuffle Again'; }
    if (hint) {
      if (s === 'initial') {
        if (!focusReady()) hint.textContent = 'Select your intention, then pick ' + (n === 1 ? '1 card' : '3 cards') + ' from the spread below.';
        else hint.textContent = 'Pick ' + (n === 1 ? '1 card' : '3 cards') + ' from the spread below. Tap a card back to choose, tap again to undo.';
      }
      else if (s === 'revealed') hint.textContent = 'Your ' + (n === 1 ? 'crystal has' : 'crystals have') + ' appeared. Read their guidance below.';
    }
  }

  // v10: 意图切换 → 重新洗牌(initial 态)
  function onIntentChange() {
    if (autoRevealTimer) { clearTimeout(autoRevealTimer); autoRevealTimer = null; }
    buildDeck(); renderDeck(); picked = [];
    var deckEl = document.getElementById('eoc-deck'); if (deckEl) deckEl.classList.remove('eoc-deck-done');
    var holder = document.getElementById('eoc-revealed-cards'); if (holder) holder.innerHTML = '';
    var res = document.getElementById('eoc-result'); if (res) res.style.display = 'none';
    var resetBtn = document.getElementById('eoc-reset-btn'); if (resetBtn) resetBtn.style.display = 'none';
    var shuffleBtn = document.getElementById('eoc-shuffle-btn'); if (shuffleBtn) shuffleBtn.classList.remove('eoc-btn-reveal');
    setStage('initial');
    updatePickUI();
  }

  // v10: Shuffle Again = 重新洗牌(可选)
  function shuffleDeck() {
    if (autoRevealTimer) { clearTimeout(autoRevealTimer); autoRevealTimer = null; }
    buildDeck(); renderDeck(); picked = [];
    var deckEl = document.getElementById('eoc-deck');
    if (deckEl) {
      deckEl.classList.remove('eoc-deck-done');
      deckEl.classList.add('eoc-shuffle-anim');
      setTimeout(function () { deckEl.classList.remove('eoc-shuffle-anim'); }, 600);
    }
    var holder = document.getElementById('eoc-revealed-cards'); if (holder) holder.innerHTML = '';
    var res = document.getElementById('eoc-result'); if (res) res.style.display = 'none';
    var resetBtn = document.getElementById('eoc-reset-btn'); if (resetBtn) resetBtn.style.display = 'none';
    var shuffleBtn = document.getElementById('eoc-shuffle-btn'); if (shuffleBtn) shuffleBtn.classList.remove('eoc-btn-reveal');
    setStage('initial');
    updatePickUI();
  }

  function pickCard(pos) {
    if (state !== 'initial') return; // v10: initial 态可选(revealed 拦截)
    if (!focusReady()) {
      var hint = document.getElementById('eoc-stage-hint');
      if (hint) {
        hint.textContent = 'Select your intention first, then pick your card' + (needed() > 1 ? 's' : '') + '.';
        hint.classList.add('eoc-hint-warn');
        setTimeout(function () { hint.classList.remove('eoc-hint-warn'); }, 1800);
      }
      return;
    }
    var idx = picked.indexOf(pos);
    if (idx > -1) {
      picked.splice(idx, 1);
      var backOff = document.querySelector('#eoc-deck .eoc-card-back[data-pos="' + pos + '"]');
      if (backOff) backOff.classList.remove('selected');
      if (autoRevealTimer) { clearTimeout(autoRevealTimer); autoRevealTimer = null; }
      var sb1 = document.getElementById('eoc-shuffle-btn');
      if (sb1) sb1.classList.remove('eoc-btn-reveal');
    } else {
      var n = needed();
      if (picked.length >= n) return;
      picked.push(pos);
      var backOn = document.querySelector('#eoc-deck .eoc-card-back[data-pos="' + pos + '"]');
      if (backOn) backOn.classList.add('selected');
    }
    updatePickUI();
  }

  // v10: 选满后 Shuffle Again 变 "Reveal" 高亮 + 0.5s 自动翻牌
  function updatePickUI() {
    if (state === 'revealed') return;
    var n = needed();
    var hint = document.getElementById('eoc-stage-hint');
    var shuffleBtn = document.getElementById('eoc-shuffle-btn');
    if (picked.length < n) {
      if (autoRevealTimer) { clearTimeout(autoRevealTimer); autoRevealTimer = null; }
      if (shuffleBtn) { shuffleBtn.classList.remove('eoc-btn-reveal'); shuffleBtn.textContent = 'Shuffle Again'; }
      if (hint) {
        if (!focusReady()) hint.textContent = 'Select your intention, then pick ' + (n === 1 ? '1 card' : '3 cards') + ' from the spread below.';
        else {
          var left = n - picked.length;
          if (left === n) hint.textContent = 'Pick ' + n + ' card' + (n > 1 ? 's' : '') + ' from the spread below. Tap a card back to choose, tap again to undo.';
          else hint.textContent = 'Pick ' + left + ' more card' + (left > 1 ? 's' : '') + ' (' + picked.length + '/' + n + ' chosen). Tap again to undo.';
        }
      }
    } else {
      if (shuffleBtn) { shuffleBtn.classList.add('eoc-btn-reveal'); shuffleBtn.textContent = 'Reveal \\u2192'; }
      if (hint) hint.textContent = 'You have chosen ' + n + ' card' + (n > 1 ? 's' : '') + '. Revealing\\u2026';
      if (autoRevealTimer) { clearTimeout(autoRevealTimer); }
      autoRevealTimer = setTimeout(function () {
        autoRevealTimer = null;
        if (state === 'initial' && picked.length >= n) { revealAll(); }
      }, 500);
    }
  }

  // v10: Shuffle Again 按钮双功能 — 未选满=重新洗牌; 选满=Reveal 提前翻牌
  function onShuffleClick() {
    if (state === 'initial' && picked.length >= needed()) {
      if (autoRevealTimer) { clearTimeout(autoRevealTimer); autoRevealTimer = null; }
      revealAll();
    } else {
      shuffleDeck();
    }
  }

  function crystalImgHtml(c) {
    if (!c.img) return '<div class="eoc-card-img-ph"></div>';
    return '<img class="eoc-card-img" src="' + esc(c.img) + '" alt="' + esc(c.name) + ' crystal card" loading="lazy">';
  }
  function intentChips(c) {
    if (!c.intentions || !c.intentions.length) return '';
    return c.intentions.slice(0, 4).map(function (it) {
      return '<span class="eoc-chip eoc-chip-intent">' + esc(INTENT_LABEL[it] || it) + '</span>';
    }).join('');
  }
  function chakraChips(c) {
    if (!c.chakras || !c.chakras.length) return '';
    return c.chakras.slice(0, 4).map(function (ch) {
      return '<span class="eoc-chip eoc-chip-chakra">' + esc(CHAKRA_LABEL[ch] || ch) + '</span>';
    }).join('');
  }
  function guidanceText(c, intent, posLabel) {
    var intro = c.excerpt || (c.name + ' is a stone long valued for its gentle, supportive presence.');
    var intentLbl = (INTENT_MAP[intent] || {}).label || 'your intention';
    var posClause = posLabel ? (' In the ' + posLabel.toLowerCase() + ' position,') : '';
    return posClause + ' this crystal offers its qualities of ' + intentLbl.toLowerCase() + ' as something to sit with. '
      + intro + ' Let its appearance be a prompt: where in your life is this energy already asking for attention?';
  }

  function cardFrontHtml(c) {
    return '<div class="eoc-front-face">'
      + crystalImgHtml(c)
      + '<div class="eoc-front-name">' + esc(c.name) + '</div>'
      + '<div class="eoc-front-sub">Oracle Card</div>'
      + '</div>';
  }

  function singleCardHtml(cardIdx, posLabel, intent) {
    var c = CARDS[cardIdx];
    if (!c) return '';
    var chakraLine = c.chakras && c.chakras.length
      ? '<span class="eoc-meta-chip"><b>Chakra:</b> ' + esc(c.chakras.map(function (ch) { return CHAKRA_LABEL[ch] || ch; }).join(', ')) + '</span>' : '';
    var elementLine = c.element
      ? '<span class="eoc-meta-chip"><b>Element:</b> ' + esc(ELEMENT_LABEL[c.element] || c.element) + '</span>' : '';
    var posHtml = posLabel ? '<div class="eoc-card-pos">' + posLabel + '</div>' : '';
    var guidance = guidanceText(c, intent, posLabel);
    return '<div class="eoc-card">' + posHtml
      + '<div class="eoc-card-head">'
      + '<div class="eoc-card-headimg">' + crystalImgHtml(c) + '</div>'
      + '<div class="eoc-card-headtxt">'
      + '<div class="eoc-card-name">' + esc(c.name) + '</div>'
      + '<div class="eoc-card-role">Crystal Oracle Card</div>'
      + '<div class="eoc-card-chips">' + intentChips(c) + chakraChips(c) + '</div>'
      + '</div></div>'
      + '<div class="eoc-card-body">'
      + '<div class="eoc-meta-row">' + elementLine + chakraLine + '</div>'
      + '<div class="eoc-guidance-lbl">Guidance for ' + esc((INTENT_MAP[intent] || {}).label || 'you') + '</div>'
      + '<div class="eoc-guidance">' + esc(guidance) + '</div>'
      + '<div class="eoc-cta-row">'
      + '<a class="eoc-cta eoc-cta-primary" href="' + esc(c.shop) + '">Shop ' + esc(c.name) + ' &rarr;</a>'
      + (c.link ? '<a class="eoc-cta eoc-cta-sec" href="' + esc(c.link) + '">Read the ' + esc(c.name) + ' guide &rarr;</a>' : '')
      + '</div>'
      + '</div></div>';
  }

  function revealAll() {
    if (autoRevealTimer) { clearTimeout(autoRevealTimer); autoRevealTimer = null; }
    setStage('revealed');
    var spreadEl = document.getElementById('eoc-spread');
    var spread = spreadEl ? spreadEl.value : 'single';
    var intent = currentIntent();
    // 1) 选中牌背原地翻开显示水晶卡面
    for (var i = 0; i < picked.length; i++) {
      var pos = picked[i];
      var ci = deck[pos];
      var backEl = document.querySelector('#eoc-deck .eoc-card-back[data-pos="' + pos + '"]');
      if (backEl) {
        (function (el, card) {
          el.classList.add('flipped');
          setTimeout(function () { el.classList.add('eoc-is-front'); el.innerHTML = cardFrontHtml(card); }, 280);
        })(backEl, CARDS[ci]);
      }
    }
    // 2) 下方详细解读
    var holder = document.getElementById('eoc-revealed-cards');
    var res = document.getElementById('eoc-result');
    if (holder) holder.innerHTML = '';
    if (res) res.style.display = 'block';
    for (var j = 0; j < picked.length; j++) {
      var pos2 = picked[j];
      var ci2 = deck[pos2];
      var posLabel = spread === 'three' ? POSITIONS[j] : '';
      if (holder) holder.insertAdjacentHTML('beforeend', singleCardHtml(ci2, posLabel, intent));
    }
    var deckEl = document.getElementById('eoc-deck');
    if (deckEl) deckEl.classList.add('eoc-deck-done');
    var resetBtn = document.getElementById('eoc-reset-btn');
    if (resetBtn) resetBtn.style.display = 'inline-block';
    setTimeout(function () {
      var ff = document.querySelector('#eoc-deck .eoc-card-back.flipped');
      if (ff) { try { ff.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { } }
    }, 450);
  }

  function resetDraw() {
    if (autoRevealTimer) { clearTimeout(autoRevealTimer); autoRevealTimer = null; }
    buildDeck(); renderDeck(); picked = [];
    var deckEl = document.getElementById('eoc-deck'); if (deckEl) deckEl.classList.remove('eoc-deck-done');
    var holder = document.getElementById('eoc-revealed-cards'); if (holder) holder.innerHTML = '';
    var res = document.getElementById('eoc-result'); if (res) res.style.display = 'none';
    var resetBtn = document.getElementById('eoc-reset-btn'); if (resetBtn) resetBtn.style.display = 'none';
    var shuffleBtn = document.getElementById('eoc-shuffle-btn'); if (shuffleBtn) shuffleBtn.classList.remove('eoc-btn-reveal');
    setStage('initial');
    updatePickUI();
  }

  function init() {
    // v10: 初始即渲染 deck(用 guidance 意图作默认展示, 让用户进页面即见牌背);
    // focus(intent) select 仍是 placeholder 必选 — 点牌前必须先选 intent, 选了 intent 重建为该意图牌堆
    var intentEl0 = document.getElementById('eoc-intent');
    var defaultIntent = 'guidance';
    if (intentEl0) intentEl0.value = defaultIntent; // 临时设默认意图以渲染初始 deck
    buildDeck(); renderDeck();
    if (intentEl0) intentEl0.value = ''; // 恢复 placeholder 态(value="" 未选), 但 deck 已渲染可见
    var shBtn = document.getElementById('eoc-shuffle-btn');
    var rstBtn = document.getElementById('eoc-reset-btn');
    var intentEl = document.getElementById('eoc-intent');
    if (shBtn) shBtn.addEventListener('click', onShuffleClick);
    if (rstBtn) rstBtn.addEventListener('click', resetDraw);
    if (intentEl) intentEl.addEventListener('change', onIntentChange);
    setStage('initial');
    updatePickUI();
    window.EOC = { shuffle: shuffleDeck, pick: pickCard, reveal: revealAll, reset: resetDraw };
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();`;

let html = `<!-- ===== Earthward Crystal Oracle Cards v10 ===== -->
<div id="eoc-wrap">
  <h1 class="eoc-h1">Crystal Oracle Cards</h1>
  <p class="eoc-intro">A one-of-a-kind oracle deck where the cards are real crystals — not tarot archetypes. Choose an intention, then pick one or three cards from the deck cut from 390 stones. Each reveals a crystal with its meaning, chakra, and element, plus a direct link to bring it into your life. Let the stone that appears be a mirror for what is already asking for your attention.</p>

  <div class="eoc-input-row">
    <div class="eoc-field">
      <label class="eoc-field-lbl" for="eoc-intent">Your intention</label>
      <select id="eoc-intent">
        <option value="" disabled selected>Select your intention</option>
        <option value="love">Love &amp; Relationships</option>
        <option value="protection">Protection &amp; Grounding</option>
        <option value="wealth">Abundance &amp; New Paths</option>
        <option value="healing">Healing &amp; Calm</option>
        <option value="guidance">Inner Guidance</option>
      </select>
    </div>
    <div class="eoc-field">
      <label class="eoc-field-lbl" for="eoc-spread">Draw</label>
      <select id="eoc-spread">
        <option value="single">Single Card</option>
        <option value="three">Three Cards (Past — Present — Future)</option>
      </select>
    </div>
    <div class="eoc-field eoc-field-grow">
      <label class="eoc-field-lbl" for="eoc-question">Your question (optional)</label>
      <input id="eoc-question" type="text" placeholder="What do you want guidance on?" maxlength="120">
    </div>
  </div>

  <div class="eoc-deck" id="eoc-deck"></div>
  <p class="eoc-deck-count" id="eoc-deck-count"></p>

  <div class="eoc-ritual-bar">
    <div class="eoc-action-row">
      <button class="eoc-btn eoc-btn-ritual" id="eoc-shuffle-btn" type="button">Shuffle Again</button>
      <button class="eoc-btn eoc-btn-reset" id="eoc-reset-btn" type="button" style="display:none">Draw Again</button>
    </div>
    <p class="eoc-stage-hint" id="eoc-stage-hint">Select your intention, then pick your card from the spread above.</p>
  </div>

  <div class="eoc-result" id="eoc-result" style="display:none">
    <div id="eoc-revealed-cards"></div>
  </div>

  <p class="eoc-disclaim-top">${GENTLE}</p>
</div>
<style>
#eoc-wrap{font-size:16px;color:#1A1A2E}
.eoc-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.eoc-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}
.eoc-input-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.eoc-field{display:flex;flex-direction:column;gap:5px}
.eoc-field-grow{flex:1;min-width:220px}
.eoc-field-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#1B4332}
.eoc-input-row select,.eoc-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff;min-width:190px;font-family:inherit}
.eoc-field-grow input{width:100%;min-width:0}

.eoc-ritual-bar{background:#fff;padding:14px 0 4px;margin:14px 0 0;border-top:1px solid #EEE}
.eoc-action-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:center;margin-bottom:10px}
.eoc-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:12px 30px;font-size:15px;font-weight:600;cursor:pointer;height:46px;font-family:inherit}
.eoc-btn:hover:not(:disabled){background:#1B4332}
.eoc-btn:disabled{background:#BBB;cursor:not-allowed}
.eoc-btn-ritual{min-width:130px;transition:background .2s,border-color .2s,transform .2s}
/* v10: 选满态 Shuffle Again 按钮变 Reveal 高亮(金色脉冲) */
.eoc-btn-ritual.eoc-btn-reveal{background:#CFAA3E;color:#1A1A2E !important;border-color:#CFAA3E;font-weight:700;animation:eocPulse 1.6s ease-in-out infinite}
.eoc-btn-ritual.eoc-btn-reveal:hover{background:#B8902A;transform:translateY(-1px)}
.eoc-btn-reset{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.eoc-btn-reset:hover:not(:disabled){background:#F0F7F4}
@keyframes eocPulse{0%,100%{box-shadow:0 0 0 0 rgba(207,170,62,.5)}50%{box-shadow:0 0 0 8px rgba(207,170,62,0)}}
.eoc-stage-hint{color:#1B4332;font-size:15px;margin:0 auto;font-weight:500;padding:8px 16px;background:#F0F7F4;border-radius:8px;border-left:3px solid #2D6A4F;max-width:680px;text-align:center;transition:color .2s,background .2s,border-color .2s}
.eoc-stage-hint.eoc-hint-warn{color:#8B1A1A;background:#FFF0F0;border-color:#C83030;animation:eocHintShake .35s ease}
@keyframes eocHintShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.eoc-deck-count{color:#888;font-size:13px;margin:0 0 8px;text-align:center}
.eoc-disclaim-top{color:#888;font-size:13px;line-height:1.6;margin-top:22px;border-left:3px solid #DDD;padding-left:14px}

/* v10 牌背布局: flex 横向单排 + 左右滚动(大牌 150px), 金色滚动条 */
.eoc-deck{display:flex;gap:14px;overflow-x:auto;margin-bottom:8px;padding:10px 4px 18px;transition:opacity .4s;-webkit-overflow-scrolling:touch;scrollbar-color:#CFAA3E #F0F0E8}
.eoc-deck::-webkit-scrollbar{height:10px}
.eoc-deck::-webkit-scrollbar-track{background:#F0F0E8;border-radius:6px}
.eoc-deck::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#CFAA3E 0%,#B8902A 100%);border-radius:6px;border:1px solid #F0F0E8}
.eoc-deck::-webkit-scrollbar-thumb:hover{background:#B8902A}
.eoc-card-back{flex:0 0 150px;width:150px;height:225px;border-radius:12px;position:relative;background:linear-gradient(135deg,#1A1A2E 0%,#2D2D52 100%);border:2px solid #CFAA3E;box-shadow:0 4px 14px rgba(26,26,46,.22);transition:transform .25s,box-shadow .25s,border-color .25s;cursor:default;transform-origin:center bottom}
.eoc-card-back.eoc-enter{animation:eocEnter .45s ease backwards}
.eoc-back-inner{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.5);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#CFAA3E}

/* v10 水晶主题牌背(六棱柱水晶图形放大) */
.eoc-back-crystal{position:relative;width:62px;height:84px;margin-bottom:4px}
.eoc-crystal-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:21px solid transparent;border-right:21px solid transparent;border-bottom:21px solid rgba(127,209,168,.85)}
.eoc-crystal-face.eoc-crystal-m{position:absolute;top:18px;left:10px;width:42px;height:50px;background:linear-gradient(180deg,rgba(127,209,168,.7) 0%,rgba(207,170,62,.6) 100%);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.eoc-crystal-side.eoc-crystal-l{position:absolute;top:21px;left:0;width:14px;height:44px;background:rgba(45,106,79,.75);clip-path:polygon(100% 0,80% 0,100% 100%,30% 100%)}
.eoc-crystal-side.eoc-crystal-r{position:absolute;top:21px;right:0;width:14px;height:44px;background:rgba(45,106,79,.55);clip-path:polygon(0 0,20% 0,70% 100%,0 100%)}
.eoc-crystal-base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:21px solid transparent;border-right:21px solid transparent;border-top:12px solid rgba(45,106,79,.85)}
.eoc-back-spark{position:absolute;font-size:18px;color:rgba(207,170,62,.85);opacity:.8}
.eoc-back-label{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;text-align:center;line-height:1.2}
.eoc-deck:not(.eoc-deck-pickable) .eoc-card-back{opacity:.78}
.eoc-deck:not(.eoc-deck-pickable) .eoc-card-back:hover{transform:translateY(-8px);box-shadow:0 10px 22px rgba(26,26,46,.32);border-color:#7FD1A8;opacity:1}
.eoc-deck-pickable .eoc-card-back{cursor:pointer}
.eoc-deck-pickable .eoc-card-back:hover{transform:translateY(-10px);box-shadow:0 14px 28px rgba(26,26,46,.38);border-color:#7FD1A8}
.eoc-card-back.selected{border-color:#2D6A4F;box-shadow:0 0 0 3px rgba(45,106,79,.35),0 8px 18px rgba(26,26,46,.3);transform:translateY(-7px)}
.eoc-card-back.selected .eoc-back-inner{color:#7FD1A8}
.eoc-deck.eoc-deck-done{pointer-events:none}
.eoc-deck.eoc-deck-done .eoc-card-back:not(.flipped){opacity:.3}
.eoc-card-back.flipped{animation:eocFlipOver .55s ease}
.eoc-card-back.eoc-is-front{background:#fff;border-color:#2D6A4F;opacity:1 !important;cursor:default}
.eoc-front-face{position:absolute;inset:6px;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;background:#fff;padding:6px;text-align:center}
.eoc-card-img{width:100%;height:78%;object-fit:cover;border-radius:6px;background:#EEE}
.eoc-card-img-ph{width:100%;height:78%;border-radius:6px;background:linear-gradient(135deg,#7FD1A8,#CFAA3E)}
.eoc-front-name{font-size:14px;font-weight:700;color:#1A1A2E;line-height:1.15;padding:2px 4px}
.eoc-front-sub{font-size:9px;color:#888;letter-spacing:.08em;text-transform:uppercase}
@keyframes eocFlipOver{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.eoc-deck.eoc-shuffle-anim{animation:eocShuffle .55s ease}
@keyframes eocEnter{0%{transform:translateY(-14px) rotate(-3deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
@keyframes eocShuffle{0%{transform:translateX(0)}20%{transform:translateX(-8px) rotate(-1deg)}40%{transform:translateX(8px) rotate(1deg)}60%{transform:translateX(-6px) rotate(-.5deg)}80%{transform:translateX(6px) rotate(.5deg)}100%{transform:translateX(0) rotate(0)}}

/* 结果卡 */
.eoc-result{margin-top:8px}
.eoc-card{background:#fff;border:1px solid #EEE;border-radius:16px;padding:0;margin-bottom:22px;overflow:hidden;animation:eocReveal .5s ease}
@keyframes eocReveal{0%{opacity:0;transform:translateY(14px) rotateY(-12deg)}100%{opacity:1;transform:translateY(0) rotateY(0)}}
.eoc-card-pos{background:#F0F7F4;border-bottom:1px solid #EEE;padding:8px 22px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1B4332}
.eoc-card-head{background:#1A1A2E;padding:22px 26px;color:#fff;display:flex;gap:18px;align-items:center}
.eoc-card-headimg{flex:0 0 84px;width:84px;height:84px;border-radius:50%;overflow:hidden;border:2px solid #CFAA3E;background:#EEE}
.eoc-card-headimg img,.eoc-card-headimg .eoc-card-img-ph{width:100%;height:100%;object-fit:cover}
.eoc-card-headimg .eoc-card-img-ph{border-radius:0}
.eoc-card-headtxt{flex:1;min-width:0}
.eoc-card-name{font-size:28px;font-weight:700;line-height:1.1}
.eoc-card-role{font-size:14px;color:#CFAA3E;font-weight:600;margin-top:3px}
.eoc-card-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.eoc-chip{font-size:12px;font-weight:600;padding:3px 9px;border-radius:10px}
.eoc-chip-intent{background:rgba(127,209,168,.2);color:#7FD1A8;border:1px solid rgba(127,209,168,.4)}
.eoc-chip-chakra{background:rgba(207,170,62,.2);color:#E8C887;border:1px solid rgba(207,170,62,.4)}
.eoc-card-body{padding:22px 26px}
.eoc-meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.eoc-meta-chip{background:#FAFAFA;border:1px solid #EEE;border-radius:8px;padding:5px 11px;font-size:14px;color:#444}
.eoc-meta-chip b{color:#1A1A2E}
.eoc-guidance-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:6px}
.eoc-guidance{font-size:16px;color:#444;line-height:1.7;margin-bottom:18px}
.eoc-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.eoc-cta{display:inline-block;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600}
.eoc-cta-primary{background:#2D6A4F;color:#fff !important}
.eoc-cta-primary:hover{background:#1B4332}
.eoc-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.eoc-cta-sec:hover{background:#F0F7F4}

.eoc-seo-accordion{margin:32px 0 0}
.eoc-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.eoc-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.eoc-seo-details summary::-webkit-details-marker{display:none}
.eoc-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.eoc-seo-details[open] summary:after{content:'-'}
.eoc-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.eoc-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px}
.eoc-seo-content h2:first-child{margin-top:0}
.eoc-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
/* v10 平板: 保持 flex 横向滚动(大牌 150px), 牌稍小 130px */
@media(max-width:780px){
  .eoc-card-back{flex:0 0 130px;width:130px;height:195px}
  .eoc-card-head{flex-direction:column;text-align:center}
}
/* v10 移动: flex-wrap 换行 2-3 列(105px), 取消横向滚动 */
@media(max-width:640px){
  .eoc-h1{font-size:26px}.eoc-input-row select,.eoc-input-row input{min-width:150px;font-size:15px}.eoc-card-name{font-size:23px}
  .eoc-card-head{padding:18px}.eoc-card-body{padding:18px}
  .eoc-deck{flex-wrap:wrap;justify-content:center;overflow-x:visible;gap:10px}
  .eoc-card-back{flex:0 0 105px;width:105px;height:158px}
  .eoc-back-crystal{width:38px;height:52px}
  .eoc-btn{padding:12px 22px;font-size:14px;height:44px}
  .eoc-btn-ritual{min-width:110px}
  .eoc-stage-hint{font-size:14px}
}
</style>
<!-- JSON data in standalone application/json block -->
<script type="application/json" id="eoc-data">${DATA_BLOCK}</script>
<!-- executable JS Base64-encoded to survive WP wp_kses entity-escaping. Loader decodes + evals at runtime. -->
<script type="text/plain" id="eoc-app">__EOC_APP_B64__</script>
<script>
(function(){var b=document.getElementById('eoc-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EOC init failed',e);}})();
</script>
<!-- ===== Crystal Oracle Cards Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What are crystal oracle cards?","acceptedAnswer":{"@type":"Answer","text":"Crystal oracle cards are a divination and self-reflection deck where each card represents a real crystal rather than a tarot archetype. In this deck, every card is drawn from a library of 390 real stones, each paired with its meaning, chakra, element, and a direct link to shop it. You choose an intention, draw one or more cards, and read the crystal that appears as a prompt for reflection — not as a fixed prediction."}},
{"@type":"Question","name":"How do crystal oracle cards work?","acceptedAnswer":{"@type":"Answer","text":"You set an intention (such as love, protection, abundance, healing, or inner guidance), then pick one or three cards from a deck built from the crystals that match that intention. Each reveals a real crystal with its traditional meanings and associations. The crystal that appears is read as a mirror for what is already asking for your attention — a starting point for contemplation, never a substitute for professional advice."}},
{"@type":"Question","name":"What is the difference between crystal oracle cards and tarot cards?","acceptedAnswer":{"@type":"Answer","text":"Tarot uses a fixed set of 78 archetypal cards (22 Major Arcana and 56 Minor Arcana) with prescribed upright and reversed meanings. Crystal oracle cards are open-ended: instead of archetypes, each card is a real stone with its own properties, and the deck is rebuilt from up to 390 crystals filtered by your intention. Tarot asks you to read a symbol; a crystal oracle invites you to connect with a specific stone you can actually hold or wear."}},
{"@type":"Question","name":"How does a crystal choose me in an oracle reading?","acceptedAnswer":{"@type":"Answer","text":"Because the deck is shuffled at random, the crystal that appears is genuinely a matter of chance — yet practitioners believe the stone that shows up often resonates with something you are already working through. Treat it as a prompt: read the crystal's meaning, notice which part of it lands, and ask yourself where that energy is already present in your life. Personal resonance matters more than any rule."}},
{"@type":"Question","name":"Can I buy the crystal from my oracle reading?","acceptedAnswer":{"@type":"Answer","text":"Yes. Every card in this deck links directly to the crystal's shop page, so you can bring the stone that appeared into your daily life as jewelry or a raw piece. Wearing or holding the crystal while you reflect on your reading is a way to keep its theme present through the day."}}
]}
]}
</script>
<!-- ===== End Crystal Oracle Cards v10 ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Crystal Oracle Cards SEO Accordion ===== -->
<section class="eoc-seo-accordion" aria-label="Crystal oracle cards guide">
  <details class="eoc-seo-details">
    <summary>Learn More About Crystal Oracle Cards</summary>
    <div class="eoc-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Crystal Oracle Cards SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'crystal-oracle-cards.html');
function asciiEscape(s) { return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');
html = html.replace('__EOC_APP_B64__', APP_B64);
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, function (full, open, inner, close) {
  return open + asciiEscape(inner) + close;
});
fs.writeFileSync(OUT, html, 'utf8');
console.log('Crystal Oracle Cards v10 generated:', OUT, '|', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB |', CARDS.length, 'crystals | intents:', Object.keys(INTENT_MAP).join(','), '| deck sizes:', Object.keys(INTENT_INDEX).map(function (k) { return k + '=' + INTENT_INDEX[k].length; }).join(' '), '|', APP_B64.length, 'b64 chars');
