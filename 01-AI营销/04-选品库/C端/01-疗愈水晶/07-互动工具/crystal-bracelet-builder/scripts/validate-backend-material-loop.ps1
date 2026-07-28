$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Split-Path -Parent $root
$plugin = Join-Path $project 'plugin'
$install = Get-Content -LiteralPath (Join-Path $plugin 'includes\class-ew-t17-install.php') -Raw
$catalog = Get-Content -LiteralPath (Join-Path $plugin 'includes\class-ew-t17-catalog.php') -Raw
$commerce = Get-Content -LiteralPath (Join-Path $plugin 'includes\class-ew-t17-commerce.php') -Raw
$bootstrap = Get-Content -LiteralPath (Join-Path $plugin 't17-bracelet-builder.php') -Raw
$frontend = Get-Content -LiteralPath (Join-Path $plugin 'includes\class-ew-t17-frontend.php') -Raw
$frontendScript = Get-Content -LiteralPath (Join-Path $plugin 'assets\js\t17-builder-ui.js') -Raw
$frontendStyle = Get-Content -LiteralPath (Join-Path $plugin 'assets\css\t17-builder-ui.css') -Raw
$frontendFragment = Get-Content -LiteralPath (Join-Path $plugin 'assets\partials\t17-builder-fragment.php') -Raw
$template = Get-Content -LiteralPath (Join-Path $plugin 'assets\catalog-template.csv') -Raw
$liveVerifier = Get-Content -LiteralPath (Join-Path $root 'verify-live-post-upgrade.ps1') -Raw

foreach ($needle in @('ew_t17_materials', 'ew_t17_variants', 'category_slug', 'display_scale', 'compatible_bead_sizes', 'sort_order', 'REQUIRED_MATERIAL_COLUMNS')) {
  if ($install -notmatch [regex]::Escape($needle)) { throw "Install schema is missing $needle" }
}
foreach ($needle in @('ew-t17-beads', 'ew-t17-decor', 'render_library_page', 'update_sort_order', 'register_rest_route', "'/catalog'", "'/quote'", 'present_variant', 'neighbor_bead_sizes_are_compatible', 'ew_t17_incompatible_bead_size', 'ew_t17_variant_size_mismatch', 'ew_t17_invalid_wrap_mode', 'packaging_snapshot', 'validate_live_mirror_pair', 'IMPORT_HEADERS', 'START TRANSACTION', 'ROLLBACK')) {
  if ($catalog -notmatch [regex]::Escape($needle)) { throw "Catalog backend is missing $needle" }
}
foreach ($needle in @('if ($decoded === array())', 'return $defaults;', 'private static function validated_position_list')) {
  if ($catalog -notmatch [regex]::Escape($needle)) { throw "Catalog quote validation must accept explicitly empty direction-rule arrays: $needle" }
}
if ($catalog -match 'weight_g' -or $commerce -match 'weight_g' -or $frontendScript -match 'weight_g' -or $frontendFragment -match 'weight_g') {
  throw 'Weight is not part of the current T17 public, quote, snapshot, or frontend contract.'
}
if ($catalog -notmatch [regex]::Escape("EXISTS (SELECT 1 FROM " + '" . self::variants_table() . "' + " v WHERE v.material_id = m.id AND v.status = 'live')")) {
  throw 'Catalog REST query must exclude live materials without a live Variant card.'
}
foreach ($needle in @("'category_slug' => sanitize_key(wp_unslash(`$_POST['category_slug'] ?? ''))", "v.status = %s", "m.status = %s AND (v.status = %s OR v.id IS NULL)")) {
  if ($catalog -notmatch [regex]::Escape($needle)) { throw "Catalog backend is missing operational library behavior: $needle" }
}
foreach ($needle in @('official-design/(?P<product_id>', 'get_official_design', 'ew_t17_add_custom', 'EW_T17_Catalog::quote_config', 'ew_t17_snapshot', "'preview_data' => `$recipe['preview_data']", "'resolved_variant' => `$quote['packaging_snapshot']", "'wrap_mode' => 'single'", 'ew_t17_invalid_recipe_wrap_mode', "add_query_arg('t17_design'")) {
  if ($commerce -notmatch [regex]::Escape($needle)) { throw "Commerce backend is missing $needle" }
}
foreach ($forbidden in @('three.module', 'OrbitControls', 't17_add_custom_bracelet')) {
  if ($catalog -match [regex]::Escape($forbidden) -or $commerce -match [regex]::Escape($forbidden) -or $frontend -match [regex]::Escape($forbidden) -or $frontendScript -match [regex]::Escape($forbidden)) {
    throw "Plugin contains deprecated 3D or legacy-cart dependency: $forbidden"
  }
}
foreach ($needle in @("require_once EW_T17_DIR . 'includes/class-ew-t17-frontend.php'", 'EW_T17_Frontend::init')) {
  if ($bootstrap -notmatch [regex]::Escape($needle)) { throw "Plugin bootstrap must load the v3 frontend: $needle" }
}
foreach ($needle in @('assets/css/t17-builder-ui.css', 'assets/js/t17-builder-ui.js', 'assets/partials/t17-builder-fragment.php', 'EW_T17_UI_CONFIG', "rest_url('ew-t17/v1/')")) {
  if ($frontend -notmatch [regex]::Escape($needle)) { throw "Plugin v3 frontend integration is missing: $needle" }
}
foreach ($needle in @('trayThemes', 'tutorialSlides', 'tray-celadon-alpha.png', 'tray-blue-alpha.png', 'tray-ice-alpha.png', 'tray-walnut-alpha.png', 'tutorial-add-materials-dev.png', 'tutorial-size-dev.png', 'tutorial-drag-dev.png', 'tutorial-remove-dev.png')) {
  if ($frontend -notmatch [regex]::Escape($needle)) { throw "Plugin v3 visual configuration is missing: $needle" }
}
foreach ($needle in @('data-t17-ui', 'data-ring', 'data-grid', 'data-dialog="wrist"', 'data-dialog="finish"')) {
  if ($frontendFragment -notmatch [regex]::Escape($needle)) { throw "Plugin v3 frontend fragment is missing: $needle" }
}
foreach ($legacyPath in @('assets\js\t17-builder.js', 'assets\css\t17-builder.css', 'assets\js\three.module.min.js', 'assets\js\OrbitControls.js', 'vendor\three.module.min.js', 'vendor\OrbitControls.js')) {
  if (Test-Path -LiteralPath (Join-Path $plugin $legacyPath)) { throw "Plugin source contains forbidden legacy frontend file: $legacyPath" }
}
foreach ($forbidden in @('assets/js/t17-builder.js', 'Test-RuntimeVersionEvidence')) {
  if ($liveVerifier -match [regex]::Escape($forbidden)) { throw "Live verifier must not expect a legacy plugin frontend asset: $forbidden" }
}
foreach ($needle in @('category_slug', 'display_scale', 'sort_order', 'RequiredUiMarker')) {
  if ($liveVerifier -notmatch [regex]::Escape($needle)) { throw "Live verifier is missing v3 runtime contract coverage: $needle" }
}
if ($template -notmatch 'display_scale' -or $template -notmatch 'compatible_bead_sizes' -or $template -notmatch 'material_sort_order') {
  throw 'Catalog CSV template does not expose the new material-loop fields.'
}

Write-Output 'PASS: local material loop and packaged v3 2D frontend source contract are present.'
