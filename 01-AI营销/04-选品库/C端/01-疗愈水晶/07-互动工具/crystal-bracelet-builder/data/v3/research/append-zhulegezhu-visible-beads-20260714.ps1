param(
    [Parameter(Mandatory = $true)]
    [string]$CardsJsonBase64
)

$ErrorActionPreference = 'Stop'
$researchRoot = Split-Path -Parent $PSCommandPath
$cards = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($CardsJsonBase64)) | ConvertFrom-Json
if ($cards.Count -ne 233) { throw "Expected 233 visible bead cards; received $($cards.Count)." }

$sourcePath = Join-Path $researchRoot 'domestic-materials-zhulegezhu-20260713.csv'
$aggregatePath = Join-Path $researchRoot 'domestic-materials-20260713.csv'
$benchmarkPath = Join-Path $researchRoot 'domestic-price-benchmark-20260713.csv'
$sourceExisting = Import-Csv -LiteralPath $sourcePath
$existingBeads = @($sourceExisting | Where-Object { $_.component_type -eq 'bead' })
if ($existingBeads.Count -ne 12) { throw "Expected 12 existing bead rows; received $($existingBeads.Count)." }
$sourceTemplate = $existingBeads[0]

$aggregateExisting = Import-Csv -LiteralPath $aggregatePath
$aggregateTemplate = @($aggregateExisting | Where-Object { $_.source_name -eq $sourceTemplate.source_name -and $_.component_type -eq 'bead' })[0]
if ($null -eq $aggregateTemplate) { throw 'Cannot locate aggregate template row.' }
$benchmarkExisting = Import-Csv -LiteralPath $benchmarkPath
$benchmarkTemplate = @($benchmarkExisting | Where-Object { $_.source_name -eq $sourceTemplate.source_name -and $_.component_type -eq 'bead' })[0]
if ($null -eq $benchmarkTemplate) { throw 'Cannot locate benchmark template row.' }

$newCards = @($cards | Select-Object -Skip 12)
if ($newCards.Count -ne 221) { throw "Expected 221 new bead rows; received $($newCards.Count)." }
$evidence = 'Authorized desktop WeChat session; all-beads list; 233 visible filter results; text verified 2026-07-14.'
$noteBase = 'Authorized desktop WeChat session; visible all-beads card; name, size, and public price verified from text layer.'

$newSourceRows = foreach ($card in $newCards) {
    [pscustomobject][ordered]@{
        source_name = $sourceTemplate.source_name; source_url = $sourceTemplate.source_url; evidence_date = '2026-07-14'; evidence_status = 'verified-public'
        category_level_1 = $sourceTemplate.category_level_1; category_level_2 = $sourceTemplate.category_level_2; category_level_3 = ''; component_type = 'bead'
        product_name_original = $card.name; variant_name_original = "$($card.size_mm)mm"; size_mm = $card.size_mm; price_visible = $card.price_cny
        currency = 'CNY'; unit_type = 'single-bead'; image_local_path_or_cache_folder = $evidence; image_mapping_status = 'ui-text-evidence'
        material_or_color = ''; product_attributes = $(if ($card.sold_out_visible) { 'sold-out-visible' } else { '' }); compatible_bead_sizes = ''; orientation_mode = ''
        notes = "$noteBase$($(if ($card.sold_out_visible) { ' Sold-out label visible; public price retained.' } else { '' }))"; production_ready = 'no'
    }
}
$newAggregateRows = foreach ($card in $newCards) {
    [pscustomobject][ordered]@{
        source_name = $aggregateTemplate.source_name; source_url = $aggregateTemplate.source_url; evidence_date = '2026-07-14'; evidence_status = 'verified-public'; component_type = 'bead'
        category = $aggregateTemplate.category; sub_category = $aggregateTemplate.sub_category; name_original = $card.name; name_en_suggestion = ''; size_mm = $card.size_mm; price_visible = $card.price_cny
        currency = 'CNY'; image_evidence_url_or_screenshot = $evidence; material_or_color = ''; compatible_bead_sizes = ''; orientation_mode = ''
        notes = "$noteBase$($(if ($card.sold_out_visible) { ' Sold-out label visible; public price retained.' } else { '' }))"; production_ready = 'no'
    }
}
$newBenchmarkRows = foreach ($card in $newCards) {
    [pscustomobject][ordered]@{
        source_name = $benchmarkTemplate.source_name; source_url = $benchmarkTemplate.source_url; evidence_date = '2026-07-14'; evidence_status = 'verified-public'; component_type = 'bead'
        item_name = $card.name; size_mm = $card.size_mm; unit_type = 'single-bead'; visible_price = $card.price_cny; currency = 'CNY'; normalized_price = $card.price_cny
        normalization_method = 'same-as-visible-per-bead'; notes = "$noteBase$($(if ($card.sold_out_visible) { ' Sold-out label visible; public price retained.' } else { '' }))"
    }
}

@($sourceExisting) + @($newSourceRows) | Export-Csv -LiteralPath $sourcePath -NoTypeInformation -Encoding utf8
@($aggregateExisting) + @($newAggregateRows) | Export-Csv -LiteralPath $aggregatePath -NoTypeInformation -Encoding utf8
@($benchmarkExisting) + @($newBenchmarkRows) | Export-Csv -LiteralPath $benchmarkPath -NoTypeInformation -Encoding utf8
