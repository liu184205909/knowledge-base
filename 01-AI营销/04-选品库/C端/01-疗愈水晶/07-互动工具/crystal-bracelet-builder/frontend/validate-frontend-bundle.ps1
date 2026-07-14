$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$required = @(
  'README.md',
  't17-builder-fragment.html',
  't17-builder-ui.css',
  't17-builder-ui.js',
  't17-builder-mock-config.js',
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

foreach ($needle in @('data-t17-ui', 'data-ring', 'data-grid', 'data-dialog="wrist"', 'data-dialog="finish"')) {
  if ($fragment -notmatch [regex]::Escape($needle)) { throw "Fragment is missing $needle" }
}
$preview = Get-Content -LiteralPath (Join-Path $root 'preview.html') -Raw
foreach ($needle in @('t17-builder-mock-config.js', 't17-builder-ui.js', '../plugin/assets/images/tray-default.png')) {
  if ($preview -notmatch [regex]::Escape($needle)) { throw "Local preview is missing $needle" }
}
foreach ($needle in @('catalog', 'quote', 'official-design/', 'officialDesignId', 't17_design', 'ew_t17_add_custom', 'EW_T17_UI_CONFIG', 'display_scale', 'previewData', 'preview_data')) {
  if ($script -notmatch [regex]::Escape($needle)) { throw "UI script is missing backend boundary $needle" }
}
foreach ($needle in @("insertAt=state.selectedIndex===null?state.sequence.length:state.selectedIndex+1", "action==='move-left'", "action==='move-right'", "action==='remove-selected'", "action==='orientation'", "item={variant_id:id,size_mm:Number(variant.size_mm)}")) {
    if ($script -notmatch [regex]::Escape($needle)) { throw "Independent editor must provide deterministic $needle behavior." }
}
foreach ($forbidden in @('t17_add_custom_bracelet', 'three.module', 'OrbitControls', 'price_table')) {
  if ($script -match [regex]::Escape($forbidden)) { throw "UI script contains deprecated frontend dependency: $forbidden" }
}
if ($script -notmatch [regex]::Escape('mockMode') -or $script -notmatch [regex]::Escape('ew_t17_add_custom')) { throw 'UI script must retain explicit mock-mode isolation and the Woo handoff boundary.' }
if ($script -notmatch [regex]::Escape('size_mm||8)*4.8*scale')) { throw '2D bead rendering must apply the backend display_scale multiplier.' }
if ($script -notmatch [regex]::Escape("renderer:'t17-2d'")) { throw 'Cart preview data must identify the preserved 2D renderer.' }
if ($script -notmatch [regex]::Escape('mockOfficialDesigns') -or $mockConfig -notmatch [regex]::Escape('officialDesignId') -or $mockConfig -notmatch [regex]::Escape('9001')) { throw 'Local fixture must be able to exercise the official-design import path without production data.' }
if ($config -notmatch 'is_page\(array\(50236, 54723\)\)') { throw 'Config snippet must remain page-scoped.' }

Write-Output 'PASS: independent T17 frontend bundle has the required backend-only boundary.'
