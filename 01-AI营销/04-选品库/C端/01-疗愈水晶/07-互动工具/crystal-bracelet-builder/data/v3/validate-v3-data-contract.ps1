param(
    [string]$DataDirectory = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) {
        throw "Validation failed: $Message"
    }
}

function Read-CsvHeader {
    param([string]$Path)
    return @(([string](Get-Content -LiteralPath $Path -Encoding UTF8 -TotalCount 1)).Split(','))
}

function Get-Text {
    param($Value)
    if ($null -eq $Value) {
        return ''
    }
    return ([string]$Value).Trim()
}

function Assert-StrictKey {
    param([string]$Value, [string]$Field, [int]$RowNumber, [bool]$AllowBlank = $false)
    $text = Get-Text $Value
    if ($AllowBlank -and $text -eq '') {
        return ''
    }
    Assert-Condition ($text -match '^[a-z0-9_-]+$') "Row $RowNumber has an invalid $Field. Use a stable lowercase key."
    return $text
}

function Get-StrictList {
    param([string]$Value, [string]$Field, [int]$RowNumber)
    $text = Get-Text $Value
    if ($text -eq '') {
        return @()
    }

    if ($text.StartsWith('[') -or $text.StartsWith('{')) {
        try {
            $items = ConvertFrom-Json -InputObject $text -ErrorAction Stop
        } catch {
            throw "Validation failed: Row $RowNumber has invalid JSON in $Field."
        }
        Assert-Condition ($items -is [System.Array]) "Row $RowNumber $Field JSON must be a list."
    } else {
        $items = $text.Split(',')
    }

    $result = @()
    foreach ($item in @($items)) {
        $token = Get-Text $item
        Assert-Condition ($token -match '^[a-z0-9_-]+$') "Row $RowNumber has an invalid $Field value."
        if ($result -notcontains $token) {
            $result += $token
        }
    }
    Assert-Condition ($result.Count -gt 0) "Row $RowNumber $Field cannot be an empty list."
    return @($result)
}

function Get-NonNegativeNumber {
    param([string]$Value, [string]$Field, [int]$RowNumber)
    $text = Get-Text $Value
    $number = 0.0
    $valid = [double]::TryParse($text, [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$number)
    Assert-Condition ($text -ne '' -and $valid -and -not [double]::IsNaN($number) -and -not [double]::IsInfinity($number) -and $number -ge 0) "Row $RowNumber requires a non-negative numeric $Field."
    return $number
}

function Get-OptionalPositiveNumberList {
    param([string]$Value, [string]$Field, [int]$RowNumber)
    $text = Get-Text $Value
    if ($text -eq '') {
        return @()
    }

    $result = @()
    foreach ($item in $text.Split(',')) {
        $token = Get-Text $item
        $number = 0.0
        $valid = [double]::TryParse($token, [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$number)
        Assert-Condition ($valid -and -not [double]::IsNaN($number) -and -not [double]::IsInfinity($number) -and $number -gt 0 -and $number -le 100) "Row $RowNumber has an invalid $Field value."
        if ($result -notcontains $number) {
            $result += $number
        }
    }
    return @($result)
}

function Get-OrientationDefaults {
    param([string]$Mode)
    switch ($Mode) {
        'none' { return @('none') }
        'fixed_left' { return @('left') }
        'fixed_right' { return @('right') }
        'mirrorable' { return @('left', 'right') }
        'rotatable' { return @('rotate_0', 'rotate_90', 'rotate_180', 'rotate_270') }
    }
    throw "Validation failed: Unsupported orientation mode $Mode."
}

function Assert-NeighborConstraints {
    param([string]$Value, [string[]]$AllowedKeys, [int]$RowNumber)
    $text = Get-Text $Value
    if ($text -eq '') {
        return
    }
    try {
        $object = ConvertFrom-Json -InputObject $text -ErrorAction Stop
    } catch {
        throw "Validation failed: Row $RowNumber has invalid JSON in neighbor_constraints."
    }
    Assert-Condition ($object -is [pscustomobject]) "Row $RowNumber neighbor_constraints must be a non-empty JSON object."
    $properties = @($object.PSObject.Properties)
    Assert-Condition ($properties.Count -gt 0) "Row $RowNumber neighbor_constraints must not be empty."
    foreach ($property in $properties) {
        Assert-Condition ($AllowedKeys -contains $property.Name) "Row $RowNumber has an unsupported neighbor constraint $($property.Name)."
        $values = $property.Value
        if ($values -is [System.Array]) {
            $listValue = ($values -join ',')
        } else {
            $listValue = [string]$values
        }
        [void](Get-StrictList $listValue "neighbor_constraints.$($property.Name)" $RowNumber)
    }
}

function Assert-CatalogRows {
    param($Rows, $CatalogContract)
    $variantRows = @{}
    $rowNumber = 1
    foreach ($row in $Rows) {
        $rowNumber++
        $materialKey = Assert-StrictKey $row.material_key 'material_key' $rowNumber
        [void](Assert-StrictKey $row.category_slug 'category_slug' $rowNumber $true)
        $variantKey = Assert-StrictKey $row.variant_key 'variant_key' $rowNumber
        Assert-Condition (-not [string]::IsNullOrWhiteSpace((Get-Text $row.name_en))) "Row $rowNumber requires name_en."
        $componentType = (Get-Text $row.component_type).ToLowerInvariant()
        Assert-Condition ($CatalogContract.component_type_values -contains $componentType) "Row $rowNumber has an invalid component_type."
        $materialStatus = (Get-Text $row.material_status).ToLowerInvariant()
        if ($materialStatus -eq '') { $materialStatus = 'draft' }
        $variantStatus = (Get-Text $row.variant_status).ToLowerInvariant()
        if ($variantStatus -eq '') { $variantStatus = 'draft' }
        Assert-Condition ($CatalogContract.material_status_values -contains $materialStatus) "Row $rowNumber has an invalid material_status."
        Assert-Condition ($CatalogContract.variant_status_values -contains $variantStatus) "Row $rowNumber has an invalid variant_status."

        $size = Get-NonNegativeNumber $row.size_mm 'size_mm' $rowNumber
        $price = Get-NonNegativeNumber $row.price 'price' $rowNumber
        $weight = Get-NonNegativeNumber $row.weight_g 'weight_g' $rowNumber
        $occupiedLength = Get-NonNegativeNumber $row.occupied_length_mm 'occupied_length_mm' $rowNumber
        $displayScale = Get-NonNegativeNumber $row.display_scale 'display_scale' $rowNumber
        Assert-Condition ($displayScale -gt 0 -and $displayScale -le 10) "Row $rowNumber display_scale must be greater than zero and no more than 10."
        [void](Get-OptionalPositiveNumberList $row.compatible_bead_sizes 'compatible_bead_sizes' $rowNumber)
        foreach ($sortField in @('material_sort_order', 'variant_sort_order')) {
            $sortValue = Get-Text $row.$sortField
            Assert-Condition ($sortValue -eq '' -or $sortValue -match '^\d+$') "Row $rowNumber $sortField must be blank or a non-negative integer."
        }
        if ($variantStatus -eq 'live') {
            Assert-Condition ($size -gt 0 -and $price -gt 0 -and $weight -gt 0 -and $occupiedLength -gt 0) "Row $rowNumber is live, so size_mm, price, weight_g, and occupied_length_mm must all be greater than zero."
        }

        $stockStatus = (Get-Text $row.stock_status).ToLowerInvariant()
        if ($stockStatus -eq '') { $stockStatus = 'instock' }
        Assert-Condition ($CatalogContract.stock_status_values -contains $stockStatus) "Row $rowNumber has an invalid stock_status."
        $stockQuantity = Get-Text $row.stock_quantity
        Assert-Condition ($stockQuantity -eq '' -or $stockQuantity -match '^\d+$') "Row $rowNumber stock_quantity must be blank or a non-negative integer."

        $orientationMode = (Get-Text $row.orientation_mode).ToLowerInvariant()
        if ($orientationMode -eq '') { $orientationMode = 'none' }
        Assert-Condition ($CatalogContract.orientation_mode_values -contains $orientationMode) "Row $rowNumber has an invalid orientation_mode."
        if ($orientationMode -ne 'none') {
            Assert-Condition ($componentType -eq 'decor') "Row $rowNumber uses a directional orientation_mode but is not a decor Variant."
        }
        $orientationValues = Get-StrictList $row.allowed_orientations 'allowed_orientations' $rowNumber
        $orientationDefaults = Get-OrientationDefaults $orientationMode
        if ($orientationValues.Count -eq 0) { $orientationValues = $orientationDefaults }
        Assert-Condition (-not @($orientationValues | Where-Object { $orientationDefaults -notcontains $_ })) "Row $rowNumber contains an orientation value not allowed by $orientationMode."

        $positionValues = Get-StrictList $row.allowed_positions 'allowed_positions' $rowNumber
        if ($positionValues.Count -gt 0) {
            Assert-Condition (-not @($positionValues | Where-Object { $CatalogContract.allowed_position_values -notcontains $_ })) "Row $rowNumber contains an invalid allowed_positions value."
            Assert-Condition (-not (($positionValues -contains 'any') -and $positionValues.Count -ne 1)) "Row $rowNumber must not combine any with another allowed_positions value."
        }
        Assert-NeighborConstraints $row.neighbor_constraints @($CatalogContract.neighbor_constraint_keys) $rowNumber

        $mirroredVariantKey = Assert-StrictKey $row.mirrored_variant_key 'mirrored_variant_key' $rowNumber $true
        if ($orientationMode -in @('fixed_left', 'fixed_right')) {
            Assert-Condition ($mirroredVariantKey -ne '' -and $mirroredVariantKey -ne $variantKey) "Row $rowNumber $orientationMode requires a different mirrored_variant_key."
        }

        Assert-Condition (-not $variantRows.ContainsKey($variantKey)) "Row $rowNumber duplicates variant_key $variantKey."
        $variantRows[$variantKey] = [pscustomobject]@{
            RowNumber = $rowNumber
            VariantKey = $variantKey
            MaterialKey = $materialKey
            OrientationMode = $orientationMode
            MirroredVariantKey = $mirroredVariantKey
        }
    }

    foreach ($variant in $variantRows.Values) {
        if ($variant.OrientationMode -notin @('fixed_left', 'fixed_right')) {
            continue
        }
        Assert-Condition ($variantRows.ContainsKey($variant.MirroredVariantKey)) "Row $($variant.RowNumber) references a mirrored_variant_key that is missing from the approved catalog."
        $counterpart = $variantRows[$variant.MirroredVariantKey]
        $expectedMode = if ($variant.OrientationMode -eq 'fixed_left') { 'fixed_right' } else { 'fixed_left' }
        Assert-Condition ($counterpart.OrientationMode -eq $expectedMode -and $counterpart.MirroredVariantKey -eq $variant.VariantKey) "Row $($variant.RowNumber) must reference a reciprocal $expectedMode physical Variant."
    }
}

$contractPath = Join-Path $DataDirectory 'data-contract.v3.json'
$contract = Get-Content -LiteralPath $contractPath -Encoding UTF8 -Raw | ConvertFrom-Json
Assert-Condition ($contract.schema_version -eq 'ew-t17-v3-data-contract-2026-07') 'Unexpected data contract version.'

$catalogPath = Join-Path $DataDirectory $contract.catalog_import.file
$catalogHeader = Read-CsvHeader $catalogPath
$expectedCatalogHeaders = @('material_key', 'component_type', 'category_slug', 'name_en', 'primary_color', 'color_tags', 'intention_tags', 'material_image_url', 'material_status', 'material_sort_order', 'variant_key', 'size_mm', 'shape', 'price', 'weight_g', 'occupied_length_mm', 'display_scale', 'variant_image_url', 'stock_status', 'stock_quantity', 'compatibility', 'compatible_bead_sizes', 'orientation_mode', 'mirrored_variant_key', 'allowed_orientations', 'allowed_positions', 'neighbor_constraints', 'variant_status', 'variant_sort_order', 'source_name')
Assert-Condition ($expectedCatalogHeaders.Count -eq 30) 'Validator must encode all 30 approved import headers.'
Assert-Condition ($contract.catalog_import.exact_header_count -eq 30) 'Catalog contract must declare 30 approved import headers.'
Assert-Condition ($catalogHeader.Count -eq 30) 'Catalog import header must contain exactly 30 columns.'
Assert-Condition (($contract.catalog_import.headers -join ',') -eq ($expectedCatalogHeaders -join ',')) 'Catalog contract headers do not match the strict importer header list.'
Assert-Condition (($catalogHeader -join ',') -eq ($expectedCatalogHeaders -join ',')) 'Catalog import header must match the current importer contract exactly.'
$catalogRows = @(Import-Csv -LiteralPath $catalogPath -Encoding UTF8)
Assert-CatalogRows $catalogRows $contract.catalog_import

$orientationPath = Join-Path $DataDirectory $contract.decor_orientation_review.file
$orientationHeader = Read-CsvHeader $orientationPath
Assert-Condition (($orientationHeader -join ',') -eq (($contract.decor_orientation_review.headers) -join ',')) 'Decor orientation review header does not match the contract.'
$orientationRows = @(Import-Csv -LiteralPath $orientationPath -Encoding UTF8)
$orientationRowNumber = 1
foreach ($row in $orientationRows) {
    $orientationRowNumber++
    Assert-Condition ((Get-Text $row.record_scope) -eq 'decor_orientation_review_only') "Decor review row $orientationRowNumber must remain review-only."
    Assert-Condition ((Get-Text $row.production_import_eligible) -eq 'no') "Decor review row $orientationRowNumber must never be directly importable."
    Assert-Condition ((Get-Text $row.schema_version) -eq $contract.schema_version) "Decor review row $orientationRowNumber has an unexpected schema version."
    [void](Assert-StrictKey $row.variant_key 'decor review variant_key' $orientationRowNumber)
    $mode = (Get-Text $row.orientation_mode).ToLowerInvariant()
    Assert-Condition ($contract.decor_orientation_review.orientation_mode_values -contains $mode) "Decor review row $orientationRowNumber has an invalid orientation_mode."
    $orientationValues = Get-StrictList $row.allowed_orientations 'decor review allowed_orientations' $orientationRowNumber
    $defaults = Get-OrientationDefaults $mode
    Assert-Condition (-not @($orientationValues | Where-Object { $defaults -notcontains $_ })) "Decor review row $orientationRowNumber has an orientation not allowed by its mode."
    $positionValues = Get-StrictList $row.allowed_positions 'decor review allowed_positions' $orientationRowNumber
    Assert-Condition (-not @($positionValues | Where-Object { $contract.decor_orientation_review.allowed_position_values -notcontains $_ })) "Decor review row $orientationRowNumber has an invalid allowed position."
    Assert-Condition (-not (($positionValues -contains 'any') -and $positionValues.Count -ne 1)) "Decor review row $orientationRowNumber cannot combine any with another position."
    Assert-NeighborConstraints $row.neighbor_constraints @($contract.catalog_import.neighbor_constraint_keys) $orientationRowNumber
    if ($mode -in @('fixed_left', 'fixed_right')) {
        [void](Assert-StrictKey $row.mirrored_variant_key 'decor review mirrored_variant_key' $orientationRowNumber)
    }
    foreach ($statusField in @('asset_review_status', 'orientation_review_status', 'approval_status')) {
        Assert-Condition ((Get-Text $row.$statusField).ToLowerInvariant() -eq 'approved') "Decor review row $orientationRowNumber requires approved $statusField."
    }
    Assert-Condition ((Get-Text $row.approved_by) -ne '' -and (Get-Text $row.approved_at_utc) -ne '') "Decor review row $orientationRowNumber requires approver and timestamp."
}

$mappingPath = Join-Path $DataDirectory $contract.legacy_mapping.file
$mappingRows = @(Import-Csv -LiteralPath $mappingPath -Encoding UTF8)
Assert-Condition ($mappingRows.Count -eq 20) 'Legacy mapping must cover exactly 20 legacy candidates.'
foreach ($row in $mappingRows) {
    Assert-Condition ($row.record_scope -eq 'legacy_candidate_review_only') "Legacy item $($row.legacy_item_id) has an invalid scope."
    Assert-Condition ($row.production_import_eligible -eq 'no') "Legacy item $($row.legacy_item_id) must remain non-importable."
    foreach ($field in $contract.legacy_mapping.required_blank_target_fields) {
        Assert-Condition ([string]::IsNullOrWhiteSpace([string]$row.$field)) "Legacy item $($row.legacy_item_id) must leave $field blank."
    }
}

$recipePath = Join-Path $DataDirectory 'woo-official-design-recipe.template.json'
$recipe = Get-Content -LiteralPath $recipePath -Encoding UTF8 -Raw | ConvertFrom-Json
Assert-Condition ($recipe._template_status -like 'NOT_VALID_FOR_WOO*') 'Official recipe template must remain explicitly non-production.'
Assert-Condition ($null -eq $recipe._ew_t17_recipe_json.target_wrist_cm) 'Official recipe template must not contain a wrist value.'

Write-Output 'PASS: v3 data contract is valid.'
Write-Output "PASS: approved production catalog has the exact 30-column importer header and $($catalogRows.Count) valid data row(s)."
Write-Output "PASS: decor orientation review has $($orientationRows.Count) validated non-production review row(s)."
Write-Output 'PASS: 20 legacy candidates remain non-importable with blank production targets.'
Write-Output 'PASS: official recipe JSON remains an invalid placeholder template.'
