param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
$researchRoot = Join-Path $ProjectRoot 'data\v3\research'
$designCsv = Join-Path $researchRoot 'domestic-design-square-zhulegezhu-20260714.csv'
$componentCsv = Join-Path $researchRoot 'domestic-design-square-zhulegezhu-components-20260714.csv'
$competitorRoot = Join-Path $researchRoot 'mini-program-competitors'
$packageRoot = Join-Path $competitorRoot 'zhulegezhu-designs'

if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) {
    throw "Project root does not exist: $ProjectRoot"
}
if (-not (Test-Path -LiteralPath $designCsv -PathType Leaf) -or -not (Test-Path -LiteralPath $componentCsv -PathType Leaf)) {
    throw 'The required design or component CSV is missing.'
}
if (-not $packageRoot.StartsWith($competitorRoot + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to write outside the mini-program competitor directory: $packageRoot"
}

$utf8Bom = New-Object System.Text.UTF8Encoding($true)
function Write-Utf8BomFile {
    param([string]$Path, [string]$Content)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8Bom)
}

function ConvertTo-SafeFolderName {
    param([string]$Name)
    $safe = $Name -replace '[<>:"/\\|?*]', '_'
    $safe = $safe.Trim().TrimEnd('.', ' ')
    if ([string]::IsNullOrWhiteSpace($safe)) { return 'untitled-design' }
    return $safe
}

$designs = @(Import-Csv -LiteralPath $designCsv -Encoding UTF8 | Sort-Object design_name_original, author_original, design_id)
$components = @(Import-Csv -LiteralPath $componentCsv -Encoding UTF8)
if ($designs.Count -ne 58) {
    throw "Expected 58 designs, found $($designs.Count)."
}

New-Item -ItemType Directory -Force -Path $competitorRoot | Out-Null
New-Item -ItemType Directory -Force -Path $packageRoot | Out-Null
$indexRows = [System.Collections.Generic.List[object]]::new()
$sequence = 0

foreach ($design in $designs) {
    $sequence++
    $folderName = '{0:D3}-{1}' -f $sequence, (ConvertTo-SafeFolderName $design.design_name_original)
    $designFolder = Join-Path $packageRoot $folderName
    New-Item -ItemType Directory -Force -Path $designFolder | Out-Null

    $designComponents = @($components | Where-Object { $_.design_id -eq $design.design_id })
    if ($designComponents.Count -eq 0) {
        throw "No components found for design: $($design.design_id)"
    }

    $details = [ordered]@{
        design_name = $design.design_name_original
        design_id = $design.design_id
        source = $design.source_name
        source_url = $design.source_url
        author = $design.author_original
        created_date = $design.created_date
        captured_on = $design.evidence_date
        source_evidence_status = $design.evidence_status
        usage_count_at_capture = $design.usage_count
        like_count_at_capture = $design.like_count
        five_elements = $design.five_elements
        tags = $design.tags
        recipe_status = $design.recipe_status
        source_displayed_price_sum = $design.source_displayed_price_sum
        source_quantity_multiplied_total = $design.source_quantity_multiplied_total
        source_price_unit_status = $design.source_price_unit_status
        earthward_preset_candidate_status = $design.earthward_preset_candidate_status
        earthward_material_mapping_status = $design.earthward_material_mapping_status
        earthward_price_status = $design.earthward_price_status
        earthward_image_status = $design.earthward_image_status
        woo_status = $design.woo_status
        component_rows = $designComponents.Count
        notes = $design.notes
    }
    Write-Utf8BomFile -Path (Join-Path $designFolder 'design-details.json') -Content ($details | ConvertTo-Json -Depth 4)

    $designComponents |
        Select-Object design_id, component_order, material_name_original, size_or_spec_original, quantity, source_row_price, source_price_unit_status, notes |
        ConvertTo-Csv -NoTypeInformation |
        Set-Content -LiteralPath (Join-Path $designFolder 'materials.csv') -Encoding UTF8

    $imageStatus = [ordered]@{
        status = 'pending-export-and-verification'
        source_image_evidence = $design.design_image_evidence
        saved_file = $null
        reason = 'Visible in the authorized mini-program session, but no unmapped cache file is treated as a design image.'
        next_action = 'Export from the mini-program or verify the cache-file-to-design-ID mapping, then save design-reference-image.webp or design-reference-image.png in this folder.'
        usage_rights_note = 'Source image is internal design reference only and is not a Woo product primary image.'
    }
    Write-Utf8BomFile -Path (Join-Path $designFolder 'image-status.json') -Content ($imageStatus | ConvertTo-Json -Depth 4)

    $indexRows.Add([PSCustomObject]@{
        sequence = $sequence
        design_name = $design.design_name_original
        author = $design.author_original
        usage_count_at_capture = $design.usage_count
        like_count_at_capture = $design.like_count
        source_quantity_multiplied_total = $design.source_quantity_multiplied_total
        component_rows = $designComponents.Count
        folder = $folderName
        image_status = 'pending-export-and-verification'
    })
}

$indexRows | ConvertTo-Csv -NoTypeInformation | Set-Content -LiteralPath (Join-Path $packageRoot 'design-index.csv') -Encoding UTF8

$readme = @"
# Zhu Le Ge Zhu design gallery

This directory is under data/v3/research/mini-program-competitors and is parallel to overseas-competitors.

Each numbered folder is one design. It contains design-details.json, materials.csv, and image-status.json.
Images are written only after a source file is exported or its cache mapping is verified.

Source price fields are preserved only as collection evidence. They are not Earthward or Woo prices.
"@
Write-Utf8BomFile -Path (Join-Path $packageRoot 'README.md') -Content $readme

[PSCustomObject]@{
    package_root = $packageRoot
    design_folders = $designs.Count
    component_rows = $components.Count
    metadata_files = (Get-ChildItem -LiteralPath $packageRoot -Directory | ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Filter 'design-details.json' -File }).Count
    material_files = (Get-ChildItem -LiteralPath $packageRoot -Directory | ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Filter 'materials.csv' -File }).Count
} | ConvertTo-Json
