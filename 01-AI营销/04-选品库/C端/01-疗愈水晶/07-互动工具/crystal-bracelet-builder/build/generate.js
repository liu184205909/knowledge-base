/**
 * DEPRECATED: use generate-deploy.js as the canonical generator.
 *
 * T17 Crystal Bracelet Builder — Step 2 generator (interaction completeness).
 *
 * LOCAL PROTOTYPE ONLY (not WP-deployed). Built on top of the Step 1 generator;
 * Step 2 layers on the interaction/material/UX completeness the PRD requires:
 *   - F8 numeric wrist input (cm/in toggle) + slider + measurement-teach SVG +
 *       live suggested-bead-count readout (PRD R3 circumference formula)
 *   - F1 pointer-drag reorder along the ring + drag-out-to-delete, with
 *       OrbitControls event arbitration (PRD R6, Annflora pattern)
 *   - F3 charm: refined canvas glyphs + GLTFLoader framework that swaps in a
 *       .glb when charm.model_url is set, falling back to the 2D coin (PRD R7)
 *   - F4 cord material differentiation — thickness + procedural braid texture +
 *       metalness/roughness (elastic / braided / silver), not just colour
 *   - localStorage toast on draft restore + version-expiry reset (PRD R9)
 *
 * Outputs:
 *   - ../data/parts.json    (front-end component library)
 *   - ../data/prices.json   (back-end price truth; ready for Step 3 Woo recalc)
 *   - ./crystal-bracelet-builder.html  (local prototype)
 *
 * Run: node generate.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'data', 'parts-source.json');
const PARTS_PATH = path.join(ROOT, 'data', 'parts.json');
const PRICES_PATH = path.join(ROOT, 'data', 'prices.json');
const OUT_PATH = path.join(__dirname, 'crystal-bracelet-builder-step2-local-only.html');
const VENDOR_DIR = path.join(__dirname, 'vendor');
// Absolute file:// URL for the vendor dir, so Chromium's file:// origin can
// resolve bare-specifier imports via the importmap regardless of the HTML's
// own location. Backslashes -> forward slashes, leading slash after drive.
const VENDOR_FILE_URL = 'file:///' + VENDOR_DIR.replace(/\\/g, '/') + '/';

const source = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf8'));

function fail(msg) { throw new Error('[T17 build] ' + msg); }
function assertArray(name, value, min) {
  if (!Array.isArray(value) || value.length < min) fail(name + ' must contain at least ' + min + ' items');
}

// PRD R5: single source of truth — validate, then derive parts.json + prices.json
function validateSource(data) {
  assertArray('beads', data.beads, 20);
  assertArray('charms', data.charms, 7);
  assertArray('cords', data.cords, 3);
  assertArray('presets', data.presets, 6);
  const beadIds = new Set();
  data.beads.forEach((b) => {
    if (!b.id || beadIds.has(b.id)) fail('duplicate or missing bead id: ' + b.id);
    beadIds.add(b.id);
    if (!Array.isArray(b.sizes) || b.sizes.length !== 4) fail(b.id + ' must have exactly 4 sizes');
    [6, 8, 10, 12].forEach((size) => {
      const row = b.sizes.find((s) => s.size_mm === size);
      if (!row || typeof row.price !== 'number') fail(b.id + ' missing price for ' + size + 'mm');
    });
    if (!Array.isArray(b.textureColors) || b.textureColors.length < 3) fail(b.id + ' missing textureColors');
  });
  const charmIds = new Set();
  data.charms.forEach((c) => {
    if (!c.id || charmIds.has(c.id)) fail('duplicate or missing charm id: ' + c.id);
    charmIds.add(c.id);
    if (typeof c.price !== 'number') fail(c.id + ' missing charm price');
  });
  const cordIds = new Set();
  data.cords.forEach((c) => {
    if (!c.id || cordIds.has(c.id)) fail('duplicate or missing cord id: ' + c.id);
    cordIds.add(c.id);
    if (typeof c.price !== 'number') fail(c.id + ' missing cord price');
  });
  data.presets.forEach((p) => {
    if (!p.id || !Array.isArray(p.stones) || !p.stones.length) fail('invalid preset: ' + p.id);
    p.stones.forEach((id) => { if (!beadIds.has(id)) fail('preset ' + p.id + ' references unknown bead ' + id); });
  });
}

function compactParts(data) {
  return {
    schemaVersion: data.schemaVersion,
    partsVersion: data.partsVersion,
    settings: data.settings,
    beads: data.beads,
    charms: data.charms,
    cords: data.cords,
    presets: data.presets
  };
}

function buildPrices(data) {
  const prices = {
    schemaVersion: data.schemaVersion,
    partsVersion: data.partsVersion,
    currency: data.settings.currency,
    beads: {}, charms: {}, cords: {}
  };
  data.beads.forEach((b) => {
    prices.beads[b.id] = {};
    b.sizes.forEach((s) => { prices.beads[b.id][String(s.size_mm)] = s.price; });
  });
  data.charms.forEach((c) => { prices.charms[c.id] = c.price; });
  data.cords.forEach((c) => { prices.cords[c.id] = c.price; });
  return prices;
}

validateSource(source);
const parts = compactParts(source);
const prices = buildPrices(source);
fs.writeFileSync(PARTS_PATH, JSON.stringify(parts, null, 2), 'utf8');
fs.writeFileSync(PRICES_PATH, JSON.stringify(prices, null, 2), 'utf8');

// Local prototype: inline the parts JSON as ascii-escaped application/json block.
// (No base64 wrapping needed — this HTML never goes through wp_kses_post.)
const DATA_BLOCK = JSON.stringify(parts).replace(/<\//g, '<\\/');

// ---------------------------------------------------------------------------
// Application JS (runs as a native ES module — no eval, no base64).
// ---------------------------------------------------------------------------
const APP_JS = String.raw`(function () {
  'use strict';

  // Three.js is loaded dynamically so the UI (which does not need THREE) always
  // renders even if the module fetch fails (e.g. file:// origin restrictions
  // in some Chromium builds). 3D is progressive enhancement.
  var THREE = null;
  var OrbitControls = null;

  var parts = JSON.parse(document.getElementById('t17-data').textContent);
  var settings = parts.settings || {};
  var STORAGE_KEY = 't17-step1-draft';

  var beadMap = indexBy(parts.beads);
  var charmMap = indexBy(parts.charms);
  var cordMap = indexBy(parts.cords);

  var state = {
    wristCm: settings.defaultWristCm || 16,
    wristUnit: 'cm',       // F8: cm | in
    beadSizeMm: settings.defaultBeadSizeMm || 8,
    cord: 'elastic_black',
    sequence: [],          // [{type:'bead',id,size_mm} | {type:'charm',id,slotWeight}]
    selected: -1,
    filterColor: 'all'
  };

  // --- 3D globals ---
  var renderer, scene, camera, controls, braceletGroup, ringGroup;
  var textureCache = {};
  var beadMeshes = [];     // parallel to sequence bead entries (charm meshes tracked separately)
  var slotMeshIndex = [];  // for each sequence index -> mesh (or null for non-mesh items)

  function indexBy(list) { var o = {}; (list || []).forEach(function (i) { o[i.id] = i; }); return o; }
  function money(v) { return '$' + Number(v || 0).toFixed(2); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function uniq(a) { return Array.from(new Set(a)); }

  // --- Sizing (PRD R3: target inner circumference) ---
  function targetCm() { return Number(state.wristCm) + Number(settings.fitAllowanceCm || 1.5); }
  function targetSlots() { return Math.max(6, Math.round(targetCm() * 10 / Number(state.beadSizeMm))); }
  function usedSlots() {
    return state.sequence.reduce(function (s, it) {
      return s + (it.type === 'charm' ? Number(it.slotWeight || 1) : 1);
    }, 0);
  }
  function canAdd(weight) { return usedSlots() + (weight || 1) <= targetSlots(); }

  // F8: cm <-> inch conversion (1 inch = 2.54cm exactly). Round to .25 for inch display.
  function cmToIn(cm) { return Math.round((Number(cm) / 2.54) * 4) / 4; }
  function inToCm(inch) { return Number(inch) * 2.54; }
  // F8 (PRD R3): suggested bead count using the true bead-spacing formula.
  // Each bead contributes π × diameter along the inner circumference (the bead
  // spans its own diameter across the ring but the cord wraps the inner half),
  // so N = floor((wristCm + fitAllowanceCm) / (beadSizeMm × 0.1 × π)).
  function suggestedBeadCount() {
    var perimeter = targetCm();                       // cm
    var beadCirc = Number(state.beadSizeMm) * 0.1 * Math.PI; // cm per bead
    if (!(beadCirc > 0)) return 0;
    return Math.max(1, Math.floor(perimeter / beadCirc));
  }

  // --- Pricing ---
  function beadPrice(id, size) {
    var b = beadMap[id]; if (!b) return 0;
    var row = b.sizes.find(function (s) { return Number(s.size_mm) === Number(size); });
    return row ? Number(row.price) : 0;
  }
  function totalPrice() {
    var t = cordMap[state.cord] ? Number(cordMap[state.cord].price) : 0;
    state.sequence.forEach(function (it) {
      if (it.type === 'bead') t += beadPrice(it.id, it.size_mm || state.beadSizeMm);
      else if (charmMap[it.id]) t += Number(charmMap[it.id].price || 0);
    });
    return t;
  }

  // --- Color tab mapping (PRD 7-color narrative) ---
  var COLOR_TABS = [
    { id: 'all', label: 'All' },
    { id: 'purple', label: 'Purple' },
    { id: 'pink', label: 'Pink' },
    { id: 'red', label: 'Pink/Red' },
    { id: 'orange', label: 'Orange' },
    { id: 'yellow', label: 'Yellow' },
    { id: 'gold', label: 'Gold' },
    { id: 'green', label: 'Green' },
    { id: 'blue', label: 'Blue' },
    { id: 'black', label: 'Black' },
    { id: 'clear', label: 'Clear' },
    { id: 'white', label: 'White' },
    { id: 'multi', label: 'Rainbow' }
  ];
  function beadMatchesColor(b, color) {
    if (color === 'all') return true;
    return (b.color || []).indexOf(color) >= 0;
  }

  // --- Procedural crystal texture (canvas) — shared by 3D bead + 2D thumbnail ---
  // Per-stone textureColors drives base/band/speckle so each stone reads distinct.
  function makeBeadTexture(bead) {
    var key = bead.id;
    if (textureCache[key]) return textureCache[key];
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var ctx = c.getContext('2d');
    var col = bead.textureColors || ['#888', '#ddd', '#222'];
    var base = col[0], light = col[1], dark = col[2];
    // lit-from-one-side radial gradient baked in
    var g = ctx.createRadialGradient(92, 80, 14, 128, 128, 180);
    g.addColorStop(0, light);
    g.addColorStop(0.28, base);
    g.addColorStop(1, dark);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    // agate-like banding
    ctx.globalAlpha = 0.20;
    for (var i = 0; i < 9; i++) {
      ctx.fillStyle = i % 2 ? light : dark;
      var y = 14 + i * 28 + Math.sin(i * 1.3) * 10;
      ctx.fillRect(0, y, 256, 8 + (i % 4) * 4);
    }
    // speckle / crystalline sparkle
    ctx.globalAlpha = 0.30;
    for (var j = 0; j < 70; j++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : dark;
      var r = 1 + Math.random() * 2.4;
      ctx.beginPath();
      ctx.arc(Math.random() * 256, Math.random() * 256, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    var tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    textureCache[key] = tex;
    // also keep a 2D data URL for the stone-library thumbnail (drawn before 3D init)
    if (!bead._thumb) bead._thumb = c.toDataURL('image/png');
    return tex;
  }

  // Pre-render thumbnails before 3D boots (uses offscreen canvas, no THREE needed).
  function preRenderThumbs() {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var ctx = c.getContext('2d');
    parts.beads.forEach(function (b) {
      var col = b.textureColors || ['#888', '#ddd', '#222'];
      var g = ctx.createRadialGradient(92, 80, 14, 128, 128, 180);
      g.addColorStop(0, col[1]); g.addColorStop(0.28, col[0]); g.addColorStop(1, col[2]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
      ctx.globalAlpha = 0.20;
      for (var i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? col[1] : col[2]; var y = 14 + i * 28 + Math.sin(i*1.3)*10; ctx.fillRect(0, y, 256, 8 + (i%4)*4); }
      ctx.globalAlpha = 0.30;
      for (var j = 0; j < 70; j++) { ctx.fillStyle = Math.random() > 0.5 ? '#fff' : col[2]; var r = 1 + Math.random()*2.4; ctx.beginPath(); ctx.arc(Math.random()*256, Math.random()*256, r, 0, Math.PI*2); ctx.fill(); }
      ctx.globalAlpha = 1;
      b._thumb = c.toDataURL('image/png');
    });
  }

  function charmMark(symbol) {
    var m = { lotus:'LOT', buddha:'BUD', om:'OM', heart:'HT', cross:'CR', anchor:'AN', star:'ST' };
    return m[symbol] || 'CH';
  }

  // F8: inline SVGs — small ruler icon (button) + a teaching line drawing of a
  // wrist being measured with a soft tape across the wrist bone.
  var MEASURE_ICON_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="9" width="14" height="6" rx="1"/><path d="M5 9v6M8 9v6M11 9v6M14 9v6"/>' +
    '<path d="M17 12h4"/></svg>';
  var MEASURE_TEACH_SVG = '<svg viewBox="0 0 220 110" width="220" height="110" fill="none" stroke="#cdd4de" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    // forearm + hand silhouette (simple line art)
    '<path d="M10 70 Q40 60 70 64 L78 50 Q80 42 88 40 L120 36 Q128 36 130 44 L132 70" stroke-width="1.6"/>' +
    '<path d="M88 40 L92 24 Q94 18 100 19 L106 22" stroke-width="1.4"/>' +  // thumb hint
    // wrist bone marker
    '<path d="M70 64 Q74 70 80 64" stroke="#7fd1ff"/>' +
    '<text x="56" y="86" font-size="9" fill="#7fd1ff" font-family="sans-serif">wrist bone</text>' +
    // soft tape wrapping the wrist
    '<ellipse cx="80" cy="62" rx="20" ry="9" stroke="#ffd479" stroke-dasharray="3 2"/>' +
    '<path d="M60 62 L52 58 M100 62 L108 58" stroke="#ffd479"/>' +
    '<text x="150" y="40" font-size="10" fill="#ffd479" font-family="sans-serif">soft tape</text>' +
    '<path d="M148 44 Q130 50 110 56" stroke="#ffd479" stroke-dasharray="2 2"/>' +
    '<text x="150" y="74" font-size="9" fill="#9aa4b2" font-family="sans-serif">snug, not tight</text>' +
    '</svg>';

  // F3: refined charm glyphs drawn to a canvas, used both as the 3D coin decal
  // (CanvasTexture) and the 2D toolbar/strip icon. More recognisable than the
  // old 3-letter abbreviation — lotus petals, Om glyph, anchor flukes, etc.
  function drawCharmGlyph(symbol, size, fg) {
    size = size || 128; fg = fg || '#2b210c';
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var ctx = c.getContext('2d');
    ctx.strokeStyle = fg; ctx.fillStyle = fg;
    ctx.lineWidth = size * 0.045; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    var cx = size / 2, cy = size / 2, R = size * 0.34;
    switch (symbol) {
      case 'lotus': {
        for (var i = 0; i < 8; i++) {
          var a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          var px = cx + Math.cos(a) * R * 0.55, py = cy + Math.sin(a) * R * 0.55;
          ctx.beginPath();
          ctx.ellipse(px, py, R * 0.34, R * 0.62, a + Math.PI / 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.18, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'buddha': {
        // simple serene head silhouette: dome + ushnisha + closed-eye curve
        ctx.beginPath();
        ctx.moveTo(cx - R * 0.7, cy + R * 0.9);
        ctx.quadraticCurveTo(cx - R * 0.8, cy - R * 0.4, cx - R * 0.45, cy - R * 0.7);
        ctx.quadraticCurveTo(cx, cy - R * 1.15, cx + R * 0.45, cy - R * 0.7);
        ctx.quadraticCurveTo(cx + R * 0.8, cy - R * 0.4, cx + R * 0.7, cy + R * 0.9);
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy - R * 0.85, R * 0.18, 0, Math.PI * 2); ctx.stroke(); // topknot
        ctx.beginPath(); ctx.arc(cx - R * 0.22, cy - R * 0.05, R * 0.16, 0.1, Math.PI - 0.1); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + R * 0.22, cy - R * 0.05, R * 0.16, 0.1, Math.PI - 0.1); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy + R * 0.35, R * 0.12, 0, Math.PI); ctx.stroke(); // smile
        break;
      }
      case 'om': {
        ctx.font = 'bold ' + (size * 0.55) + 'px Georgia, "Noto Sans", serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('ॐ', cx, cy + size * 0.02); // Devanagari OM
        break;
      }
      case 'heart': {
        ctx.beginPath();
        ctx.moveTo(cx, cy + R * 0.75);
        ctx.bezierCurveTo(cx - R * 1.5, cy - R * 0.1, cx - R * 0.5, cy - R * 1.0, cx, cy - R * 0.25);
        ctx.bezierCurveTo(cx + R * 0.5, cy - R * 1.0, cx + R * 1.5, cy - R * 0.1, cx, cy + R * 0.75);
        ctx.stroke();
        break;
      }
      case 'cross': {
        ctx.beginPath();
        ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
        ctx.moveTo(cx - R * 0.6, cy - R * 0.1); ctx.lineTo(cx + R * 0.6, cy - R * 0.1);
        ctx.stroke();
        break;
      }
      case 'anchor': {
        ctx.beginPath();
        ctx.arc(cx, cy - R * 0.75, R * 0.22, 0, Math.PI * 2); ctx.stroke();            // ring
        ctx.moveTo(cx, cy - R * 0.53); ctx.lineTo(cx, cy + R * 0.85);                   // shank
        ctx.moveTo(cx - R * 0.45, cy - R * 0.15); ctx.lineTo(cx + R * 0.45, cy - R * 0.15); // stock
        ctx.beginPath();
        ctx.moveTo(cx - R * 0.75, cy + R * 0.45);
        ctx.quadraticCurveTo(cx - R * 0.7, cy + R * 0.95, cx, cy + R * 0.85);            // left fluke
        ctx.quadraticCurveTo(cx + R * 0.7, cy + R * 0.95, cx + R * 0.75, cy + R * 0.45); // right fluke
        ctx.stroke();
        break;
      }
      case 'star': {
        ctx.beginPath();
        for (var k = 0; k < 10; k++) {
          var ang = (k / 10) * Math.PI * 2 - Math.PI / 2;
          var rr = (k % 2 === 0) ? R : R * 0.42;
          var sx = cx + Math.cos(ang) * rr, sy = cy + Math.sin(ang) * rr;
          if (k === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.closePath(); ctx.stroke();
        break;
      }
      default: {
        ctx.font = 'bold ' + (size * 0.4) + 'px Georgia, serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('?', cx, cy);
      }
    }
    return c;
  }
  var _glyphCache = {};
  function charmGlyphTexture(symbol) {
    if (_glyphCache[symbol]) return _glyphCache[symbol];
    var tex = new THREE.CanvasTexture(drawCharmGlyph(symbol, 128, '#2b210c'));
    _glyphCache[symbol] = tex;
    return tex;
  }

  // ---------------------------------------------------------------------------
  // Rendering: left panel (presets + color tabs + bead grid)
  // ---------------------------------------------------------------------------
  function renderLeft() {
    // presets
    var presetEl = document.getElementById('t17-presets');
    presetEl.innerHTML = parts.presets.map(function (p) {
      return '<button type="button" class="preset-btn" data-preset="' + p.id + '">' +
        '<b>' + p.name + '</b><span>' + p.stones.map(function (id) { return beadMap[id] ? beadMap[id].name_en : id; }).join(' · ') + '</span></button>';
    }).join('');

    // color tabs
    var tabsEl = document.getElementById('t17-color-tabs');
    tabsEl.innerHTML = COLOR_TABS.map(function (t) {
      return '<button type="button" class="color-tab' + (state.filterColor === t.id ? ' is-active' : '') + '" data-color="' + t.id + '">' + t.label + '</button>';
    }).join('');

    renderBeadGrid();
  }

  function renderBeadGrid() {
    var grid = document.getElementById('t17-bead-grid');
    var list = parts.beads.filter(function (b) { return beadMatchesColor(b, state.filterColor); });
    if (!list.length) { grid.innerHTML = '<p class="empty">No stones in this color.</p>'; return; }
    grid.innerHTML = list.map(function (b) {
      var price = beadPrice(b.id, state.beadSizeMm);
      var tierTag = b.tier === 'premium' ? '<em class="tier">Premium</em>' : '';
      return '<button type="button" class="bead-card" data-bead="' + b.id + '" title="' + (b.description_short || '') + '">' +
        '<span class="bead-thumb" style="background-image:url(' + (b._thumb || '') + ')"></span>' +
        '<span class="bead-meta"><b>' + b.name_en + tierTag + '</b>' +
        '<small>' + money(price) + ' / bead</small></span></button>';
    }).join('');
  }

  // ---------------------------------------------------------------------------
  // Rendering: right top toolbar (charms + cords + wrist + bead size)
  // ---------------------------------------------------------------------------
  function renderToolbar() {
    var charmCount = state.sequence.filter(function (i) { return i.type === 'charm'; }).length;
    ensureGlyphDataUrls();   // refined canvas glyphs available before 3D boots
    var charmEl = document.getElementById('t17-charms');
    charmEl.innerHTML = '<span class="tb-label">Charm ' + charmCount + '/' + (settings.maxCharms || 5) + '</span>' +
      parts.charms.map(function (c) {
        var gUrl = _glyphDataUrls && _glyphDataUrls[c.symbol];
        var coinInner = gUrl
          ? '<img src="' + gUrl + '" alt="" class="charm-glyph" draggable="false">'
          : charmMark(c.symbol);
        return '<button type="button" class="charm-btn" data-charm="' + c.id + '" title="' + c.name_en + ' · ' + money(c.price) + '">' +
          '<span class="charm-coin">' + coinInner + '</span><small>' + c.name_en + '</small></button>';
      }).join('');

    var cordEl = document.getElementById('t17-cords');
    cordEl.innerHTML = '<span class="tb-label">Cord</span>' + parts.cords.map(function (c) {
      return '<button type="button" class="cord-btn' + (state.cord === c.id ? ' is-active' : '') + '" data-cord="' + c.id + '" title="' + c.description_short + '">' +
        c.name_en + '<small>' + money(c.price) + '</small></button>';
    }).join('');

    var sizeEl = document.getElementById('t17-sizes');
    sizeEl.innerHTML = '<span class="tb-label">Bead size</span>' + [6,8,10,12].map(function (s) {
      return '<button type="button" class="size-btn' + (Number(state.beadSizeMm) === s ? ' is-active' : '') + '" data-size="' + s + '">' + s + 'mm</button>';
    }).join('');

    // F8 (PRD R3): numeric wrist input + cm/inch toggle + slider fine-tune +
    // measurement-teaching SVG + live "suggested N beads" readout.
    var wristEl = document.getElementById('t17-wrist-wrap');
    var unit = state.wristUnit || 'cm';
    var shown = unit === 'in' ? cmToIn(state.wristCm) : state.wristCm;
    var suggested = suggestedBeadCount();
    var fitAllow = Number(settings.fitAllowanceCm || 1.5);
    wristEl.innerHTML =
      '<span class="tb-label">Wrist circumference · target inner ' + targetCm().toFixed(1) + 'cm (+' + fitAllow + 'cm fit) · ~' + targetSlots() + ' slots</span>' +
      '<div class="wrist-row">' +
        '<input id="t17-wrist-num" type="number" min="' + (unit === 'cm' ? settings.minWristCm : cmToIn(settings.minWristCm)) + '" max="' + (unit === 'cm' ? settings.maxWristCm : cmToIn(settings.maxWristCm)) + '" step="' + (unit === 'cm' ? '0.5' : '0.25') + '" value="' + shown + '" inputmode="decimal">' +
        '<div class="unit-toggle" role="group" aria-label="wrist unit">' +
          '<button type="button" class="unit-btn' + (unit === 'cm' ? ' is-active' : '') + '" data-unit="cm">cm</button>' +
          '<button type="button" class="unit-btn' + (unit === 'in' ? ' is-active' : '') + '" data-unit="in">in</button>' +
        '</div>' +
        '<button type="button" class="measure-btn" id="t17-measure-toggle" title="How to measure your wrist" aria-label="How to measure your wrist">' + MEASURE_ICON_SVG + '</button>' +
      '</div>' +
      '<input id="t17-wrist" type="range" min="' + settings.minWristCm + '" max="' + settings.maxWristCm + '" step="0.25" value="' + state.wristCm + '">' +
      '<div class="wrist-suggest">Suggested beads for ' + state.beadSizeMm + 'mm: <b>' + suggested + '</b> ' +
        '(π × D fit: (' + state.wristCm + ' + ' + fitAllow + ') / (' + state.beadSizeMm + 'mm × 0.1 × π))</div>' +
      '<div class="measure-teach" id="t17-measure-teach" hidden>' +
        '<div class="measure-teach-inner">' +
          MEASURE_TEACH_SVG +
          '<p>Wrap a soft tailor\'s tape (or a paper strip you mark + measure) snugly around the <b>wrist bone</b>, then add ~1.5cm for a comfortable fit. Not sure? Pick an XS–XL quick size below.</p>' +
          '<div class="quick-sizes">' +
            [{k:'XS',v:13},{k:'S',v:15},{k:'M',v:16.5},{k:'L',v:18},{k:'XL',v:20}].map(function(q){
              return '<button type="button" class="quick-size" data-quick="' + q.v + '">' + q.k + '<small>' + q.v + 'cm</small></button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ---------------------------------------------------------------------------
  // Rendering: bottom pricing + sequence strip + selected actions
  // ---------------------------------------------------------------------------
  function renderPricing() {
    var beadCount = state.sequence.filter(function (i) { return i.type === 'bead'; }).length;
    var charmCount = state.sequence.filter(function (i) { return i.type === 'charm'; }).length;
    var beadTotal = 0;
    state.sequence.forEach(function (it) { if (it.type === 'bead') beadTotal += beadPrice(it.id, it.size_mm || state.beadSizeMm); });
    var charmTotal = 0;
    state.sequence.forEach(function (it) { if (it.type === 'charm' && charmMap[it.id]) charmTotal += Number(charmMap[it.id].price); });
    var cordTotal = cordMap[state.cord] ? Number(cordMap[state.cord].price) : 0;
    var diff = targetSlots() - usedSlots();
    var fitMsg = diff > 0 ? 'Add ' + diff + ' more to fill' : diff < 0 ? 'Over by ' + Math.abs(diff) : 'Perfect fit';
    document.getElementById('t17-price').innerHTML =
      '<div class="price-rows">' +
        '<div class="pr"><span>Beads (' + beadCount + ')</span><span>' + money(beadTotal) + '</span></div>' +
        '<div class="pr"><span>Charms (' + charmCount + ')</span><span>' + money(charmTotal) + '</span></div>' +
        '<div class="pr"><span>Cord · ' + (cordMap[state.cord] ? cordMap[state.cord].name_en : '') + '</span><span>' + money(cordTotal) + '</span></div>' +
      '</div>' +
      '<div class="price-total"><span>Total</span><span>' + money(beadTotal + charmTotal + cordTotal) + '</span></div>' +
      '<div class="price-fit ' + (diff === 0 ? 'ok' : diff < 0 ? 'over' : '') + '">' + fitMsg + ' · ' + usedSlots() + '/' + targetSlots() + ' slots</div>';
  }

  function renderSequenceStrip() {
    var el = document.getElementById('t17-seq');
    // Pre-render the 7 charm glyphs as 2D data URLs once (no THREE needed), so
    // the strip + toolbar can show the refined icons even before 3D boots.
    ensureGlyphDataUrls();
    el.innerHTML = state.sequence.map(function (it, i) {
      var part = it.type === 'bead' ? beadMap[it.id] : charmMap[it.id];
      var label = it.type === 'bead' ? (part ? part.name_en : it.id) : (part ? part.name_en + ' charm' : it.id);
      var dot;
      if (it.type === 'bead') {
        dot = '<span class="seq-dot" style="background-image:url(' + (part && part._thumb ? part._thumb : '') + ')"></span>';
      } else {
        var glyphUrl = part && _glyphDataUrls[part.symbol] ? _glyphDataUrls[part.symbol] : '';
        dot = '<span class="seq-dot charm-dot"' + (glyphUrl ? ' style="background-image:url(' + glyphUrl + ')"' : '') + '>' +
          (glyphUrl ? '' : (part ? charmMark(part.symbol) : '')) + '</span>';
      }
      return '<button type="button" class="seq-item' + (state.selected === i ? ' is-selected' : '') + '" data-slot="' + i + '">' +
        dot + '<small>' + label + '</small></button>';
    }).join('');
  }
  var _glyphDataUrls = null;
  function ensureGlyphDataUrls() {
    if (_glyphDataUrls) return;
    _glyphDataUrls = {};
    parts.charms.forEach(function (c) {
      // drawCharmGlyph works on a plain canvas (no THREE) — safe pre-3D.
      try { _glyphDataUrls[c.symbol] = drawCharmGlyph(c.symbol, 64, '#2b210c').toDataURL('image/png'); } catch (e) {}
    });
  }

  function renderSelectedActions() {
    var el = document.getElementById('t17-sel-actions');
    if (state.selected < 0 || state.selected >= state.sequence.length) { el.innerHTML = ''; return; }
    var it = state.sequence[state.selected];
    var part = it.type === 'bead' ? beadMap[it.id] : charmMap[it.id];
    var name = part ? part.name_en : it.id;
    el.innerHTML = '<span>Selected: <b>' + name + '</b></span>' +
      '<button type="button" class="mini" data-action="move-left">◀</button>' +
      '<button type="button" class="mini" data-action="move-right">▶</button>' +
      '<button type="button" class="mini danger" data-action="remove-selected">Remove</button>' +
      '<button type="button" class="mini" data-action="deselect">✕</button>';
  }

  // ---------------------------------------------------------------------------
  // Three.js scene
  // ---------------------------------------------------------------------------
  function initThree() {
    var canvas = document.getElementById('t17-canvas');
    var wrap = document.getElementById('t17-stage');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 5.2, 11);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(6, 12, 8); scene.add(key);
    var fill = new THREE.DirectionalLight(0x99bbff, 0.35);
    fill.position.set(-8, 4, -6); scene.add(fill);

    ringGroup = new THREE.Group();   // auto-spin turntable
    scene.add(ringGroup);
    braceletGroup = new THREE.Group();
    ringGroup.add(braceletGroup);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 20;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, 0, 0);

    window.addEventListener('resize', onResize);

    // F1 (PRD R6): drag-to-reorder + drag-out-to-delete on the 3D ring.
    // Pointer events with Raycaster pick a bead; while it is held we disable
    // OrbitControls (event arbitration) so dragging the bead swaps slots
    // instead of rotating the camera. Dropping outside a "delete ring" radius
    // removes the bead. Buttons remain as the a11y fallback.
    bindDragHandlers();
    animate();
  }

  function onResize() {
    if (!renderer) return;
    var wrap = document.getElementById('t17-stage');
    camera.aspect = wrap.clientWidth / wrap.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
  }

  // --- F1 drag-to-reorder / drag-out-to-delete (PRD R6) ---
  var drag = {
    active: false, dragging: false, slot: -1, mesh: null,
    startNdc: { x: 0, y: 0 }, lastNdc: { x: 0, y: 0 },
    raycaster: null, plane: null, hitPoint: null
  };
  // Visual ghost shown while dragging (the held bead follows the cursor in the
  // ring plane; the original slot is left empty).
  var dragGhost = null;
  var DRAG_START_PX = 6;     // movement threshold to distinguish click vs drag
  var DELETE_MULT = 1.55;    // drop beyond 1.55× ring radius = delete

  function ndcFromEvent(e) {
    var rect = renderer.domElement.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1
    };
  }
  function ringRadiusCurrent() {
    // mirrors the radius formula used in renderBracelet
    var n = Math.max(1, state.sequence.length);
    return Math.max(2.4, Math.min(4.2, 1.9 + n * 0.13));
  }
  function bindDragHandlers() {
    var el = renderer.domElement;
    el.addEventListener('pointerdown', onDragDown, { passive: false });
    el.addEventListener('pointermove', onDragMove, { passive: false });
    // pointerup/cancel on window so a release outside the canvas still ends the drag
    window.addEventListener('pointerup', onDragUp);
    window.addEventListener('pointercancel', onDragUp);
  }
  function onDragDown(e) {
    if (!THREE || !controls || !slotMeshIndex.length) return;
    if (e.button !== undefined && e.button !== 0) return; // primary button / touch only
    var rc = drag.raycaster = drag.raycaster || new THREE.Raycaster();
    var ndc = ndcFromEvent(e);
    rc.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera);
    // gather all bead/charm meshes currently on the ring for the pick
    var pickable = [];
    slotMeshIndex.forEach(function (m) {
      if (!m) return;
      m.traverse(function (o) { if (o.isMesh) pickable.push(o); });
    });
    var hits = rc.intersectObjects(pickable, false);
    if (!hits.length) return;            // empty-space drag → let OrbitControls rotate
    var hit = hits[0].object;
    // walk up to the slot-level mesh/group (we tagged userData.slot on it)
    var node = hit;
    while (node && (node.userData.slot === undefined)) node = node.parent;
    if (!node) return;
    e.preventDefault();
    try { el_capture(e); } catch (_) {}
    drag.active = true; drag.dragging = false;
    drag.slot = node.userData.slot; drag.mesh = node;
    drag.startNdc.x = ndc.x; drag.startNdc.y = ndc.y;
    drag.lastNdc.x = ndc.x; drag.lastNdc.y = ndc.y;
    // freeze the camera so the drag reorders instead of rotating (PRD R6)
    controls.enabled = false;
  }
  function el_capture(e) { if (e.target && e.target.setPointerCapture && e.pointerId !== undefined) e.target.setPointerCapture(e.pointerId); }
  function onDragMove(e) {
    if (!drag.active) return;
    var ndc = ndcFromEvent(e);
    var dx = ndc.x - drag.startNdc.x, dy = ndc.y - drag.startNdc.y;
    if (!drag.dragging && Math.hypot(dx, dy) * 200 > DRAG_START_PX) {
      // promote to drag — show ghost, dim the source bead
      drag.dragging = true;
      beginGhost();
    }
    if (!drag.dragging) return;
    drag.lastNdc.x = ndc.x; drag.lastNdc.y = ndc.y;
    updateGhost();
    e.preventDefault();
  }
  function onDragUp(e) {
    if (!drag.active) return;
    var wasDragging = drag.dragging;
    var ndc = (e.clientX !== undefined) ? ndcFromEvent(e) : drag.lastNdc;
    controls.enabled = true;             // always restore OrbitControls
    if (wasDragging) {
      var rc = drag.raycaster;
      rc.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera);
      if (!drag.plane) drag.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      var hp = drag.hitPoint = new THREE.Vector3();
      var hitOk = rc.ray.intersectPlane(drag.plane, hp);
      if (!hitOk) { endGhost(); resetDrag(); return; }   // ray parallel to plane — cancel
      var r = ringRadiusCurrent();
      var dist = Math.hypot(hp.x, hp.z);
      if (dist > r * DELETE_MULT) {
        // dropped outside the ring → delete (PRD R6 drag-to-delete)
        removeSlot(drag.slot);
        flash('Bead removed (dragged off the ring)');
      } else {
        // dropped inside → reorder to the nearest slot angle
        var n = Math.max(1, state.sequence.length);
        var angle = Math.atan2(hp.z, hp.x);
        var target = ((Math.round(((angle + Math.PI * 2.5) / (Math.PI * 2)) * n) % n) + n) % n;
        if (target !== drag.slot) moveSlotTo(drag.slot, target);
      }
    } else {
      // treated as a click → select the slot (no reorder)
      state.selected = drag.slot; updateAll(false);
    }
    endGhost();
    resetDrag();
  }
  function resetDrag() {
    drag.active = false; drag.dragging = false; drag.slot = -1; drag.mesh = null;
  }
  function beginGhost() {
    if (!drag.mesh) return;
    // dim the source while dragging
    drag.mesh.traverse(function (o) {
      if (o.material && o.material.transparent !== undefined) {
        o._origOpacity = o.material.opacity; o.material.transparent = true; o.material.opacity = 0.28;
      }
    });
  }
  function updateGhost() {
    // (visual refinement hook) — the bead stays in place during drag; the
    // drop slot is computed on pointerup, which is enough to convey reorder.
    // This keeps the implementation robust and avoids flicker on touch.
  }
  function endGhost() {
    if (!drag.mesh) return;
    drag.mesh.traverse(function (o) {
      if (o.material && o._origOpacity !== undefined) {
        o.material.opacity = o._origOpacity; delete o._origOpacity;
        if (o.material.opacity >= 1) o.material.transparent = false;
      }
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    if (ringGroup) ringGroup.rotation.y += 0.0016;
    if (controls) controls.update();
    if (renderer) renderer.render(scene, camera);
  }

  // Build/rebuild bracelet meshes from state.sequence.
  function renderBracelet() {
    if (!THREE || !braceletGroup) return;
    buildCordVisuals();   // lazily build cord canvas textures once THREE is live
    while (braceletGroup.children.length) {
      var ch = braceletGroup.children.pop();
      ch.disposed = true;  // flag so any pending .glb swap aborts (buildCharmMesh)
      ch.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    }
    var n = Math.max(1, state.sequence.length);
    // ring radius scales gently with bead count so it always reads as a bracelet
    var radius = Math.max(2.4, Math.min(4.2, 1.9 + n * 0.13));
    slotMeshIndex = [];
    var sharedSphere = new THREE.SphereGeometry(0.42, 48, 36); // r=0.42 scene units (8mm reference)

    state.sequence.forEach(function (it, i) {
      var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      var x = Math.cos(angle) * radius;
      var z = Math.sin(angle) * radius;
      var mesh;
      if (it.type === 'bead') {
        var bead = beadMap[it.id];
        var scale = Number(it.size_mm || state.beadSizeMm) / 8;
        var mat = new THREE.MeshStandardMaterial({ map: makeBeadTexture(bead), roughness: 0.28, metalness: 0.06 });
        mesh = new THREE.Mesh(sharedSphere, mat);
        mesh.scale.setScalar(scale);
        mesh.userData = { type: 'bead', slot: i, id: it.id };
      } else {
        var charm = charmMap[it.id];
        mesh = buildCharmMesh(charm, i);
      }
      mesh.position.set(x, 0, z);
      if (i === state.selected) {
        mesh.scale.multiplyScalar(1.18);
        // emissive highlight only applies to materials we own (beads + charm coin)
        mesh.traverse(function (o) {
          if (o.material && o.material.emissive) o.material.emissive = new THREE.Color(0x332200);
        });
      }
      braceletGroup.add(mesh);
      slotMeshIndex[i] = mesh;
    });

    // F4: cord material differentiation — not just colour, but thickness +
    // texture + reflectivity. Three distinct bands:
    //   elastic_black : 2mm matte black (rubberised, near-no specular)
    //   braided_brown : 3mm brown with a procedural woven-braid canvas texture
    //   silver_wire   : 2.5mm polished silver (high metalness + sharp specular)
    var cordSpec = CORD_VISUALS[state.cord] || CORD_VISUALS.elastic_black;
    var torus = new THREE.TorusGeometry(radius, cordSpec.thickness, 24, 200);
    var tmat = new THREE.MeshStandardMaterial({
      map: cordSpec.map,                 // braided gets the woven texture; others null
      color: cordSpec.color,
      roughness: cordSpec.roughness,
      metalness: cordSpec.metalness,
      envMapIntensity: cordSpec.metalness > 0.5 ? 1.4 : 0.4
    });
    var cordMesh = new THREE.Mesh(torus, tmat);
    cordMesh.rotation.x = Math.PI / 2;
    cordMesh.userData = { type: 'cord' };
    braceletGroup.add(cordMesh);
  }

  // Procedural woven-braid canvas texture for the braided cord (diagonal weave
  // with light/dark strands so it reads as a real cord, not a flat brown tube).
  var _braidTex = null;
  function makeBraidTexture() {
    if (_braidTex) return _braidTex;
    var c = document.createElement('canvas');
    c.width = 256; c.height = 32;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#6b4528'; ctx.fillRect(0, 0, 256, 32);
    // diagonal woven strands — two interleaved S-twists
    var strandW = 14;
    for (var i = -2; i < 256 / strandW + 2; i++) {
      var x = i * strandW;
      ctx.strokeStyle = i % 2 ? '#8a5e36' : '#523319';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(x, -4); ctx.lineTo(x + 28, 36); ctx.stroke();
      ctx.strokeStyle = i % 2 ? '#3f2614' : '#7a5230';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + 4, -4); ctx.lineTo(x + 32, 36); ctx.stroke();
    }
    // subtle highlight along the top edge of each strand
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#c89a64';
    for (var j = 0; j < 256; j += 7) { ctx.fillRect(j, 4, 3, 2); }
    ctx.globalAlpha = 1;
    _braidTex = new THREE.CanvasTexture(c);
    _braidTex.wrapS = THREE.RepeatWrapping;
    _braidTex.wrapT = THREE.RepeatWrapping;
    _braidTex.repeat.set(radiusToRepeats(), 1);
    _braidTex.anisotropy = 4;
    return _braidTex;
  }
  function radiusToRepeats() { return 60; } // tile the weave densely around the ring
  // Cord visuals are rebuilt when THREE is ready (textures need a WebGL context).
  var CORD_VISUALS = null;
  function buildCordVisuals() {
    if (!THREE) return null;
    if (CORD_VISUALS) return CORD_VISUALS;
    CORD_VISUALS = {
      elastic_black: { thickness: 0.045, color: 0x181818, roughness: 0.82, metalness: 0.02, map: null },
      braided_brown: { thickness: 0.068, color: 0xffffff, roughness: 0.70, metalness: 0.05, map: makeBraidTexture() },
      silver_wire:   { thickness: 0.056, color: 0xd8d9db, roughness: 0.22, metalness: 0.96, map: null }
    };
    return CORD_VISUALS;
  }

  function makeCharmSprite(label) {
    // Legacy text sprite — retained as the deepest fallback for the sequence
    // strip (2D), never used in the 3D coin anymore (drawCharmGlyph replaces it).
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#2d2410';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 64, 68);
    var tex = new THREE.CanvasTexture(c);
    var m = new THREE.SpriteMaterial({ map: tex, transparent: true });
    var s = new THREE.Sprite(m);
    s.scale.set(0.7, 0.7, 0.7);
    return s;
  }

  // F3 (PRD R7): charm rendering. Two paths:
  //  (a) charm.model_url present + GLTFLoader available → load .glb (Meshy/Tripo3D)
  //  (b) else → refined 2D round-pendant placeholder (coin + canvas glyph decal)
  // GLTFLoader is fetched lazily so a missing addon file (local file:// vendor
  // dir does not currently ship GLTFLoader.js) never breaks the builder — the
  // placeholder is the guaranteed baseline per PRD R7.
  var GLTFLoader = null;
  var _gltfTried = false;
  function ensureGLTFLoader() {
    if (_gltfTried) return Promise.resolve(GLTFLoader);
    _gltfTried = true;
    return import('three/addons/loaders/GLTFLoader.js').then(function (mod) {
      GLTFLoader = mod.GLTFLoader || mod.default;
      return GLTFLoader;
    }).catch(function () { return null; });
  }
  function buildCharmMesh(charm, slotIndex) {
    // Placeholder coin first (always available); if a .glb is configured we
    // asynchronously swap it in once loaded.
    var group = new THREE.Group();
    var coin = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 40);
    var cmat = new THREE.MeshStandardMaterial({ color: 0xd9c17c, roughness: 0.26, metalness: 0.74 });
    var coinMesh = new THREE.Mesh(coin, cmat);
    coinMesh.rotation.x = Math.PI / 2;
    var glyph = new THREE.Sprite(new THREE.SpriteMaterial({ map: charmGlyphTexture(charm.symbol), transparent: true }));
    glyph.position.set(0, 0.08, 0);
    glyph.scale.set(0.78, 0.78, 0.78);
    coinMesh.add(glyph);
    group.add(coinMesh);
    group.userData = { type: 'charm', slot: slotIndex, id: charm.id, isCharmGroup: true };
    // Try .glb swap-in only when a model_url is configured (Step 3 / Meshy).
    if (charm && charm.model_url) {
      ensureGLTFLoader().then(function (Loader) {
        if (!Loader || group.disposed) return;
        try {
          var loader = new Loader();
          loader.load(charm.model_url, function (gltf) {
            if (group.disposed) return;
            // normalise the loaded model into the coin's slot
            var obj = gltf.scene || gltf.scenes[0];
            if (!obj) return;
            obj.traverse(function (o) { if (o.isMesh) { o.castShadow = true; } });
            // fit into ~1 scene-unit bounding box
            var box = new THREE.Box3().setFromObject(obj);
            var size = new THREE.Vector3(); box.getSize(size);
            var s = 1.1 / Math.max(size.x, size.y, size.z || 0.0001);
            obj.scale.setScalar(s);
            obj.position.set(0, -box.getCenter(new THREE.Vector3()).y * s, 0);
            // remove the placeholder coin, keep the glyph as a faint halo behind
            group.remove(coinMesh);
            group.add(obj);
          }, undefined, function () { /* keep placeholder on load error */ });
        } catch (e) { /* keep placeholder */ }
      });
    }
    return group;
  }

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------
  function updateAll(redraw3d) {
    if (redraw3d === undefined) redraw3d = true;
    renderToolbar();
    renderPricing();
    renderSequenceStrip();
    renderSelectedActions();
    if (redraw3d) renderBracelet();
    saveDraft();
  }

  function addBead(id) {
    if (!beadMap[id]) return;
    if (!canAdd(1)) { flash('Ring is full — remove a bead or raise bead size.'); return; }
    state.sequence.push({ type: 'bead', id: id, size_mm: state.beadSizeMm });
    state.selected = state.sequence.length - 1;
    updateAll();
  }
  function addCharm(id) {
    var c = charmMap[id]; if (!c) return;
    var count = state.sequence.filter(function (i) { return i.type === 'charm'; }).length;
    if (count >= Number(settings.maxCharms || 5)) { flash('Max charms reached.'); return; }
    if (!canAdd(Number(c.slotWeight || 1))) { flash('Not enough room for this charm.'); return; }
    state.sequence.push({ type: 'charm', id: id, slotWeight: Number(c.slotWeight || 1) });
    state.selected = state.sequence.length - 1;
    updateAll();
  }
  function removeSlot(i) {
    if (i < 0 || i >= state.sequence.length) return;
    state.sequence.splice(i, 1);
    state.selected = Math.min(i, state.sequence.length - 1);
    updateAll();
  }
  function moveSlot(i, dir) {
    var j = i + dir;
    if (i < 0 || j < 0 || i >= state.sequence.length || j >= state.sequence.length) return;
    var tmp = state.sequence[i]; state.sequence[i] = state.sequence[j]; state.sequence[j] = tmp;
    state.selected = j;
    updateAll();
  }
  // F1: reorder a slot to an absolute target index (used by drag-drop on the ring).
  function moveSlotTo(i, target) {
    var n = state.sequence.length;
    if (i < 0 || i >= n || target < 0 || target >= n || i === target) return;
    var item = state.sequence.splice(i, 1)[0];
    state.sequence.splice(target, 0, item);
    state.selected = target;
    updateAll();
  }
  function fillPreset(id) {
    var p = parts.presets.find(function (x) { return x.id === id; });
    if (!p) return;
    var n = Math.min(6, targetSlots()); // Step-1 preset = compact 6-bead starter mix
    state.sequence = [];
    for (var i = 0; i < n; i++) {
      state.sequence.push({ type: 'bead', id: p.stones[i % p.stones.length], size_mm: state.beadSizeMm });
    }
    state.selected = -1;
    updateAll();
    flash('Loaded "' + p.name + '" template');
  }
  function setBeadSize(s) {
    state.beadSizeMm = Number(s);
    state.sequence = state.sequence.map(function (it) {
      if (it.type === 'bead') return { type: 'bead', id: it.id, size_mm: state.beadSizeMm };
      return it;
    });
    while (usedSlots() > targetSlots() && state.sequence.length) state.sequence.pop();
    state.selected = Math.min(state.selected, state.sequence.length - 1);
    updateAll();
  }
  function setWrist(v, quiet) {
    state.wristCm = clamp(Number(v) || settings.defaultWristCm, settings.minWristCm, settings.maxWristCm);
    while (usedSlots() > targetSlots() && state.sequence.length) state.sequence.pop();
    state.selected = Math.min(state.selected, state.sequence.length - 1);
    if (quiet) {
      // typing into the numeric field: don't rebuild the toolbar (which would
      // yank focus from the input). Only refresh the label, slider, pricing,
      // sequence strip, bracelet, and draft — the input keeps its cursor.
      syncWristReadouts();
      renderPricing();
      renderSequenceStrip();
      renderBracelet();
      saveDraft();
    } else {
      updateAll();
    }
  }
  // Live-update the wrist label/slider/suggestion without rebuilding the input.
  function syncWristReadouts() {
    var wrap = document.getElementById('t17-wrist-wrap');
    if (!wrap) return;
    var label = wrap.querySelector('.tb-label');
    if (label) {
      var fitAllow = Number(settings.fitAllowanceCm || 1.5);
      label.textContent = 'Wrist circumference · target inner ' + targetCm().toFixed(1) + 'cm (+' + fitAllow + 'cm fit) · ~' + targetSlots() + ' slots';
    }
    var slider = document.getElementById('t17-wrist');
    if (slider && String(Number(slider.value)) !== String(state.wristCm)) slider.value = state.wristCm;
    var sug = wrap.querySelector('.wrist-suggest');
    if (sug) {
      var fitAllow2 = Number(settings.fitAllowanceCm || 1.5);
      sug.innerHTML = 'Suggested beads for ' + state.beadSizeMm + 'mm: <b>' + suggestedBeadCount() + '</b> ' +
        '(π × D fit: (' + state.wristCm + ' + ' + fitAllow2 + ') / (' + state.beadSizeMm + 'mm × 0.1 × π))';
    }
  }
  function setCord(id) { if (cordMap[id]) { state.cord = id; updateAll(); } }

  // --- Step-1 default: 6-bead starter mix (Lucid Compose, non-blank) ---
  function initDefault() {
    var mix = ['rose_quartz', 'amethyst', 'rose_quartz', 'clear_quartz', 'amethyst', 'rose_quartz'];
    state.sequence = mix.map(function (id) { return { type: 'bead', id: id, size_mm: state.beadSizeMm }; });
    state.selected = -1;
  }

  // --- localStorage draft (PRD R9: versioned) ---
  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        schemaVersion: parts.schemaVersion,
        partsVersion: parts.partsVersion,
        savedAt: new Date().toISOString(),
        wristCm: state.wristCm, wristUnit: state.wristUnit,
        beadSizeMm: state.beadSizeMm, cord: state.cord,
        sequence: state.sequence
      }));
    } catch (e) {}
  }
  function restoreDraft() {
    // Returns: 'restored' | 'expired' | 'none' so the caller can show the right
    // toast (PRD R9 — versioned draft + clear-and-restart affordance).
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return 'none';
      var d = JSON.parse(raw);
      if (!d || d.schemaVersion !== parts.schemaVersion || d.partsVersion !== parts.partsVersion) {
        localStorage.removeItem(STORAGE_KEY);
        return 'expired';
      }
      state.wristCm = clamp(Number(d.wristCm || state.wristCm), settings.minWristCm, settings.maxWristCm);
      if (d.wristUnit === 'in' || d.wristUnit === 'cm') state.wristUnit = d.wristUnit;
      var sz = Number(d.beadSizeMm); state.beadSizeMm = [6,8,10,12].indexOf(sz) >= 0 ? sz : state.beadSizeMm;
      state.cord = cordMap[d.cord] ? d.cord : state.cord;
      state.sequence = (d.sequence || []).filter(function (it) {
        return (it.type === 'bead' && beadMap[it.id]) || (it.type === 'charm' && charmMap[it.id]);
      }).map(function (it) {
        if (it.type === 'bead') return { type: 'bead', id: it.id, size_mm: state.beadSizeMm };
        return { type: 'charm', id: it.id, slotWeight: Number(it.slotWeight || 1) };
      });
      return 'restored';
    } catch (e) { try { localStorage.removeItem(STORAGE_KEY); } catch (_) {} return 'none'; }
  }
  // PRD R9: clear the draft + reset to the default starter mix.
  function clearDraftAndReset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state.wristUnit = 'cm';
    state.wristCm = settings.defaultWristCm || 16;
    state.beadSizeMm = settings.defaultBeadSizeMm || 8;
    state.cord = 'elastic_black';
    initDefault();
    updateAll();
    hideDraftToast();
    flash('Started fresh — your previous draft was cleared.');
  }
  function showDraftToast(msg, ctaLabel) {
    var el = document.getElementById('t17-draft-toast');
    if (!el) return;
    el.innerHTML = '<span class="draft-msg">' + msg + '</span>' +
      (ctaLabel ? '<button type="button" class="draft-cta" id="t17-draft-clear">' + ctaLabel + '</button>' : '') +
      '<button type="button" class="draft-x" id="t17-draft-x" aria-label="dismiss">✕</button>';
    el.classList.add('show');
    clearTimeout(el._t);
    // auto-dismiss after ~6s (cta buttons keep working until then)
    el._t = setTimeout(function () { hideDraftToast(); }, 6000);
  }
  function hideDraftToast() {
    var el = document.getElementById('t17-draft-toast');
    if (!el) return;
    el.classList.remove('show');
    clearTimeout(el._t);
  }

  function flash(msg) {
    var el = document.getElementById('t17-flash');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  // --- Add to cart (Step 1: console.log only; Step 3 wires WooCommerce) ---
  function configPayload() {
    return {
      schemaVersion: parts.schemaVersion, partsVersion: parts.partsVersion,
      bead_size: Number(state.beadSizeMm), wrist_cm: Number(state.wristCm),
      target_cm: targetCm(), target_slots: targetSlots(),
      cord: state.cord,
      sequence: state.sequence.map(function (it) {
        return it.type === 'bead'
          ? { type: 'bead', id: it.id, size_mm: Number(it.size_mm || state.beadSizeMm) }
          : { type: 'charm', id: it.id, slotWeight: Number(it.slotWeight || 1) };
      }),
      total: totalPrice()
    };
  }
  function handleAddToCart() {
    var payload = configPayload();
    console.log('[T17] Add to cart config:', payload);
    flash('Logged config to console (Step 1 — WooCommerce wiring is Step 3).');
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------
  function bindEvents() {
    var root = document.getElementById('t17-app');
    root.addEventListener('click', function (e) {
      var beadBtn = e.target.closest('[data-bead]');
      if (beadBtn) {
        // If a slot is selected, replace that bead; else append.
        if (state.selected >= 0 && state.sequence[state.selected] && state.sequence[state.selected].type === 'bead') {
          state.sequence[state.selected].id = beadBtn.getAttribute('data-bead');
          updateAll();
        } else {
          addBead(beadBtn.getAttribute('data-bead'));
        }
        return;
      }
      var charmBtn = e.target.closest('[data-charm]'); if (charmBtn) return addCharm(charmBtn.getAttribute('data-charm'));
      var presetBtn = e.target.closest('[data-preset]'); if (presetBtn) return fillPreset(presetBtn.getAttribute('data-preset'));
      var cordBtn = e.target.closest('[data-cord]'); if (cordBtn) return setCord(cordBtn.getAttribute('data-cord'));
      var sizeBtn = e.target.closest('[data-size]'); if (sizeBtn) return setBeadSize(sizeBtn.getAttribute('data-size'));
      var colorBtn = e.target.closest('[data-color]');
      if (colorBtn) { state.filterColor = colorBtn.getAttribute('data-color'); renderLeft(); return; }
      var slotBtn = e.target.closest('[data-slot]');
      if (slotBtn) { state.selected = Number(slotBtn.getAttribute('data-slot')); updateAll(false); return; }
      var actBtn = e.target.closest('[data-action]');
      if (actBtn) {
        var a = actBtn.getAttribute('data-action');
        if (a === 'remove-selected') return removeSlot(state.selected);
        if (a === 'move-left') return moveSlot(state.selected, -1);
        if (a === 'move-right') return moveSlot(state.selected, 1);
        if (a === 'deselect') { state.selected = -1; updateAll(false); return; }
      }
      if (e.target && e.target.id === 't17-add-cart') return handleAddToCart();
      // F8: unit toggle (cm/in), quick-size chips, measure-teach popover,
      // and the draft toast clear/dismiss buttons.
      var unitBtn = e.target.closest('[data-unit]');
      if (unitBtn) { state.wristUnit = unitBtn.getAttribute('data-unit'); renderToolbar(); return; }
      var quickBtn = e.target.closest('[data-quick]');
      if (quickBtn) { setWrist(quickBtn.getAttribute('data-quick')); return; }
      if (e.target.id === 't17-measure-toggle') {
        var teach = document.getElementById('t17-measure-teach');
        if (teach) teach.hidden = !teach.hidden;
        return;
      }
      if (e.target.id === 't17-draft-clear') return clearDraftAndReset();
      if (e.target.id === 't17-draft-x') return hideDraftToast();
    });
    root.addEventListener('input', function (e) {
      if (e.target.id === 't17-wrist') setWrist(e.target.value);
      // F8: numeric wrist input. Value is in the currently selected unit.
      if (e.target.id === 't17-wrist-num') {
        var v = parseFloat(e.target.value);
        if (isNaN(v)) return;
        var cm = state.wristUnit === 'in' ? inToCm(v) : v;
        setWrist(cm, true);   // quiet: keep input focused while typing
      }
    });
  }

  // --- Boot ---
  // UI first (does not need THREE), so pricing/sequence/selector always render
  // even if the 3D module fetch fails (file:// origin) or WebGL is unavailable.
  preRenderThumbs();
  renderLeft();
  // PRD R9: restore a versioned draft, else fall back to the starter mix.
  // Surface a toast on restore + version-expiry so the user is never silently
  // dropped into a state they did not expect.
  var draftStatus = restoreDraft();
  if (draftStatus === 'none') initDefault();
  renderToolbar();
  renderPricing();
  renderSequenceStrip();
  renderSelectedActions();
  bindEvents();
  if (draftStatus === 'restored') {
    showDraftToast('Restored your saved design.', 'Clear draft & start over');
  } else if (draftStatus === 'expired') {
    showDraftToast('Your saved draft was from an older version and has been reset.', null);
  }
  console.log('[T17] Step-2 builder UI ready ·', state.sequence.length, 'beads · draft=' + draftStatus);

  // 3D is progressive enhancement — dynamic import so a fetch failure never
  // breaks the builder. On the WP deployment (HTTP origin) this always works.
  (async function () {
    try {
      var mod = await import('three');
      THREE = mod;
      var oc = await import('three/addons/controls/OrbitControls.js');
      OrbitControls = oc.OrbitControls;
      initThree();
      renderBracelet();
      console.log('[T17] 3D stage ready');
    } catch (e) {
      console.warn('[T17] 3D unavailable, running in 2D-only mode:', e && e.message ? e.message : e);
      var stage = document.getElementById('t17-stage');
      if (stage) {
        var fb = document.createElement('div');
        fb.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;color:#9aa4b2;font-size:13px;text-align:center;padding:24px;line-height:1.6;';
        fb.innerHTML = '3D preview needs an http(s) origin or a local server.<br>The builder on the left and the pricing below are fully functional in 2D.';
        stage.appendChild(fb);
      }
    }
  })();
})();
`;

// ---------------------------------------------------------------------------
// CSS — left/right two-column builder (Lucid Compose style)
// ---------------------------------------------------------------------------
const CSS = String.raw`
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0e1116;color:#e8e8e8;-webkit-font-smoothing:antialiased}
#t17-app{display:flex;width:100vw;height:100vh;overflow:hidden}

/* ---------- LEFT PANEL: bead selector (320px) ---------- */
#t17-left{width:336px;flex:0 0 336px;background:#161b22;border-right:1px solid #232a35;display:flex;flex-direction:column;overflow:hidden}
#t17-left h3{font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:#9aa4b2;margin:14px 14px 8px;font-weight:700}
.lh-title{padding:16px 14px 6px;font-size:16px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.lh-title .dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#b96f7f,#7a55a3)}

.scroll-area{overflow-y:auto;flex:1;padding-bottom:20px}

/* preset combo buttons */
#t17-presets{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 14px}
.preset-btn{background:#1f2630;border:1px solid #2c343f;border-radius:6px;padding:8px 9px;text-align:left;cursor:pointer;color:#dfe4ec;transition:border-color .15s,transform .1s}
.preset-btn:hover{border-color:#3a6ea5;transform:translateY(-1px)}
.preset-btn b{display:block;font-size:12.5px;font-weight:600;margin-bottom:2px}
.preset-btn span{display:block;font-size:10px;color:#7c8694;line-height:1.3}

/* color tabs */
#t17-color-tabs{display:flex;flex-wrap:wrap;gap:4px;padding:0 14px}
.color-tab{background:#1f2630;border:1px solid #2c343f;border-radius:12px;padding:4px 10px;font-size:11px;color:#9aa4b2;cursor:pointer;transition:all .12s}
.color-tab:hover{border-color:#3a6ea5;color:#cdd4de}
.color-tab.is-active{background:#2d6cdf;border-color:#2d6cdf;color:#fff}

/* bead grid */
#t17-bead-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:0 14px}
.bead-card{background:#1f2630;border:2px solid transparent;border-radius:8px;padding:8px 4px 6px;text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;transition:border-color .12s}
.bead-card:hover{border-color:#3a6ea5}
.bead-thumb{width:42px;height:42px;border-radius:50%;background-size:cover;background-position:center;box-shadow:inset -4px -4px 8px rgba(0,0,0,.45),inset 3px 3px 6px rgba(255,255,255,.25),0 2px 4px rgba(0,0,0,.4)}
.bead-meta{display:flex;flex-direction:column;align-items:center;line-height:1.2;width:100%}
.bead-meta b{font-size:10.5px;font-weight:600;color:#e8ecf2;display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap}
.bead-meta .tier{font-size:8px;font-style:normal;color:#ffd479;background:rgba(255,212,121,.12);padding:1px 4px;border-radius:3px;font-weight:700;letter-spacing:.3px}
.bead-meta small{font-size:9.5px;color:#7c8694}
.empty{padding:20px;color:#7c8694;font-size:12px;text-align:center}

/* ---------- RIGHT PANEL: 3D + toolbar + pricing (flex) ---------- */
#t17-right{flex:1;display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at center,#1a2030 0%,#0a0d12 100%)}

/* top toolbar */
#t17-toolbar{background:rgba(22,27,34,.92);border-bottom:1px solid #232a35;padding:10px 14px;display:flex;flex-wrap:wrap;gap:16px 22px;align-items:center}
.tb-group{display:flex;flex-direction:column;gap:6px}
.tb-label{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#7c8694;font-weight:700}
#t17-charms,#t17-cords,#t17-sizes{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.charm-btn{background:#1f2630;border:1px solid #2c343f;border-radius:6px;padding:5px 8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;color:#cdd4de;transition:border-color .12s}
.charm-btn:hover{border-color:#3a6ea5}
.charm-coin{width:26px;height:26px;border-radius:50%;background:linear-gradient(145deg,#f4dda1,#b58a2f);display:grid;place-items:center;font-size:8px;font-weight:800;color:#2b210c;box-shadow:inset -2px -2px 4px rgba(0,0,0,.35);overflow:hidden}
.charm-glyph{width:20px;height:20px;display:block;filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
.charm-btn small{font-size:9px;color:#7c8694}
.cord-btn{background:#1f2630;border:1px solid #2c343f;border-radius:6px;padding:6px 10px;cursor:pointer;color:#cdd4de;font-size:11.5px;display:flex;flex-direction:column;align-items:center;gap:1px;transition:border-color .12s}
.cord-btn small{font-size:9px;color:#7c8694}
.cord-btn.is-active{border-color:#2d6cdf;background:#1a2a44;color:#fff}
.size-btn{background:#1f2630;border:1px solid #2c343f;border-radius:6px;padding:6px 11px;cursor:pointer;color:#cdd4de;font-size:12px;font-weight:600;transition:border-color .12s}
.size-btn.is-active{border-color:#2d6cdf;background:#1a2a44;color:#fff}
#t17-wrist-wrap{display:flex;flex-direction:column;gap:6px;min-width:230px}
.wrist-row{display:flex;align-items:center;gap:6px}
#t17-wrist-num{width:74px;background:#0f1419;border:1px solid #2c343f;color:#fff;border-radius:6px;padding:6px 8px;font-size:13px;font-weight:600}
#t17-wrist-num:focus{outline:none;border-color:#2d6cdf}
.unit-toggle{display:inline-flex;background:#1f2630;border:1px solid #2c343f;border-radius:6px;overflow:hidden}
.unit-btn{background:transparent;border:0;color:#9aa4b2;padding:6px 9px;font-size:11px;font-weight:700;cursor:pointer}
.unit-btn.is-active{background:#2d6cdf;color:#fff}
.measure-btn{background:#1f2630;border:1px solid #2c343f;border-radius:6px;color:#cdd4de;width:32px;height:32px;display:grid;place-items:center;cursor:pointer;padding:0}
.measure-btn:hover{border-color:#3a6ea5}
.wrist-suggest{font-size:10.5px;color:#7c8694;line-height:1.45}
.wrist-suggest b{color:#ffd479;font-weight:700}
.measure-teach{margin-top:6px;background:#0f1419;border:1px solid #2c343f;border-radius:8px;padding:10px}
.measure-teach[hidden]{display:none}
.measure-teach-inner{display:flex;gap:12px;align-items:flex-start}
.measure-teach-inner p{font-size:11px;color:#cdd4de;line-height:1.55;flex:1}
.measure-teach-inner p b{color:#7fd1ff}
.quick-sizes{display:flex;gap:5px;margin-top:6px;flex-wrap:wrap}
.quick-size{background:#1f2630;border:1px solid #2c343f;border-radius:6px;padding:4px 8px;cursor:pointer;color:#cdd4de;font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;line-height:1.2}
.quick-size small{font-size:8.5px;color:#7c8694;font-weight:400}
.quick-size:hover{border-color:#3a6ea5}
#t17-wrist{width:100%;accent-color:#2d6cdf;cursor:pointer}

/* draft toast (PRD R9) */
#t17-draft-toast{position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(15,20,25,.96);border:1px solid #2d6cdf;color:#e8ecf2;padding:9px 12px;border-radius:8px;font-size:12px;display:flex;align-items:center;gap:10px;max-width:78%;box-shadow:0 6px 22px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}
#t17-draft-toast.show{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(2px)}
#t17-draft-toast .draft-msg{line-height:1.4}
#t17-draft-toast .draft-cta{background:#2d6cdf;border:0;color:#fff;border-radius:5px;padding:5px 9px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap}
#t17-draft-toast .draft-cta:hover{background:#2257b8}
#t17-draft-toast .draft-x{background:transparent;border:0;color:#7c8694;font-size:14px;cursor:pointer;padding:2px 4px}
#t17-draft-toast .draft-x:hover{color:#fff}

/* 3D stage */
#t17-stage{flex:1;position:relative;min-height:0}
#t17-canvas{display:block;width:100%;height:100%}
#t17-hint{position:absolute;top:12px;left:12px;background:rgba(0,0,0,.5);padding:7px 11px;border-radius:6px;font-size:11px;line-height:1.55;color:#cdd4de;pointer-events:none;max-width:240px}
#t17-hint b{color:#7fd1ff}
#t17-sel-actions{position:absolute;top:12px;right:12px;background:rgba(0,0,0,.6);padding:8px 12px;border-radius:6px;display:flex;align-items:center;gap:8px;font-size:12px;color:#e8ecf2;max-width:60%;flex-wrap:wrap}
#t17-sel-actions:empty{display:none}
#t17-sel-actions b{color:#ffd479}
#t17-sel-actions .mini{background:#2d3540;border:1px solid #3a4452;color:#fff;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer}
#t17-sel-actions .mini:hover{background:#3a4452}
#t17-sel-actions .mini.danger{background:#5a2722;border-color:#7a3328}
#t17-sel-actions .mini.danger:hover{background:#7a3328}
#t17-flash{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(45,108,223,.95);color:#fff;padding:8px 16px;border-radius:6px;font-size:12.5px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .2s;max-width:80%;text-align:center}
#t17-flash.show{opacity:1}

/* bottom pricing + sequence strip */
#t17-bottom{background:rgba(22,27,34,.96);border-top:1px solid #232a35;padding:10px 14px;display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:stretch}
#t17-seq-wrap{min-width:0}
#t17-seq-wrap .tb-label{display:block;margin-bottom:6px}
#t17-seq{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;align-items:stretch}
.seq-item{flex:0 0 auto;background:#1f2630;border:2px solid transparent;border-radius:8px;padding:6px 8px;cursor:pointer;display:flex;align-items:center;gap:7px;min-width:120px;transition:border-color .12s}
.seq-item:hover{border-color:#3a6ea5}
.seq-item.is-selected{border-color:#ffd479;box-shadow:0 0 0 2px rgba(255,212,121,.18)}
.seq-dot{width:26px;height:26px;border-radius:50%;flex:0 0 26px;background-size:cover;background-position:center;box-shadow:inset -3px -3px 6px rgba(0,0,0,.4)}
.seq-dot.charm-dot{background:linear-gradient(145deg,#f4dda1,#b58a2f);display:grid;place-items:center;font-size:8px;font-weight:800;color:#2b210c;background-size:18px 18px;background-position:center;background-repeat:no-repeat}
.seq-item small{font-size:11px;color:#cdd4de;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#t17-price{background:#0f1419;border:1px solid #232a35;border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:3px}
.price-rows .pr{display:flex;justify-content:space-between;font-size:11.5px;color:#9aa4b2;padding:1px 0}
.price-total{display:flex;justify-content:space-between;border-top:1px solid #2c343f;margin-top:6px;padding-top:7px;font-size:19px;font-weight:700;color:#ffd479}
.price-fit{font-size:10.5px;color:#7c8694;margin-top:4px}
.price-fit.ok{color:#6abf6a}.price-fit.over{color:#e57373}
#t17-add-cart{margin-top:8px;background:#2d6cdf;color:#fff;border:0;border-radius:6px;padding:9px;font-size:13px;font-weight:700;cursor:pointer}
#t17-add-cart:hover{background:#2257b8}

/* scrollbars */
.scroll-area::-webkit-scrollbar,#t17-bead-grid::-webkit-scrollbar,#t17-seq::-webkit-scrollbar{width:8px;height:8px}
.scroll-area::-webkit-scrollbar-thumb,#t17-bead-grid::-webkit-scrollbar-thumb,#t17-seq::-webkit-scrollbar-thumb{background:#2c343f;border-radius:4px}
.scroll-area::-webkit-scrollbar-track,#t17-bead-grid::-webkit-scrollbar-track,#t17-seq::-webkit-scrollbar-track{background:transparent}

/* ---------- mobile: stack vertically ---------- */
@media(max-width:820px){
  #t17-app{flex-direction:column;height:auto;min-height:100vh;overflow:auto}
  #t17-left{width:100%;flex:0 0 auto;max-height:none;border-right:0;border-bottom:1px solid #232a35}
  .scroll-area{overflow:visible}
  #t17-right{flex:1 1 auto}
  #t17-stage{min-height:380px}
  #t17-bottom{grid-template-columns:1fr}
}
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>T17 Crystal Bracelet Builder — Step 2 Local Prototype</title>
<style>${CSS}</style>
</head>
<body>
<div id="t17-app">
  <!-- LEFT: bead selector (presets + color tabs + stone library) -->
  <aside id="t17-left">
    <div class="lh-title"><span class="dot"></span> Earthward Composer</div>
    <h3>Quick templates</h3>
    <div id="t17-presets"></div>
    <h3>Filter by color</h3>
    <div id="t17-color-tabs"></div>
    <h3>Stone library (20)</h3>
    <div class="scroll-area"><div id="t17-bead-grid"></div></div>
  </aside>

  <!-- RIGHT: 3D + toolbar + pricing -->
  <section id="t17-right">
    <div id="t17-toolbar">
      <div class="tb-group" id="t17-charms-wrap"><div id="t17-charms"></div></div>
      <div class="tb-group" id="t17-cords-wrap"><div id="t17-cords"></div></div>
      <div class="tb-group" id="t17-sizes-wrap"><div id="t17-sizes"></div></div>
      <div class="tb-group" id="t17-wrist-wrap"></div>
    </div>
    <div id="t17-stage">
      <canvas id="t17-canvas"></canvas>
      <div id="t17-hint"><b>Step-2 Builder</b><br>Drag empty = rotate · Drag a bead = reorder · Drag off-ring = delete<br>Scroll/pinch = zoom · Click bead card to add</div>
      <div id="t17-sel-actions"></div>
      <div id="t17-flash"></div>
      <div id="t17-draft-toast" role="status" aria-live="polite"></div>
    </div>
    <div id="t17-bottom">
      <div id="t17-seq-wrap">
        <span class="tb-label">Strand sequence</span>
        <div id="t17-seq"></div>
      </div>
      <div>
        <div id="t17-price"></div>
        <button type="button" id="t17-add-cart">Add custom bracelet to cart</button>
      </div>
    </div>
  </section>
</div>

<script type="application/json" id="t17-data">${DATA_BLOCK}</script>

<!-- Self-hosted Three.js r160 (no CDN dependency). importmap uses ABSOLUTE
     file:// URLs because Chromium's file:// origin refuses to resolve relative
     bare-specifier module paths from an importmap even with
     --allow-file-access-from-files. Absolute file:// URLs resolve reliably. -->
<script type="importmap">
{
  "imports": {
    "three": "${VENDOR_FILE_URL}three.module.min.js",
    "three/addons/": "${VENDOR_FILE_URL}"
  }
}
</script>
<script type="module">
${APP_JS}
</script>
</body>
</html>`;

fs.writeFileSync(OUT_PATH, html, 'utf8');
console.log('T17 Step-2 builder generated:', OUT_PATH);
console.log('parts:', PARTS_PATH);
console.log('prices:', PRICES_PATH);
console.log('beads=' + parts.beads.length + ' charms=' + parts.charms.length + ' cords=' + parts.cords.length + ' presets=' + parts.presets.length);
