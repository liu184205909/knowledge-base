[CmdletBinding()]
param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot),
    [switch]$FailOnMissing
)

$ErrorActionPreference = 'Stop'
$script:Missing = New-Object System.Collections.Generic.List[string]
$script:Passed = 0

function Write-Check {
    param(
        [bool]$Passed,
        [string]$Name,
        [string]$Detail
    )

    if ($Passed) {
        $script:Passed += 1
        Write-Host "[PASS] $Name - $Detail" -ForegroundColor Green
        return
    }

    $script:Missing.Add("$Name - $Detail")
    Write-Host "[MISSING] $Name - $Detail" -ForegroundColor Yellow
}

function Get-RequiredFileContent {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Required file is missing: $Path"
    }
    return [System.IO.File]::ReadAllText($Path)
}

function Test-PatternSet {
    param(
        [string]$Name,
        [string]$Content,
        [string[]]$Patterns,
        [string]$Detail
    )

    $found = $true
    foreach ($pattern in $Patterns) {
        if ($Content -notmatch $pattern) {
            $found = $false
            break
        }
    }
    Write-Check -Passed $found -Name $Name -Detail $Detail
}

function Test-CsvHeaders {
    param(
        [string]$Name,
        [string]$Path,
        [string[]]$RequiredHeaders
    )

    $header = (Get-Content -LiteralPath $Path -TotalCount 1)
    $actual = @($header -split ',' | ForEach-Object { $_.Trim() })
    $missingHeaders = @($RequiredHeaders | Where-Object { $_ -notin $actual })
    $detail = if ($missingHeaders.Count) { "Missing headers: $($missingHeaders -join ', ')" } else { 'Required headers present.' }
    Write-Check -Passed ($missingHeaders.Count -eq 0) -Name $Name -Detail $detail
}

try {
    $plugin = Join-Path $Root 'plugin'
    $data = Join-Path $Root 'data\v3'
    $install = Get-RequiredFileContent (Join-Path $plugin 'includes\class-ew-t17-install.php')
    $catalog = Get-RequiredFileContent (Join-Path $plugin 'includes\class-ew-t17-catalog.php')
    $commerce = Get-RequiredFileContent (Join-Path $plugin 'includes\class-ew-t17-commerce.php')
    $frontendRoot = Join-Path $Root 'frontend'
    $frontend = Get-RequiredFileContent (Join-Path $frontendRoot 't17-builder-fragment.html')
    $javascript = Get-RequiredFileContent (Join-Path $frontendRoot 't17-builder-ui.js')
    $css = Get-RequiredFileContent (Join-Path $frontendRoot 't17-builder-ui.css')

    Write-Host "T17 directional decor validation (read-only)"
    Write-Host "Root: $Root"
    Write-Host ''

    Write-Host 'Direction data contract'
    Test-PatternSet -Name 'Installer persists directional fields' -Content $install -Patterns @('orientation|direction|mirror|rotat') -Detail 'Variant schema must own directional data, not only a review CSV.'
    Test-PatternSet -Name 'Catalog accepts or presents directional fields' -Content $catalog -Patterns @('orientation|direction|mirror|rotat') -Detail 'Catalog API/admin path must carry directional data.'
    Test-PatternSet -Name 'Commerce validates and snapshots orientation' -Content $commerce -Patterns @('normalize_orientation', 'merge_sequence_orientations', 'format_orientation') -Detail 'Order and official-design snapshots retain validated orientation.'
    Test-PatternSet -Name 'Independent frontend markup exposes orientation controls or state' -Content $frontend -Patterns @('orientation|direction|mirror|rotat') -Detail 'The independent editor must provide a directional interaction boundary.'
    Test-PatternSet -Name 'Editor state carries orientation' -Content $javascript -Patterns @('orientation|direction|mirror|rotat') -Detail 'Editor JS must send a selected direction with a sequence item.'

    Write-Host ''
    Write-Host 'Deterministic insertion'
    Test-PatternSet -Name 'Editor has deterministic insertion mutation' -Content $javascript -Patterns @('function\s+add\s*\(', 'state\.sequence\.splice\s*\(', 'state\.sequence\.length') -Detail 'A material click uses one deterministic insert path; append is the selected-index fallback.'
    Test-PatternSet -Name 'Editor has explicit selected-slot insertion' -Content $javascript -Patterns @('selected[_A-Za-z]*index|insert[_A-Za-z]*index|target[_A-Za-z]*index') -Detail 'Required for insert-at-selection instead of append-only behavior.'
    Write-Check -Passed ($javascript -notmatch 'Math\.random\s*\(') -Name 'Editor has no random sequence mutation' -Detail 'Static check: t17-builder-ui.js does not call Math.random.'

    Write-Host ''
    Write-Host 'Reduced-motion boundary'
    Test-PatternSet -Name 'Editor CSS honours reduced-motion preference' -Content $css -Patterns @('@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)') -Detail 'Animations and transitions need a prefers-reduced-motion boundary.'
    Test-PatternSet -Name 'Editor JS recognises reduced-motion preference' -Content $javascript -Patterns @('prefers-reduced-motion') -Detail 'Required when JS controls placement or collision animation.'

    Write-Host ''
    Write-Host 'V3 data template headers'
    Test-CsvHeaders -Name 'Production catalog import headers' -Path (Join-Path $data 'approved-production-catalog.import.csv') -RequiredHeaders @('material_key', 'component_type', 'variant_key', 'size_mm', 'price', 'weight_g', 'occupied_length_mm', 'stock_status', 'compatibility', 'orientation_mode', 'mirrored_variant_key', 'allowed_orientations', 'allowed_positions', 'neighbor_constraints', 'variant_status')
    Test-CsvHeaders -Name 'Directional decor review headers' -Path (Join-Path $data 'decor-orientation-review.template.csv') -RequiredHeaders @('variant_key', 'orientation_mode', 'mirrored_variant_key', 'allowed_orientations', 'allowed_positions', 'neighbor_constraints', 'approval_status')
    Test-CsvHeaders -Name 'Official design registry headers' -Path (Join-Path $data 'official-design-registry.template.csv') -RequiredHeaders @('design_slot_id', 'woo_product_id', 'design_version', 'price_version', 'recipe_status', 'approval_status')

    Write-Host ''
    Write-Host "Summary: $script:Passed passed, $($script:Missing.Count) missing."
    if ($script:Missing.Count) {
        Write-Host 'Missing implementation boundaries:' -ForegroundColor Yellow
        $script:Missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
        if ($FailOnMissing) {
            exit 1
        }
    }

    exit 0
}
catch {
    Write-Error $_
    exit 2
}
