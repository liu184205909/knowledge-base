(function () {
  'use strict';

  var root = document.querySelector('.ew-t17-builder');
  if (!root) return;

  var config = window.EW_T17 || {};
  var money = function (value) { return (config.currencySymbol || '$') + Number(value || 0).toFixed(2); };
  var storageKey = 'ew-t17-v3-draft';
  var state = {
    type: 'crystal',
    search: '',
    color: 'all',
    target_wrist_cm: 16,
    fit_preference: 'regular',
    sequence: [],
    catalog: null,
    quote: null,
    selected_index: -1,
    selection_kind: 'append',
    animation_index: -1
  };
  var variantMap = new Map();
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var quoteTimer;
  var quoteRequestId = 0;
  var focusTargetVariantId = null;
  var ring = root.querySelector('.ew-t17-ring');
  var empty = root.querySelector('.ew-t17-canvas__empty');
  var grid = root.querySelector('[data-grid]');
  var filters = root.querySelector('[data-filters]');
  var notice = root.querySelector('.ew-t17-builder__notice');

  function sequenceItem(item) {
    var normalized = { variant_id: item && item.variant_id };
    if (item && typeof item.orientation === 'string') normalized.orientation = item.orientation;
    return normalized;
  }

  function notify(message, isError) {
    notice.textContent = message || '';
    notice.classList.toggle('is-error', Boolean(isError));
    notice.classList.toggle('is-visible', Boolean(message));
    if (message) window.setTimeout(function () { notice.classList.remove('is-visible'); }, 3600);
  }

  function recipeFromMarkup() {
    try { return JSON.parse(root.getAttribute('data-recipe') || '{}'); } catch (err) { return {}; }
  }

  function restoreDraft() {
    var recipe = recipeFromMarkup();
    if (recipe && Array.isArray(recipe.sequence) && recipe.sequence.length) {
      state.sequence = recipe.sequence.map(sequenceItem);
      state.target_wrist_cm = Number(recipe.target_wrist_cm || state.target_wrist_cm);
      state.fit_preference = recipe.fit_preference || state.fit_preference;
      return;
    }
    try {
      var draft = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
      if (Array.isArray(draft.sequence)) Object.assign(state, draft);
    } catch (err) {}
  }

  function saveDraft() {
    var draft = {
      target_wrist_cm: state.target_wrist_cm,
      fit_preference: state.fit_preference,
      sequence: state.sequence
    };
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    notify('Design saved on this device.');
  }

  function orientationMode(variant) {
    var value = String(variant.orientation_mode || (variant.material && variant.material.orientation_mode) || 'none').toLowerCase();
    return ['none', 'fixed_left', 'fixed_right', 'mirrorable', 'rotatable'].indexOf(value) !== -1 ? value : 'none';
  }

  function defaultOrientation(variant) {
    return orientationOptions(variant)[0] || '';
  }

  function orientationOptions(variant) {
    var mode = orientationMode(variant);
    var allowed = Array.isArray(variant && variant.allowed_orientations) ? variant.allowed_orientations : [];
    if (mode === 'fixed_left') return ['left'];
    if (mode === 'fixed_right') return ['right'];
    if (mode === 'mirrorable') {
      allowed = allowed.filter(function (value) { return value === 'left' || value === 'right'; });
      return allowed.length ? allowed : ['left', 'right'];
    }
    if (mode === 'rotatable') {
      allowed = allowed.filter(function (value) { return /^rotate_(0|90|180|270)$/.test(value); });
      return allowed.length ? allowed : ['rotate_0', 'rotate_90', 'rotate_180', 'rotate_270'];
    }
    return ['none'];
  }

  function normalizeOrientation(item, variant) {
    var orientation = item && typeof item.orientation === 'string' ? item.orientation : '';
    if (orientationMode(variant) === 'rotatable' && /^(0|90|180|270)$/.test(orientation)) orientation = 'rotate_' + orientation;
    return orientationOptions(variant).indexOf(orientation) !== -1 ? orientation : defaultOrientation(variant);
  }

  function canToggleOrientation(item, variant) {
    var mode = orientationMode(variant);
    if (!item || !variant || variant.material.component_type !== 'accessory') return false;
    if (mode === 'rotatable') return orientationOptions(variant).length > 1;
    return mode === 'mirrorable' && !variant.mirrored_variant_key && orientationOptions(variant).length > 1;
  }

  function entryOffset(index, variantId) {
    var seed = String(variantId || '').split('').reduce(function (total, char) { return total + char.charCodeAt(0); }, index + 1);
    var angle = (seed % 360) * Math.PI / 180;
    return { x: Math.round(Math.cos(angle) * 18), y: Math.round(Math.sin(angle) * 18) };
  }

  function setInsertStatus(message) {
    root.querySelectorAll('[data-insert-status], [data-editor-status]').forEach(function (status) { status.textContent = message; });
  }

  function setSelection(index, kind) {
    state.selected_index = Number.isInteger(index) && index >= 0 && index < state.sequence.length ? index : -1;
    state.selection_kind = state.selected_index >= 0 ? (kind || 'bead') : 'append';
    root.dataset.insertionPosition = state.selected_index >= 0 ? 'after-selected' : 'append';
    root.dataset.selectedItemIndex = state.selected_index >= 0 ? String(state.selected_index) : '';

    var item = state.selected_index >= 0 ? state.sequence[state.selected_index] : null;
    var variant = item ? variantMap.get(item.variant_id) : null;
    root.dataset.selectedVariantKey = variant ? String(variant.variant_key || variant.id || '') : '';
    root.dataset.selectedComponentType = variant && variant.material ? String(variant.material.component_type || '') : '';
    root.dataset.orientationState = item && item.orientation ? String(item.orientation) : 'none';
    root.querySelectorAll('[data-editor-status]').forEach(function (status) {
      status.dataset.orientationState = root.dataset.orientationState;
    });
    if (!item || !variant) {
      setInsertStatus('No material is selected. New materials will be appended to the bracelet.');
      return;
    }
    setInsertStatus('New materials will be inserted after ' + variant.material.name_en + ' ' + variant.size_mm + ' mm.');
  }

  function selectionToolbox() {
    return root.querySelector('[data-selection-toolbox]');
  }

  function positionToolbox(index) {
    var toolbox = selectionToolbox();
    var canvas = root.querySelector('.ew-t17-canvas');
    var target = root.querySelector('.ew-t17-bead[data-sequence-index="' + index + '"]') || root.querySelector('[data-insert-after="' + index + '"]');
    if (!toolbox || !canvas || !target) return;
    var canvasBox = canvas.getBoundingClientRect();
    var targetBox = target.getBoundingClientRect();
    toolbox.hidden = false;
    var halfWidth = Math.min(toolbox.offsetWidth / 2, Math.max(0, (canvasBox.width - 16) / 2));
    var minLeft = 8 + halfWidth;
    var maxLeft = canvasBox.width - 8 - halfWidth;
    var preferredLeft = targetBox.left - canvasBox.left + (targetBox.width / 2);
    var left = maxLeft < minLeft ? canvasBox.width / 2 : Math.max(minLeft, Math.min(maxLeft, preferredLeft));
    var top = Math.max(42, Math.min(canvasBox.height - 42, targetBox.top - canvasBox.top - 26));
    toolbox.style.left = left + 'px';
    toolbox.style.top = top + 'px';
  }

  function syncSelectionControls() {
    var toolbox = selectionToolbox();
    if (!toolbox) return;
    var direction = toolbox.querySelector('[data-selection-action="orientation"]');
    if (!direction) {
      direction = document.createElement('button');
      direction.type = 'button';
      direction.dataset.selectionAction = 'orientation';
      direction.className = 'ew-t17-selection-toolbox__orientation';
      toolbox.insertBefore(direction, toolbox.querySelector('[data-selection-action="remove"]'));
    }
    var remove = toolbox.querySelector('[data-selection-action="remove"]');
    var label = toolbox.querySelector('[data-selection-label]');
    var item = state.sequence[state.selected_index];
    var variant = item && variantMap.get(item.variant_id);
    var canToggle = state.selection_kind === 'bead' && canToggleOrientation(item, variant);
    direction.hidden = !canToggle;
    if (remove) remove.hidden = state.selection_kind !== 'bead';
    if (label && variant) {
      label.textContent = state.selection_kind === 'insert' ? 'Insert after ' + variant.material.name_en : variant.material.name_en + ' ' + variant.size_mm + ' mm';
    }
    if (canToggle) {
      var orientation = normalizeOrientation(item, variant);
      direction.textContent = orientationMode(variant) === 'rotatable'
        ? 'Rotate ' + orientation.replace('rotate_', '') + ' deg'
        : (orientation === 'right' ? 'Face left' : 'Face right');
    }
    if (state.selected_index >= 0) {
      toolbox.hidden = false;
      positionToolbox(state.selected_index);
    } else {
      toolbox.hidden = true;
    }
  }

  function variantsForCurrentType() {
    if (!state.catalog) return [];
    return state.catalog.materials
      .filter(function (material) { return materialTab(material) === state.type; })
      .flatMap(function (material) {
        return (material.variants || []).map(function (variant) {
          return Object.assign({ material: material }, variant);
        });
      })
      .filter(function (variant) {
        var haystack = [variant.material.name_en, variant.id, variant.material.primary_color, (variant.material.color_tags || []).join(' ')].join(' ').toLowerCase();
        var matchesSearch = !state.search || haystack.indexOf(state.search) !== -1;
        var matchesColor = state.color === 'all' || variant.material.primary_color === state.color || (variant.material.color_tags || []).indexOf(state.color) !== -1;
        return matchesSearch && matchesColor;
      });
  }

  function beadStyle(variant) {
    var color = variant.material.primary_color || 'rgba(126, 113, 100, .75)';
    return 'background:radial-gradient(circle at 32% 25%,rgba(255,255,255,.9),transparent 19%),radial-gradient(circle at 64% 72%,rgba(0,0,0,.28),transparent 50%),' + color + ';';
  }

  function renderFilters() {
    if (!state.catalog) return;
    var colors = new Set(['all']);
    state.catalog.materials.filter(function (m) { return materialTab(m) === state.type; }).forEach(function (m) {
      if (m.primary_color) colors.add(m.primary_color);
      (m.color_tags || []).forEach(function (color) { colors.add(color); });
    });
    filters.innerHTML = Array.from(colors).map(function (color) {
      var label = color === 'all' ? 'All' : color.replace(/(^|[-_ ])\w/g, function (m) { return m.toUpperCase(); });
      return '<button type="button" data-color="' + escapeHtml(color) + '" class="' + (state.color === color ? 'is-active' : '') + '">' + escapeHtml(label) + '</button>';
    }).join('');
  }

  function materialTab(material) {
    return String((material && (material.library_tab_slug || material.component_type)) || 'crystal');
  }

  function renderTabs() {
    var holder = root.querySelector('.ew-t17-tabs');
    if (!holder || !state.catalog) return;
    var tabs = Array.isArray(state.catalog.tabs) && state.catalog.tabs.length
      ? state.catalog.tabs
      : [{ slug: 'crystal', label: 'Crystals' }, { slug: 'accessory', label: 'Accessories' }];
    if (!tabs.some(function (tab) { return tab.slug === state.type; })) state.type = tabs[0].slug;
    holder.innerHTML = tabs.map(function (tab) {
      return '<button type="button" class="' + (tab.slug === state.type ? 'is-active' : '') + '" data-type="' + escapeAttr(tab.slug) + '" role="tab">' + escapeHtml(tab.label) + '</button>';
    }).join('');
  }

  function renderGrid() {
    var items = variantsForCurrentType();
    if (!items.length) {
      grid.innerHTML = '<p class="ew-t17-builder__catalog-empty">' + escapeHtml(config.strings && config.strings.catalogEmpty || 'No matching materials.') + '</p>';
      return;
    }
    grid.innerHTML = items.map(function (variant) {
      var count = state.sequence.filter(function (item) { return item.variant_id === variant.id; }).length;
      var image = variant.image_url ? '<img src="' + escapeAttr(variant.image_url) + '" alt="' + escapeAttr(variant.material.name_en) + '">' : '<span class="ew-t17-builder__thumb-fallback" style="' + beadStyle(variant) + '"></span>';
      return '<button type="button" class="ew-t17-card" data-variant="' + escapeAttr(variant.id) + '">' +
        '<span class="ew-t17-card__image">' + image + '</span>' +
        '<span class="ew-t17-card__name">' + escapeHtml(variant.material.name_en) + '</span>' +
        '<span class="ew-t17-card__meta"><b>' + escapeHtml(String(variant.size_mm)) + ' mm</b><b>' + money(variant.price) + '</b></span>' +
        (count ? '<span class="ew-t17-card__count">' + count + '</span>' : '') +
      '</button>';
    }).join('');
  }

  function restoreCardFocus() {
    if (!focusTargetVariantId) return;
    var variantId = focusTargetVariantId;
    focusTargetVariantId = null;
    var card = Array.from(root.querySelectorAll('[data-variant]')).find(function (candidate) { return candidate.dataset.variant === variantId; });
    if (card) card.focus({ preventScroll: true });
  }

  function visualOrientation(variant, item) {
    var mode = orientationMode(variant);
    var orientation = normalizeOrientation(item, variant);
    if (mode === 'rotatable') return 'rotate(' + orientation.replace('rotate_', '') + 'deg)';
    if (mode === 'mirrorable' && !variant.mirrored_variant_key && orientation === 'right') return 'scaleX(-1)';
    return 'none';
  }

  function renderRing() {
    var selected = state.sequence.map(function (item, index) {
      var variant = variantMap.get(item.variant_id);
      return variant ? { item: item, variant: variant, index: index } : null;
    }).filter(Boolean);
    ring.innerHTML = '';
    ring.classList.toggle('is-settling', state.animation_index >= 0);
    empty.hidden = selected.length > 0;
    if (!selected.length) return;
    selected.forEach(function (entry, displayIndex) {
      var item = entry.item;
      var variant = entry.variant;
      var index = entry.index;
      var angle = (Math.PI * 2 * displayIndex / selected.length) - Math.PI / 2;
      var size = Math.min(68, Math.max(20, Number(variant.size_mm || 8) * 4.8));
      var x = 50 + Math.cos(angle) * 29;
      var y = 50 + Math.sin(angle) * 29;
      var element = document.createElement('button');
      element.type = 'button';
      element.className = 'ew-t17-bead';
      element.style.setProperty('--x', x + '%');
      element.style.setProperty('--y', y + '%');
      element.style.setProperty('--size', size + 'px');
      var offset = entryOffset(index, variant.id);
      element.style.setProperty('--entry-x', offset.x + 'px');
      element.style.setProperty('--entry-y', offset.y + 'px');
      element.dataset.sequenceIndex = String(index);
      item.orientation = normalizeOrientation(item, variant);
      element.dataset.orientation = item.orientation;
      element.style.setProperty('--orientation-transform', visualOrientation(variant, item));
      element.style.transform = 'translate(-50%,-50%) ' + visualOrientation(variant, item);
      if (state.animation_index === index) element.classList.add('is-entering');
      if (state.selected_index === index && state.selection_kind === 'bead') element.classList.add('is-selected');
      element.title = variant.material.name_en + ' ' + variant.size_mm + 'mm';
      if (variant.image_url) element.innerHTML = '<img src="' + escapeAttr(variant.image_url) + '" alt="">';
      else element.innerHTML = '<span style="' + beadStyle(variant) + '"></span>';
      ring.appendChild(element);

      var insertAngle = (Math.PI * 2 * (displayIndex + 0.5) / selected.length) - Math.PI / 2;
      var insertPoint = document.createElement('button');
      insertPoint.type = 'button';
      insertPoint.className = 'ew-t17-insert-point';
      insertPoint.dataset.insertAfter = String(index);
      insertPoint.style.setProperty('--x', (50 + Math.cos(insertAngle) * 29) + '%');
      insertPoint.style.setProperty('--y', (50 + Math.sin(insertAngle) * 29) + '%');
      insertPoint.setAttribute('aria-label', 'Select insertion point after ' + variant.material.name_en + ' ' + variant.size_mm + ' mm');
      insertPoint.title = 'Insert after ' + variant.material.name_en;
      insertPoint.textContent = '+';
      ring.appendChild(insertPoint);
    });
    if (prefersReducedMotion) {
      state.animation_index = -1;
      ring.classList.remove('is-settling');
      return;
    }
    window.setTimeout(function () {
      state.animation_index = -1;
      ring.classList.remove('is-settling');
      ring.querySelectorAll('.is-entering').forEach(function (element) { element.classList.remove('is-entering'); });
    }, 460);
  }

  function renderMetrics() {
    var quote = state.quote;
    root.querySelector('[data-metric="length"]').textContent = quote ? quote.used_length_mm + ' mm' : '0 mm';
    root.querySelector('[data-metric="pieces"]').textContent = state.sequence.length;
    var wrist = root.querySelector('.ew-t17-wrist strong');
    wrist.textContent = state.target_wrist_cm.toFixed(1).replace('.0', '') + ' cm';
    var fit = root.querySelector('.ew-t17-fit');
    var labels = { empty: 'Start with a material', fit: 'Wrist fit looks good', short: 'Design is short', long: 'Design is long' };
    var fitStatus = quote ? quote.fit_status : 'empty';
    fit.dataset.fit = fitStatus;
    fit.textContent = labels[fitStatus] || labels.empty;
  }

  function syncTypeTabs() {
    var tabs = Array.from(root.querySelectorAll('[data-type]'));
    if (!tabs.length || !grid) return;
    var panelId = grid.id || 'ew-t17-material-panel';
    grid.id = panelId;
    grid.setAttribute('role', 'tabpanel');
    tabs.forEach(function (tab, index) {
      var active = tab.dataset.type === state.type;
      var tabId = tab.id || 'ew-t17-material-tab-' + index;
      tab.id = tabId;
      tab.setAttribute('aria-controls', panelId);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
      if (active) grid.setAttribute('aria-labelledby', tabId);
    });
  }

  function renderAll() {
    var activeCard = document.activeElement && document.activeElement.closest ? document.activeElement.closest('[data-variant]') : null;
    if (activeCard && root.contains(activeCard)) focusTargetVariantId = activeCard.dataset.variant;
    renderTabs();
    renderFilters();
    renderGrid();
    renderRing();
    renderMetrics();
    syncTypeTabs();
    syncSelectionControls();
    restoreCardFocus();
  }

  function requestQuote() {
    window.clearTimeout(quoteTimer);
    var requestId = ++quoteRequestId;
    if (!state.sequence.length) {
      state.quote = null;
      renderAll();
      return;
    }
    var requestSequence = state.sequence.map(sequenceItem);
    quoteTimer = window.setTimeout(function () {
      fetch(config.restUrl + 'quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_wrist_cm: state.target_wrist_cm,
          fit_preference: state.fit_preference,
          sequence: requestSequence
        })
      }).then(function (response) { return response.json().then(function (data) { return { ok: response.ok, data: data }; }); })
        .then(function (result) {
          if (requestId !== quoteRequestId) return;
          if (!result.ok) throw new Error(result.data && result.data.message || 'Quote error');
          state.quote = result.data;
          renderAll();
        }).catch(function () {
          if (requestId === quoteRequestId) notify(config.strings && config.strings.quoteError || 'Price unavailable.', true);
        });
    }, 180);
  }

  function addVariant(id, focusSource) {
    var variant = variantMap.get(id);
    if (!variant) return;
    var item = { variant_id: id };
    var orientation = defaultOrientation(variant);
    if (orientation) item.orientation = orientation;
    var insertAt = state.selected_index >= 0 ? state.selected_index + 1 : state.sequence.length;
    state.sequence.splice(insertAt, 0, item);
    state.animation_index = insertAt;
    setSelection(insertAt, 'bead');
    if (focusSource) focusTargetVariantId = id;
    renderAll();
    requestQuote();
  }

  function removeVariantAt(index) {
    if (index < 0 || index >= state.sequence.length) return;
    state.sequence.splice(index, 1);
    setSelection(-1, 'append');
    renderAll();
    requestQuote();
  }

  function toggleOrientation() {
    var item = state.sequence[state.selected_index];
    var variant = item && variantMap.get(item.variant_id);
    if (!canToggleOrientation(item, variant)) return;
    var options = orientationOptions(variant);
    var current = normalizeOrientation(item, variant);
    item.orientation = options[(options.indexOf(current) + 1) % options.length];
    state.animation_index = state.selected_index;
    renderAll();
    requestQuote();
  }

  function openDialog(name) {
    var dialog = root.querySelector('[data-dialog="' + name + '"]');
    if (!dialog) return;
    if (name === 'finish') {
      if (!state.quote) { notify('Add materials before finishing your design.', true); return; }
      dialog.querySelector('[data-summary]').innerHTML = '<dl><div><dt>Total</dt><dd>' + money(state.quote.total) + '</dd></div><div><dt>Wrist</dt><dd>' + state.target_wrist_cm + ' cm</dd></div><div><dt>Materials</dt><dd>' + state.sequence.length + '</dd></div><div><dt>Fit</dt><dd>' + escapeHtml(state.quote.fit_status) + '</dd></div></dl>';
    }
    dialog.showModal();
  }

  function addToCart() {
    if (!state.quote) return;
    var body = new URLSearchParams({
      action: 'ew_t17_add_custom',
      nonce: config.nonce,
      config: JSON.stringify({
        target_wrist_cm: state.target_wrist_cm,
        fit_preference: state.fit_preference,
        sequence: state.sequence
      })
    });
    fetch(config.ajaxUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: body.toString() })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result.success) throw new Error(result.data && result.data.message || 'Cart error');
        window.location.assign(result.data.cart_url || config.cartUrl);
      }).catch(function (error) { notify(error.message || 'Unable to add your design to cart.', true); });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]; });
  }
  function escapeAttr(value) { return escapeHtml(value); }

  root.addEventListener('click', function (event) {
    var selectionAction = event.target.closest('[data-selection-action]');
    if (selectionAction && selectionAction.dataset.selectionAction === 'orientation') {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleOrientation();
      return;
    }
    if (selectionAction && selectionAction.dataset.selectionAction === 'close') {
      event.preventDefault();
      event.stopImmediatePropagation();
      setSelection(-1, 'append');
      syncSelectionControls();
      return;
    }
    if (selectionAction && selectionAction.dataset.selectionAction === 'remove') {
      event.preventDefault();
      event.stopImmediatePropagation();
      removeVariantAt(state.selected_index);
      return;
    }
    var insertPoint = event.target.closest('[data-insert-after]');
    if (insertPoint && root.contains(insertPoint)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setSelection(Number(insertPoint.dataset.insertAfter), 'insert');
      root.querySelectorAll('.ew-t17-bead').forEach(function (bead) { bead.classList.remove('is-selected'); });
      syncSelectionControls();
      return;
    }
    var bead = event.target.closest('.ew-t17-bead');
    if (bead && root.contains(bead)) {
      setSelection(Number(bead.dataset.sequenceIndex), 'bead');
      window.requestAnimationFrame(syncSelectionControls);
    }
  }, true);

  root.addEventListener('click', function (event) {
    var card = event.target.closest('[data-variant]');
    if (card) { addVariant(card.dataset.variant, card); return; }
    var type = event.target.closest('[data-type]');
    if (type) { state.type = type.dataset.type; state.color = 'all'; root.querySelectorAll('[data-type]').forEach(function (button) { var active = button === type; button.classList.toggle('is-active', active); }); renderAll(); return; }
    var color = event.target.closest('[data-color]');
    if (color) { state.color = color.dataset.color; renderAll(); return; }
    var action = event.target.closest('[data-action]');
    if (!action) return;
    switch (action.dataset.action) {
      case 'edit-wrist': openDialog('wrist'); break;
      case 'reset':
        state.sequence = []; state.quote = null; state.animation_index = -1;
        window.localStorage.removeItem(storageKey);
        requestQuote();
        setSelection(-1, 'append'); renderAll();
        notify('Design and saved local draft cleared.');
        break;
      case 'save': saveDraft(); break;
      case 'finish': openDialog('finish'); break;
      case 'confirm-wrist':
        event.preventDefault();
        state.target_wrist_cm = Math.max(10, Math.min(30, Number(root.querySelector('[data-wrist-input]').value || 16)));
        var preference = root.querySelector('[name="fit"]:checked');
        state.fit_preference = preference ? preference.value : 'regular';
        root.querySelector('[data-dialog="wrist"]').close();
        requestQuote(); renderAll();
        break;
      case 'add-cart': event.preventDefault(); addToCart(); break;
      case 'toggle-search': root.classList.toggle('has-search'); root.querySelector('[data-search]').focus(); break;
    }
  });

  root.querySelector('[data-search]').addEventListener('input', function (event) { state.search = event.target.value.trim().toLowerCase(); renderGrid(); });

  root.addEventListener('keydown', function (event) {
    var current = event.target.closest('[data-type]');
    if (!current || !root.contains(current)) return;
    var tabs = Array.from(root.querySelectorAll('[data-type]'));
    var index = tabs.indexOf(current);
    var nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  });

  restoreDraft();
  fetch(config.restUrl + 'catalog')
    .then(function (response) { return response.json(); })
    .then(function (catalog) {
      state.catalog = catalog;
      catalog.materials.forEach(function (material) { (material.variants || []).forEach(function (variant) { variantMap.set(variant.id, Object.assign({ material: material }, variant)); }); });
       state.sequence = state.sequence.filter(function (item) { return variantMap.has(item.variant_id); }).map(function (item) {
         var normalized = sequenceItem(item);
         normalized.orientation = normalizeOrientation(normalized, variantMap.get(normalized.variant_id));
         return normalized;
       });
      renderAll();
      requestQuote();
    })
    .catch(function () { notify('The catalog could not be loaded.', true); });
}());
