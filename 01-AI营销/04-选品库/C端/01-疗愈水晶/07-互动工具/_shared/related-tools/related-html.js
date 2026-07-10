/**
 * Earthward Related Tools — shared HTML generator.
 * Single source for: (a) the wp_footer Code Snippet (snippet.php mirrors this config),
 * (b) inject-root-pages.js (for the 3 root-level pages that bypass wp_footer),
 * (c) each generate.js can also require this to bake related into HTML at build time.
 *
 * relatedHtml(slug) returns the full <style>+<section> HTML for that tool's 2-3 recommendations.
 */
const HOME = 'https://goearthward.com/';

const TOOLS = {
  'crystal-tarot-reading':         { t: 'Crystal Tarot Reading',   u: '/tools/crystal-tarot-reading/',          d: 'Draw cards and decode their meaning with matching crystals', i: '🔮' },
  'yes-no-tarot':                  { t: 'Yes or No Tarot',          u: '/tools/yes-no-tarot/',                    d: 'A clear yes, no, or maybe from a single card', i: '✅' },
  'crystal-oracle-cards':          { t: 'Crystal Oracle Cards',     u: '/tools/crystal-oracle-cards/',            d: 'Pull a crystal oracle card for instant guidance', i: '🔮' },
  'tarot-birth-card':              { t: 'Tarot Birth Card',         u: '/tools/tarot-birth-card/',                d: 'Calculate your two lifetime tarot birth cards', i: '🎂' },
  'ai-tarot-chat':                 { t: 'AI Tarot Chat',            u: '/tools/ai-tarot-chat/',                   d: 'Chat with an AI tarot reader about anything on your heart', i: '💬' },
  'zodiac-compatibility-checker':  { t: 'Zodiac Compatibility',     u: '/tools/zodiac-compatibility-checker/',   d: 'Check the compatibility between two zodiac signs', i: '♊' },
  'chinese-zodiac-checker':        { t: 'Chinese Zodiac Checker',   u: '/tools/chinese-zodiac-checker/',         d: 'Find your Chinese zodiac animal and lucky crystals', i: '🐉' },
  'numerology-calculator':         { t: 'Life Path Calculator',     u: '/tools/numerology-calculator/',          d: 'Calculate your life path number and its stones', i: '🔢' },
  'birthstone-finder':             { t: 'Birthstone Finder',        u: '/tools/birthstone-finder/',              d: 'Discover your birthstone by month', i: '💎' },
  'moon-calendar':                 { t: 'Moon Phase Calendar',      u: '/tools/moon-calendar/',                  d: 'Track moon phases and the crystals for each phase', i: '🌕' },
  'crystal-quiz':                  { t: 'Crystal Quiz',             u: '/tools/crystal-quiz/',                   d: 'Find your perfect crystal by color', i: '✨' },
  'chakra-test':                   { t: 'Chakra Test',              u: '/tools/chakra-test/',                    d: 'Find which of your seven chakras is blocked', i: '🌈' },
  'element-test':                  { t: 'Element Test',             u: '/tools/element-test/',                   d: 'Discover your dominant elemental energy', i: '🔥' },
  'crystal-compatibility-checker': { t: 'Crystal Compatibility',    u: '/tools/crystal-compatibility-checker/',  d: 'Check whether two crystals work together', i: '🤝' },
  'crystal-meaning-search':        { t: 'Crystal Meaning Search',   u: '/crystal-meaning-search/',               d: 'Search 390 crystal meanings and properties', i: '🔍' },
  'crystal-cleansing-timer':       { t: 'Cleansing Timer',          u: '/tools/crystal-cleansing-timer/',        d: 'Time and schedule your crystal cleansing', i: '⏱️' },
  'bracelet-size-calculator':      { t: 'Bracelet Size Calculator', u: '/bracelet-size-calculator/',             d: 'Find your perfect bracelet fit', i: '📿' },
  'ring-size-calculator':          { t: 'Ring Size Calculator',     u: '/ring-size-calculator/',                 d: 'Find your ring size in any system', i: '💍' },
  'crystal-bracelet-builder':      { t: 'Crystal Bracelet Builder', u: '/tools/crystal-bracelet-builder/',        d: 'Design bead by bead', i: '📿' },
  'daily-tarot':                   { t: 'Daily Tarot',              u: '/tools/daily-tarot/',                     d: "Today's tarot card and crystal for the whole community", i: '🌅' },
  'mbti-tarot':                    { t: 'MBTI Tarot',               u: '/tools/mbti-tarot/',                      d: 'Find your MBTI tarot birth card and crystals', i: '🧬' },
  'ai-dream-interpreter':          { t: 'AI Dream Interpreter',     u: '/tools/ai-dream-interpreter/',            d: 'Decode your dream with AI and matching crystals', i: '🌙' },
};

const MAP = {
  'crystal-tarot-reading':         ['ai-tarot-chat', 'daily-tarot', 'yes-no-tarot'],
  'yes-no-tarot':                  ['crystal-tarot-reading', 'ai-tarot-chat', 'tarot-birth-card'],
  'crystal-oracle-cards':          ['crystal-tarot-reading', 'ai-tarot-chat', 'crystal-quiz'],
  'tarot-birth-card':              ['crystal-tarot-reading', 'ai-tarot-chat', 'mbti-tarot'],
  'ai-tarot-chat':                 ['crystal-tarot-reading', 'daily-tarot', 'tarot-birth-card'],
  'zodiac-compatibility-checker':  ['chinese-zodiac-checker', 'numerology-calculator', 'moon-calendar'],
  'chinese-zodiac-checker':        ['zodiac-compatibility-checker', 'birthstone-finder', 'numerology-calculator'],
  'numerology-calculator':         ['tarot-birth-card', 'mbti-tarot', 'chinese-zodiac-checker'],
  'birthstone-finder':             ['chinese-zodiac-checker', 'numerology-calculator', 'moon-calendar'],
  'moon-calendar':                 ['daily-tarot', 'birthstone-finder', 'crystal-cleansing-timer'],
  'daily-tarot':                   ['crystal-tarot-reading', 'ai-tarot-chat', 'moon-calendar'],
  'mbti-tarot':                    ['tarot-birth-card', 'numerology-calculator', 'crystal-quiz'],
  'crystal-quiz':                  ['chakra-test', 'mbti-tarot', 'crystal-bracelet-builder'],
  'chakra-test':                   ['crystal-quiz', 'element-test', 'crystal-cleansing-timer'],
  'element-test':                  ['crystal-quiz', 'chakra-test', 'crystal-compatibility-checker'],
  'crystal-compatibility-checker': ['crystal-quiz', 'crystal-meaning-search', 'chakra-test'],
  'crystal-meaning-search':        ['crystal-compatibility-checker', 'crystal-quiz', 'crystal-cleansing-timer'],
  'crystal-cleansing-timer':       ['crystal-meaning-search', 'moon-calendar', 'chakra-test'],
  'bracelet-size-calculator':      ['ring-size-calculator', 'crystal-quiz', 'crystal-bracelet-builder'],
  'ring-size-calculator':          ['bracelet-size-calculator', 'crystal-quiz', 'crystal-bracelet-builder'],
  'crystal-bracelet-builder':      ['bracelet-size-calculator', 'crystal-meaning-search', 'crystal-quiz'],
  'ai-dream-interpreter':          ['ai-tarot-chat', 'mbti-tarot', 'numerology-calculator'],
};

const CSS = ''
  + '.ew-related{margin:40px 0 8px;padding:24px;background:#FAFAFA;border:1px solid #E8E2D5;border-radius:14px}'
  + '.ew-rl-h{font-size:22px;font-weight:700;color:#1A1A2E;margin:0 0 4px;letter-spacing:.01em}'
  + '.ew-rl-sub{font-size:14px;color:#5A5A6E;margin:0 0 16px}'
  + '.ew-rl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}'
  + '.ew-rl-card{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#fff;border:1px solid #E8E2D5;border-radius:10px;text-decoration:none;color:#1A1A2E;transition:border-color .2s,box-shadow .2s,transform .15s}'
  + '.ew-rl-card:hover{border-color:#CFAA3E;box-shadow:0 4px 12px rgba(26,26,46,.08);transform:translateY(-2px)}'
  + '.ew-rl-ico{font-size:26px;flex-shrink:0;line-height:1}'
  + '.ew-rl-tx{display:flex;flex-direction:column;gap:3px;min-width:0}'
  + '.ew-rl-tx strong{font-size:15px;font-weight:700;color:#1A1A2E;line-height:1.25}'
  + '.ew-rl-tx em{font-size:13px;font-style:normal;color:#5A5A6E;line-height:1.35}'
  + '@media(max-width:768px){.ew-rl-grid{grid-template-columns:1fr}}';

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function relatedHtml(slug) {
  const recs = MAP[slug];
  if (!recs) return '';
  let cards = '';
  recs.forEach(function (rk) {
    const t = TOOLS[rk];
    if (!t) return;
    const href = HOME + t.u.replace(/^\//, '');
    cards += '<a class="ew-rl-card" href="' + href + '">'
      + '<span class="ew-rl-ico">' + t.i + '</span>'
      + '<span class="ew-rl-tx"><strong>' + escapeHtml(t.t) + '</strong><em>' + escapeHtml(t.d) + '</em></span>'
      + '</a>';
  });
  if (!cards) return '';
  return '<style>' + CSS + '</style>'
    + '<section class="ew-related"><h2 class="ew-rl-h">Keep exploring</h2>'
    + '<p class="ew-rl-sub">More free tools to guide your journey</p>'
    + '<div class="ew-rl-grid">' + cards + '</div></section>';
}

module.exports = { relatedHtml, TOOLS, MAP, CSS };
