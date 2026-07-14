param(
    [string]$DataDirectory = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

function Assert-Preflight { param([bool]$Condition, [string]$Message) if (-not $Condition) { throw "Preflight failed: $Message" } }
function Text($Value) { if ($null -eq $Value) { return '' }; return ([string]$Value).Trim() }
function Header($Path) { return @(([string](Get-Content -LiteralPath $Path -Encoding UTF8 -TotalCount 1)).Split(',')) }
function Rows($Path) { return @(Import-Csv -LiteralPath $Path -Encoding UTF8) }
function IsApproved($Value) { return (Text $Value).ToLowerInvariant() -eq 'approved' }

& (Join-Path $DataDirectory 'validate-v3-data-contract.ps1') -DataDirectory $DataDirectory

$catalogPath = Join-Path $DataDirectory 'approved-production-catalog.import.csv'
$assetPath = Join-Path $DataDirectory 'material-asset-provenance.production-template.csv'
$pricePath = Join-Path $DataDirectory 'variant-price-review.production-template.csv'
$orientationPath = Join-Path $DataDirectory 'decor-orientation-review.template.csv'
$contract = Get-Content -LiteralPath (Join-Path $DataDirectory 'data-contract.v3.json') -Encoding UTF8 -Raw | ConvertFrom-Json

$expectedAssetHeaders = @('material_key','variant_key','asset_role','source_name','source_url','original_file_name','file_hash_sha256','license_or_permission_status','asset_status','captured_at_utc','approved_by','approved_at_utc','notes')
$expectedPriceHeaders = @('price_version','variant_key','currency','supplier_name','supplier_sku','supplier_cost','domestic_reference_retail','overseas_reference_retail','wastage_cost','labor_cost','packaging_cost','fulfillment_cost','recommended_unit_price','target_gross_margin','confidence','review_status','reviewed_by','reviewed_at_utc','notes')
Assert-Preflight ((Header $assetPath) -join ',' -eq ($expectedAssetHeaders -join ',')) 'Asset provenance header does not match the approved template.'
Assert-Preflight ((Header $pricePath) -join ',' -eq ($expectedPriceHeaders -join ',')) 'Price review header does not match the approved template.'

$catalog = Rows $catalogPath; $assets = Rows $assetPath; $prices = Rows $pricePath; $orientations = Rows $orientationPath
$assetByVariant = @{}; foreach ($row in $assets) { if (IsApproved $row.asset_status) { $assetByVariant[(Text $row.variant_key)] = $row } }
$priceByVariant = @{}; foreach ($row in $prices) { if (IsApproved $row.review_status) { $priceByVariant[(Text $row.variant_key)] = $row } }
$orientationByVariant = @{}; foreach ($row in $orientations) { $orientationByVariant[(Text $row.variant_key)] = $row }

foreach ($row in $catalog) {
    $variant = Text $row.variant_key; $material = Text $row.material_key; $status = (Text $row.variant_status).ToLowerInvariant()
    if ($status -ne 'live') { continue }
    Assert-Preflight ($assetByVariant.ContainsKey($variant)) "Live variant $variant has no approved image provenance record."
    $asset = $assetByVariant[$variant]
    foreach ($field in @('source_name','source_url','original_file_name','file_hash_sha256','license_or_permission_status','captured_at_utc','approved_by','approved_at_utc')) { Assert-Preflight ((Text $asset.$field) -ne '') "Approved asset for $variant lacks $field." }
    Assert-Preflight ($priceByVariant.ContainsKey($variant)) "Live variant $variant has no approved price review."
    $price = $priceByVariant[$variant]
    foreach ($field in @('price_version','currency','recommended_unit_price','reviewed_by','reviewed_at_utc')) { Assert-Preflight ((Text $price.$field) -ne '') "Approved price for $variant lacks $field." }
    [decimal]$catalogPrice = 0; [decimal]$reviewPrice = 0
    Assert-Preflight ([decimal]::TryParse((Text $row.price), [ref]$catalogPrice) -and [decimal]::TryParse((Text $price.recommended_unit_price), [ref]$reviewPrice) -and $catalogPrice -eq $reviewPrice) "Live variant $variant catalog price does not equal its approved price review."
    $mode = (Text $row.orientation_mode).ToLowerInvariant(); if ($mode -eq '') { $mode = 'none' }
    if ($mode -ne 'none') {
        Assert-Preflight ((Text $row.component_type).ToLowerInvariant() -eq 'decor') "Directional live variant $variant is not Decor."
        Assert-Preflight ($orientationByVariant.ContainsKey($variant)) "Directional live variant $variant has no direction review."
        $review = $orientationByVariant[$variant]
        Assert-Preflight ((Text $review.record_scope) -eq 'decor_orientation_review_only' -and (Text $review.production_import_eligible) -eq 'no') "Direction review for $variant is not safely marked review-only."
        foreach ($field in @('asset_review_status','orientation_review_status','approval_status')) { Assert-Preflight (IsApproved $review.$field) "Direction review for $variant lacks approved $field." }
        foreach ($field in @('orientation_mode','mirrored_variant_key','allowed_orientations','allowed_positions','neighbor_constraints')) { Assert-Preflight ((Text $review.$field) -eq (Text $row.$field)) "Direction review for $variant does not match catalog $field." }
    }
}

Write-Output "PASS: production import preflight accepted $($catalog.Count) catalog row(s), $($assets.Count) asset review row(s), and $($prices.Count) price review row(s)."
