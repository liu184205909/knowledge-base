/**
 * AI Dream Interpreter — generate.js (M3.5 丰富版)
 * 生成 wp:html: Hero 工具 + How We Interpret 方法论 + FAQ accordion + Common Symbols 30 网格 + Dream Types + Crystals for Dreams Hub + Privacy/Safety + base64
 * 30 symbols 从 core-dream-symbols.json v1.2 派生(链 /{slug}-dream-meaning/ 文章, 文章生产中接受临时 404)
 * 跑: 在 build/ 目录  node generate.js
 */
const fs = require('fs');
const path = require('path');

const APP = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const INDEX = fs.readFileSync(path.join(__dirname, '..', 'data', 'public-symbol-index.json'), 'utf8');
const CORE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'core-dream-symbols.json'), 'utf8')).symbols;
const APP_B64 = Buffer.from(APP).toString('base64');
const INDEX_B64 = Buffer.from(INDEX).toString('base64');

// Only link to verified production assets. Unmapped symbols remain useful as tool launchers.
const ARTICLE_MAP = {
  'teeth falling out': '/teeth-falling-out-dream-spiritual-meaning/',
  'snake': '/snake-dream-meaning/',
  'flying': '/flying-dream-spiritual-meaning/',
  'being chased': '/being-chased-dream-meaning/',
  'cat': '/cat-dream-meaning/',
  'blood': '/blood-dream-meaning/',
  'tornado': '/tornado-dream-meaning/',
  'water': '/water-dream-spiritual-meaning/',
  'death': '/death-dream-biblical-meaning/',
  'being pregnant': '/i-was-pregnant-dream-meaning/',
  'money': '/money-dream-spiritual-meaning/',
  'bear': '/bear-dream-meaning/',
  'spider': '/spiders-dream-spiritual-meaning/',
  'drowning': '/drowning-dream-meaning/',
  'being lost': '/being-lost-dream-spiritual-meaning/',
  'hair falling out': '/hair-loss-dream-spiritual-meaning/',
  'frog': '/frogs-dream-meaning/',
  'bird': '/birds-dream-spiritual-meaning/'
};

// ---- 30 symbols 网格(core 派生, URL 规则 /{slug}-dream-meaning/, 对齐 2A §二 dream subject 根级 post) ----
function symSlug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
const symbolsGrid = CORE.filter(function (s) { return !!ARTICLE_MAP[s.symbol]; }).map(function (s) {
  var url = ARTICLE_MAP[s.symbol];
  return '<a class="edi-symcard" href="' + url + '"><span class="edi-symcat">' + s.category + '</span><span class="edi-symname">' + s.symbol + '</span><span class="edi-symaction">Read meaning</span></a>';
}).join('\n      ');

const HTML = `<!-- wp:html -->
<div class="edi-wrap">

  <!-- ============ HERO 工具区 ============ -->
  <div class="edi-hero">
    <h1>AI Dream Interpreter</h1>
    <p class="edi-sub">Free &middot; Anonymous &middot; Crystal-Infused Insights</p>
    <form id="edi-form" class="edi-form">
      <label for="edi-dream" style="display:block;font-weight:600;margin-bottom:6px">Describe your dream</label>
      <textarea id="edi-dream" maxlength="4000" rows="6" placeholder="What did you dream last night? Write as much as you remember — the people, places, feelings, and symbols."></textarea>
      <div class="edi-suggest" id="edi-suggest"></div>
      <div class="edi-map-preview" id="edi-map-preview" aria-live="polite"></div>
      <details class="edi-recall"><summary>Add details for a richer reading <em>optional</em></summary><div><input id="edi-person" maxlength="120" placeholder="Who was there?"><input id="edi-place" maxlength="120" placeholder="Where were you?"><input id="edi-action" maxlength="120" placeholder="What happened?"><input id="edi-afterfeel" maxlength="120" placeholder="How did you feel on waking?"></div></details>
      <div class="edi-opts">
        <label>Feeling
          <select id="edi-emotion">
            <option value="balanced">Balanced</option><option value="calm">Calm</option><option value="afraid">Afraid</option>
            <option value="confused">Confused</option><option value="sad">Sad</option><option value="excited">Excited</option><option value="intense">Intense</option>
          </select>
        </label>
        <label>Lens
          <select id="edi-lens">
            <option value="balanced">Balanced</option><option value="psychological">Psychological</option>
            <option value="spiritual">Spiritual</option><option value="crystal-focused">Crystal-Focused</option>
          </select>
        </label>
      </div>
      <input type="text" name="edi_hp" id="edi-hp" value="" autocomplete="off" tabindex="-1" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px">
      <button type="submit" id="edi-submit">Interpret My Dream</button>
      <p class="edi-privacy">Your dream text is sent to a third-party AI service to generate this reflection. We do not store it, and no account is needed.</p>
    </form>
  </div>

  <div class="edi-loading" id="edi-loading" hidden>
    <div class="edi-skeleton"></div>
    <p id="edi-loading-text">Reading the symbols&hellip;</p>
  </div>
  <div class="edi-error" id="edi-error" hidden></div>

  <div class="edi-result" id="edi-result" hidden>
    <section class="edi-mod"><h2>Your Dream, Reflected</h2><div id="edi-summary" class="edi-summary-copy"></div></section>
    <section class="edi-mod"><h3>Symbols Found</h3><div id="edi-symbols"></div></section>
    <section class="edi-mod"><h3>Psychological Lens</h3><div id="edi-psychological"></div></section>
    <section class="edi-mod"><h3>Spiritual Lens</h3><div id="edi-spiritual"></div></section>
    <section class="edi-mod"><h3>Crystal Match</h3><div id="edi-crystals" class="edi-crystals"></div></section>
    <section class="edi-mod"><h3>Reflection Prompt</h3><div id="edi-reflection"></div></section>
    <section class="edi-mod" id="edi-related-section" hidden><h3>Related Dream Meanings</h3><div id="edi-related" class="edi-symgrid"></div></section>
    <p class="edi-safety" id="edi-safety" hidden></p>
    <section class="edi-deepen"><h3>Deepen the reflection</h3><p>Add one detail and receive a more contextual reading. Nothing is saved.</p><div class="edi-followups" id="edi-followups"></div></section>
    <button class="edi-snapshot" id="edi-snapshot" type="button">Download private reflection</button>
  </div>

  <!-- ============ How We Interpret Dreams 方法论区(AIO + 信任) ============ -->
  <section class="edi-method">
    <h2>How We Interpret Dreams</h2>
    <p>Every dream is personal — there is no universal dictionary where one symbol means the same thing for everyone. Our AI dream interpreter draws on three reflective lenses:</p>
    <div class="edi-method-grid">
      <div class="edi-method-card"><h4>Psychological</h4><p>Jungian archetypes and modern reflection — what inner process (transition, avoidance, integration) the dream may mirror.</p></div>
      <div class="edi-method-card"><h4>Spiritual &amp; Cultural</h4><p>How traditions across cultures have read the same symbol — without issuing any religious ruling.</p></div>
      <div class="edi-method-card"><h4>Crystal</h4><p>A gentle ritual focus — a stone you can hold while journaling. Never a treatment, cure, or guarantee.</p></div>
    </div>
    <p class="edi-method-note">What this tool is <strong>not</strong>: it does not diagnose mental or physical illness, predict death, pregnancy, or betrayal, issue religious rulings, or promise that any crystal will cure or protect. If a dream feels distressing or recurs in a way that affects your wellbeing, please speak with a qualified professional.</p>
  </section>

  <!-- ============ FAQ accordion(PAA, 原生 details, 无宗教诱导) ============ -->
  <section class="edi-faq">
    <h2>Frequently Asked Questions</h2>
    <details><summary>Can AI interpret dreams?</summary><p>AI can surface symbolic and psychological lenses drawn from dream traditions, but no interpretation is definitive. Dreams are personal — treat any reading as a starting point for your own reflection, not a verdict.</p></details>
    <details><summary>Is this AI dream interpreter free?</summary><p>Yes — free, and no sign-up needed. There is a daily limit per person to keep the service sustainable.</p></details>
    <details><summary>Can ChatGPT interpret dreams?</summary><p>General chatbots can, but they are not tuned for dream work or compliance. This tool is built specifically for reflective dream interpretation, with safety boundaries (no diagnosis, no prophecy, no religious rulings) and a crystal ritual layer unique to our site.</p></details>
    <details><summary>Are dream meanings always accurate?</summary><p>No. Dream symbols are subjective and context-dependent. A snake may mean transformation for one person and a hidden threat for another. "Accuracy" here means honest, reflective framing — not a fixed answer.</p></details>
    <details><summary>Can crystals help with dream recall?</summary><p>Crystals are used as tactile cues for intention and journaling — for example, placing amethyst by the bed as a nightly ritual. They are not a treatment, cure, or guarantee of any outcome.</p></details>
    <details><summary>Does this replace professional advice?</summary><p>No. This is reflective content for self-inquiry. It is not medical, psychological, legal, or financial advice, and not a substitute for a qualified professional.</p></details>
  </section>

  <!-- ============ Common Dream Symbols 30 网格(core 派生, 内容矩阵入口) ============ -->
  <section class="edi-symbols">
    <h2>Common Dream Symbols</h2>
    <p>Explore deeper meanings for the symbols people dream about most — each one connects to a full interpretation.</p>
    <div class="edi-symgrid">
      ${symbolsGrid}
    </div>
  </section>

  <!-- ============ Dream Types(轻量 4 卡, Should) ============ -->
  <!-- ============ Crystals for Dreams Hub(差异化闭环) ============ -->
  <section class="edi-hub">
    <h2>Dreams &rarr; Energy &rarr; Crystal Ritual</h2>
    <p>After your reading, the tool suggests crystals that match the dream's emotional tone — as a ritual focus for journaling or bedside reflection, never as a treatment. Explore stones for dream recall, lucid dreaming, nightmare ease, and restful sleep.</p>
    <a class="edi-hub-cta" href="/crystals-for-dreams/">Explore Crystals for Dreams &rarr;</a>
  </section>

  <!-- ============ Privacy + Safety ============ -->
  <section class="edi-safety-section">
    <h2>Safety &amp; Privacy</h2>
    <p>Your dream text is sent to a third-party AI service (DeepSeek) to generate this reflection in the moment. <strong>We do not store your dream text</strong>, and no account is needed.</p>
    <p>This tool offers reflective, symbolic interpretations only. It is <strong>not</strong> medical or psychological diagnosis, not a prediction of future events, and not a religious ruling. If recurring dreams or nightmares affect your wellbeing, please reach out to a qualified professional or a trusted support line.</p>
  </section>

</div>

<script type="text/plain" id="edi-index">${INDEX_B64}</script>
<script>window.EDI_ARTICLE_MAP = ${JSON.stringify(ARTICLE_MAP)};</script>
<script type="text/plain" id="edi-app">${APP_B64}</script>
<script>
window.EDI_AJAX_URL = (typeof EDI_WP !== 'undefined' && EDI_WP.ajaxUrl) ? EDI_WP.ajaxUrl : '/wp-admin/admin-ajax.php';
(function(){try{var s=atob(document.getElementById('edi-app').textContent);(0,eval)(s);}catch(e){console.error('EDI init failed',e);}})();
</script>
<!-- /wp:html -->`;

fs.writeFileSync(path.join(__dirname, 'ai-dream-interpreter.html'), HTML);
console.log('Generated ai-dream-interpreter.html (M3.5 丰富版)');
console.log('  app.js base64:', APP_B64.length, '| index base64:', INDEX_B64.length, '| symbols 网格:', CORE.length, '卡');
