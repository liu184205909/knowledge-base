$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Split-Path -Parent $root
$plugin = Join-Path $project 'plugin'
$install = Get-Content -LiteralPath (Join-Path $plugin 'includes\class-ew-t17-install.php') -Raw
$catalog = Get-Content -LiteralPath (Join-Path $plugin 'includes\class-ew-t17-catalog.php') -Raw
$commerce = Get-Content -LiteralPath (Join-Path $plugin 'includes\class-ew-t17-commerce.php') -Raw
$bootstrap = Get-Content -LiteralPath (Join-Path $plugin 't17-bracelet-builder.php') -Raw
$template = Get-Content -LiteralPath (Join-Path $plugin 'assets\catalog-template.csv') -Raw
$liveVerifier = Get-Content -LiteralPath (Join-Path $root 'verify-live-post-upgrade.ps1') -Raw

foreach ($needle in @('ew_t17_materials', 'ew_t17_variants', 'category_slug', 'display_scale', 'compatible_bead_sizes', 'sort_order', 'REQUIRED_MATERIAL_COLUMNS')) {
  if ($install -notmatch [regex]::Escape($needle)) { throw "Install schema is missing $needle" }
}
foreach ($needle in @('ew-t17-beads', 'ew-t17-decor', 'render_library_page', 'update_sort_order', 'register_rest_route', "'/catalog'", "'/quote'", 'present_variant', 'neighbor_bead_sizes_are_compatible', 'ew_t17_incompatible_bead_size', 'ew_t17_variant_size_mismatch', 'ew_t17_invalid_wrap_mode', 'packaging_snapshot', 'validate_live_mirror_pair', 'IMPORT_HEADERS', 'START TRANSACTION', 'ROLLBACK')) {
  if ($catalog -notmatch [regex]::Escape($needle)) { throw "Catalog backend is missing $needle" }
}
if ($catalog -notmatch [regex]::Escape("EXISTS (SELECT 1 FROM " + '" . self::variants_table() . "' + " v WHERE v.material_id = m.id AND v.status = 'live')")) {
  throw 'Catalog REST query must exclude live materials without a live Variant card.'
}
foreach ($needle in @("'category_slug' => sanitize_key(wp_unslash(`$_POST['category_slug'] ?? ''))", "v.status = %s", "m.status = %s AND (v.status = %s OR v.id IS NULL)")) {
  if ($catalog -notmatch [regex]::Escape($needle)) { throw "Catalog backend is missing operational library behavior: $needle" }
}
foreach ($needle in @('official-design/(?P<product_id>', 'get_official_design', 'ew_t17_add_custom', 'EW_T17_Catalog::quote_config', 'ew_t17_snapshot', "'preview_data' => `$recipe['preview_data']", "'resolved_variant' => `$quote['packaging_snapshot']", "'wrap_mode' => 'single'", 'ew_t17_invalid_recipe_wrap_mode')) {
  if ($commerce -notmatch [regex]::Escape($needle)) { throw "Commerce backend is missing $needle" }
}
foreach ($forbidden in @('three.module', 'OrbitControls', 't17_add_custom_bracelet')) {
  if ($catalog -match [regex]::Escape($forbidden) -or $commerce -match [regex]::Escape($forbidden)) {
    throw "Backend contains deprecated 3D or legacy-cart dependency: $forbidden"
  }
}
foreach ($forbidden in @('class-ew-t17-frontend.php', 'EW_T17_Frontend::init')) {
  if ($bootstrap -match [regex]::Escape($forbidden)) { throw "Plugin bootstrap must not load the legacy frontend: $forbidden" }
}
foreach ($forbidden in @('assets/js/t17-builder.js', 'Test-RuntimeVersionEvidence')) {
  if ($liveVerifier -match [regex]::Escape($forbidden)) { throw "Live verifier must not expect a legacy plugin frontend asset: $forbidden" }
}
foreach ($needle in @('category_slug', 'display_scale', 'sort_order', 'backend-only plugin')) {
  if ($liveVerifier -notmatch [regex]::Escape($needle)) { throw "Live verifier is missing v3 backend-only contract coverage: $needle" }
}
if ($template -notmatch 'display_scale' -or $template -notmatch 'compatible_bead_sizes' -or $template -notmatch 'material_sort_order') {
  throw 'Catalog CSV template does not expose the new material-loop fields.'
}

Write-Output 'PASS: local backend material-loop source contract is present.'
