$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$required = @(
  'README.md',
  't17-builder-fragment.html',
  't17-builder-ui.css',
  't17-builder-ui.js',
  't17-builder-mock-config.js',
  't17-builder-linganshi-draft-catalog.js',
  'preview.html',
  't17-builder-config.php'
)

foreach ($name in $required) {
  $path = Join-Path $root $name
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing frontend bundle file: $name" }
  if ((Get-Item -LiteralPath $path).Length -eq 0) { throw "Empty frontend bundle file: $name" }
}

$fragment = Get-Content -LiteralPath (Join-Path $root 't17-builder-fragment.html') -Raw
$script = Get-Content -LiteralPath (Join-Path $root 't17-builder-ui.js') -Raw
$config = Get-Content -LiteralPath (Join-Path $root 't17-builder-config.php') -Raw
$mockConfig = Get-Content -LiteralPath (Join-Path $root 't17-builder-mock-config.js') -Raw

foreach ($needle in @('data-t17-ui', 'data-ring', 'data-grid', 'data-dialog="wrist"', 'data-dialog="finish"', 'data-fixture-note', 'data-stage-actions', 'data-action="background"', 'data-action="assemble"', 'data-tray-brand')) {
  if ($fragment -notmatch [regex]::Escape($needle)) { throw "Fragment is missing $needle" }
}
$preview = Get-Content -LiteralPath (Join-Path $root 'preview.html') -Raw
foreach ($needle in @('t17-builder-mock-config.js', 't17-builder-linganshi-draft-catalog.js', 't17-builder-ui.js')) {
  if ($preview -notmatch [regex]::Escape($needle)) { throw "Local preview is missing $needle" }
}
$linganshiCatalog = Get-Content -LiteralPath (Join-Path $root 't17-builder-linganshi-draft-catalog.js') -Raw
foreach ($needle in @('ew-t17-v3-linganshi-235-draft-fixture', 'Linganshi 235-card development draft', 'config.mockCatalog')) {
  if ($linganshiCatalog -notmatch [regex]::Escape($needle)) { throw "Local 235-card catalog is missing $needle" }
}
$linganshiAssets = @(Get-ChildItem -LiteralPath (Join-Path $root 'assets\linganshi-draft') -File -Filter '*.webp')
if ($linganshiAssets.Count -ne 235) { throw "Local 235-card catalog must have exactly 235 WebP assets; found $($linganshiAssets.Count)." }
if ($preview -match [regex]::Escape('tray-default.png')) { throw 'Local preview must not retain the wood tray fallback.' }
foreach ($needle in @('trayThemes', 'tray-celadon-alpha.png', 'tray-blue-alpha.png', 'tray-ice-alpha.png', 'tray-walnut-alpha.png')) {
  if ($mockConfig -notmatch [regex]::Escape($needle)) { throw "Local fixture is missing PNG tray theme $needle" }
}
foreach ($name in @('assets/tray-celadon-alpha.png', 'assets/tray-blue-alpha.png', 'assets/tray-ice-alpha.png', 'assets/tray-walnut-alpha.png')) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $name))) { throw "Local fixture tray image is missing: $name" }
}
foreach ($needle in @('catalog', 'quote', 'official-design/', 'officialDesignId', 't17_design', 'ew_t17_add_custom', 'EW_T17_UI_CONFIG', 'display_scale', 'previewData', 'preview_data')) {
  if ($script -notmatch [regex]::Escape($needle)) { throw "UI script is missing backend boundary $needle" }
}
foreach ($needle in @("insertAt=state.selectedIndex===null?state.sequence.length:state.selectedIndex+1", "action==='background'", "action==='assemble'", "action==='confirm-reset'", "item={variant_id:id,size_mm:Number(variant.size_mm)}", "wrap_mode:'single'", "size_mm:Number(variants.get(item.variant_id).size_mm)")) {
    if ($script -notmatch [regex]::Escape($needle)) { throw "Independent editor must provide deterministic $needle behavior." }
}
foreach ($forbidden in @('t17_add_custom_bracelet', 'three.module', 'OrbitControls', 'price_table')) {
  if ($script -match [regex]::Escape($forbidden)) { throw "UI script contains deprecated frontend dependency: $forbidden" }
}
if ($script -notmatch [regex]::Escape('mockMode') -or $script -notmatch [regex]::Escape('ew_t17_add_custom') -or $script -notmatch [regex]::Escape('fixtureLabel')) { throw 'UI script must retain explicit mock-mode isolation, fixture disclosure, and the Woo handoff boundary.' }
if ($script -notmatch 'size_mm\|\|8\)\*[0-9.]+\*scale') { throw '2D bead rendering must apply the backend display_scale multiplier.' }
if ($script -notmatch [regex]::Escape("renderer:'t17-2d'")) { throw 'Cart preview data must identify the preserved 2D renderer.' }
if ($script -notmatch [regex]::Escape('mockOfficialDesigns') -or $mockConfig -notmatch [regex]::Escape('officialDesignId') -or $mockConfig -notmatch [regex]::Escape('9001')) { throw 'Local fixture must be able to exercise the official-design import path without production data.' }
foreach ($needle in @('Development fixture — not for sale', 'hero-dzi-bead-1-eye.webp', 'hero-dzi-bead-7-eye.webp', 'hero-dzi-bead-12-eye.webp', 'is_fixture: true')) {
  if ($mockConfig -notmatch [regex]::Escape($needle)) { throw "Local fixture must disclose and contain its intended visual QA source: $needle" }
}
if ($config -notmatch 'is_page\(array\(50236, 54723\)\)') { throw 'Config snippet must remain page-scoped.' }
if ($mockConfig -notmatch [regex]::Escape("physicsMotion: 'essential'") -or $script -notmatch [regex]::Escape("skipPhysics=reduceMotion&&physicsMotionPolicy==='none'")) { throw 'Core scatter collision must remain active when the browser only requests reduced decorative motion.' }
if ($script -match [regex]::Escape('if(reduceMotion){')) { throw 'Reduced-motion preference must not bypass the core scatter collision solver.' }

Write-Output 'PASS: independent T17 frontend bundle has the required backend-only boundary.'
