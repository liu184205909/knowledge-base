/**
 * T17 Crystal Bracelet Builder 鈥?Step 3 DEPLOY generator (WP-adapted).
 *
 * Builds on the Step 2 generator (interaction completeness) and layers the
 * WP-deployment adaptations the production page needs:
 *   - CDN importmap (jsdelivr three@0.160.0) instead of file:// vendor URLs,
 *       with a self-host fallback the operator can flip via HOST_MODE.
 *   - JS base64 wrapping (memory wp-html-block-js-base64, MANDATORY): the APP
 *       JS contains pointer-drag `&&`, `<` comparisons and CJK strings that
 *       wp_kses_post would otherwise mangle inside <!-- wp:html -->.
 *   - parts JSON delivered as ascii-escaped application/json block (CJK
 *       name_cn 鈫?\uXXXX so non-ASCII bytes never hit wp_kses).
 *   - Add-to-cart wired to admin-ajax action=t17_add_custom_bracelet (Step 0
 *       Code Snippet id=20 endpoint), with cart toast + "View cart" link.
 *
 * Host mode: set HOST_MODE=selfhost to emit the self-hosted importmap
 * (/wp-content/uploads/builder/vendor/...) 鈥?the operator uploads the three
 * vendor files there via WP media. Default = CDN (simplest, no upload).
 *
 * Outputs:
 *   - ./crystal-bracelet-builder-wp-fragment.html  (paste/deploy into <!-- wp:html -->)
 *   - ./crystal-bracelet-builder-preview.html      (local preview wrapper)
 * Run: node generate-deploy.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'data', 'parts-source.json');
const OUT_PATH = path.join(__dirname, 'crystal-bracelet-builder-wp-fragment.html');
const PREVIEW_PATH = path.join(__dirname, 'crystal-bracelet-builder-preview.html');
const TRAY_PATH = path.join(__dirname, 'tray-assets', 'tray-default.png');

// Host mode: 'cdn' (default, jsdelivr) or 'selfhost' (/wp-content/uploads/builder/vendor/).
// Flip via env var HOST_MODE=selfhost once the vendor files are uploaded.
const HOST_MODE = (process.env.HOST_MODE || 'cdn').toLowerCase() === 'selfhost' ? 'selfhost' : 'cdn';
const THREE_BASE = HOST_MODE === 'selfhost'
  ? '/wp-content/uploads/builder/vendor/'
  : 'https://cdn.jsdelivr.net/npm/three@0.160.0/';
const IMPORTMAP = {
  three: THREE_BASE + (HOST_MODE === 'selfhost' ? 'three.module.min.js' : 'build/three.module.js'),
  'three/addons/': THREE_BASE + (HOST_MODE === 'selfhost' ? '' : 'examples/jsm/')
};

const source = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf8'));
const TRAY_DATA_URI = 'data:image/png;base64,' + fs.readFileSync(TRAY_PATH).toString('base64');

function fail(msg) { throw new Error('[T17 deploy build] ' + msg); }
function assertArray(name, value, min) {
  if (!Array.isArray(value) || value.length < min) fail(name + ' must contain at least ' + min + ' items');
}

// PRD R5: validate source (same checks as Step 2 鈥?single source of truth).
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

validateSource(source);
const parts = compactParts(source);

// asciiJSON: non-ASCII 鈫?\uXXXX so wp_kses never sees raw multi-byte chars
// that would corrupt the JSON block. Also escape </ to prevent </script> breakout.
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON(parts);
const DATA_B64 = Buffer.from(DATA_BLOCK, 'utf8').toString('base64');

// ---------------------------------------------------------------------------
// Application JS (WP-deploy: base64-wrapped, runs via atob鈫抏val loader).
// Step 3 change vs Step 2: handleAddToCart now POSTs to admin-ajax
// action=t17_add_custom_bracelet (Code Snippet id=20 endpoint) instead of
// console.log. Everything else is the Step 2 interaction surface unchanged.
// ---------------------------------------------------------------------------
const APP_JS = String.raw`(function () {
  'use strict';

  // Three.js is loaded dynamically so the UI (which does not need THREE) always
  // renders even if the module fetch fails. 3D is progressive enhancement.
  var THREE = null;
  var OrbitControls = null;

  var parts = JSON.parse(atob(document.getElementById('t17-data').textContent));
  var settings = parts.settings || {};
  var STORAGE_KEY = 't17-step1-draft';
  var TRAY_IMAGE_SRC = '${TRAY_DATA_URI}';
  var trayImage = new Image();
  trayImage.decoding = 'async';
  trayImage.onload = function () { draw2DBracelet(); };
  trayImage.src = TRAY_IMAGE_SRC;

  // WP admin-ajax URL + builder product id (catalog_hidden product 49026).
  var AJAX_URL = (window.T17_AJAX_URL) || '/wp-admin/admin-ajax.php';
  var PRODUCT_ID = (window.T17_PRODUCT_ID) || 49026;

  var beadMap = indexBy(parts.beads);
  var charmMap = indexBy(parts.charms);
  var cordMap = indexBy(parts.cords);

  var state = {
    wristCm: settings.defaultWristCm || 16,
    wristUnit: 'cm',       // F8: cm | in
    heightCm: 165,
    weightKg: 46,
    beadSizeMm: settings.defaultBeadSizeMm || 8,
    cord: 'elastic_black',
    sequence: [],          // [{type:'bead',id,size_mm} | {type:'charm',id,slotWeight}]
    selected: -1,
    filterColor: 'all',
    filterType: 'all',
    categoryView: 'color',
    dimensionOpen: false,
    sizeOpen: false,
    catalogMode: 'bead',
    seqView: 'bead',
    viewMode: '2d',
    beadLayout: 'gathered'
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
  function titleCase(text) {
    return String(text || '').toLowerCase().replace(/\b[a-z]/g, function (m) { return m.toUpperCase(); });
  }

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
  function estimateWristFromBody(heightCm, weightKg) {
    var h = clamp(Number(heightCm) || 165, 145, 190);
    var w = clamp(Number(weightKg) || 46, 35, 100);
    var cm = 14.6 + (h - 165) * 0.045 + (w - 46) * 0.055;
    return clamp(Math.round(cm * 10) / 10, settings.minWristCm || 13, settings.maxWristCm || 20);
  }
  // F8 (PRD R3): the builder uses discrete slots, not circular bead packing.
  function suggestedBeadCount() {
    return targetSlots();
  }
  function beadPathRatio(sizeMm) {
    var s = Number(sizeMm || state.beadSizeMm || 8);
    // Only actual items are laid out. Charms/accessories compress spacing when
    // added; no empty future slots are reserved on the tray.
    var ratio = s <= 6 ? 0.31 : s <= 8 ? 0.33 : s <= 10 ? 0.35 : 0.365;
    return clamp(ratio, 0.30, 0.37);
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
  function estimateWeightG() {
    var total = 0;
    state.sequence.forEach(function (it) {
      if (it.type === 'bead') {
        var mm = Number(it.size_mm || state.beadSizeMm);
        total += Math.pow(mm, 3) * 0.00135;
      } else if (it.type === 'charm') {
        total += 1.2 * Number(it.slotWeight || 1);
      }
    });
    if (state.sequence.length) total += 0.5;
    return total;
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
  function colorSwatch(id) {
    return ({
      all: 'linear-gradient(135deg,#efe7dc,#ffffff 48%,#c8b59a)',
      purple: '#7a4db2',
      pink: '#e6a7bd',
      red: '#b34b47',
      orange: '#c97137',
      yellow: '#d4a22e',
      gold: '#b98925',
      green: '#2f7d58',
      blue: '#6a9fbd',
      black: '#2e2b2a',
      clear: '#d9dde3',
      white: '#eee9e2',
      multi: 'linear-gradient(135deg,#7a4db2,#e6a7bd,#d4a22e,#2f7d58,#6a9fbd)'
    })[id] || '#d9d2ca';
  }
  function beadMatchesColor(b, color) {
    if (color === 'all') return true;
    return (b.color || []).indexOf(color) >= 0;
  }
  function beadMatchesActiveFilters(b) {
    var byType = state.filterType === 'all' || b.id === state.filterType;
    var byColor = state.filterColor === 'all' || beadMatchesColor(b, state.filterColor);
    return byType && byColor;
  }
  var SHAPE_PRODUCTS = [
    { id: 'shape_freeform_quartz', name: 'Clear Quartz Freeform', price: 8, size: '10mm', note: 'natural shape' },
    { id: 'shape_clear_bear', name: 'Clear Quartz Bear', price: 12, size: '12mm', note: 'carved bead' },
    { id: 'shape_moonstone_drop', name: 'Moonstone Drop', price: 9, size: '9mm', note: 'soft glow' },
    { id: 'shape_obsidian_figure', name: 'Obsidian Figure', price: 10, size: '15mm', note: 'carved form' }
  ];
  var SPACER_PRODUCTS = [
    { id: 'spacer_silver', name: 'Silver Spacer', price: 2, size: '4mm', note: 'roundel' },
    { id: 'spacer_gold', name: 'Gold Spacer', price: 2, size: '4mm', note: 'warm metal' },
    { id: 'spacer_rondelle', name: 'Clear Rondelle', price: 3, size: '6mm', note: 'sparkle' },
    { id: 'spacer_matte', name: 'Matte Divider', price: 1.5, size: '5mm', note: 'soft break' }
  ];
  var PACKAGING_PRODUCTS = [
    { id: 'pack_basic', name: 'Basic Pouch', price: 0, size: 'Gift ready', note: 'included' },
    { id: 'pack_gift_box', name: 'Gift Box', price: 6, size: 'Box', note: 'gift packaging' },
    { id: 'pack_premium_box', name: 'Premium Gift Box', price: 15, size: 'Box', note: 'premium packaging' }
  ];

  // --- Procedural crystal texture (canvas) 鈥?shared by 3D bead + 2D thumbnail ---
  function makeBeadTexture(bead) {
    var key = bead.id;
    if (textureCache[key]) return textureCache[key];
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var ctx = c.getContext('2d');
    var col = bead.textureColors || ['#888', '#ddd', '#222'];
    var base = col[0], light = col[1], dark = col[2];
    var g = ctx.createRadialGradient(92, 80, 14, 128, 128, 180);
    g.addColorStop(0, light);
    g.addColorStop(0.28, base);
    g.addColorStop(1, dark);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    ctx.globalAlpha = 0.20;
    for (var i = 0; i < 9; i++) {
      ctx.fillStyle = i % 2 ? light : dark;
      var y = 14 + i * 28 + Math.sin(i * 1.3) * 10;
      ctx.fillRect(0, y, 256, 8 + (i % 4) * 4);
    }
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
    if (!bead._thumb) bead._thumb = c.toDataURL('image/png');
    return tex;
  }

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

  var MEASURE_ICON_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="9" width="14" height="6" rx="1"/><path d="M5 9v6M8 9v6M11 9v6M14 9v6"/>' +
    '<path d="M17 12h4"/></svg>';
  var MEASURE_TEACH_SVG = '<svg viewBox="0 0 220 110" width="220" height="110" fill="none" stroke="#cdd4de" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M10 70 Q40 60 70 64 L78 50 Q80 42 88 40 L120 36 Q128 36 130 44 L132 70" stroke-width="1.6"/>' +
    '<path d="M88 40 L92 24 Q94 18 100 19 L106 22" stroke-width="1.4"/>' +
    '<path d="M70 64 Q74 70 80 64" stroke="#7fd1ff"/>' +
    '<text x="56" y="86" font-size="9" fill="#7fd1ff" font-family="sans-serif">wrist bone</text>' +
    '<ellipse cx="80" cy="62" rx="20" ry="9" stroke="#ffd479" stroke-dasharray="3 2"/>' +
    '<path d="M60 62 L52 58 M100 62 L108 58" stroke="#ffd479"/>' +
    '<text x="150" y="40" font-size="10" fill="#ffd479" font-family="sans-serif">soft tape</text>' +
    '<path d="M148 44 Q130 50 110 56" stroke="#ffd479" stroke-dasharray="2 2"/>' +
    '<text x="150" y="74" font-size="9" fill="#9aa4b2" font-family="sans-serif">snug, not tight</text>' +
    '</svg>';

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
        ctx.beginPath();
        ctx.moveTo(cx - R * 0.7, cy + R * 0.9);
        ctx.quadraticCurveTo(cx - R * 0.8, cy - R * 0.4, cx - R * 0.45, cy - R * 0.7);
        ctx.quadraticCurveTo(cx, cy - R * 1.15, cx + R * 0.45, cy - R * 0.7);
        ctx.quadraticCurveTo(cx + R * 0.8, cy - R * 0.4, cx + R * 0.7, cy + R * 0.9);
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy - R * 0.85, R * 0.18, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx - R * 0.22, cy - R * 0.05, R * 0.16, 0.1, Math.PI - 0.1); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + R * 0.22, cy - R * 0.05, R * 0.16, 0.1, Math.PI - 0.1); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy + R * 0.35, R * 0.12, 0, Math.PI); ctx.stroke();
        break;
      }
      case 'om': {
        ctx.font = 'bold ' + (size * 0.55) + 'px Georgia, "Noto Sans", serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('OM', cx, cy + size * 0.02);
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
        ctx.arc(cx, cy - R * 0.75, R * 0.22, 0, Math.PI * 2); ctx.stroke();
        ctx.moveTo(cx, cy - R * 0.53); ctx.lineTo(cx, cy + R * 0.85);
        ctx.moveTo(cx - R * 0.45, cy - R * 0.15); ctx.lineTo(cx + R * 0.45, cy - R * 0.15);
        ctx.beginPath();
        ctx.moveTo(cx - R * 0.75, cy + R * 0.45);
        ctx.quadraticCurveTo(cx - R * 0.7, cy + R * 0.95, cx, cy + R * 0.85);
        ctx.quadraticCurveTo(cx + R * 0.7, cy + R * 0.95, cx + R * 0.75, cy + R * 0.45);
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

  function renderLeft() {
    renderCategoryList();
    renderBeadGrid();
  }

  function renderCategoryList() {
    var cats = document.getElementById('t17-category-list');
    var heading = document.getElementById('t17-category-heading');
    if (!cats || !heading) return;
    if (state.catalogMode === 'bead') {
      heading.innerHTML =
        '<button type="button" class="cat-switch-btn' + (state.categoryView === 'color' ? ' is-active' : '') + '" data-cat-view="color">Color</button>' +
        '<button type="button" class="cat-switch-btn' + (state.categoryView === 'type' ? ' is-active' : '') + '" data-cat-view="type">Type</button>';
      if (state.categoryView === 'type') {
        cats.innerHTML = ['all'].concat(parts.beads.map(function (b) { return b.id; })).map(function (id) {
          var bead = beadMap[id];
          var label = id === 'all' ? 'All' : titleCase(bead.name_en);
          var thumb = bead && bead._thumb ? 'background-image:url(' + bead._thumb + ')' : '--cat-color:' + colorSwatch('all');
          return '<button type="button" class="cat-row' + (state.filterType === id ? ' is-active' : '') + '" data-type-filter="' + id + '">' +
            '<span class="cat-mark" style="' + thumb + '"></span><span>' + label + '</span></button>';
        }).join('');
      } else {
        cats.innerHTML = COLOR_TABS.map(function (t) {
          return '<button type="button" class="cat-row' + (state.filterColor === t.id ? ' is-active' : '') + '" data-color="' + t.id + '">' +
            '<span class="cat-mark" style="--cat-color:' + colorSwatch(t.id) + '"></span><span>' + titleCase(t.label) + '</span></button>';
        }).join('');
      }
      return;
    }
    if (state.catalogMode === 'charm') {
      heading.textContent = 'Charms';
      cats.innerHTML = '<button type="button" class="cat-row is-active" data-charm-cat="all"><span class="cat-mark"></span><span>All</span></button>';
      return;
    }
    if (state.catalogMode === 'cord') {
      heading.textContent = 'Cord';
      cats.innerHTML = '<button type="button" class="cat-row is-active"><span class="cat-mark"></span><span>All</span></button>';
      return;
    }
    heading.textContent = state.catalogMode === 'shape' ? 'Accessories' : 'Packaging';
    var rows = state.catalogMode === 'shape'
      ? ['All', 'Spacers', 'Floral', 'Zodiac', 'Decor', 'Caps']
      : ['All'];
    cats.innerHTML = rows.map(function (label, i) {
      return '<button type="button" class="cat-row' + (i === 0 ? ' is-active' : '') + '" disabled><span class="cat-mark"></span><span>' + label + '</span></button>';
    }).join('');
  }

  function renderBeadGrid() {
    var grid = document.getElementById('t17-bead-grid');
    if (!grid) return;
    var tabs = document.getElementById('t17-catalog-tabs');
    if (tabs) {
      tabs.querySelectorAll('[data-mode]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-mode') === state.catalogMode);
      });
    }
    if (state.catalogMode === 'bead') {
      var list = parts.beads.filter(beadMatchesActiveFilters);
      if (!list.length) { grid.innerHTML = '<p class="empty">No stones in this category.</p>'; return; }
      grid.innerHTML = list.map(function (b) {
        var price = beadPrice(b.id, state.beadSizeMm);
        var tierTag = b.tier === 'premium' ? '<em class="tier">Premium</em>' : '';
        return '<button type="button" class="bead-card" data-bead="' + b.id + '" title="' + (b.description_short || '') + '">' +
          '<span class="bead-thumb large" style="background-image:url(' + (b._thumb || '') + ')"></span>' +
          '<span class="bead-meta"><b>' + b.name_en + tierTag + '</b>' +
          '<small>' + money(price) + '</small></span></button>';
      }).join('');
      return;
    }
    if (state.catalogMode === 'charm') {
      ensureGlyphDataUrls();
      var charms = parts.charms.filter(function (c) {
        return state.filterColor === 'all' || !state.filterColor || c.category === state.filterColor;
      });
      grid.innerHTML = charms.map(function (c) {
        var gUrl = _glyphDataUrls && _glyphDataUrls[c.symbol];
        return '<button type="button" class="bead-card charm-card" data-charm="' + c.id + '" title="' + c.description_short + '">' +
          '<span class="charm-coin card-coin">' + (gUrl ? '<img src="' + gUrl + '" alt="" class="charm-glyph" draggable="false">' : charmMark(c.symbol)) + '</span>' +
          '<span class="bead-meta"><b>' + c.name_en + '</b><small>' + c.material + ' - ' + money(c.price) + '</small></span></button>';
      }).join('');
      return;
    }
    if (state.catalogMode === 'cord') {
      grid.innerHTML = parts.cords.map(function (c) {
        return '<button type="button" class="bead-card cord-card' + (state.cord === c.id ? ' is-selected' : '') + '" data-cord="' + c.id + '" title="' + c.description_short + '">' +
          '<span class="cord-thumb ' + c.id + '"></span><span class="bead-meta"><b>' + c.name_en + '</b><small>' + c.material + ' - ' + money(c.price) + '</small></span></button>';
      }).join('');
      return;
    }
    var spacerNames = state.catalogMode === 'shape' ? SPACER_PRODUCTS : PACKAGING_PRODUCTS;
    grid.innerHTML = spacerNames.map(function (s) {
      return '<button type="button" class="bead-card spacer-card" disabled title="SKU pending">' +
        '<span class="spacer-thumb"></span><span class="bead-meta"><b>' + s.name + '</b><small>' + s.size + ' - ' + money(s.price) + '</small></span>' +
        (state.catalogMode === 'shape' ? '<em class="unavailable">Pending</em>' : '') + '</button>';
    }).join('');
  }

  function renderToolbar() {
    var charmCount = state.sequence.filter(function (i) { return i.type === 'charm'; }).length;
    ensureGlyphDataUrls();
    var charmEl = document.getElementById('t17-charms');
    if (charmEl) {
      charmEl.innerHTML = '<span class="tb-label">Charm ' + charmCount + '/' + (settings.maxCharms || 5) + '</span>' +
        parts.charms.map(function (c) {
          var gUrl = _glyphDataUrls && _glyphDataUrls[c.symbol];
          var coinInner = gUrl
            ? '<img src="' + gUrl + '" alt="" class="charm-glyph" draggable="false">'
            : charmMark(c.symbol);
          return '<button type="button" class="charm-btn" data-charm="' + c.id + '" title="' + c.name_en + ' ' + money(c.price) + '">' +
            '<span class="charm-coin">' + coinInner + '</span><small>' + c.name_en + '</small></button>';
        }).join('');
    }

    var sizeEl = document.getElementById('t17-sizes');
    if (sizeEl) sizeEl.innerHTML = '';

    var wristEl = document.getElementById('t17-wrist-wrap');
    if (!wristEl) return;
    var suggested = suggestedBeadCount();
    var fitAllow = Number(settings.fitAllowanceCm || 1.5);
    var displayCm = Number(state.wristCm).toFixed(1).replace(/\.0$/, '');
    var recommendedCm = estimateWristFromBody(state.heightCm, state.weightKg).toFixed(1).replace(/\.0$/, '');
    var sizeOptions = [6,8,10,12].map(function (s) {
      return '<button type="button" class="stage-size-btn' + (Number(state.beadSizeMm) === s ? ' is-active' : '') + '" data-size="' + s + '">' + s + 'mm</button>';
    }).join('');
    var selectOptions = [6,8,10,12].map(function (s) {
      return '<option value="' + s + '"' + (Number(state.beadSizeMm) === s ? ' selected' : '') + '>' + s + 'mm</option>';
    }).join('');
    wristEl.innerHTML =
      '<button type="button" id="t17-dimension-toggle" class="dimension-pill" aria-expanded="' + (state.dimensionOpen ? 'true' : 'false') + '">' +
        '<span class="dimension-hand" aria-hidden="true">&#9995;</span>' +
        '<span class="dimension-copy"><small>Hand Dimension</small><b>' + displayCm + ' cm</b></span>' +
      '</button>' +
      '<button type="button" class="stage-size-row' + (state.sizeOpen ? ' is-open' : '') + '" aria-label="bead size" aria-expanded="' + (state.sizeOpen ? 'true' : 'false') + '"><span>Bead Size</span><strong>' + state.beadSizeMm + 'mm</strong><i aria-hidden="true"></i><div class="stage-size-options">' + sizeOptions + '</div><select id="t17-bead-size-select" class="stage-size-select" aria-label="Bead Size">' + selectOptions + '</select></button>' +
      '<div class="dimension-popover' + (state.dimensionOpen ? ' is-open' : '') + '" role="dialog" aria-modal="true" aria-label="Customize wrist size">' +
        '<div class="dimension-modal-head"><b>Customize Wrist</b><button type="button" id="t17-dimension-close" aria-label="Close">×</button></div>' +
        '<div class="dimension-field body-measure-field">' +
          '<div class="dimension-field-head"><span>Height*</span><strong>' + state.heightCm + 'cm</strong></div>' +
          '<div class="ruler-card measure-ruler"><input id="t17-height" type="range" min="145" max="190" step="1" value="' + state.heightCm + '"><div class="ruler-ticks"><span>150</span><span>165</span><span>180</span></div></div>' +
        '</div>' +
        '<div class="dimension-field body-measure-field">' +
          '<div class="dimension-field-head"><span>Weight*</span><strong>' + state.weightKg + 'kg</strong></div>' +
          '<div class="ruler-card measure-ruler"><input id="t17-weight" type="range" min="35" max="100" step="1" value="' + state.weightKg + '"><div class="ruler-ticks"><span>35</span><span>50</span><span>70</span></div></div>' +
        '</div>' +
        '<div class="wrist-recommend wrist-edit"><span>Recommended circumference (editable)</span><label><input id="t17-wrist-num" type="number" min="' + settings.minWristCm + '" max="' + settings.maxWristCm + '" step="0.1" value="' + displayCm + '" inputmode="decimal" aria-label="Recommended wrist circumference"><b>cm</b></label></div>' +
        '<div class="quick-size-head"><b>Common sizes</b><span>Click a card to fill</span></div>' +
        '<div class="quick-sizes">' +
          [{k:'13cm',v:13,d:'Slim wrist'},{k:'14cm',v:14,d:'Small wrist'},{k:'15cm',v:15,d:'Fine wrist'},{k:'16cm',v:16,d:'Regular'},{k:'17cm',v:17,d:'Relaxed'},{k:'18cm',v:18,d:'Large wrist'},{k:'19cm',v:19,d:'Loose fit'},{k:'20cm',v:20,d:'Big wrist'}].map(function(q){
            return '<button type="button" class="quick-size" data-quick="' + q.v + '"><b>' + q.k + '</b><small>' + q.d + '</small></button>';
          }).join('') +
        '</div>' +
        '<div class="wrist-suggest">Body estimate: <b>' + recommendedCm + 'cm</b> · target slots: <b>' + suggested + '</b> · fit +' + fitAllow + 'cm</div>' +
        '<div class="measure-teach" id="t17-measure-teach" hidden>' +
          '<div class="measure-teach-inner">' +
            MEASURE_TEACH_SVG +
            '<p>Wrap a soft tailor\'s tape around the wrist bone, then add about 1.5cm for comfort.</p>' +
          '</div>' +
        '</div>' +
        '<button type="button" id="t17-dimension-confirm">Confirm Settings</button>' +
      '</div>';
  }
  function renderPricing() {
    var beadCount = state.sequence.filter(function (i) { return i.type === 'bead'; }).length;
    var charmCount = state.sequence.filter(function (i) { return i.type === 'charm'; }).length;
    var beadTotal = 0;
    state.sequence.forEach(function (it) { if (it.type === 'bead') beadTotal += beadPrice(it.id, it.size_mm || state.beadSizeMm); });
    var charmTotal = 0;
    state.sequence.forEach(function (it) { if (it.type === 'charm' && charmMap[it.id]) charmTotal += Number(charmMap[it.id].price); });
    var cordTotal = cordMap[state.cord] ? Number(cordMap[state.cord].price) : 0;
    var accessoryTotal = 0;
    state.sequence.forEach(function (it) {
      if (it.type === 'shape') {
        var shape = SHAPES.find(function (s) { return s.id === it.id; });
        if (shape) accessoryTotal += Number(shape.price || 0);
      } else if (it.type === 'spacer') {
        var spacer = SPACERS.find(function (s) { return s.id === it.id; });
        if (spacer) accessoryTotal += Number(spacer.price || 0);
      }
    });
    var grandTotal = beadTotal + charmTotal + cordTotal + accessoryTotal;
    var diff = targetSlots() - usedSlots();
    var fitMsg = diff > 0 ? 'Add ' + diff + ' more to fill' : diff < 0 ? 'Over by ' + Math.abs(diff) : 'Perfect fit';
    var summary = document.getElementById('t17-design-summary');
    if (summary) {
      summary.innerHTML =
        '<span><em>Wrist</em><strong>' + Number(state.wristCm).toFixed(1).replace(/\\.0$/, '') + ' cm</strong></span>' +
        '<span><em>Bead Size</em><strong>' + state.beadSizeMm + 'mm</strong></span>' +
        '<span><em>Slots</em><strong>' + usedSlots() + '/' + targetSlots() + '</strong></span>' +
        '<span><em>Weight</em><strong>~' + estimateWeightG().toFixed(1) + 'g</strong></span>';
    }
    var cordName = cordMap[state.cord] ? cordMap[state.cord].name_en.replace(' Cord', '') : 'Cord';
    document.getElementById('t17-price').innerHTML =
      '<div class="price-rows">' +
        '<div class="pr"><span class="pr-label">Beads</span><strong>' + money(beadTotal) + '</strong></div>' +
        '<div class="pr"><span class="pr-label">Charms</span><strong>' + money(charmTotal) + '</strong></div>' +
        '<div class="pr pr-cord"><span class="pr-label">Cord <em>' + cordName + '</em></span><strong>' + money(cordTotal) + '</strong></div>' +
        '<div class="pr"><span class="pr-label">Accessories</span><strong>' + money(accessoryTotal) + '</strong></div>' +
      '</div>' +
      '<div class="price-total-col"><span>Total</span><strong>' + money(grandTotal) + '</strong></div>';
    var checkoutNote = document.getElementById('t17-checkout-note');
    if (checkoutNote) {
      checkoutNote.className = 'checkout-note ' + (diff === 0 ? 'ok' : diff < 0 ? 'over' : '');
      checkoutNote.textContent = diff > 0 ? 'Need ' + diff + ' more beads' : diff < 0 ? 'Over by ' + Math.abs(diff) + ' beads' : 'Ready to checkout';
    }
    var checkoutTotal = document.getElementById('t17-checkout-total');
    if (checkoutTotal) {
      checkoutTotal.innerHTML = '<span>Total</span><strong>' + money(grandTotal) + '</strong>';
    }
  }

  function renderSequenceStrip() {
    var summaryEl = document.getElementById('t17-seq-summary');
    var el = document.getElementById('t17-seq');
    ensureGlyphDataUrls();
    var beadItems = state.sequence.map(function (it, i) { return { item: it, index: i }; }).filter(function (row) { return row.item.type === 'bead'; });
    var charmItems = state.sequence.map(function (it, i) { return { item: it, index: i }; }).filter(function (row) { return row.item.type === 'charm'; });
    var shapeItems = state.sequence.map(function (it, i) { return { item: it, index: i }; }).filter(function (row) { return row.item.type === 'shape'; });
    var spacerItems = state.sequence.map(function (it, i) { return { item: it, index: i }; }).filter(function (row) { return row.item.type === 'spacer'; });
    var cord = cordMap[state.cord];
    var activeView = state.seqView || 'bead';
    if (activeView === 'charm' && !charmItems.length) activeView = 'bead';
    if (activeView === 'cord' && !cord) activeView = 'bead';
    if (['bead','charm','cord','shape','spacer'].indexOf(activeView) < 0) activeView = 'bead';
    state.seqView = activeView;
    if (summaryEl) {
      var rows = [
        { id: 'bead', label: 'Beads', count: beadItems.length },
        { id: 'charm', label: 'Charms', count: charmItems.length },
        { id: 'cord', label: 'Cord', count: cord ? 1 : 0 },
        { id: 'spacer', label: 'Pack.', count: spacerItems.length },
        { id: 'shape', label: 'Accessories', count: shapeItems.length, wide: true }
      ];
      summaryEl.innerHTML = '<b>Strand Sequence</b>' + rows.map(function (row) {
        return '<button type="button" class="seq-summary-btn' + (activeView === row.id ? ' is-active' : '') + (row.wide ? ' is-wide' : '') + '" data-seq-view="' + row.id + '">' +
          '<span class="seq-label">' + row.label + '</span><strong>' + row.count + '</strong></button>';
      }).join('');
    }
    var rowsToShow = activeView === 'charm' ? charmItems : (activeView === 'shape' ? shapeItems : (activeView === 'spacer' ? spacerItems : (activeView === 'bead' ? beadItems : [])));
    if (activeView === 'cord') {
      el.innerHTML = cord
        ? '<button type="button" class="seq-item seq-cord-item" data-cord="' + cord.id + '"><span class="cord-thumb ' + cord.id + '"></span><small>' + titleCase(cord.name_en) + '</small></button>'
        : '<div class="seq-empty">Choose a cord to finish the bracelet.</div>';
      return;
    }
    if (!rowsToShow.length) {
      el.innerHTML = '<div class="seq-empty">' + (activeView === 'charm' ? 'No charms in use yet.' : activeView === 'bead' ? 'Select crystals below to start.' : 'No items in use yet.') + '</div>';
      return;
    }
    el.innerHTML = rowsToShow.map(function (row) {
      var it = row.item;
      var i = row.index;
      var part = it.type === 'bead' ? beadMap[it.id] : (it.type === 'charm' ? charmMap[it.id] : null);
      var label = it.type === 'bead' ? (part ? part.name_en : it.id) : (it.type === 'charm' ? (part ? part.name_en + ' charm' : it.id) : it.id);
      var dot;
      if (it.type === 'bead') {
        dot = '<span class="seq-dot" style="background-image:url(' + (part && part._thumb ? part._thumb : '') + ')"></span>';
      } else if (it.type === 'charm') {
        var glyphUrl = part && _glyphDataUrls[part.symbol] ? _glyphDataUrls[part.symbol] : '';
        dot = '<span class="seq-dot charm-dot"' + (glyphUrl ? ' style="background-image:url(' + glyphUrl + ')"' : '') + '>' +
          (glyphUrl ? '' : (part ? charmMark(part.symbol) : '')) + '</span>';
      } else {
        dot = '<span class="seq-dot">' + (it.type === 'spacer' ? 'P' : 'A') + '</span>';
      }
      return '<button type="button" class="seq-item' + (state.selected === i ? ' is-selected' : '') + '" data-slot="' + i + '">' +
        dot + '<small>' + titleCase(label) + '</small><span class="seq-remove" data-remove-slot="' + i + '" aria-label="Remove">&times;</span></button>';
    }).join('');
  }
  function renderViewMode() {
    var stage = document.getElementById('t17-stage');
    var btn = document.getElementById('t17-view-toggle');
    var gatherBtn = document.getElementById('t17-gather-toggle');
    if (!stage || !btn) return;
    stage.setAttribute('data-view', state.viewMode);
    btn.innerHTML = state.viewMode === '3d'
      ? '<span aria-hidden="true">&#9635;</span><b>3D Preview</b>'
      : '<span aria-hidden="true">&#9635;</span><b>2D View</b>';
    if (gatherBtn) {
      gatherBtn.innerHTML = state.beadLayout === 'released'
        ? '<span aria-hidden="true">&#8764;</span><b>Gather Beads</b>'
        : '<span aria-hidden="true">&#8764;</span><b>Release Beads</b>';
    }
  }
  var _glyphDataUrls = null;
  function ensureGlyphDataUrls() {
    if (_glyphDataUrls) return;
    _glyphDataUrls = {};
    parts.charms.forEach(function (c) {
      try { _glyphDataUrls[c.symbol] = drawCharmGlyph(c.symbol, 64, '#2b210c').toDataURL('image/png'); } catch (e) {}
    });
  }

  function renderSelectedActions() {
    var el = document.getElementById('t17-sel-actions');
    if (!el) return;
    if (state.dimensionOpen) { el.innerHTML = ''; return; }
    if (state.selected < 0 || state.selected >= state.sequence.length) { el.innerHTML = ''; return; }
    var it = state.sequence[state.selected];
    var part = it.type === 'bead' ? beadMap[it.id] : charmMap[it.id];
    var name = part ? part.name_en : it.id;
    el.innerHTML = '<span>Selected<br><b>' + name + '</b></span>' +
      '<button type="button" class="mini" data-action="move-left">Prev</button>' +
      '<button type="button" class="mini" data-action="move-right">Next</button>' +
      '<button type="button" class="mini danger" data-action="remove-selected">Remove</button>' +
      '<button type="button" class="mini" data-action="deselect">Done</button>';
  }

  // --- Three.js scene (identical to Step 2) ---
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

    ringGroup = new THREE.Group();
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
  var dragGhost = null;
  var DRAG_START_PX = 6;
  var DELETE_MULT = 1.55;
  var hit2DSlots = [];
  var layout2D = { cx: 0, cy: 0, rx: 0, ry: 0 };
  var drag2D = { active: false, dragging: false, slot: -1, startX: 0, startY: 0, lastX: 0, lastY: 0 };

  function ndcFromEvent(e) {
    var rect = renderer.domElement.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1
    };
  }
  function ringRadiusCurrent() {
    var n = Math.max(1, state.sequence.length);
    return Math.max(2.4, Math.min(4.2, 1.9 + n * 0.13));
  }
  function bindDragHandlers() {
    var el = renderer.domElement;
    el.addEventListener('pointerdown', onDragDown, { passive: false });
    el.addEventListener('pointermove', onDragMove, { passive: false });
    window.addEventListener('pointerup', onDragUp);
    window.addEventListener('pointercancel', onDragUp);
  }
  function bind2DDragHandlers() {
    var el = document.getElementById('t17-canvas-2d');
    if (!el || el._t17DragBound) return;
    el._t17DragBound = true;
    el.addEventListener('pointerdown', on2DDragDown, { passive: false });
    el.addEventListener('pointermove', on2DDragMove, { passive: false });
    window.addEventListener('pointerup', on2DDragUp);
    window.addEventListener('pointercancel', on2DDragUp);
  }
  function canvas2DPoint(e) {
    var el = document.getElementById('t17-canvas-2d');
    var rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function hit2DSlotAt(x, y) {
    for (var hi = hit2DSlots.length - 1; hi >= 0; hi--) {
      var hit = hit2DSlots[hi];
      if (Math.hypot(x - hit.x, y - hit.y) <= hit.r) return hit.slot;
    }
    return -1;
  }
  function beadSequenceSlots() {
    var slots = [];
    state.sequence.forEach(function (it, i) {
      if (it.type === 'bead' || it.type === 'charm') slots.push(i);
    });
    return slots;
  }
  function slotFrom2DAngle(x, y) {
    var slots = beadSequenceSlots();
    if (!slots.length || !layout2D.rx) return -1;
    var angle = Math.atan2(y - layout2D.cy, x - layout2D.cx);
    var ordinal = Math.round(((angle + Math.PI / 2) / (Math.PI * 2)) * slots.length);
    ordinal = ((ordinal % slots.length) + slots.length) % slots.length;
    return slots[ordinal];
  }
  function on2DDragDown(e) {
    if (state.viewMode === '3d') return;
    var p = canvas2DPoint(e);
    var slot = hit2DSlotAt(p.x, p.y);
    if (slot < 0) return;
    drag2D.active = true;
    drag2D.dragging = false;
    drag2D.slot = slot;
    drag2D.startX = drag2D.lastX = p.x;
    drag2D.startY = drag2D.lastY = p.y;
    state.selected = slot;
    updateAll(false);
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function on2DDragMove(e) {
    if (!drag2D.active) return;
    var p = canvas2DPoint(e);
    drag2D.lastX = p.x;
    drag2D.lastY = p.y;
    if (!drag2D.dragging && Math.hypot(p.x - drag2D.startX, p.y - drag2D.startY) >= DRAG_START_PX) {
      drag2D.dragging = true;
    }
    draw2DBracelet();
    e.preventDefault();
  }
  function on2DDragUp(e) {
    if (!drag2D.active) return;
    var slot = drag2D.slot;
    var target = drag2D.dragging ? slotFrom2DAngle(drag2D.lastX, drag2D.lastY) : -1;
    drag2D.active = false;
    drag2D.dragging = false;
    drag2D.slot = -1;
    if (target >= 0 && target !== slot) {
      moveSlotTo(slot, target);
    } else {
      state.selected = slot;
      updateAll(false);
    }
    e.preventDefault();
  }
  function onDragDown(e) {
    if (!THREE || !controls || !slotMeshIndex.length) return;
    if (e.button !== undefined && e.button !== 0) return;
    var rc = drag.raycaster = drag.raycaster || new THREE.Raycaster();
    var ndc = ndcFromEvent(e);
    rc.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera);
    var pickable = [];
    slotMeshIndex.forEach(function (m) {
      if (!m) return;
      m.traverse(function (o) { if (o.isMesh) pickable.push(o); });
    });
    var hits = rc.intersectObjects(pickable, false);
    if (!hits.length) return;
    var hit = hits[0].object;
    var node = hit;
    while (node && (node.userData.slot === undefined)) node = node.parent;
    if (!node) return;
    e.preventDefault();
    try { el_capture(e); } catch (_) {}
    drag.active = true; drag.dragging = false;
    drag.slot = node.userData.slot; drag.mesh = node;
    drag.startNdc.x = ndc.x; drag.startNdc.y = ndc.y;
    drag.lastNdc.x = ndc.x; drag.lastNdc.y = ndc.y;
    controls.enabled = false;
  }
  function el_capture(e) { if (e.target && e.target.setPointerCapture && e.pointerId !== undefined) e.target.setPointerCapture(e.pointerId); }
  function onDragMove(e) {
    if (!drag.active) return;
    var ndc = ndcFromEvent(e);
    var dx = ndc.x - drag.startNdc.x, dy = ndc.y - drag.startNdc.y;
    if (!drag.dragging && Math.hypot(dx, dy) * 200 > DRAG_START_PX) {
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
    controls.enabled = true;
    if (wasDragging) {
      var rc = drag.raycaster;
      rc.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera);
      if (!drag.plane) drag.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      var hp = drag.hitPoint = new THREE.Vector3();
      var hitOk = rc.ray.intersectPlane(drag.plane, hp);
      if (!hitOk) { endGhost(); resetDrag(); return; }
      var r = ringRadiusCurrent();
      var dist = Math.hypot(hp.x, hp.z);
      if (dist > r * DELETE_MULT) {
        removeSlot(drag.slot);
        flash('Bead removed (dragged off the ring)');
      } else {
        var n = Math.max(1, state.sequence.length);
        var angle = Math.atan2(hp.z, hp.x);
        var target = ((Math.round(((angle + Math.PI * 2.5) / (Math.PI * 2)) * n) % n) + n) % n;
        if (target !== drag.slot) moveSlotTo(drag.slot, target);
      }
    } else {
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
    drag.mesh.traverse(function (o) {
      if (o.material && o.material.transparent !== undefined) {
        o._origOpacity = o.material.opacity; o.material.transparent = true; o.material.opacity = 0.28;
      }
    });
  }
  function updateGhost() { /* visual refinement hook 鈥?drop-slot computed on pointerup */ }
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
    if (controls) controls.update();
    if (renderer && state.viewMode === '3d') renderer.render(scene, camera);
  }

  function renderBracelet() {
    if (state.viewMode !== '3d') { draw2DBracelet(); return; }
    if (!THREE || !braceletGroup) return;
    buildCordVisuals();
    while (braceletGroup.children.length) {
      var ch = braceletGroup.children.pop();
      ch.disposed = true;
      ch.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    }
    var n = Math.max(1, state.sequence.length);
    var radius = Math.max(2.4, Math.min(4.2, 1.9 + n * 0.13));
    slotMeshIndex = [];
    var sharedSphere = new THREE.SphereGeometry(0.42, 48, 36);

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
        mesh.traverse(function (o) {
          if (o.material && o.material.emissive) o.material.emissive = new THREE.Color(0x332200);
        });
      }
      braceletGroup.add(mesh);
      slotMeshIndex[i] = mesh;
    });

    var cordSpec = CORD_VISUALS[state.cord] || CORD_VISUALS.elastic_black;
    var torus = new THREE.TorusGeometry(radius, cordSpec.thickness, 24, 200);
    var tmat = new THREE.MeshStandardMaterial({
      map: cordSpec.map,
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

  var _braidTex = null;
  function makeBraidTexture() {
    if (_braidTex) return _braidTex;
    var c = document.createElement('canvas');
    c.width = 256; c.height = 32;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#6b4528'; ctx.fillRect(0, 0, 256, 32);
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
  function radiusToRepeats() { return 60; }
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

  // F3 (PRD R7): .glb swap when charm.model_url set, else 2D coin placeholder.
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
    if (charm && charm.model_url) {
      ensureGLTFLoader().then(function (Loader) {
        if (!Loader || group.disposed) return;
        try {
          var loader = new Loader();
          loader.load(charm.model_url, function (gltf) {
            if (group.disposed) return;
            var obj = gltf.scene || gltf.scenes[0];
            if (!obj) return;
            obj.traverse(function (o) { if (o.isMesh) { o.castShadow = true; } });
            var box = new THREE.Box3().setFromObject(obj);
            var size = new THREE.Vector3(); box.getSize(size);
            var s = 1.1 / Math.max(size.x, size.y, size.z || 0.0001);
            obj.scale.setScalar(s);
            obj.position.set(0, -box.getCenter(new THREE.Vector3()).y * s, 0);
            group.remove(coinMesh);
            group.add(obj);
          }, undefined, function () { });
        } catch (e) { }
      });
    }
    return group;
  }

  // --- Mutations ---
  function updateAll(redraw3d) {
    if (redraw3d === undefined) redraw3d = true;
    renderToolbar();
    renderPricing();
    renderSequenceStrip();
    renderViewMode();
    renderSelectedActions();
    if (redraw3d) renderBracelet();
    saveDraft();
  }

  function addBead(id) {
    if (!beadMap[id]) return;
    if (!canAdd(1)) { flash('Ring is full. Remove a bead or raise bead size.'); return; }
    state.sequence.push({ type: 'bead', id: id, size_mm: state.beadSizeMm });
    state.selected = state.sequence.length - 1;
    state.seqView = 'bead';
    updateAll();
  }
  function addCharm(id) {
    var c = charmMap[id]; if (!c) return;
    var count = state.sequence.filter(function (i) { return i.type === 'charm'; }).length;
    if (count >= Number(settings.maxCharms || 5)) { flash('Max charms reached.'); return; }
    if (!canAdd(Number(c.slotWeight || 1))) { flash('Not enough room for this charm.'); return; }
    state.sequence.push({ type: 'charm', id: id, slotWeight: Number(c.slotWeight || 1) });
    state.selected = state.sequence.length - 1;
    state.seqView = 'charm';
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
    var n = targetSlots();
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
      syncWristReadouts();
      renderPricing();
      renderSequenceStrip();
      renderBracelet();
      saveDraft();
    } else {
      updateAll();
    }
  }
  function syncWristReadouts() {
    var wrap = document.getElementById('t17-wrist-wrap');
    if (!wrap) return;
    var label = wrap.querySelector('.tb-label');
    if (label) {
      var fitAllow = Number(settings.fitAllowanceCm || 1.5);
      label.textContent = 'Wrist circumference - target inner ' + targetCm().toFixed(1) + 'cm (+' + fitAllow + 'cm fit) - ~' + targetSlots() + ' slots';
    }
    var pillValue = wrap.querySelector('.dimension-copy b');
    if (pillValue) pillValue.textContent = Number(state.wristCm).toFixed(1).replace(/\.0$/, '') + ' cm';
    var slider = document.getElementById('t17-wrist');
    if (slider && String(Number(slider.value)) !== String(state.wristCm)) slider.value = state.wristCm;
    var sug = wrap.querySelector('.wrist-suggest');
    if (sug) {
      var fitAllow2 = Number(settings.fitAllowanceCm || 1.5);
      sug.innerHTML = 'Target slots for ' + state.beadSizeMm + 'mm beads: <b>' + suggestedBeadCount() + '</b> ' +
        '(target inner cm x 10 / bead size mm)';
    }
  }
  function draw2DBracelet() {
    var canvas = document.getElementById('t17-canvas-2d');
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var w = Math.max(1, Math.floor(rect.width * dpr));
    var h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    var bg = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    bg.addColorStop(0, '#fbfaf6');
    bg.addColorStop(0.48, '#f4efe6');
    bg.addColorStop(1, '#fbfaf7');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, rect.width, rect.height);
    hit2DSlots = [];
    var isCompactStage = rect.width <= 820;
    var cx = rect.width / 2, cy = rect.height * (isCompactStage ? 0.515 : 0.52);
    var board = isCompactStage
      ? Math.min(rect.width * 0.70, rect.height * 0.69, 620)
      : Math.min(rect.width * 0.72, rect.height * 0.74, 620);
    var bx = cx - board / 2, by = cy - board / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(56,32,12,.10)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 7;
    if (trayImage && trayImage.complete && trayImage.naturalWidth) {
      ctx.drawImage(trayImage, bx, by, board, board);
    } else {
      ctx.fillStyle = '#d8b277';
      roundRect(ctx, bx, by, board, board, board * .085);
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
    var slotMarks = targetSlots();
    var markCount = Math.min(slotMarks, 40);
    var trayCx = bx + board * 0.5;
    var trayCy = by + board * 0.5;
    var markRadius = board * 0.272;
    var layoutItems = state.sequence.map(function (it, i) { return { item: it, index: i }; })
      .filter(function (row) { return row.item.type === 'bead' || row.item.type === 'charm'; });
    var beadPathRadius = board * beadPathRatio(state.beadSizeMm);
    ctx.translate(trayCx, trayCy);
    ctx.strokeStyle = 'rgba(98,58,22,.42)';
    ctx.fillStyle = 'rgba(98,58,22,.46)';
    ctx.lineWidth = 1;
    ctx.font = Math.max(7, board * .024) + 'px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var mi = 0; mi < markCount; mi++) {
      var mt = (mi / markCount) * Math.PI * 2 - Math.PI / 2;
      var outerX = Math.cos(mt) * markRadius;
      var outerY = Math.sin(mt) * markRadius;
      var innerX = Math.cos(mt) * markRadius * .88;
      var innerY = Math.sin(mt) * markRadius * .88;
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
      if (markCount <= 24 && mi % 2 === 0) {
        ctx.fillText(String(mi + 1), Math.cos(mt) * markRadius * .72, Math.sin(mt) * markRadius * .72);
      }
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(72,45,22,.18)';
    ctx.font = '700 ' + Math.max(15, board * .034) + 'px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Earthward', trayCx, trayCy + board * .006);
    var rx = beadPathRadius;
    var ry = beadPathRadius;
    layout2D = { cx: trayCx, cy: trayCy, rx: rx, ry: ry };
    ctx.save();
    ctx.strokeStyle = state.beadLayout === 'gathered' ? 'rgba(91,111,126,.34)' : 'rgba(91,111,126,.18)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(trayCx, trayCy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    if (!layoutItems.length) {
      ctx.restore();
      return;
    }
    layoutItems.forEach(function (row, i) {
      var it = row.item;
      var slotIndex = row.index;
      var t = (i / layoutItems.length) * Math.PI * 2 - Math.PI / 2;
      var seed = (i * 37 + String(it.id).length * 11) % 100;
      var scatterX = bx + board * (0.18 + ((seed * 17) % 61) / 100);
      var scatterY = by + board * (0.16 + ((seed * 29) % 66) / 100);
      var isDragged = drag2D.active && drag2D.dragging && slotIndex === drag2D.slot;
      var x = state.beadLayout === 'released' ? scatterX : trayCx + Math.cos(t) * rx;
      var y = state.beadLayout === 'released' ? scatterY : trayCy + Math.sin(t) * ry;
      if (isDragged) {
        x = drag2D.lastX;
        y = drag2D.lastY;
      }
      var b = it.type === 'bead' ? beadMap[it.id] : null;
      var charm = it.type === 'charm' ? charmMap[it.id] : null;
      var size = it.type === 'charm'
        ? Math.max(18, Math.min(34, Number(state.beadSizeMm) * 2.55))
        : Math.max(16, Math.min(34, Number(it.size_mm || state.beadSizeMm) * 2.85));
      if (isDragged) size *= 1.24;
      var col = b && b.textureColors ? b.textureColors : ['#d7b35f', '#fff7c7', '#8d6c26'];
      var g = ctx.createRadialGradient(x - size * .22, y - size * .28, 2, x, y, size * .62);
      g.addColorStop(0, col[1]); g.addColorStop(.35, col[0]); g.addColorStop(1, col[2]);
      if (isDragged) {
        ctx.save();
        ctx.shadowColor = 'rgba(45,106,67,.40)';
        ctx.shadowBlur = 24;
        ctx.fillStyle = 'rgba(255,255,255,.32)';
        ctx.strokeStyle = 'rgba(45,106,67,.72)';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.arc(x, y, size / 2 + 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(255,255,255,.85)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, size / 2 + 3, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, size / 2, 0, Math.PI * 2); ctx.fill();
      if (it.type === 'charm') {
        ctx.fillStyle = 'rgba(72,45,22,.72)';
        ctx.font = '700 ' + Math.max(8, size * .28) + 'px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(charmMark(charm && charm.symbol), x, y + size * .02);
      }
      if (slotIndex === state.selected) {
        ctx.strokeStyle = '#d5504c';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, size / 2 + 4, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x - size * .08, y - size * .08, size * .22, 0, Math.PI * 2); ctx.stroke();
      hit2DSlots.push({ slot: slotIndex, x: x, y: y, r: size / 2 + 8 });
    });
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  function setCord(id) { if (cordMap[id]) { state.cord = id; state.seqView = 'cord'; updateAll(); } }

  function initDefault() {
    state.sequence = [];
    state.selected = -1;
    state.beadLayout = 'gathered';
  }
  function resetDesign() {
    state.sequence = [];
    state.selected = -1;
    state.beadLayout = 'gathered';
    updateAll();
    flash('Design reset.');
  }

  // --- localStorage draft (PRD R9: versioned) ---
  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        schemaVersion: parts.schemaVersion,
        partsVersion: parts.partsVersion,
        savedAt: new Date().toISOString(),
        wristCm: state.wristCm, wristUnit: state.wristUnit,
        heightCm: state.heightCm, weightKg: state.weightKg,
        beadSizeMm: state.beadSizeMm, cord: state.cord,
        beadLayout: state.beadLayout,
        sequence: state.sequence
      }));
    } catch (e) {}
  }
  function restoreDraft() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return 'none';
      var d = JSON.parse(raw);
      if (!d || d.schemaVersion !== parts.schemaVersion || d.partsVersion !== parts.partsVersion) {
        localStorage.removeItem(STORAGE_KEY);
        return 'expired';
      }
      state.wristCm = clamp(Number(d.wristCm || state.wristCm), settings.minWristCm, settings.maxWristCm);
      state.heightCm = clamp(Number(d.heightCm || state.heightCm), 145, 190);
      state.weightKg = clamp(Number(d.weightKg || state.weightKg), 35, 100);
      if (d.wristUnit === 'in' || d.wristUnit === 'cm') state.wristUnit = d.wristUnit;
      var sz = Number(d.beadSizeMm); state.beadSizeMm = [6,8,10,12].indexOf(sz) >= 0 ? sz : state.beadSizeMm;
      state.cord = cordMap[d.cord] ? d.cord : state.cord;
      if (d.beadLayout === 'released' || d.beadLayout === 'gathered') state.beadLayout = d.beadLayout;
      state.sequence = (d.sequence || []).filter(function (it) {
        return (it.type === 'bead' && beadMap[it.id]) || (it.type === 'charm' && charmMap[it.id]);
      }).map(function (it) {
        if (it.type === 'bead') return { type: 'bead', id: it.id, size_mm: state.beadSizeMm };
        return { type: 'charm', id: it.id, slotWeight: Number(it.slotWeight || 1) };
      });
      return 'restored';
    } catch (e) { try { localStorage.removeItem(STORAGE_KEY); } catch (_) {} return 'none'; }
  }
  function clearDraftAndReset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state.wristUnit = 'cm';
    state.heightCm = 165;
    state.weightKg = 46;
    state.wristCm = settings.defaultWristCm || 16;
    state.beadSizeMm = settings.defaultBeadSizeMm || 8;
    state.cord = 'elastic_black';
    initDefault();
    updateAll();
    hideDraftToast();
    flash('Started fresh. Your previous draft was cleared.');
  }
  function showDraftToast(msg, ctaLabel) {
    return;
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

  // ============================================================
  // STEP 3 鈥?Add to cart via admin-ajax (Code Snippet id=20 endpoint)
  // POST /wp-admin/admin-ajax.php?action=t17_add_custom_bracelet
  // body: product_id + config{sequence[], bead_size, cord, wrist...}
  // response: {success, data:{cart_item_key, server_recalc_total, cart_url}}
  // ============================================================
  function configPayload() {
    return {
      bead_size: Number(state.beadSizeMm),
      wrist: Number(state.wristCm),
      target_cm: targetCm(),
      cord: state.cord,
      sequence: state.sequence.map(function (it) {
        return it.type === 'bead'
          ? { type: 'bead', id: it.id, size_mm: Number(it.size_mm || state.beadSizeMm) }
          : { type: 'charm', id: it.id, slotWeight: Number(it.slotWeight || 1) };
      })
    };
  }
  var _cartBusy = false;
  function handleAddToCart() {
    if (_cartBusy) return;
    if (!state.sequence.length) { flash('Add at least one bead first.'); return; }
    _cartBusy = true;
    var btn = document.getElementById('t17-add-cart');
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Adding...'; }
    var cfg = configPayload();
    // urlencoded form body 鈥?admin-ajax expects form params, not JSON.
    var params = new URLSearchParams();
    params.append('action', 't17_add_custom_bracelet');
    params.append('product_id', String(PRODUCT_ID));
    params.append('config', JSON.stringify(cfg));
    fetch(AJAX_URL, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.success && j.data && j.data.cart_item_key) {
        var srv = j.data.server_recalc_total;
        var checkoutUrl = j.data.checkout_url || '/checkout/';
        flash('Added ' + money(srv) + '. Redirecting to checkout...');
        // Brief pause so the user sees the confirmation, then go to checkout.
        setTimeout(function () { window.location.href = checkoutUrl; }, 700);
      } else {
        var msg = (j && j.data && j.data.message) ? j.data.message : 'Add to cart failed.';
        flash(msg);
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Checkout custom bracelet'; }
        _cartBusy = false;
      }
    }).catch(function (e) {
      flash('Network error. Please try again.');
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Checkout custom bracelet'; }
      _cartBusy = false;
    });
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------
  function bindEvents() {
    var root = document.getElementById('t17-app');
    bind2DDragHandlers();
    root.addEventListener('click', function (e) {
      if (e.target && e.target.id === 't17-canvas-2d') {
        var cr = e.target.getBoundingClientRect();
        var px = e.clientX - cr.left, py = e.clientY - cr.top;
        for (var hi = hit2DSlots.length - 1; hi >= 0; hi--) {
          var hit = hit2DSlots[hi];
          if (Math.hypot(px - hit.x, py - hit.y) <= hit.r) {
            state.selected = hit.slot;
            updateAll();
            return;
          }
        }
      }
      var beadBtn = e.target.closest('[data-bead]');
      if (beadBtn) {
        var chosenSize = Number(beadBtn.getAttribute('data-bead-size') || state.beadSizeMm);
        state.beadSizeMm = chosenSize;
        addBead(beadBtn.getAttribute('data-bead'));
        return;
      }
      var charmBtn = e.target.closest('[data-charm]'); if (charmBtn) return addCharm(charmBtn.getAttribute('data-charm'));
      var presetBtn = e.target.closest('[data-preset]'); if (presetBtn) return fillPreset(presetBtn.getAttribute('data-preset'));
      var cordBtn = e.target.closest('[data-cord]'); if (cordBtn) return setCord(cordBtn.getAttribute('data-cord'));
      var sizeBtn = e.target.closest('[data-size]');
      if (sizeBtn) { state.sizeOpen = false; return setBeadSize(sizeBtn.getAttribute('data-size')); }
      var seqViewBtn = e.target.closest('[data-seq-view]');
      if (seqViewBtn) {
        state.seqView = seqViewBtn.getAttribute('data-seq-view');
        renderSequenceStrip();
        return;
      }
      if (e.target.closest('#t17-view-toggle')) {
        state.viewMode = state.viewMode === '3d' ? '2d' : '3d';
        updateAll();
        return;
      }
      if (e.target.closest('#t17-gather-toggle')) {
        state.beadLayout = state.beadLayout === 'released' ? 'gathered' : 'released';
        updateAll();
        return;
      }
      if (e.target.closest('#t17-stage-reset')) {
        resetDesign();
        return;
      }
      if (e.target.closest('#t17-dimension-toggle')) { state.dimensionOpen = !state.dimensionOpen; state.sizeOpen = false; renderToolbar(); renderSelectedActions(); return; }
      if (e.target.closest('.stage-size-row')) { state.sizeOpen = !state.sizeOpen; state.dimensionOpen = false; renderToolbar(); renderSelectedActions(); return; }
      if (e.target.closest('#t17-dimension-close') || e.target.closest('#t17-dimension-confirm')) {
        state.dimensionOpen = false;
        renderToolbar();
        renderSelectedActions();
        return;
      }
      var catViewBtn = e.target.closest('[data-cat-view]');
      if (catViewBtn) { state.categoryView = catViewBtn.getAttribute('data-cat-view'); renderLeft(); return; }
      var colorBtn = e.target.closest('[data-color]');
      if (colorBtn) { state.filterColor = colorBtn.getAttribute('data-color'); renderLeft(); return; }
      var typeBtn = e.target.closest('[data-type-filter]');
      if (typeBtn) { state.filterType = typeBtn.getAttribute('data-type-filter'); renderLeft(); return; }
      var charmCatBtn = e.target.closest('[data-charm-cat]');
      if (charmCatBtn) { state.filterColor = charmCatBtn.getAttribute('data-charm-cat'); renderLeft(); return; }
      var modeBtn = e.target.closest('[data-mode]');
      if (modeBtn) { state.catalogMode = modeBtn.getAttribute('data-mode'); state.filterColor = 'all'; state.filterType = 'all'; renderLeft(); return; }
      var removeSeqBtn = e.target.closest('[data-remove-slot]');
      if (removeSeqBtn) return removeSlot(Number(removeSeqBtn.getAttribute('data-remove-slot')));
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
      if (e.target.id === 't17-height' || e.target.id === 't17-weight') {
        if (e.target.id === 't17-height') state.heightCm = clamp(Number(e.target.value) || 165, 145, 190);
        if (e.target.id === 't17-weight') state.weightKg = clamp(Number(e.target.value) || 46, 35, 100);
        setWrist(estimateWristFromBody(state.heightCm, state.weightKg), true);
        renderToolbar();
        return;
      }
      if (e.target.id === 't17-wrist') setWrist(e.target.value);
      if (e.target.id === 't17-wrist-num') {
        var v = parseFloat(e.target.value);
        if (isNaN(v)) return;
        setWrist(v, true);
      }
    });
    root.addEventListener('change', function (e) {
      if (e.target.id === 't17-bead-size-select') setBeadSize(e.target.value);
    });
    var syncScrollState = function () {
      var app = document.getElementById('t17-app');
      if (!app) return;
      var r = app.getBoundingClientRect();
      var compact = window.innerWidth <= 820 && r.top < -46;
      app.classList.toggle('is-mobile-scrolled', compact);
    };
    window.addEventListener('scroll', syncScrollState, { passive: true });
    window.addEventListener('resize', function () { syncScrollState(); renderBracelet(); });
    syncScrollState();
  }

  // --- Boot ---
  preRenderThumbs();
  renderLeft();
  var draftStatus = restoreDraft();
  if (draftStatus === 'none') initDefault();
  renderToolbar();
  renderPricing();
  renderSequenceStrip();
  renderViewMode();
  renderBracelet();
  renderSelectedActions();
  bindEvents();

  // 3D progressive enhancement 鈥?dynamic import (CDN/self-host via importmap).
  (async function () {
    try {
      var mod = await import('three');
      THREE = mod;
      var oc = await import('three/addons/controls/OrbitControls.js');
      OrbitControls = oc.OrbitControls;
      initThree();
      renderBracelet();
    } catch (e) {
      var stage = document.getElementById('t17-stage');
      if (stage) {
        var fb = document.createElement('div');
        fb.className = 'three-fallback';
        fb.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;color:#9aa4b2;font-size:13px;text-align:center;padding:24px;line-height:1.6;';
        fb.innerHTML = '3D preview could not load.<br>The builder on the left and the pricing below are fully functional in 2D.';
        stage.appendChild(fb);
      }
    }
  })();
})();
`;

// ascii-escape the APP JS (non-ASCII 鈫?\uXXXX), then base64. The JS contains
// pointer-drag `&&`, `<` comparisons and CJK that wp_kses would otherwise
// entity-encode and break inside <!-- wp:html --> (memory wp-html-block-js-base64).
function asciiJS(s) {
  return s.replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const APP_B64 = Buffer.from(asciiJS(APP_JS), 'utf8').toString('base64');

// Refined light catalog UI for the live WordPress builder.
const CSS = String.raw`
#t17-app,#t17-app *{box-sizing:border-box;margin:0;padding:0}
body:has(#t17-app){overflow-x:hidden}
#t17-app{--paper:#fffdf9;--ink:#332d28;--muted:#81776e;--line:#e7dfd8;--soft:#f4f0ec;--wash:#f8f5f1;--accent:#d5504c;--green:#2d6a43;--blue:#2d7fd8;position:relative;left:50%;transform:translateX(-50%);display:flex;width:min(1360px,calc(100vw - 32px));max-width:calc(100vw - 32px);min-height:0;height:min(690px,calc(100vh - 105px));margin:10px 0;scroll-margin-top:150px;overflow:hidden;font-family:Georgia,"Times New Roman",serif;background:#fff;color:var(--ink);-webkit-font-smoothing:antialiased;border:1px solid #eee4dc;border-radius:18px;box-shadow:0 20px 60px rgba(92,65,42,.12)}
#t17-root,#t17-right,#t17-stage,#t17-catalog,#t17-bottom,#t17-seq-wrap,.catalog-body,#t17-bead-grid{min-width:0;max-width:100%}
#t17-left{display:flex;flex-direction:column;width:300px;flex:0 0 300px;background:var(--soft);border-right:1px solid var(--line);padding:18px 14px;overflow:hidden}
#t17-left h3,.catalog-cats h3{font-size:24px;line-height:1;color:#211b17;font-weight:700;margin:4px 0 18px}
.lh-title{display:none}
.scroll-area{overflow-y:auto;flex:1;padding-right:10px}
#t17-stone-list{display:flex;flex-direction:column;gap:6px}
.stone-row{width:100%;min-height:50px;border:0;background:transparent;border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:12px;color:#79716b;font-size:21px;line-height:1.1;text-align:left;cursor:pointer;transition:background .16s,color .16s,transform .16s}
.stone-row:hover{background:rgba(255,255,255,.58);color:#433a33}
.stone-row.is-active{background:#fff;color:#2f2924;box-shadow:0 1px 0 rgba(0,0,0,.03)}
.stone-mini{width:22px;height:22px;flex:0 0 22px;border-radius:50%;background-size:cover;background-position:center;box-shadow:inset -3px -3px 6px rgba(45,37,30,.18),inset 2px 2px 4px rgba(255,255,255,.72),0 1px 2px rgba(45,37,30,.12)}
.cat-row{width:100%;min-height:31px;border:0;background:transparent;border-radius:10px;padding:5px 7px 5px 20px;display:flex;align-items:center;justify-content:flex-start;gap:8px;color:#6f6760;font-family:Arial,sans-serif;font-size:11px;font-weight:650;text-align:left;text-transform:none;cursor:pointer;transition:background .14s,color .14s}
#t17-app .cat-row{padding:5px 7px 5px 20px;justify-content:flex-start;text-align:left}
.cat-row:hover{background:rgba(255,255,255,.7);color:#2f2924}
.cat-row.is-active{background:#fff;color:#2f2924;box-shadow:0 1px 0 rgba(0,0,0,.04)}
.cat-row:disabled{cursor:default;opacity:.75}
.cat-mark{width:15px;height:15px;border-radius:50%;background:var(--cat-color,#d9d2ca);flex:0 0 15px;box-shadow:inset -3px -3px 5px rgba(50,42,35,.18),inset 2px 2px 4px rgba(255,255,255,.65),0 1px 2px rgba(60,45,35,.12)}
.cat-row.is-active .cat-mark{background:var(--cat-color,var(--green));box-shadow:inset -3px -3px 5px rgba(50,42,35,.18),inset 2px 2px 4px rgba(255,255,255,.65),0 0 0 2px #fff,0 0 0 3px rgba(213,80,76,.34)}
#t17-right{height:100%;display:grid;grid-template-columns:minmax(0,54%) minmax(0,46%);grid-template-rows:1fr auto;overflow:hidden;background:var(--paper);width:100%}
.tool-brand{display:flex;flex-direction:column;gap:5px}
.tool-brand b{font-size:26px;line-height:1;color:#26211d}
.tool-brand small{font-family:Arial,sans-serif;font-size:12px;color:#7d746c;letter-spacing:.2px}
#t17-catalog{grid-column:2;grid-row:1/3;min-height:0;border-left:1px solid var(--line);padding:5px 10px 5px 8px;background:#fff;display:flex;flex-direction:column;gap:12px;overflow:hidden}
.catalog-body{min-height:0;display:grid;grid-template-columns:130px minmax(0,1fr);gap:14px;flex:1 1 auto;max-height:none}
.catalog-cats{min-height:0;background:#f4f2f0;border-radius:14px;padding:2px 6px 9px;display:flex;flex-direction:column;align-items:stretch;overflow:hidden}
.catalog-products{min-height:0;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.catalog-head{height:58px;border:1px solid var(--line);border-radius:28px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;background:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}
#t17-catalog-title{font-size:24px;font-weight:700;color:#473d36;line-height:1}
#t17-catalog-count{min-width:52px;height:30px;border-radius:18px;background:#f7f2ee;border:1px solid #e2d8cf;color:#675d55;display:grid;place-items:center;font-size:20px}
#t17-app .catalog-cats .scroll-area{padding-left:0;padding-top:0;padding-right:0}
#t17-app .catalog-cats h3.cat-switch{display:flex;justify-content:flex-start;gap:5px;padding:0 0 5px;margin:0 0 5px;border-bottom:1px solid #e8e2dc}
.cat-switch-btn{height:18px!important;min-height:18px!important;flex:0 0 48px;border:0;border-radius:999px;background:#fff;color:#756c64;font-family:Arial,sans-serif;font-size:8px;font-weight:800;letter-spacing:0;line-height:1!important;text-transform:none;padding:0!important;cursor:pointer;appearance:none}
.cat-switch-btn.is-active{background:#171717;color:#fff}
#t17-catalog-tabs{display:flex;gap:7px;align-items:center;justify-content:center;padding:0 0 5px;border-bottom:1px solid #eee7e0;min-height:31px;overflow:hidden}
.mode-tab{position:relative;border:0;border-radius:999px;background:#f5f4f3;color:#746b64;min-width:84px;height:24px!important;min-height:0!important;padding:0 12px!important;font-family:Arial,sans-serif;font-size:8.5px;font-weight:800;line-height:1!important;text-transform:none;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer;transition:color .16s,background .16s,box-shadow .16s;appearance:none}
.mode-tab:hover{color:#302a25;background:#efedeb}
.mode-tab.is-active{color:#fff;background:#171717;box-shadow:0 8px 18px rgba(0,0,0,.12)}
.mode-tab.is-active:after{display:none}
#t17-bead-grid{min-height:0;flex:1;overflow-y:auto;padding:0 10px 7px 0;display:grid;grid-template-columns:repeat(3,minmax(104px,1fr));gap:7px;align-content:start;justify-content:stretch}
.bead-card{position:relative;min-height:52px;background:#fff;border:1px solid #ebe4df;border-radius:10px;padding:4px 5px;text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 4px 10px rgba(65,49,34,.03);transition:border-color .16s,box-shadow .16s,transform .16s}
#t17-app .bead-card{padding:3px 5px;justify-content:center}
.bead-card:hover{border-color:#eeb6b2;box-shadow:0 14px 30px rgba(118,77,48,.1);transform:translateY(-2px)}
.bead-card:disabled{cursor:not-allowed;opacity:.72;transform:none}
.bead-thumb{width:22px;height:22px;border-radius:50%;flex:0 0 22px;background-size:cover;background-position:center;box-shadow:inset -4px -4px 7px rgba(54,45,38,.2),inset 3px 3px 6px rgba(255,255,255,.72),0 2px 6px rgba(75,58,46,.1)}
.bead-thumb.large{width:22px;height:22px}
.bead-meta{display:flex;flex-direction:column;align-items:center;gap:3px;line-height:1.08;min-width:0;width:100%}
.bead-meta b{font-size:10px;font-weight:650;letter-spacing:0;text-transform:none;color:#554a42;max-width:100%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.bead-meta small{font-size:10px;color:#756a62}
.bead-meta small::first-letter{font-weight:700}
.card-coin{width:46px;height:46px;flex:0 0 46px}
.charm-coin{width:30px;height:30px;border-radius:50%;background:linear-gradient(145deg,#f6dfa5,#bc8d32);display:grid;place-items:center;font-size:9px;font-weight:800;color:#2b210c;box-shadow:inset -3px -3px 5px rgba(0,0,0,.24),0 4px 8px rgba(69,52,28,.12);overflow:hidden}
.charm-glyph{width:24px;height:24px;display:block;filter:drop-shadow(0 1px 1px rgba(0,0,0,.24))}
.card-coin .charm-glyph{width:34px;height:34px}
.spacer-thumb{width:54px;height:30px;flex:0 0 30px;border-radius:20px;background:linear-gradient(90deg,#d9d2ca,#fff,#bdb3aa,#f7f1ec);box-shadow:inset -5px -5px 8px rgba(64,52,45,.18),0 6px 14px rgba(70,54,42,.08)}
.cord-thumb{width:58px;height:14px;flex:0 0 14px;border-radius:18px;background:#202020;box-shadow:0 8px 16px rgba(60,45,35,.08),inset 0 2px 4px rgba(255,255,255,.25)}
.cord-thumb.braided_brown{background:repeating-linear-gradient(45deg,#6a442a 0 6px,#9b704b 6px 12px)}
.cord-thumb.silver_wire{background:linear-gradient(90deg,#b8bcc0,#fff,#8f969d,#eef2f4)}
.cord-card.is-selected{border-color:#2d7fd8;background:#f4f9ff}
.unavailable{position:absolute;right:10px;bottom:10px;background:#d8524d;color:#fff;font-style:normal;font-size:12px;font-family:Arial,sans-serif;border-radius:14px;padding:4px 10px}
.empty{padding:24px;color:var(--muted);font-size:14px;text-align:center}
.tb-group{display:flex;flex-direction:column;gap:7px}
.tb-label{font-family:Arial,sans-serif;font-size:10px;text-transform:none;letter-spacing:.5px;color:#8c8178;font-weight:700}
#t17-charms-wrap{display:none}
#t17-sizes{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.cord-btn,.size-btn{background:#f7f3ef;border:1px solid #e1d8cf;border-radius:999px;padding:6px 9px;cursor:pointer;color:#5d534b;font-family:Arial,sans-serif;font-size:11px;font-weight:800;text-transform:none;transition:border-color .12s,background .12s,box-shadow .12s}
.cord-btn{display:flex;flex-direction:column;align-items:center;gap:1px}
.cord-btn small{font-size:10px;color:#8d827a;font-weight:500}
.cord-btn.is-active,.size-btn.is-active{border-color:#2d7fd8;background:#eaf4ff;color:#1e5c9d;box-shadow:0 0 0 2px rgba(45,127,216,.1)}
#t17-wrist-wrap{display:flex;flex-direction:row;align-items:center;justify-content:center;gap:10px;min-width:0}
.wrist-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px}
#t17-wrist-num{width:100%;background:#fff;border:1px solid #e8ddd4;color:#1f1d1b;border-radius:12px;padding:10px 12px;font-size:18px;font-weight:800;text-align:center}
#t17-app #t17-wrist-num{padding:10px 12px!important}
#t17-wrist-num:focus{outline:none;border-color:#2d7fd8}
.unit-toggle{display:inline-flex;background:#f7f3ef;border:1px solid #e5dad1;border-radius:12px;overflow:hidden}
.unit-btn{background:transparent;border:0;color:#7f746c;padding:10px 12px;font-size:14px;font-weight:800;cursor:pointer}
#t17-app .unit-btn{padding:10px 12px!important;min-height:42px!important}
.unit-btn.is-active{background:#2d7fd8;color:#fff}
.measure-btn{background:#f4f0ec;border:1px solid #ded5cd;border-radius:12px;color:#665b53;width:46px;height:46px;display:grid;place-items:center;cursor:pointer;padding:0}
#t17-app .measure-btn{width:46px!important;height:46px!important;min-height:46px!important}
.wrist-suggest{font-family:Arial,sans-serif;font-size:11px;color:#82776e;line-height:1.45}
.wrist-suggest b{color:#2f2924;font-weight:800}
.measure-teach{margin-top:6px;background:#fff;border:1px solid #e1d8cf;border-radius:12px;padding:10px}
.measure-teach[hidden]{display:none}
.measure-teach-inner{display:flex;gap:12px;align-items:flex-start}
.measure-teach-inner p{font-family:Arial,sans-serif;font-size:12px;color:#5d534b;line-height:1.55;flex:1}
.measure-teach-inner p b{color:#2d7fd8}
.quick-size-head{display:flex;align-items:end;justify-content:space-between;margin-top:2px;font-family:Arial,sans-serif}
.quick-size-head b{font-size:13px;color:#25211e}
.quick-size-head span{font-size:10px;color:#a49a91}
.quick-sizes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin-top:0}
.quick-size{background:#fff;border:1px solid #e8dfd7;border-radius:10px;padding:4px 7px;cursor:pointer;color:#34302c;font-family:Arial,sans-serif;font-size:12px;font-weight:800;display:flex;flex-direction:column;align-items:center;line-height:1.15;box-shadow:0 2px 6px rgba(70,50,34,.04)}
#t17-app .quick-size{padding:4px 7px!important;min-height:34px!important}
.quick-size small{font-size:9px;color:#8d827a;font-weight:500;margin-top:3px}
#t17-wrist{width:100%;accent-color:#2d7fd8;cursor:pointer}
#t17-draft-toast{position:absolute;top:12px;right:14px;background:rgba(255,255,255,.96);border:1px solid #d9cfc6;color:#3c352f;padding:7px 8px 7px 10px;border-radius:12px;font-size:11px;display:flex;align-items:center;gap:7px;max-width:315px;box-shadow:0 12px 28px rgba(80,59,45,.14);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;transform:translateY(-4px);z-index:5}
#t17-draft-toast.show{opacity:1;pointer-events:auto;transform:translateY(0)}
#t17-draft-toast .draft-msg{line-height:1.4}
#t17-draft-toast .draft-cta{background:#2d6a43;border:0;color:#fff;border-radius:8px;padding:5px 8px;font-size:10px;font-weight:800;cursor:pointer;white-space:nowrap}
#t17-draft-toast .draft-x{width:22px;height:22px;min-height:22px!important;background:#f3eee8;border:0;border-radius:50%;color:#7a7067;font-size:16px;line-height:1;cursor:pointer;padding:0!important;display:grid;place-items:center}
#t17-stage{grid-column:1;grid-row:1;position:relative;min-height:0;background:#fbfaf6;border-right:1px solid #eee4dc;overflow:hidden}
#t17-canvas,#t17-canvas-2d{position:absolute;inset:0;display:block;width:100%;height:100%}
#t17-stage[data-view="2d"] #t17-canvas{opacity:0;pointer-events:none}
#t17-stage[data-view="3d"] #t17-canvas-2d{opacity:0;pointer-events:none}
#t17-stage[data-view="2d"] .three-fallback{display:none!important}
#t17-stage-panel{position:absolute;top:12px;left:50%;z-index:7;display:block;width:min(560px,calc(100% - 40px));transform:translateX(-50%);pointer-events:none}
#t17-stage-panel>*{pointer-events:auto}
.stage-card{background:transparent;border:0;border-radius:0;padding:0;box-shadow:none}
.stage-controls{display:flex;flex-direction:column;align-items:center;gap:7px;position:relative}
.dimension-pill{height:40px;min-width:188px;border:1px solid #c8bc93;border-radius:999px;background:#d4c9a2;color:#332d28;display:flex;align-items:center;gap:9px;padding:4px 14px 4px 10px;box-shadow:0 8px 18px rgba(91,67,32,.09);cursor:pointer;text-align:left}
#t17-app .dimension-pill{padding:4px 14px 4px 10px!important}
.dimension-hand{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#d1bd8e;color:#fff;font-size:15px;line-height:1}
.dimension-copy{display:flex;flex-direction:column;line-height:1.08;min-width:0}
.dimension-copy small{font-family:Arial,sans-serif;font-size:10px;letter-spacing:.4px;text-transform:none;color:#776d5a;font-weight:800}
.dimension-copy b{font-size:17px;color:#3f352c;font-weight:800;text-shadow:none}
.stage-size-row{height:40px;display:flex;flex-direction:row;align-items:center;gap:7px;background:#ece5d5;border:1px solid #d8cdbb;border-radius:999px;padding:4px 6px 4px 12px;box-shadow:0 8px 18px rgba(91,67,32,.08);font-family:Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:.2px;text-transform:none;color:#756b60}
#t17-app .stage-size-row{padding:4px 6px 4px 12px!important}
.stage-size-row>span{line-height:1;white-space:nowrap}
.stage-size-row>strong{display:none}
.stage-size-row>i{display:none}
.stage-size-options{display:flex;gap:4px;align-items:center}
.stage-size-select{display:none;height:32px;min-width:82px;border:1px solid #d8cdbb;border-radius:10px;background:#fffaf3;color:#2d2924;font-family:Arial,sans-serif;font-size:13px;font-weight:800;padding:0 26px 0 10px;cursor:pointer}
.stage-size-btn{height:32px;min-width:50px;border:1px solid #d8cdbb;border-radius:10px;background:#fffaf3;color:#5f554b;font-family:Arial,sans-serif;font-size:13px;font-weight:800;cursor:pointer}
#t17-app .stage-size-btn{padding:0!important;min-height:32px!important}
.stage-size-btn.is-active{background:#171717;border-color:#171717;color:#fff}
.dimension-popover{display:none;position:absolute;top:44px;left:50%;z-index:8;transform:translateX(-50%);width:min(500px,calc(100% - 8px));max-height:352px;background:rgba(255,255,255,.98);border:1px solid #e4d9cf;border-radius:16px;padding:14px;box-shadow:0 22px 48px rgba(58,42,30,.20);overflow:auto;user-select:none}
#t17-app .dimension-popover{padding:14px!important}
.dimension-popover.is-open{display:flex;flex-direction:column;gap:0}
.dimension-popover *{box-sizing:border-box}
.dimension-popover input{user-select:text}
.dimension-modal-head{height:34px;padding:0 8px 0 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee7e1}
#t17-app .dimension-modal-head{padding:0 8px 0 12px!important}
.dimension-modal-head b{font-family:Arial,sans-serif;font-size:14px;color:#181614}
#t17-dimension-close{width:26px;height:26px;min-height:26px!important;border:0;border-radius:50%;background:#f4f1ee;color:#1f1d1a;font-size:18px;line-height:1;cursor:pointer;padding:0!important}
.dimension-field{padding:9px 12px 0;display:flex;flex-direction:column;gap:5px}
#t17-app .dimension-field{padding:9px 12px 0!important}
.body-measure-field{gap:6px}
.measure-ruler input{width:100%;accent-color:#e0202b;cursor:pointer}
.dimension-field-head{display:flex;align-items:center;justify-content:space-between;font-family:Arial,sans-serif}
.dimension-field-head span{font-size:12px;font-weight:800;color:#24211e}
.dimension-field-head strong{font-size:15px;color:#d32222}
.ruler-card{border:1px solid #eee5de;border-radius:11px;padding:5px 9px 4px;background:linear-gradient(180deg,#fff,#fbfaf8)}
#t17-app .ruler-card{padding:5px 9px 4px!important}
.ruler-ticks{display:flex;justify-content:space-between;padding:0 20px;font-family:Arial,sans-serif;font-size:10px;color:#9a9189}
.wrist-recommend{margin:6px 12px 0;background:#fff0f0;border-radius:11px;padding:5px 8px;display:flex;align-items:center;justify-content:space-between;font-family:Arial,sans-serif}
#t17-app .wrist-recommend{margin:6px 12px 0!important;padding:5px 8px!important}
.wrist-recommend span{font-size:11px;font-weight:800;color:#2a2623;white-space:nowrap}
.wrist-recommend b{background:#fff;border:1px solid #f1d9d9;border-radius:9px;padding:4px 10px;font-size:14px;color:#d32222}
.wrist-edit label{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #f1d9d9;border-radius:10px;padding:0 10px}
#t17-app .wrist-edit label{padding:0 10px!important}
.wrist-edit input{width:66px;border:0;background:transparent;color:#d32222;font-size:16px;font-weight:900;text-align:right;padding:5px 0!important}
.wrist-edit input:focus{outline:none}
.wrist-edit label b{border:0;border-radius:0;background:transparent;padding:0;font-size:13px}
.dimension-popover .quick-size-head,.dimension-popover .quick-sizes,.dimension-popover .wrist-suggest{margin-left:12px;margin-right:12px}
.dimension-popover .quick-size-head{margin-top:6px}
.dimension-popover .quick-sizes{margin-top:4px}
.dimension-popover .wrist-suggest{margin-top:6px}
#t17-app .dimension-popover .quick-size-head,#t17-app .dimension-popover .quick-sizes,#t17-app .dimension-popover .wrist-suggest{margin-left:12px!important;margin-right:12px!important}
#t17-app .dimension-popover .quick-size-head{margin-top:6px!important}
#t17-app .dimension-popover .quick-sizes{margin-top:4px!important}
#t17-app .dimension-popover .wrist-suggest{margin-top:6px!important}
.dimension-popover .wrist-suggest{display:none}
#t17-dimension-confirm{height:34px!important;min-height:34px!important;border:0;border-radius:999px;background:#111;color:#fff;margin:8px 12px 10px;padding:0 14px!important;font-size:12px;font-weight:800;cursor:pointer}
.dimension-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.size-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
#t17-stage-actions{position:absolute;left:50%;bottom:14px;z-index:4;transform:translateX(-50%);display:flex;gap:12px;align-items:center;justify-content:center;pointer-events:auto}
#t17-stage-actions button{height:30px!important;min-height:30px!important;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 14px!important;font-family:Georgia,"Times New Roman",serif;font-size:12px;font-weight:700;line-height:1!important;box-shadow:0 10px 22px rgba(80,59,45,.12);cursor:pointer;white-space:nowrap}
#t17-stage-reset{min-width:82px;background:#d4c38e;color:#fff}
#t17-gather-toggle{min-width:132px;background:#f7f2ea;color:#4c4036}
#t17-view-toggle{min-width:122px;background:#9a8d61;color:#fff}
#t17-stage-actions button:hover{transform:translateY(-1px);filter:saturate(1.08);box-shadow:0 13px 24px rgba(80,59,45,.18)}
#t17-stage[data-view="3d"] #t17-view-toggle{background:#f7f2ea;color:#45392f}
#t17-stage-actions span{font-family:Arial,sans-serif;font-size:14px;line-height:1}
#t17-hint{display:none}
#t17-hint b{color:#2f2924}
#t17-sel-actions{position:absolute;top:76px;right:18px;background:rgba(255,255,255,.9);padding:8px;border-radius:12px;display:flex;flex-direction:column;align-items:stretch;gap:5px;font-size:10px;color:#3c352f;width:112px;box-shadow:0 10px 24px rgba(75,55,42,.08)}
#t17-sel-actions:empty{display:none}
#t17-sel-actions b{color:#a56f28}
#t17-sel-actions .mini{height:27px!important;min-height:27px!important;background:#f5f1ed;border:1px solid #ded5cd;color:#4c433d;border-radius:8px;padding:0 7px!important;font-size:9px;font-weight:800;line-height:1!important;cursor:pointer}
#t17-sel-actions .mini.danger{background:#fff0ef;border-color:#edb2ad;color:#b33b36}
#t17-flash{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:rgba(31,30,29,.94);color:#fff;padding:9px 18px;border-radius:18px;font-size:13px;font-weight:700;opacity:0;pointer-events:none;transition:opacity .2s;max-width:80%;text-align:center;z-index:4}
#t17-flash.show{opacity:1}
#t17-bottom{grid-column:1;grid-row:2;background:#fff;border-top:1px solid var(--line);padding:7px 10px;display:grid;grid-template-columns:minmax(190px,.66fr) minmax(285px,.98fr) minmax(158px,.44fr);gap:7px 9px;align-items:stretch;overflow:hidden}
#t17-checkout-panel{grid-column:3;width:100%;min-width:0;justify-self:stretch;display:flex;flex-direction:column;justify-content:center;gap:6px;align-items:stretch;border:1px solid #e5dcd4;border-radius:13px;background:linear-gradient(180deg,#fffdfb,#f8f2ed);padding:7px;box-shadow:0 7px 18px rgba(72,52,34,.045);height:96px;min-height:96px;overflow:hidden;box-sizing:border-box}
#t17-checkout-total{display:none}
#t17-design-summary{grid-column:1;grid-row:1/span 2;align-self:stretch;border:1px solid #e9dfd6;border-radius:13px;background:linear-gradient(180deg,#fffdfb,#f7f1eb);padding:8px 9px;font-family:Arial,sans-serif;color:#746960;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:8px;row-gap:5px;min-width:0;height:96px;min-height:96px;overflow:hidden;box-shadow:0 7px 18px rgba(72,52,34,.045);box-sizing:border-box}
#t17-design-summary span{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:3px;min-width:0;line-height:1.05}
#t17-design-summary em{display:block;font-style:normal;font-size:10px;font-weight:800;color:#8b7f74;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
#t17-design-summary strong{display:block;font-size:13px;color:#2f2924;white-space:nowrap}
#t17-seq-wrap{min-width:0;height:150px;flex:0 0 150px;background:#d4c9a2;border:0;border-radius:12px;padding:0;margin:0 0 8px;overflow:hidden;display:grid;grid-template-columns:160px minmax(0,1fr);gap:8px}
#t17-seq-summary{min-width:0;min-height:0;height:100%;box-sizing:border-box;overflow:hidden;padding:9px 0 9px 10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:min-content;gap:4px}
#t17-seq-summary b{grid-column:1/-1;font-family:Georgia,"Times New Roman",serif;font-size:15px;line-height:1.05;color:#473d36}
.seq-summary-btn{height:26px!important;min-height:26px!important;border:1px solid rgba(120,105,82,.22);border-radius:999px;background:rgba(255,255,255,.34);color:#62594d;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:6px;padding:2px 8px!important;font-family:Arial,sans-serif;font-size:8px;font-weight:800;line-height:1!important;text-transform:none;cursor:pointer;appearance:none;min-width:0}
#t17-app .seq-summary-btn{text-transform:none}
.seq-summary-btn.is-wide{grid-column:1/-1}
.seq-summary-btn .seq-label{display:block;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:8px;line-height:1;color:#746a5d}
.seq-summary-btn strong{display:block;font-size:10px;line-height:1;color:#302a25;flex:0 0 auto}
.seq-summary-btn.is-active{background:#fff;color:#2f2924;box-shadow:0 4px 10px rgba(80,60,38,.08)}
.seq-summary-btn.is-active .seq-label,.seq-summary-btn.is-active strong{color:#2f2924}
#t17-seq{min-width:0;min-height:0;height:calc(100% - 18px);box-sizing:border-box;margin:9px 10px 9px 0;background:rgba(255,255,255,.55);border-radius:10px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(34px,34px);gap:8px 6px;overflow-y:auto;overflow-x:hidden;padding:7px;align-items:start;align-content:start}
.seq-item{min-width:0;background:#f8f5f2;border:1px solid #e5dcd4;border-radius:10px;padding:3px 5px;cursor:pointer;display:flex;align-items:center;gap:5px;transition:border-color .12s,background .12s}
#t17-app .seq-item{padding:3px 5px;text-transform:none}
.seq-item:hover{border-color:#d5b8a1;background:#fff}
.seq-item.is-selected{border-color:#d5504c;box-shadow:0 0 0 2px rgba(213,80,76,.12)}
.seq-dot{width:20px;height:20px;border-radius:50%;flex:0 0 20px;background-size:cover;background-position:center;box-shadow:inset -3px -3px 6px rgba(66,50,40,.2);display:grid;place-items:center;font-family:Arial,sans-serif;font-size:8px;font-weight:800;color:#5a4d3f;background-color:#efe6d8}
.seq-dot.charm-dot{background:linear-gradient(145deg,#f4dda1,#b58a2f);display:grid;place-items:center;font-size:8px;font-weight:800;color:#2b210c;background-size:18px 18px;background-position:center;background-repeat:no-repeat}
.seq-item small{font-family:Arial,sans-serif;font-size:9px;color:#574d45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1;text-align:left;text-transform:none}
#t17-app .seq-item small{text-transform:none}
.seq-remove{width:16px;height:16px;border-radius:50%;display:grid;place-items:center;flex:0 0 16px;background:#e9ded3;color:#675b51;font-family:Arial,sans-serif;font-size:12px;font-weight:800;line-height:1}
.seq-remove:hover{background:#d5504c;color:#fff}
.seq-empty{grid-column:1/-1;min-height:74px;display:grid;place-items:center;text-align:center;color:#7f7469;font-family:Arial,sans-serif;font-size:11px}
.seq-cord-item{grid-column:1/span 2}
#t17-price{grid-column:2;height:96px;min-height:96px;background:linear-gradient(180deg,#fffdfb,#f8f2ed);border:1px solid #e5dcd4;border-radius:13px;padding:6px 7px;display:grid;grid-template-columns:minmax(0,1fr) 76px;gap:7px;align-items:stretch;box-shadow:0 7px 18px rgba(72,52,34,.045);min-width:0;overflow:hidden;box-sizing:border-box}
.price-rows{height:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr));gap:5px;align-items:stretch;min-width:0}
.price-rows .pr{min-height:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;font-family:Arial,sans-serif;font-size:11px;color:#746960;padding:4px 7px;gap:3px;line-height:1;border-radius:9px;background:rgba(255,255,255,.64);white-space:nowrap;min-width:0;overflow:hidden}
.price-rows .pr .pr-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:750;color:#6f655d}
.price-rows .pr strong{flex:0 0 auto;font-size:12.5px;font-weight:850;color:#2f2924;white-space:nowrap;text-align:left}
.price-rows .pr em{display:inline;font-style:normal;font-size:inherit;color:inherit;line-height:1;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.price-rows .pr-cord{grid-column:auto}
.price-total-col{border-left:1px solid #e3d8cf;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding-left:7px;font-family:Arial,sans-serif;color:#6f655d;min-width:0}
.price-total-col span{font-size:10.5px;font-weight:850;text-transform:none}
.price-total-col strong{font-family:Georgia,"Times New Roman",serif;font-size:19px;line-height:1;color:#1f1b18;white-space:nowrap}
#t17-add-cart{align-self:center;justify-self:center;width:100%;height:auto!important;min-height:42px!important;margin:0;background:#2d6a43;color:#fff;border:0;border-radius:12px;padding:0 9px!important;font-size:11px;font-weight:850;line-height:1.12!important;cursor:pointer;box-shadow:0 10px 22px rgba(45,106,67,.18)}
.checkout-note{font-family:Arial,sans-serif;font-size:11px;color:#82776e;line-height:1.15;text-align:center;white-space:nowrap}
.checkout-note.ok{color:#3d8b4f}.checkout-note.over{color:#c8423d}
#t17-add-cart:hover{background:#d4a72c}
#t17-add-cart:disabled{opacity:.6;cursor:default}
#t17-draft-toast,#t17-draft-toast.show{display:none!important;opacity:0!important;pointer-events:none!important}
.scroll-area::-webkit-scrollbar,#t17-bead-grid::-webkit-scrollbar,#t17-seq::-webkit-scrollbar{width:10px;height:10px}
.scroll-area::-webkit-scrollbar-thumb,#t17-bead-grid::-webkit-scrollbar-thumb{background:#b8aca1;border-radius:8px;border:2px solid transparent;background-clip:padding-box}
#t17-seq::-webkit-scrollbar-thumb{background:#8f7f55;border-radius:8px;border:2px solid #d4c9a2;background-clip:padding-box}
.scroll-area::-webkit-scrollbar-track,#t17-bead-grid::-webkit-scrollbar-track,#t17-seq::-webkit-scrollbar-track{background:transparent}
@media(max-width:1400px){
  #t17-app{width:min(1360px,calc(100vw - 16px));max-width:calc(100vw - 16px);margin:8px 0}
  #t17-right{grid-template-columns:minmax(0,52%) minmax(0,48%)}
  #t17-stage,#t17-catalog{min-width:0}
  #t17-catalog{padding:5px 7px}
  .catalog-body{grid-template-columns:118px minmax(0,1fr);gap:10px}
  #t17-bead-grid{grid-template-columns:repeat(3,minmax(92px,1fr));gap:6px}
  #t17-bottom{grid-template-columns:minmax(185px,.66fr) minmax(310px,.98fr) minmax(154px,.44fr);gap:7px 8px;padding:7px 8px}
  #t17-checkout-panel{grid-column:3;height:96px;min-height:96px;gap:6px}
  #t17-design-summary{grid-column:1;height:96px;min-height:96px}
  #t17-price{grid-column:2;height:96px;min-height:96px;grid-template-columns:minmax(0,1fr) 72px}
  .price-rows{gap:5px}
  .price-rows .pr{font-size:11px;padding:4px 6px}
  .price-rows .pr strong{font-size:12px}
  .price-total-col strong{font-size:18px}
}
@media(max-width:1280px){
  #t17-shell{padding-top:10px}
  #t17-app{left:auto!important;transform:none!important;width:100%!important;max-width:100vw!important;margin:0!important;border-radius:0;flex-direction:column!important;height:auto;min-height:0;overflow:hidden}
  #t17-left{display:none!important}
  #t17-right{display:flex!important;flex-direction:column!important;overflow:visible;width:100%!important;min-width:0!important;max-width:100%!important}
  #t17-stage{order:1;min-height:500px;border-right:0;width:100%!important;min-width:0!important;max-width:100%!important}
  #t17-catalog{order:2;width:100%!important;min-width:0!important;max-width:100%!important;border-left:0;border-top:1px solid var(--line);max-height:none;overflow:hidden;padding:5px 6px;gap:5px}
  #t17-bottom{order:3;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;padding:8px 10px;width:100%!important;max-width:100%!important;box-sizing:border-box}
  #t17-checkout-panel{grid-column:1/-1;grid-row:auto;width:min(360px,100%);justify-self:center;height:92px;min-height:92px;gap:6px}
  #t17-design-summary{grid-column:auto;grid-row:auto;height:96px;min-height:96px}
  #t17-price{grid-column:auto;grid-row:auto;height:96px;min-height:96px}
  .price-rows{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .price-rows .pr{font-size:11.5px;padding:4px 6px}
  .price-total-col strong{font-size:18px}
  #t17-stage,#t17-catalog{min-width:0;width:100%!important}
  #t17-stage-panel{width:min(500px,calc(100% - 16px));top:10px}
  .stage-size-options{display:none!important}
  .stage-size-select{display:block}
  #t17-wrist-wrap{gap:7px}
  .stage-size-row{height:42px;padding:3px 8px 3px 12px!important}
  .stage-size-row>span{font-size:12px}
  .dimension-pill{height:42px;min-width:168px}
  #t17-seq-wrap{height:118px;grid-template-columns:108px minmax(0,1fr);gap:6px}
  #t17-seq-summary{padding:7px 0 7px 8px;gap:3px}
  .seq-summary-btn{height:22px!important;min-height:22px!important;padding:2px 6px!important;gap:4px}
  .seq-summary-btn .seq-label{font-size:7px}
  .seq-summary-btn strong{font-size:9px}
  #t17-seq{height:calc(100% - 14px);margin:7px 7px 7px 0;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;padding:5px}
  .seq-card{min-height:32px}
  .seq-card .mini{width:25px;height:25px}
  .catalog-tabs{gap:7px;padding:4px 4px 5px;overflow:hidden;justify-content:center;flex-wrap:nowrap}
  .tab-btn{flex:0 1 112px;min-width:0;height:30px;font-size:11px;padding:0 10px!important}
  .catalog-body{grid-template-columns:96px minmax(0,1fr);gap:8px;max-height:260px;flex-basis:260px}
  .catalog-cats{padding:2px 4px 7px;overflow:hidden}
  #t17-filter-tabs{height:30px}
  .filter-tab{height:28px;font-size:10px}
  #t17-app .catalog-cats .scroll-area{overflow-y:auto!important;overflow-x:hidden!important}
  #t17-category-list{display:block!important;grid-template-columns:none!important;overflow-y:auto;overflow-x:hidden;padding-left:8px!important}
  .cat-row{padding-left:8px!important;height:34px}
  #t17-bead-grid{grid-template-columns:repeat(2,minmax(82px,1fr));gap:6px;padding-right:6px;max-height:260px}
  .bead-card{min-height:74px}
  #t17-stage-actions{gap:8px}
  #t17-stage-actions button{padding:0 10px!important}
  .dimension-popover{width:min(430px,calc(100vw - 34px))}
}
@media(max-width:820px){
  #t17-shell{padding-top:8px}
  body:has(#t17-app){padding-bottom:0!important}
  body:has(#t17-app) .wd-toolbar,
  body:has(#t17-app) .woodmart-toolbar,
  body:has(#t17-app) .wd-sticky-btn,
  body:has(#t17-app) .gt_float_switcher,
  body:has(#t17-app) .gt_switcher_wrapper,
  body:has(#t17-app) .gtranslate_wrapper,
  body:has(#t17-app) #gt_float_wrapper,
  body:has(#t17-app) nav.trp-language-switcher,
  body:has(#t17-app) .trp-language-switcher,
  body:has(#t17-app) .trp-floating-switcher,
  body:has(#t17-app) .trp-floater-ls,
  body:has(#t17-app) .translatepress-floating-language-switcher{display:none!important}
  #t17-app{left:auto;transform:none;width:100%;max-width:100%;margin:0!important;border-radius:0;flex-direction:column;height:auto;min-height:0;overflow:hidden}
  #t17-left{display:none}
  #t17-right{display:flex;flex-direction:column;overflow:visible;width:100%;min-width:0}
  #t17-stage{order:1;min-height:340px;border-right:0;width:100%;min-width:0}
  #t17-catalog{order:2;border-left:0;border-top:1px solid var(--line);max-height:none;padding:5px 6px;display:flex;flex-direction:column}
  #t17-catalog-tabs{order:1;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;min-height:26px;padding:0 0 4px;overflow:visible}
  .mode-tab{width:100%;min-width:0;height:24px!important;font-size:7.8px;padding:0 3px!important}
  .catalog-body{order:2}
  #t17-seq-wrap{order:3}
  #t17-bottom{order:3;grid-template-columns:1fr;gap:6px;padding:8px 10px}
  #t17-design-summary,#t17-price,#t17-checkout-panel{grid-column:1;grid-row:auto;height:auto;min-height:68px}
  #t17-design-summary{padding:6px 8px;column-gap:12px;row-gap:4px}
  #t17-design-summary span{flex-direction:row;align-items:center;justify-content:flex-start;gap:4px}
  #t17-design-summary em{font-size:9px}
  #t17-design-summary strong{font-size:12px;font-weight:700}
  #t17-checkout-panel{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:grid;grid-template-columns:104px minmax(0,1fr);align-items:center;gap:10px;height:auto;min-height:0;padding:8px 14px max(8px,env(safe-area-inset-bottom));background:rgba(255,253,249,.98);border:0;border-top:1px solid #eadfd5;border-radius:14px 14px 0 0;box-shadow:0 -8px 26px rgba(35,28,22,.16);backdrop-filter:blur(10px)}
  #t17-checkout-total{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;min-width:0;font-family:Arial,sans-serif;color:#5f554d;line-height:1.05}
  #t17-checkout-total span{font-size:10px;font-weight:750;text-transform:none}
  #t17-checkout-total strong{font-size:18px;font-weight:800;color:#1f1b18;white-space:nowrap}
  .checkout-note{text-align:center}
  #t17-price{grid-template-columns:minmax(0,1fr) 76px}
  .price-rows{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr))}
  .price-rows .pr{flex-direction:row;align-items:center;justify-content:flex-start;gap:5px;padding:4px 6px}
  .price-rows .pr .pr-label{font-size:9px;font-weight:650}
  .price-rows .pr strong{font-size:11px;font-weight:650;color:#3f3832}
  .price-rows .pr-cord{grid-column:1}
  .price-total-col{gap:5px;padding-left:8px}
  .price-total-col span{font-size:9px}
  .price-total-col strong{font-family:Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:0;color:#2b2622}
  #t17-add-cart{min-height:48px;border-radius:12px;box-shadow:0 8px 20px rgba(45,106,67,.24)}
  #t17-checkout-panel .checkout-note{display:none}
  #t17-stage-panel{top:4px;width:calc(100% - 14px)}
  #t17-app.is-mobile-scrolled #t17-stage-panel{opacity:0;pointer-events:none;transform:translate(-50%,-8px);transition:opacity .16s ease,transform .16s ease}
  .stage-controls{width:100%;display:grid;grid-template-columns:1fr;justify-items:center;gap:5px}
  #t17-wrist-wrap{width:min(100%,360px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px;justify-items:stretch}
  .dimension-pill{height:36px;min-height:36px!important;min-width:0;width:100%;padding:0 9px!important;gap:7px}
  .dimension-hand{width:22px;height:22px;flex:0 0 22px;font-size:13px}
  .dimension-copy small{font-size:9px;letter-spacing:.2px}
  .dimension-copy b{font-size:17px}
  .stage-size-row{position:relative;height:36px;min-height:36px!important;gap:5px;padding:0 9px!important;min-width:0;width:100%;box-sizing:border-box;justify-content:center;cursor:pointer}
  .stage-size-row>span{font-size:13px}
  .stage-size-row>strong{display:block;font-size:15px;color:#3f352c;line-height:1;white-space:nowrap}
  .stage-size-row>i{display:block;width:7px;height:7px;border-right:2px solid #b4aa9e;border-bottom:2px solid #b4aa9e;transform:rotate(45deg);margin:0 2px 3px 3px}
  .stage-size-select{display:none!important}
  .stage-size-options{position:absolute;left:50%;top:calc(100% + 5px);z-index:12;transform:translateX(-50%);display:none!important;grid-template-columns:repeat(4,42px);gap:4px;padding:5px;background:rgba(255,253,249,.98);border:1px solid #e2d8cf;border-radius:14px;box-shadow:0 12px 28px rgba(58,42,30,.18)}
  .stage-size-row.is-open .stage-size-options{display:grid!important}
  .stage-size-btn{height:30px!important;min-height:30px!important;min-width:0;border-radius:10px;font-size:11px}
  .dimension-popover{top:38px;width:min(408px,calc(100vw - 18px));max-height:min(292px,calc(100vh - 220px));padding:8px!important;border-radius:14px}
  .dimension-modal-head{height:28px;padding:0 6px 0 9px!important}
  .dimension-field{padding:6px 8px 0!important;gap:3px}
  .body-measure-field{gap:4px}
  .dimension-field-head span{font-size:11px}
  .dimension-field-head strong{font-size:13px}
  .ruler-card{padding:3px 8px 2px!important}
  .wrist-recommend{margin:5px 8px 0!important;padding:4px 6px!important;border-radius:10px}
  .wrist-recommend span{font-size:10px}
  .wrist-recommend b{font-size:13px;padding:3px 8px}
  .wrist-edit input{width:54px;font-size:14px;padding:3px 0!important}
  .dimension-popover .quick-size-head,.dimension-popover .quick-sizes,.dimension-popover .wrist-suggest{margin-left:8px!important;margin-right:8px!important}
  .dimension-popover .quick-size-head{margin-top:4px!important}
  .dimension-popover .quick-sizes{margin-top:3px!important;gap:4px}
  .quick-size-head b{font-size:12px}
  .quick-size-head span{font-size:9px}
  .quick-size{min-height:26px!important;padding:2px 5px!important;border-radius:9px}
  .quick-size b{font-size:11px;line-height:1}
  .quick-size small{font-size:7.5px;margin-top:1px;line-height:1}
  #t17-dimension-confirm{position:sticky;bottom:0;height:30px!important;min-height:30px!important;margin:6px 8px 0!important;font-size:11px}
  #t17-stage-actions{bottom:5px;gap:6px}
  #t17-stage-actions button{height:34px;min-width:92px;font-size:10px}
  #t17-seq-wrap{height:82px;flex:0 0 82px;grid-template-columns:112px minmax(0,1fr);gap:5px;margin:5px 0 0}
  #t17-seq-summary{padding:5px 0 5px 7px;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px}
  #t17-seq-summary b{font-size:12px}
  .seq-summary-btn{height:18px!important;min-height:18px!important;font-size:7px;padding:1px 5px!important;gap:3px}
  .seq-summary-btn .seq-label{font-size:6.8px}
  .seq-summary-btn strong{font-size:8px}
  #t17-seq{height:calc(100% - 10px);margin:5px 5px 5px 0;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:minmax(28px,28px);gap:4px;padding:4px}
  .seq-card{min-height:30px;padding:3px 5px;gap:4px}
  .seq-card .mini{width:22px;height:22px}
  .seq-card span{font-size:8px}
  .seq-remove{width:16px;height:16px}
  .catalog-tabs{gap:5px;justify-content:center;overflow:hidden;flex-wrap:nowrap}
  .tab-btn{height:28px;font-size:9.5px;flex:1 1 0;min-width:0;padding:0 6px!important}
  .catalog-body{grid-template-columns:120px minmax(0,1fr);gap:7px;flex:0 0 214px;max-height:214px}
  .catalog-cats{padding:2px 4px 7px;overflow:hidden}
  #t17-app .catalog-cats .scroll-area{overflow-y:auto!important;overflow-x:hidden!important;min-height:0}
  #t17-category-list{display:block!important;grid-template-columns:none!important;overflow-y:auto;overflow-x:hidden;padding-left:4px!important}
  .cat-row{height:30px;min-height:30px;font-size:11px;font-weight:600;line-height:1.12;letter-spacing:0;color:#625b54;padding:4px 7px 4px 8px!important;gap:7px}
  .cat-row.is-active{color:#28231f}
  .cat-mark{width:12px;height:12px;flex-basis:12px}
  #t17-bead-grid{grid-template-columns:repeat(2,minmax(84px,1fr));gap:5px;max-height:214px;overflow-y:auto;padding:0 5px 6px 0}
  .bead-card{min-height:50px;padding:3px 4px;gap:1px}
  .bead-card .card-coin{width:24px;height:24px}
  .bead-card .bead-thumb{width:20px;height:20px;flex-basis:20px}
  .bead-meta{gap:1px;line-height:1.02}
  .bead-meta b{font-size:9px;-webkit-line-clamp:1}
  .bead-meta small{font-size:8.5px}
}
@media(max-width:430px){
  #t17-stage{min-height:330px}
  #t17-wrist-wrap{width:calc(100% - 14px);grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .dimension-pill{height:34px;min-height:34px!important}
  .dimension-copy span{font-size:9px}
  .dimension-copy b{font-size:16px}
  .stage-size-row{height:34px;min-height:34px!important;padding:0 8px!important}
  .stage-size-row>span{font-size:12px}
  .stage-size-row>strong{font-size:14px}
  .stage-size-options{grid-template-columns:repeat(4,38px)}
  .stage-size-btn{height:28px!important;min-height:28px!important;font-size:10px}
  .dimension-popover{max-height:min(274px,calc(100vh - 200px))}
  #t17-catalog-tabs{grid-template-columns:repeat(5,minmax(0,1fr));gap:3px}
  .mode-tab{font-size:7px;padding:0 2px!important}
  .catalog-body{grid-template-columns:120px minmax(0,1fr);gap:5px;flex-basis:204px;max-height:204px}
  .catalog-products{min-width:0}
  #t17-bead-grid{grid-template-columns:repeat(2,minmax(78px,1fr))!important;gap:5px;max-height:204px;padding:0 4px 6px 0}
  .bead-card{width:100%;box-sizing:border-box;min-height:50px}
  #t17-price{gap:6px}
  #t17-price{grid-template-columns:1fr}
  .price-total-col{border-left:0;border-top:1px solid #e3d8cf;padding:6px 0 0;flex-direction:row;justify-content:flex-start;gap:8px}
  .price-rows{grid-template-columns:1fr 1fr}
  .price-rows .pr{height:28px;font-size:11px;padding:5px 7px}
  .price-rows .pr strong{font-size:11px;font-weight:650}
  .price-total-col strong{font-size:16px;font-weight:700}
}
`;

const fragment = `<!-- ===== Earthward T17 Crystal Bracelet Builder WP Fragment ===== -->
<style>${CSS}</style>
<div id="t17-app">
  <section id="t17-right">
    <aside id="t17-catalog">
      <section id="t17-seq-wrap" class="catalog-section">
        <div id="t17-seq-summary"></div>
        <div id="t17-seq"></div>
      </section>
      <div id="t17-catalog-tabs">
        <button type="button" class="mode-tab is-active" data-mode="bead">Crystals</button>
        <button type="button" class="mode-tab" data-mode="shape">Accessories</button>
        <button type="button" class="mode-tab" data-mode="charm">Charms</button>
        <button type="button" class="mode-tab" data-mode="spacer">Packaging</button>
        <button type="button" class="mode-tab" data-mode="cord">Cord</button>
      </div>
      <div class="catalog-body">
        <div class="catalog-cats">
          <h3 id="t17-category-heading" class="cat-switch"></h3>
          <div class="scroll-area"><div id="t17-category-list"></div></div>
        </div>
        <div class="catalog-products">
          <div id="t17-bead-grid"></div>
        </div>
      </div>
    </aside>
    <div id="t17-stage">
      <canvas id="t17-canvas-2d"></canvas>
      <canvas id="t17-canvas"></canvas>
      <div id="t17-stage-actions">
        <button type="button" id="t17-stage-reset">Reset</button>
        <button type="button" id="t17-gather-toggle"></button>
        <button type="button" id="t17-view-toggle" aria-label="Toggle 2D and 3D view"></button>
      </div>
      <div id="t17-stage-panel">
        <div class="stage-card stage-controls">
          <div class="tb-group" id="t17-sizes-wrap"><div id="t17-sizes"></div></div>
          <div class="tb-group" id="t17-wrist-wrap"></div>
        </div>
      </div>
      <div id="t17-sel-actions"></div>
      <div id="t17-flash"></div>
    </div>
    <div id="t17-bottom">
      <div id="t17-design-summary"></div>
      <div id="t17-price"></div>
      <div id="t17-checkout-panel">
        <div id="t17-checkout-total"></div>
        <button type="button" id="t17-add-cart">Checkout custom bracelet</button>
        <div id="t17-checkout-note"></div>
      </div>
    </div>
  </section>
</div>

<!-- parts JSON (ascii-escaped; non-ASCII 鈫?\\uXXXX so wp_kses never sees raw bytes) -->
<script type="text/plain" id="t17-data">${DATA_B64}</script>

<!-- importmap: CDN (jsdelivr three@0.160.0) by default. Flip HOST_MODE=selfhost
     after uploading vendor to /wp-content/uploads/builder/vendor/ if CDN is blocked. -->
<script type="importmap">
{
  "imports": {
    "three": "${IMPORTMAP.three}",
    "three/addons/": "${IMPORTMAP['three/addons/']}"
  }
}
</script>

<script type="text/plain" id="t17-app-b64">${APP_B64}</script>
<script>(function(){try{var s=atob(document.getElementById('t17-app-b64').textContent);(0,eval)(s);}catch(e){console.error('T17 init failed',e);}})();</script>
<!-- ===== End Earthward T17 Crystal Bracelet Builder WP Fragment ===== -->`;

const preview = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Crystal Bracelet Builder - Design Bead by Bead</title>
<style>html,body{margin:0;min-height:100%;background:#0e1116}</style>
</head>
<body>
${fragment}
</body>
</html>`;

fs.writeFileSync(OUT_PATH, fragment, 'utf8');
fs.writeFileSync(PREVIEW_PATH, preview, 'utf8');
console.log('T17 Step-3 WP fragment generated:', OUT_PATH);
console.log('T17 Step-3 preview generated:', PREVIEW_PATH);
console.log('host_mode=' + HOST_MODE + ' | three=' + IMPORTMAP.three);
console.log('APP_JS base64 length=' + APP_B64.length + ' | parts ascii length=' + DATA_BLOCK.length + ' | parts base64 length=' + DATA_B64.length);
console.log('beads=' + parts.beads.length + ' charms=' + parts.charms.length + ' cords=' + parts.cords.length + ' presets=' + parts.presets.length);
