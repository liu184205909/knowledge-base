param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl,
    [string]$BeadVariantId,
    [string]$DecorVariantId,
    [string]$IncompatibleDecorVariantId,
    [int]$OfficialDesignProductId = 0,
    [ValidateRange(10, 30)]
    [double]$TargetWristCm = 16
)

$ErrorActionPreference = 'Stop'
$base = $BaseUrl.TrimEnd('/')
$api = "$base/wp-json/ew-t17/v1"

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw "Runtime validation failed: $Message" }
}

function Find-Variant {
    param($Catalog, [string]$VariantId)
    foreach ($material in @($Catalog.materials)) {
        foreach ($variant in @($material.variants)) {
            if ($variant.id -eq $VariantId) {
                return [pscustomobject]@{ Material = $material; Variant = $variant }
            }
        }
    }
    return $null
}

function Assert-QuoteRejected {
    param([hashtable]$Payload, [string]$ExpectedErrorCode, [string]$Label)
    try {
        Invoke-RestMethod -Method Post -Uri "$api/quote" -ContentType 'application/json' -Body ($Payload | ConvertTo-Json -Depth 5) | Out-Null
        throw "Runtime validation failed: $Label was unexpectedly accepted."
    } catch {
        $response = $_.Exception.Response
        if ($null -eq $response) {
            throw
        }
        $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
        $body = $reader.ReadToEnd() | ConvertFrom-Json
        Assert-Condition ($body.code -eq $ExpectedErrorCode) "$Label returned $($body.code), expected $ExpectedErrorCode."
        Write-Output "PASS: server rejected $Label with $ExpectedErrorCode."
    }
}

$catalog = Invoke-RestMethod -Method Get -Uri "$api/catalog"
Assert-Condition ($catalog.schema_version -eq 'ew-t17-v3') 'Catalog schema_version must be ew-t17-v3.'
Assert-Condition ($null -ne $catalog.materials) 'Catalog response must contain materials.'

foreach ($material in @($catalog.materials)) {
    foreach ($field in @('material_key', 'component_type', 'category_slug', 'name_en', 'variants')) {
        Assert-Condition ($null -ne $material.$field) "Catalog material is missing $field."
    }
    foreach ($variant in @($material.variants)) {
        foreach ($field in @('id', 'size_mm', 'price', 'weight_g', 'occupied_length_mm', 'display_scale', 'image_url', 'compatible_bead_sizes', 'sort_order')) {
            Assert-Condition ($null -ne $variant.$field) "Catalog variant $($variant.id) is missing $field."
        }
    }
}

Write-Output "PASS: public catalog returned $(@($catalog.materials).Count) live material record(s) with v3 material-card fields."

if ([string]::IsNullOrWhiteSpace($BeadVariantId)) {
    Write-Output 'SKIP: quote test requires -BeadVariantId from a live test material.'
} else {
    $bead = Find-Variant $catalog $BeadVariantId
    Assert-Condition ($null -ne $bead) "Live bead variant $BeadVariantId was not found in catalog."
    Assert-Condition ($bead.Material.component_type -eq 'bead') "$BeadVariantId must be a bead variant."

    $sequence = @(@{ variant_id = $BeadVariantId })
    if (-not [string]::IsNullOrWhiteSpace($DecorVariantId)) {
        $decor = Find-Variant $catalog $DecorVariantId
        Assert-Condition ($null -ne $decor) "Live decor variant $DecorVariantId was not found in catalog."
        Assert-Condition ($decor.Material.component_type -in @('decor', 'finish')) "$DecorVariantId must be a decor or finish variant."
        $sequence = @(@{ variant_id = $BeadVariantId }, @{ variant_id = $DecorVariantId }, @{ variant_id = $BeadVariantId })
    }

    $quoteRequest = @{ target_wrist_cm = $TargetWristCm; fit_preference = 'regular'; sequence = $sequence } | ConvertTo-Json -Depth 5
    $quote = Invoke-RestMethod -Method Post -Uri "$api/quote" -ContentType 'application/json' -Body $quoteRequest
    foreach ($field in @('currency', 'total', 'weight_g', 'used_length_mm', 'target_length_mm', 'fit_status', 'snapshot', 'price_version')) {
        Assert-Condition ($null -ne $quote.$field) "Quote response is missing $field."
    }
    Assert-Condition (@($quote.snapshot).Count -eq @($sequence).Count) 'Quote snapshot count must match the submitted sequence.'
    Write-Output "PASS: server quote returned $($quote.currency) $($quote.total) for $(@($sequence).Count) material(s); price_version=$($quote.price_version)."

    Assert-QuoteRejected @{ target_wrist_cm = $TargetWristCm; fit_preference = 'regular'; sequence = @(@{ variant_id = 'missing-runtime-variant' }) } 'ew_t17_unknown_variant' 'an unknown Variant'

    if (-not [string]::IsNullOrWhiteSpace($IncompatibleDecorVariantId)) {
        $incompatible = Find-Variant $catalog $IncompatibleDecorVariantId
        Assert-Condition ($null -ne $incompatible) "Live incompatible decor variant $IncompatibleDecorVariantId was not found in catalog."
        Assert-Condition ($incompatible.Material.component_type -in @('decor', 'finish')) "$IncompatibleDecorVariantId must be a decor or finish variant."
        Assert-QuoteRejected @{ target_wrist_cm = $TargetWristCm; fit_preference = 'regular'; sequence = @(@{ variant_id = $BeadVariantId }, @{ variant_id = $IncompatibleDecorVariantId }, @{ variant_id = $BeadVariantId }) } 'ew_t17_incompatible_bead_size' 'a decor with incompatible bead-size rules'
    } else {
        Write-Output 'SKIP: incompatible-size rejection test requires -IncompatibleDecorVariantId.'
    }
}

if ($OfficialDesignProductId -gt 0) {
    $official = Invoke-RestMethod -Method Get -Uri "$api/official-design/$OfficialDesignProductId"
    foreach ($field in @('product_id', 'name', 'recipe', 'quote', 'design_version', 'price_version')) {
        Assert-Condition ($null -ne $official.$field) "Official design response is missing $field."
    }
    Assert-Condition (@($official.recipe.sequence).Count -gt 0) 'Official design recipe must contain a sequence.'
    Write-Output "PASS: official design $OfficialDesignProductId returned a server-validated recipe and quote."
} else {
    Write-Output 'SKIP: official design test requires -OfficialDesignProductId for a configured test Woo product.'
}

Write-Output 'NEXT: verify Woo cart and order snapshots in the authenticated test-site workflow; this public REST script intentionally does not create pages, materials, carts, or orders.'
