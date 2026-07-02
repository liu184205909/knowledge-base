/**
 * T17 Crystal Bracelet Builder — Step 3 DEPLOY generator (WP-adapted).
 *
 * Builds on the Step 2 generator (interaction completeness) and layers the
 * WP-deployment adaptations the production page needs:
 *   - CDN importmap (jsdelivr three@0.160.0) instead of file:// vendor URLs,
 *       with a self-host fallback the operator can flip via HOST_MODE.
 *   - JS base64 wrapping (memory wp-html-block-js-base64, MANDATORY): the APP
 *       JS contains pointer-drag `&&`, `<` comparisons and CJK strings that
 *       wp_kses_post would otherwise mangle inside <!-- wp:html -->.
 *   - parts JSON delivered as ascii-escaped application/json block (CJK
 *       name_cn → \uXXXX so non-ASCII bytes never hit wp_kses).
 *   - Add-to-cart wired to admin-ajax action=t17_add_custom_bracelet (Step 0
 *       Code Snippet id=20 endpoint), with cart toast + "View cart" link.
 *
 * Host mode: set HOST_MODE=selfhost to emit the self-hosted importmap
 * (/wp-content/uploads/builder/vendor/...) — the operator uploads the three
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

function fail(msg) { throw new Error('[T17 deploy build] ' + msg); }
function assertArray(name, value, min) {
  if (!Array.isArray(value) || value.length < min) fail(name + ' must contain at least ' + min + ' items');
}

// PRD R5: validate source (same checks as Step 2 — single source of truth).
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

// asciiJSON: non-ASCII → \uXXXX so wp_kses never sees raw multi-byte chars
// that would corrupt the JSON block. Also escape </ to prevent </script> breakout.
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON(parts);
const DATA_B64 = Buffer.from(DATA_BLOCK, 'utf8').toString('base64');

// ---------------------------------------------------------------------------
// Application JS (WP-deploy: base64-wrapped, runs via atob→eval loader).
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

  // WP admin-ajax URL + builder product id (catalog_hidden product 49026).
  var AJAX_URL = (window.T17_AJAX_URL) || '/wp-admin/admin-ajax.php';
  var PRODUCT_ID = (window.T17_PRODUCT_ID) || 49026;

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
    filterColor: 'all',
    catalogMode: 'bead'
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
  // F8 (PRD R3): the builder uses discrete slots, not circular bead packing.
  function suggestedBeadCount() {
    return targetSlots();
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

  // --- Procedural crystal texture (canvas) — shared by 3D bead + 2D thumbnail ---
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
        ctx.fillText('ॐ', cx, cy + size * 0.02); // Devanagari OM (escaped for asciiJSON safety)
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
      heading.textContent = 'Crystal';
      cats.innerHTML = COLOR_TABS.map(function (t) {
        return '<button type="button" class="cat-row' + (state.filterColor === t.id ? ' is-active' : '') + '" data-color="' + t.id + '">' +
          '<span class="cat-mark"></span><span>' + t.label + '</span></button>';
      }).join('');
      return;
    }
    if (state.catalogMode === 'charm') {
      heading.textContent = 'Charms';
      var groups = [
        { id: 'all', label: 'All Charms' },
        { id: 'eastern', label: 'Eastern' },
        { id: 'classic', label: 'Classic' }
      ];
      cats.innerHTML = groups.map(function (g) {
        return '<button type="button" class="cat-row' + (state.filterColor === g.id ? ' is-active' : '') + '" data-charm-cat="' + g.id + '">' +
          '<span class="cat-mark"></span><span>' + g.label + '</span></button>';
      }).join('');
      return;
    }
    if (state.catalogMode === 'cord') {
      heading.textContent = 'Cord';
      cats.innerHTML = parts.cords.map(function (c) {
        return '<button type="button" class="cat-row' + (state.cord === c.id ? ' is-active' : '') + '" data-cord="' + c.id + '">' +
          '<span class="cat-mark"></span><span>' + c.name_en + '</span></button>';
      }).join('');
      return;
    }
    heading.textContent = state.catalogMode === 'shape' ? 'Shapes' : 'Spacers';
    var rows = state.catalogMode === 'shape'
      ? ['Freeform', 'Carved', 'Drop', 'Figure']
      : ['Silver', 'Gold', 'Rondelle', 'Matte'];
    cats.innerHTML = rows.map(function (label, i) {
      return '<button type="button" class="cat-row' + (i === 0 ? ' is-active' : '') + '" disabled><span class="cat-mark"></span><span>' + label + '</span></button>';
    }).join('');
  }

  function renderBeadGrid() {
    var grid = document.getElementById('t17-bead-grid');
    var title = document.getElementById('t17-catalog-title');
    var count = document.getElementById('t17-catalog-count');
    if (!grid || !title || !count) return;
    title.textContent =
      state.catalogMode === 'bead' ? 'Beads' :
      state.catalogMode === 'charm' ? 'Charms' :
      state.catalogMode === 'shape' ? 'Crystal Shapes' :
      state.catalogMode === 'spacer' ? 'Spacers' : 'Cord';
    count.textContent =
      state.catalogMode === 'bead' ? String(parts.beads.filter(function (b) { return beadMatchesColor(b, state.filterColor); }).length) :
      state.catalogMode === 'charm' ? String(parts.charms.length) :
      state.catalogMode === 'cord' ? String(parts.cords.length) : 'Soon';
    var tabs = document.getElementById('t17-catalog-tabs');
    if (tabs) {
      tabs.querySelectorAll('[data-mode]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-mode') === state.catalogMode);
      });
    }
    if (state.catalogMode === 'bead') {
      var list = parts.beads.filter(function (b) { return beadMatchesColor(b, state.filterColor); });
      if (!list.length) { grid.innerHTML = '<p class="empty">No stones in this category.</p>'; return; }
      grid.innerHTML = list.map(function (b) {
        var price = beadPrice(b.id, state.beadSizeMm);
        var tierTag = b.tier === 'premium' ? '<em class="tier">Premium</em>' : '';
        return '<button type="button" class="bead-card" data-bead="' + b.id + '" title="' + (b.description_short || '') + '">' +
          '<span class="bead-thumb large" style="background-image:url(' + (b._thumb || '') + ')"></span>' +
          '<span class="bead-meta"><b>' + b.name_en + tierTag + '</b>' +
          '<small>' + state.beadSizeMm + 'mm · ' + money(price) + '</small></span></button>';
      }).join('');
      return;
    }
    if (state.catalogMode === 'charm') {
      ensureGlyphDataUrls();
      var charms = parts.charms.filter(function (c) {
        return state.filterColor === 'all' || !state.filterColor || c.category === state.filterColor;
      });
      count.textContent = String(charms.length);
      grid.innerHTML = charms.map(function (c) {
        var gUrl = _glyphDataUrls && _glyphDataUrls[c.symbol];
        return '<button type="button" class="bead-card charm-card" data-charm="' + c.id + '" title="' + c.description_short + '">' +
          '<span class="charm-coin card-coin">' + (gUrl ? '<img src="' + gUrl + '" alt="" class="charm-glyph" draggable="false">' : charmMark(c.symbol)) + '</span>' +
          '<span class="bead-meta"><b>' + c.name_en + '</b><small>' + c.material + ' · ' + money(c.price) + '</small></span></button>';
      }).join('');
      return;
    }
    if (state.catalogMode === 'cord') {
      grid.innerHTML = parts.cords.map(function (c) {
        return '<button type="button" class="bead-card cord-card' + (state.cord === c.id ? ' is-selected' : '') + '" data-cord="' + c.id + '" title="' + c.description_short + '">' +
          '<span class="cord-thumb ' + c.id + '"></span><span class="bead-meta"><b>' + c.name_en + '</b><small>' + c.material + ' · ' + money(c.price) + '</small></span></button>';
      }).join('');
      return;
    }
    var spacerNames = state.catalogMode === 'shape' ? SHAPE_PRODUCTS : SPACER_PRODUCTS;
    count.textContent = 'Soon';
    grid.innerHTML = spacerNames.map(function (s) {
      return '<button type="button" class="bead-card spacer-card" disabled title="Spacer SKU pending">' +
        '<span class="spacer-thumb"></span><span class="bead-meta"><b>' + s.name + '</b><small>' + s.size + ' · ' + money(s.price) + '</small></span>' +
        '<em class="unavailable">Pending</em></button>';
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
          return '<button type="button" class="charm-btn" data-charm="' + c.id + '" title="' + c.name_en + ' · ' + money(c.price) + '">' +
            '<span class="charm-coin">' + coinInner + '</span><small>' + c.name_en + '</small></button>';
        }).join('');
    }

    var cordEl = document.getElementById('t17-cords');
    cordEl.innerHTML = '<span class="tb-label">Cord</span>' + parts.cords.map(function (c) {
      return '<button type="button" class="cord-btn' + (state.cord === c.id ? ' is-active' : '') + '" data-cord="' + c.id + '" title="' + c.description_short + '">' +
        c.name_en + '<small>' + money(c.price) + '</small></button>';
    }).join('');

    var sizeEl = document.getElementById('t17-sizes');
    sizeEl.innerHTML = '<span class="tb-label">Bead size</span>' + [6,8,10,12].map(function (s) {
      return '<button type="button" class="size-btn' + (Number(state.beadSizeMm) === s ? ' is-active' : '') + '" data-size="' + s + '">' + s + 'mm</button>';
    }).join('');

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
      '<div class="wrist-suggest">Target slots for ' + state.beadSizeMm + 'mm beads: <b>' + suggested + '</b> ' +
        '(target inner cm × 10 / bead size mm)</div>' +
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
  function updateGhost() { /* visual refinement hook — drop-slot computed on pointerup */ }
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

  function renderBracelet() {
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
      label.textContent = 'Wrist circumference · target inner ' + targetCm().toFixed(1) + 'cm (+' + fitAllow + 'cm fit) · ~' + targetSlots() + ' slots';
    }
    var slider = document.getElementById('t17-wrist');
    if (slider && String(Number(slider.value)) !== String(state.wristCm)) slider.value = state.wristCm;
    var sug = wrap.querySelector('.wrist-suggest');
    if (sug) {
      var fitAllow2 = Number(settings.fitAllowanceCm || 1.5);
      sug.innerHTML = 'Target slots for ' + state.beadSizeMm + 'mm beads: <b>' + suggestedBeadCount() + '</b> ' +
        '(target inner cm × 10 / bead size mm)';
    }
  }
  function setCord(id) { if (cordMap[id]) { state.cord = id; updateAll(); } }

  function initDefault() {
    var mix = ['rose_quartz', 'amethyst', 'rose_quartz', 'clear_quartz', 'amethyst', 'rose_quartz'];
    state.sequence = [];
    for (var i = 0; i < targetSlots(); i++) {
      state.sequence.push({ type: 'bead', id: mix[i % mix.length], size_mm: state.beadSizeMm });
    }
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

  // ============================================================
  // STEP 3 — Add to cart via admin-ajax (Code Snippet id=20 endpoint)
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
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Adding…'; }
    var cfg = configPayload();
    // urlencoded form body — admin-ajax expects form params, not JSON.
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
        var cartUrl = j.data.cart_url || '/cart';
        flash('Added — ' + money(srv) + '. Redirecting to cart…');
        // Brief pause so the user sees the confirmation, then go to cart.
        setTimeout(function () { window.location.href = cartUrl; }, 700);
      } else {
        var msg = (j && j.data && j.data.message) ? j.data.message : 'Add to cart failed.';
        flash(msg);
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Add custom bracelet to cart'; }
        _cartBusy = false;
      }
    }).catch(function (e) {
      flash('Network error — please try again.');
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Add custom bracelet to cart'; }
      _cartBusy = false;
    });
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------
  function bindEvents() {
    var root = document.getElementById('t17-app');
    root.addEventListener('click', function (e) {
      var beadBtn = e.target.closest('[data-bead]');
      if (beadBtn) {
        var chosenSize = Number(beadBtn.getAttribute('data-bead-size') || state.beadSizeMm);
        state.beadSizeMm = chosenSize;
        if (state.selected >= 0 && state.sequence[state.selected] && state.sequence[state.selected].type === 'bead') {
          state.sequence[state.selected].id = beadBtn.getAttribute('data-bead');
          state.sequence[state.selected].size_mm = chosenSize;
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
      var charmCatBtn = e.target.closest('[data-charm-cat]');
      if (charmCatBtn) { state.filterColor = charmCatBtn.getAttribute('data-charm-cat'); renderLeft(); return; }
      var modeBtn = e.target.closest('[data-mode]');
      if (modeBtn) { state.catalogMode = modeBtn.getAttribute('data-mode'); state.filterColor = 'all'; renderLeft(); return; }
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
      if (e.target.id === 't17-wrist') setWrist(e.target.value);
      if (e.target.id === 't17-wrist-num') {
        var v = parseFloat(e.target.value);
        if (isNaN(v)) return;
        var cm = state.wristUnit === 'in' ? inToCm(v) : v;
        setWrist(cm, true);
      }
    });
  }

  // --- Boot ---
  preRenderThumbs();
  renderLeft();
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

  // 3D progressive enhancement — dynamic import (CDN/self-host via importmap).
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
        fb.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;color:#9aa4b2;font-size:13px;text-align:center;padding:24px;line-height:1.6;';
        fb.innerHTML = '3D preview could not load.<br>The builder on the left and the pricing below are fully functional in 2D.';
        stage.appendChild(fb);
      }
    }
  })();
})();
`;

// ascii-escape the APP JS (non-ASCII → \uXXXX), then base64. The JS contains
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
#t17-app{--paper:#fffdf9;--ink:#332d28;--muted:#81776e;--line:#e7dfd8;--soft:#f4f0ec;--wash:#f8f5f1;--accent:#d5504c;--green:#2d6a43;--blue:#2d7fd8;display:flex;width:100%;max-width:1480px;min-height:820px;height:calc(100vh - 88px);margin:18px auto;overflow:hidden;font-family:Georgia,"Times New Roman",serif;background:#fff;color:var(--ink);-webkit-font-smoothing:antialiased;border:1px solid #eee4dc;border-radius:18px;box-shadow:0 20px 60px rgba(92,65,42,.12)}
#t17-left{display:none}
#t17-left h3,.catalog-cats h3{font-size:24px;line-height:1;color:#211b17;font-weight:700;margin:4px 0 18px}
.lh-title{display:none}
.scroll-area{overflow-y:auto;flex:1;padding-right:10px}
#t17-stone-list{display:flex;flex-direction:column;gap:6px}
.stone-row{width:100%;min-height:50px;border:0;background:transparent;border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:12px;color:#79716b;font-size:21px;line-height:1.1;text-align:left;cursor:pointer;transition:background .16s,color .16s,transform .16s}
.stone-row:hover{background:rgba(255,255,255,.58);color:#433a33}
.stone-row.is-active{background:#fff;color:#2f2924;box-shadow:0 1px 0 rgba(0,0,0,.03)}
.stone-mini{width:22px;height:22px;flex:0 0 22px;border-radius:50%;background-size:cover;background-position:center;box-shadow:inset -3px -3px 6px rgba(45,37,30,.18),inset 2px 2px 4px rgba(255,255,255,.72),0 1px 2px rgba(45,37,30,.12)}
.cat-row{width:100%;min-height:44px;border:0;background:transparent;border-radius:10px;padding:7px 8px;display:flex;align-items:center;gap:9px;color:#6f6760;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-align:left;cursor:pointer;transition:background .14s,color .14s}
.cat-row:hover{background:rgba(255,255,255,.7);color:#2f2924}
.cat-row.is-active{background:#fff;color:#2f2924;box-shadow:0 1px 0 rgba(0,0,0,.04)}
.cat-row:disabled{cursor:default;opacity:.75}
.cat-mark{width:3px;height:18px;border-radius:2px;background:transparent;flex:0 0 3px}
.cat-row.is-active .cat-mark{background:var(--green)}
#t17-right{height:100%;display:grid;grid-template-columns:minmax(640px,1fr) minmax(520px,620px);grid-template-rows:auto 1fr auto;overflow:hidden;background:var(--paper)}
#t17-toolbar{grid-column:1/3;background:#fff;border-bottom:1px solid var(--line);padding:16px 24px;display:grid;grid-template-columns:minmax(230px,1fr) auto minmax(330px,420px);gap:22px;align-items:center}
.tool-brand{display:flex;flex-direction:column;gap:5px}
.tool-brand b{font-size:26px;line-height:1;color:#26211d}
.tool-brand small{font-family:Arial,sans-serif;font-size:12px;color:#7d746c;letter-spacing:.2px}
#t17-catalog{grid-column:2;grid-row:2/4;min-height:0;border-left:1px solid var(--line);padding:20px 22px;background:#fff;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.catalog-body{min-height:0;display:grid;grid-template-columns:150px minmax(0,1fr);gap:16px;flex:1}
.catalog-cats{min-height:0;background:#f4f2f0;border-radius:18px;padding:18px 8px 16px 16px;display:flex;flex-direction:column;overflow:hidden}
.catalog-products{min-height:0;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.catalog-head{height:58px;border:1px solid var(--line);border-radius:28px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;background:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}
#t17-catalog-title{font-size:24px;font-weight:700;color:#473d36;line-height:1}
#t17-catalog-count{min-width:52px;height:30px;border-radius:18px;background:#f7f2ee;border:1px solid #e2d8cf;color:#675d55;display:grid;place-items:center;font-size:20px}
#t17-catalog-tabs{display:flex;gap:24px;align-items:flex-end;padding:0 2px 4px;border-bottom:1px solid #eee7e0;min-height:36px}
.mode-tab{position:relative;border:0;border-radius:0;background:transparent;color:#746b64;padding:0 0 10px;font-family:Arial,sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:color .16s}
.mode-tab:hover{color:#302a25}
.mode-tab.is-active{color:#202020}
.mode-tab.is-active:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;border-radius:3px;background:#202020}
#t17-bead-grid{overflow-y:auto;padding:4px 4px 18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.bead-card{position:relative;min-height:172px;background:#fff;border:1px solid #ebe4df;border-radius:14px;padding:14px 10px 12px;text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:10px;box-shadow:0 10px 22px rgba(65,49,34,.05);transition:border-color .16s,box-shadow .16s,transform .16s}
.bead-card:hover{border-color:#eeb6b2;box-shadow:0 14px 30px rgba(118,77,48,.1);transform:translateY(-2px)}
.bead-card:disabled{cursor:not-allowed;opacity:.72;transform:none}
.bead-thumb{width:58px;height:58px;border-radius:50%;background-size:cover;background-position:center;box-shadow:inset -6px -6px 10px rgba(54,45,38,.2),inset 4px 4px 8px rgba(255,255,255,.72),0 4px 10px rgba(75,58,46,.12)}
.bead-thumb.large{width:76px;height:76px}
.bead-meta{display:flex;flex-direction:column;align-items:center;gap:4px;line-height:1.05;width:100%}
.bead-meta b{font-size:16px;font-weight:700;color:#554a42;max-width:100%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.bead-meta small{font-size:16px;color:#756a62}
.bead-meta small::first-letter{font-weight:700}
.card-coin{width:70px;height:70px}
.charm-coin{width:30px;height:30px;border-radius:50%;background:linear-gradient(145deg,#f6dfa5,#bc8d32);display:grid;place-items:center;font-size:9px;font-weight:800;color:#2b210c;box-shadow:inset -3px -3px 5px rgba(0,0,0,.24),0 4px 8px rgba(69,52,28,.12);overflow:hidden}
.charm-glyph{width:24px;height:24px;display:block;filter:drop-shadow(0 1px 1px rgba(0,0,0,.24))}
.card-coin .charm-glyph{width:48px;height:48px}
.spacer-thumb{width:76px;height:42px;border-radius:20px;background:linear-gradient(90deg,#d9d2ca,#fff,#bdb3aa,#f7f1ec);box-shadow:inset -5px -5px 8px rgba(64,52,45,.18),0 6px 14px rgba(70,54,42,.08)}
.cord-thumb{width:82px;height:18px;border-radius:18px;background:#202020;box-shadow:0 8px 16px rgba(60,45,35,.08),inset 0 2px 4px rgba(255,255,255,.25)}
.cord-thumb.braided_brown{background:repeating-linear-gradient(45deg,#6a442a 0 6px,#9b704b 6px 12px)}
.cord-thumb.silver_wire{background:linear-gradient(90deg,#b8bcc0,#fff,#8f969d,#eef2f4)}
.cord-card.is-selected{border-color:#2d7fd8;background:#f4f9ff}
.unavailable{position:absolute;right:10px;bottom:10px;background:#d8524d;color:#fff;font-style:normal;font-size:12px;font-family:Arial,sans-serif;border-radius:14px;padding:4px 10px}
.empty{padding:24px;color:var(--muted);font-size:14px;text-align:center}
.tb-group{display:flex;flex-direction:column;gap:7px}
.tb-label{font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#8c8178;font-weight:700}
#t17-charms-wrap,#t17-cords-wrap{display:none}
#t17-cords,#t17-sizes{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.cord-btn,.size-btn{background:#f7f3ef;border:1px solid #e1d8cf;border-radius:12px;padding:10px 13px;cursor:pointer;color:#5d534b;font-family:Arial,sans-serif;font-size:13px;font-weight:800;transition:border-color .12s,background .12s,box-shadow .12s}
.cord-btn{display:flex;flex-direction:column;align-items:center;gap:1px}
.cord-btn small{font-size:10px;color:#8d827a;font-weight:500}
.cord-btn.is-active,.size-btn.is-active{border-color:#2d7fd8;background:#eaf4ff;color:#1e5c9d;box-shadow:0 0 0 2px rgba(45,127,216,.1)}
#t17-wrist-wrap{display:flex;flex-direction:column;gap:7px;min-width:330px}
.wrist-row{display:flex;align-items:center;gap:6px}
#t17-wrist-num{width:78px;background:#fff;border:1px solid #ded5cd;color:#312b27;border-radius:10px;padding:8px 10px;font-size:14px;font-weight:700}
#t17-wrist-num:focus{outline:none;border-color:#2d7fd8}
.unit-toggle{display:inline-flex;background:#f4f0ec;border:1px solid #ded5cd;border-radius:10px;overflow:hidden}
.unit-btn{background:transparent;border:0;color:#7f746c;padding:8px 10px;font-size:12px;font-weight:700;cursor:pointer}
.unit-btn.is-active{background:#2d7fd8;color:#fff}
.measure-btn{background:#f4f0ec;border:1px solid #ded5cd;border-radius:10px;color:#665b53;width:36px;height:36px;display:grid;place-items:center;cursor:pointer;padding:0}
.wrist-suggest{font-family:Arial,sans-serif;font-size:11px;color:#82776e;line-height:1.45}
.wrist-suggest b{color:#2f2924;font-weight:800}
.measure-teach{margin-top:6px;background:#fff;border:1px solid #e1d8cf;border-radius:12px;padding:10px}
.measure-teach[hidden]{display:none}
.measure-teach-inner{display:flex;gap:12px;align-items:flex-start}
.measure-teach-inner p{font-family:Arial,sans-serif;font-size:12px;color:#5d534b;line-height:1.55;flex:1}
.measure-teach-inner p b{color:#2d7fd8}
.quick-sizes{display:flex;gap:5px;margin-top:6px;flex-wrap:wrap}
.quick-size{background:#f5f1ed;border:1px solid #ded5cd;border-radius:8px;padding:5px 9px;cursor:pointer;color:#5d534b;font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;line-height:1.2}
.quick-size small{font-size:9px;color:#8d827a;font-weight:400}
#t17-wrist{width:100%;accent-color:#2d7fd8;cursor:pointer}
#t17-draft-toast{position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.98);border:1px solid #d9cfc6;color:#3c352f;padding:9px 12px;border-radius:12px;font-size:12px;display:flex;align-items:center;gap:10px;max-width:78%;box-shadow:0 12px 28px rgba(80,59,45,.16);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;z-index:5}
#t17-draft-toast.show{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(2px)}
#t17-draft-toast .draft-msg{line-height:1.4}
#t17-draft-toast .draft-cta{background:#2d7fd8;border:0;color:#fff;border-radius:8px;padding:6px 10px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap}
#t17-draft-toast .draft-x{background:transparent;border:0;color:#8c8178;font-size:14px;cursor:pointer;padding:2px 4px}
#t17-stage{grid-column:1;grid-row:2;position:relative;min-height:0;background:radial-gradient(circle at 50% 42%,#ffffff 0%,#ffffff 34%,#faf8f5 62%,#f1ebe5 100%);border-right:1px solid #eee4dc}
#t17-canvas{display:block;width:100%;height:100%}
#t17-hint{position:absolute;top:16px;left:18px;background:rgba(255,255,255,.82);padding:10px 13px;border-radius:13px;font-family:Arial,sans-serif;font-size:11px;line-height:1.55;color:#6f645b;pointer-events:none;max-width:255px;box-shadow:0 10px 24px rgba(75,55,42,.08)}
#t17-hint b{color:#2f2924}
#t17-sel-actions{position:absolute;top:16px;right:18px;background:rgba(255,255,255,.92);padding:9px 12px;border-radius:12px;display:flex;align-items:center;gap:8px;font-size:12px;color:#3c352f;max-width:60%;flex-wrap:wrap;box-shadow:0 10px 24px rgba(75,55,42,.08)}
#t17-sel-actions:empty{display:none}
#t17-sel-actions b{color:#a56f28}
#t17-sel-actions .mini{background:#f5f1ed;border:1px solid #ded5cd;color:#4c433d;border-radius:8px;padding:5px 9px;font-size:11px;cursor:pointer}
#t17-sel-actions .mini.danger{background:#fff0ef;border-color:#edb2ad;color:#b33b36}
#t17-flash{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:rgba(31,30,29,.94);color:#fff;padding:9px 18px;border-radius:18px;font-size:13px;font-weight:700;opacity:0;pointer-events:none;transition:opacity .2s;max-width:80%;text-align:center;z-index:4}
#t17-flash.show{opacity:1}
#t17-bottom{grid-column:1;grid-row:3;background:#fff;border-top:1px solid var(--line);padding:12px 24px;display:grid;grid-template-columns:1fr 330px;gap:18px;align-items:stretch}
#t17-seq-wrap{min-width:0}
#t17-seq-wrap .tb-label{display:block;margin-bottom:6px}
#t17-seq{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;align-items:stretch}
.seq-item{flex:0 0 auto;background:#f8f5f2;border:1px solid #e5dcd4;border-radius:12px;padding:7px 10px;cursor:pointer;display:flex;align-items:center;gap:8px;min-width:122px;transition:border-color .12s,background .12s}
.seq-item:hover{border-color:#d5b8a1;background:#fff}
.seq-item.is-selected{border-color:#d5504c;box-shadow:0 0 0 2px rgba(213,80,76,.12)}
.seq-dot{width:28px;height:28px;border-radius:50%;flex:0 0 28px;background-size:cover;background-position:center;box-shadow:inset -3px -3px 6px rgba(66,50,40,.2)}
.seq-dot.charm-dot{background:linear-gradient(145deg,#f4dda1,#b58a2f);display:grid;place-items:center;font-size:8px;font-weight:800;color:#2b210c;background-size:18px 18px;background-position:center;background-repeat:no-repeat}
.seq-item small{font-family:Arial,sans-serif;font-size:11px;color:#574d45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#t17-price{background:#fbf8f5;border:1px solid #e5dcd4;border-radius:14px;padding:11px 13px;display:flex;flex-direction:column;gap:3px}
.price-rows .pr{display:flex;justify-content:space-between;font-family:Arial,sans-serif;font-size:12px;color:#746960;padding:1px 0}
.price-total{display:flex;justify-content:space-between;border-top:1px solid #e0d6cd;margin-top:6px;padding-top:7px;font-size:20px;font-weight:700;color:#2d2824}
.price-fit{font-family:Arial,sans-serif;font-size:11px;color:#82776e;margin-top:4px}
.price-fit.ok{color:#3d8b4f}.price-fit.over{color:#c8423d}
#t17-add-cart{margin-top:8px;background:#1f1e1d;color:#fff;border:0;border-radius:12px;padding:11px;font-size:13px;font-weight:800;cursor:pointer}
#t17-add-cart:hover{background:#d5504c}
#t17-add-cart:disabled{opacity:.6;cursor:default}
.scroll-area::-webkit-scrollbar,#t17-bead-grid::-webkit-scrollbar,#t17-seq::-webkit-scrollbar{width:10px;height:10px}
.scroll-area::-webkit-scrollbar-thumb,#t17-bead-grid::-webkit-scrollbar-thumb,#t17-seq::-webkit-scrollbar-thumb{background:#c7c0ba;border-radius:8px;border:2px solid transparent;background-clip:padding-box}
.scroll-area::-webkit-scrollbar-track,#t17-bead-grid::-webkit-scrollbar-track,#t17-seq::-webkit-scrollbar-track{background:transparent}
@media(max-width:820px){
  #t17-app{flex-direction:column;height:auto;min-height:100vh;overflow:auto}
  #t17-left{display:none}
  #t17-left h3{font-size:24px;margin-bottom:12px}
  #t17-stone-list,#t17-category-list{display:grid;grid-template-columns:1fr 1fr}
  .stone-row{font-size:17px;min-height:42px}
  #t17-right{display:flex;flex-direction:column;overflow:visible}
  #t17-toolbar{display:flex;flex-direction:column;align-items:stretch;padding:14px}
  #t17-catalog{border-left:0;border-top:1px solid var(--line);order:2;max-height:620px}
  .catalog-body{grid-template-columns:120px minmax(0,1fr)}
  .catalog-cats{padding:14px 6px 14px 12px}
  #t17-stage{order:3;min-height:420px}
  #t17-bottom{grid-template-columns:1fr}
  #t17-bead-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`;

const fragment = `<!-- ===== Earthward T17 Crystal Bracelet Builder WP Fragment ===== -->
<style>${CSS}</style>
<div id="t17-app">
  <section id="t17-right">
    <div id="t17-toolbar">
      <div class="tool-brand"><b>Earthward Composer</b><small>Design your crystal bracelet bead by bead</small></div>
      <div class="tb-group" id="t17-cords-wrap"><div id="t17-cords"></div></div>
      <div class="tb-group" id="t17-sizes-wrap"><div id="t17-sizes"></div></div>
      <div class="tb-group" id="t17-wrist-wrap"></div>
    </div>
    <aside id="t17-catalog">
      <div id="t17-catalog-tabs">
        <button type="button" class="mode-tab is-active" data-mode="bead">Beads</button>
        <button type="button" class="mode-tab" data-mode="charm">Charms</button>
        <button type="button" class="mode-tab" data-mode="shape">Crystal Shapes</button>
        <button type="button" class="mode-tab" data-mode="spacer">Spacers</button>
        <button type="button" class="mode-tab" data-mode="cord">Cord</button>
      </div>
      <div class="catalog-body">
        <div class="catalog-cats">
          <h3 id="t17-category-heading">Crystal</h3>
          <div class="scroll-area"><div id="t17-category-list"></div></div>
        </div>
        <div class="catalog-products">
          <div class="catalog-head"><strong id="t17-catalog-title">Beads</strong><span id="t17-catalog-count">20</span></div>
          <div id="t17-bead-grid"></div>
        </div>
      </div>
    </aside>
    <div id="t17-stage">
      <canvas id="t17-canvas"></canvas>
      <div id="t17-hint"><b>Builder</b><br>Drag empty = rotate · Drag a bead = reorder · Drag off-ring = delete<br>Scroll/pinch = zoom · Click bead card to add</div>
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

<!-- parts JSON (ascii-escaped; non-ASCII → \\uXXXX so wp_kses never sees raw bytes) -->
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
<title>Crystal Bracelet Builder — Design Bead by Bead</title>
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
