<#
.SYNOPSIS
    Read-only public acceptance checks for the EarthWard T17 bracelet builder.

.DESCRIPTION
    Sends unauthenticated read-only HTTP requests. It never writes to WordPress,
    uploads data, creates carts, or uses supplied credentials. The only POST is
    /quote: it submits an in-memory recipe and must not create a cart, order, or
    database record. A draft page is normally private, so an unauthenticated
    401/403/404/redirect is reported as a manual-admin verification item.

.EXAMPLE
    .\verify-live-post-upgrade.ps1 -BaseUrl 'https://goearthward.com'

.EXAMPLE
    # Page-only deployment: no plugin release or plugin version change is required.
    .\verify-live-post-upgrade.ps1 -BaseUrl 'https://goearthward.com' `
        -VerificationScope UiDeployment `
        -OfficialPath '/tools/crystal-bracelet-builder/' `
        -RequiredUiMarker 'ew-t17-builder'

.EXAMPLE
    .\verify-live-post-upgrade.ps1 -BaseUrl 'https://staging.example.com' `
        -OfficialPath '/tools/crystal-bracelet-builder/' `
        -DraftPath '/?p=54723&preview=true' `
        -ExpectedPluginVersion '0.1.8' `
        -QuoteVariantKey 'amethyst-8mm'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^https?://')]
    [string]$BaseUrl,

    [string]$OfficialPath = '/tools/crystal-bracelet-builder/',

    [string]$DraftPath = '/?p=54723&preview=true',

    # Backend-only candidates do not expose a public frontend asset or version endpoint.
    # Keep this as an administrator-attestation value, not a public HTTP assertion.
    [ValidatePattern('^$|^\d+\.\d+\.\d+$')]
    [string]$ExpectedPluginVersion = '',

    # UI-only deployments validate page rendering without asserting a plugin release.
    [ValidateSet('UiDeployment', 'PluginMilestone', 'Full')]
    [string]$VerificationScope = 'PluginMilestone',

    [ValidateSet('ew-t17-builder', 'ew-t17-landing', 'ew-t17-official-designs', 'ew-t17-seo')]
    [string]$RequiredUiMarker = 'ew-t17-builder',

    # Optional stable variant key. When omitted, the first public live variant is quoted.
    [string]$QuoteVariantKey = '',

    # This is an explicit manual attestation only. The script never creates a cart or order.
    [switch]$CartMilestoneVerified,

    [string]$CartMilestoneEvidence = '',

    [ValidateRange(5, 120)]
    [int]$TimeoutSeconds = 20
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Windows PowerShell 5.1 does not always preload this assembly.
Add-Type -AssemblyName System.Net.Http -ErrorAction Stop

function Join-T17Url {
    param(
        [Parameter(Mandatory = $true)][string]$Origin,
        [Parameter(Mandatory = $true)][string]$Path
    )

    return ('{0}/{1}' -f $Origin.TrimEnd('/'), $Path.TrimStart('/'))
}

function Invoke-T17Request {
    param(
        [Parameter(Mandatory = $true)][System.Net.Http.HttpClient]$Client,
        [Parameter(Mandatory = $true)][string]$Url,
        [Parameter(Mandatory = $true)][System.Net.Http.HttpMethod]$Method,
        [AllowEmptyString()][string]$JsonBody = ''
    )

    try {
        $request = [System.Net.Http.HttpRequestMessage]::new($Method, $Url)
        if ($JsonBody -ne '') {
            $request.Content = [System.Net.Http.StringContent]::new($JsonBody, [System.Text.Encoding]::UTF8, 'application/json')
        }
        $response = $Client.SendAsync($request).GetAwaiter().GetResult()
        $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        $location = ''

        if ($response.Headers.Location) {
            $location = $response.Headers.Location.OriginalString
        }

        $result = [pscustomobject]@{
            Url         = $Url
            Method      = $Method.Method
            StatusCode  = [int]$response.StatusCode
            IsSuccess   = $response.IsSuccessStatusCode
            ContentType = [string]$response.Content.Headers.ContentType
            Location    = $location
            Body        = $body
            Error       = ''
        }
        $response.Dispose()
        $request.Dispose()
        return $result
    }
    catch {
        return [pscustomobject]@{
            Url         = $Url
            Method      = $Method.Method
            StatusCode  = $null
            IsSuccess   = $false
            ContentType = ''
            Location    = ''
            Body        = ''
            Error       = $_.Exception.Message
        }
    }
}

function Get-T17Response {
    param(
        [Parameter(Mandatory = $true)][System.Net.Http.HttpClient]$Client,
        [Parameter(Mandatory = $true)][string]$Url
    )

    return Invoke-T17Request -Client $Client -Url $Url -Method ([System.Net.Http.HttpMethod]::Get)
}

function Post-T17Json {
    param(
        [Parameter(Mandatory = $true)][System.Net.Http.HttpClient]$Client,
        [Parameter(Mandatory = $true)][string]$Url,
        [Parameter(Mandatory = $true)][string]$JsonBody
    )

    return Invoke-T17Request -Client $Client -Url $Url -Method ([System.Net.Http.HttpMethod]::Post) -JsonBody $JsonBody
}

function Get-JsonObject {
    param(
        [Parameter(Mandatory = $true)][string]$Body,
        [Parameter(Mandatory = $true)][string]$Label
    )

    try {
        return $Body | ConvertFrom-Json
    }
    catch {
        throw "$Label returned invalid JSON: $($_.Exception.Message)"
    }
}

function Test-PropertySet {
    param(
        [Parameter(Mandatory = $true)]$Object,
        [Parameter(Mandatory = $true)][string[]]$Required,
        [Parameter(Mandatory = $true)][string]$Label
    )

    $missing = @($Required | Where-Object { $null -eq $Object.PSObject.Properties[$_] })
    if ($missing.Count -gt 0) {
        throw "$Label is missing required field(s): $($missing -join ', ')."
    }
}

function Test-CatalogSchema {
    param(
        [Parameter(Mandatory = $true)]$Catalog
    )

    Test-PropertySet -Object $Catalog -Required @('schema_version', 'currency', 'materials') -Label 'Catalog response'
    if ($Catalog.schema_version -ne 'ew-t17-v3') {
        throw "Catalog schema_version must be ew-t17-v3; received '$($Catalog.schema_version)'."
    }
    if ([string]$Catalog.currency -notmatch '^[A-Z]{3}$') {
        throw "Catalog currency must be an ISO-style three-letter code; received '$($Catalog.currency)'."
    }
    if ($Catalog.materials -isnot [System.Collections.IEnumerable] -or $Catalog.materials -is [string]) {
        throw 'Catalog materials must be an array.'
    }

    $materialFields = @('id', 'material_key', 'component_type', 'category_slug', 'name_en', 'primary_color', 'color_tags', 'intention_tags', 'image_url', 'variants')
    $variantFields = @('id', 'size_mm', 'shape', 'price', 'weight_g', 'occupied_length_mm', 'display_scale', 'image_url', 'stock_status', 'stock_quantity', 'compatibility', 'orientation_mode', 'mirrored_variant_key', 'allowed_orientations', 'allowed_positions', 'neighbor_constraints', 'sort_order')
    $privateFields = @('internal_name', 'source_name', 'source_url', 'notes', 'created_at', 'updated_at')
    $materialCount = 0
    $variantCount = 0

    foreach ($material in @($Catalog.materials)) {
        $materialCount++
        Test-PropertySet -Object $material -Required $materialFields -Label "Catalog material #$materialCount"
        $leaked = @($privateFields | Where-Object { $null -ne $material.PSObject.Properties[$_] })
        if ($leaked.Count -gt 0) {
            throw "Catalog material #$materialCount leaks private field(s): $($leaked -join ', ')."
        }
        if ($material.variants -isnot [System.Collections.IEnumerable] -or $material.variants -is [string]) {
            throw "Catalog material #$materialCount variants must be an array."
        }
        foreach ($variant in @($material.variants)) {
            $variantCount++
            Test-PropertySet -Object $variant -Required $variantFields -Label "Catalog variant #$variantCount"
        }
    }

    return [pscustomobject]@{ MaterialCount = $materialCount; VariantCount = $variantCount }
}

function Find-QuoteVariantKey {
    param(
        [Parameter(Mandatory = $true)]$Catalog,
        [AllowEmptyString()][string]$RequestedKey
    )

    if ($RequestedKey -ne '') {
        return $RequestedKey
    }
    foreach ($material in @($Catalog.materials)) {
        foreach ($variant in @($material.variants)) {
            if ($null -ne $variant.PSObject.Properties['id'] -and [string]$variant.id -ne '') {
                return [string]$variant.id
            }
        }
    }
    return ''
}

function Test-QuoteResponse {
    param(
        [Parameter(Mandatory = $true)]$Quote,
        [Parameter(Mandatory = $true)][string]$ExpectedVariantKey
    )

    Test-PropertySet -Object $Quote -Required @('currency', 'total', 'weight_g', 'used_length_mm', 'target_length_mm', 'fit_status', 'snapshot', 'price_version') -Label 'Quote response'
    if ([string]$Quote.currency -notmatch '^[A-Z]{3}$') {
        throw "Quote currency must be an ISO-style three-letter code; received '$($Quote.currency)'."
    }
    foreach ($field in @('total', 'weight_g', 'used_length_mm', 'target_length_mm')) {
        if ($Quote.$field -isnot [ValueType]) {
            throw "Quote field '$field' must be numeric."
        }
    }
    if (@($Quote.snapshot).Count -ne 1 -or [string]$Quote.snapshot[0].variant_id -ne $ExpectedVariantKey) {
        throw 'Quote snapshot does not preserve the requested single live variant.'
    }
}

function Write-PageMarkers {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][string]$Html
    )

    $markers = [ordered]@{
        'Builder output (.ew-t17-builder)'              = $Html -match 'class=["''][^"'']*ew-t17-builder(?:\s|["''])'
        'Landing output (.ew-t17-landing)'              = $Html -match 'class=["''][^"'']*ew-t17-landing(?:\s|["''])'
        'Official designs (.ew-t17-official-designs)'   = $Html -match 'class=["''][^"'']*ew-t17-official-designs(?:\s|["''])'
        'SEO output (.ew-t17-seo)'                      = $Html -match 'class=["''][^"'']*ew-t17-seo(?:\s|["''])'
        'Raw T17 shortcode remains in HTML'             = $Html -match '\[\s*ew_t17_[a-z0-9_]+'
    }

    Write-Host "  $Label output signals:"
    foreach ($marker in $markers.GetEnumerator()) {
        $state = if ($marker.Value) { 'yes' } else { 'no' }
        Write-Host ('    {0}: {1}' -f $marker.Key, $state)
    }

    if (-not ($markers.Values -contains $true)) {
        Write-Host '    INFO: No v3 T17 output marker was found. This is expected before the official page is migrated.'
    }
    elseif ($markers['Raw T17 shortcode remains in HTML']) {
        Write-Host '    WARN: A raw T17 shortcode is visible; verify that the page is parsed by WordPress.'
    }

    return $markers
}

$normalizedBaseUrl = $BaseUrl.TrimEnd('/')
$catalogUrl = Join-T17Url -Origin $normalizedBaseUrl -Path '/wp-json/ew-t17/v1/catalog'
$quoteUrl = Join-T17Url -Origin $normalizedBaseUrl -Path '/wp-json/ew-t17/v1/quote'
$officialUrl = Join-T17Url -Origin $normalizedBaseUrl -Path $OfficialPath
$draftUrl = Join-T17Url -Origin $normalizedBaseUrl -Path $DraftPath

$handler = [System.Net.Http.HttpClientHandler]::new()
$handler.AllowAutoRedirect = $false
$client = [System.Net.Http.HttpClient]::new($handler)
$client.Timeout = [TimeSpan]::FromSeconds($TimeoutSeconds)
$hardFailure = $false
$catalogJson = $null
$runUiDeployment = $VerificationScope -in @('UiDeployment', 'Full')
$runPluginMilestones = $VerificationScope -in @('PluginMilestone', 'Full')
$cartMilestonePending = $false

try {
    Write-Host 'T17 hybrid deployment verification'
    Write-Host ('Base URL: {0}' -f $normalizedBaseUrl)
    Write-Host ('Verification scope: {0}' -f $VerificationScope)
    if ($runPluginMilestones) {
        if ($ExpectedPluginVersion) {
            Write-Host ('Expected plugin version (administrator verification): {0}' -f $ExpectedPluginVersion)
        }
        else {
            Write-Host 'Plugin version is verified by an administrator; no public frontend asset is expected from the backend-only plugin.'
        }
    }
    else {
        Write-Host 'UI-only scope: no plugin version assertion, REST call, quote, cart, or order test will run.'
    }
    Write-Host ''

    if ($runPluginMilestones) {
    $catalog = Get-T17Response -Client $client -Url $catalogUrl
    Write-Host ('[Catalog REST] {0}' -f $catalog.Url)
    if ($catalog.Error) {
        Write-Host ('  FAIL: Request error: {0}' -f $catalog.Error)
        $hardFailure = $true
    }
    elseif ($catalog.StatusCode -ne 200) {
        Write-Host ('  FAIL: Expected HTTP 200, received HTTP {0}.' -f $catalog.StatusCode)
        $hardFailure = $true
    }
    else {
        try {
            $catalogJson = Get-JsonObject -Body $catalog.Body -Label 'Catalog REST endpoint'
            $catalogSummary = Test-CatalogSchema -Catalog $catalogJson
            Write-Host ('  PASS: HTTP 200; schema ew-t17-v3; {0} material(s), {1} variant(s).' -f $catalogSummary.MaterialCount, $catalogSummary.VariantCount)
            if ($catalogSummary.MaterialCount -eq 0) {
                Write-Host '  WAITING: Catalog schema is valid but production data has not been imported, so a successful quote cannot run yet.'
            }
        }
        catch {
            Write-Host ('  FAIL: HTTP 200 response is not valid JSON: {0}' -f $_.Exception.Message)
            $hardFailure = $true
        }
    }

    Write-Host ''
    Write-Host ('[Quote REST - rejection contract] {0}' -f $quoteUrl)
    $emptyQuote = Post-T17Json -Client $client -Url $quoteUrl -JsonBody '{"sequence":[]}'
    if ($emptyQuote.Error) {
        Write-Host ('  FAIL: Request error: {0}' -f $emptyQuote.Error)
        $hardFailure = $true
    }
    elseif ($emptyQuote.StatusCode -ne 400) {
        Write-Host ('  FAIL: Empty quote must return HTTP 400, received HTTP {0}.' -f $emptyQuote.StatusCode)
        $hardFailure = $true
    }
    else {
        try {
            $emptyQuoteJson = Get-JsonObject -Body $emptyQuote.Body -Label 'Empty quote response'
            if ([string]$emptyQuoteJson.code -ne 'ew_t17_empty_design') {
                throw "Expected ew_t17_empty_design; received '$($emptyQuoteJson.code)'."
            }
            Write-Host '  PASS: Empty sequence is rejected with HTTP 400 / ew_t17_empty_design.'
        }
        catch {
            Write-Host ('  FAIL: {0}' -f $_.Exception.Message)
            $hardFailure = $true
        }
    }

    if ($null -ne $catalogJson) {
        $candidateVariantKey = Find-QuoteVariantKey -Catalog $catalogJson -RequestedKey $QuoteVariantKey
        Write-Host ''
        Write-Host ('[Quote REST - live variant] {0}' -f $quoteUrl)
        if ($candidateVariantKey -eq '') {
            Write-Host '  WAITING: No live catalog variant is available. The rejection contract passed; import approved data before running a positive quote.'
        }
        else {
            $quotePayload = [ordered]@{
                target_wrist_cm = 16
                fit_preference = 'regular'
                sequence = @([ordered]@{ variant_id = $candidateVariantKey })
            } | ConvertTo-Json -Depth 5 -Compress
            $liveQuote = Post-T17Json -Client $client -Url $quoteUrl -JsonBody $quotePayload
            if ($liveQuote.Error) {
                Write-Host ('  FAIL: Request error: {0}' -f $liveQuote.Error)
                $hardFailure = $true
            }
            elseif ($liveQuote.StatusCode -ne 200) {
                Write-Host ('  FAIL: Live variant {0} must quote with HTTP 200, received HTTP {1}.' -f $candidateVariantKey, $liveQuote.StatusCode)
                $hardFailure = $true
            }
            else {
                try {
                    $liveQuoteJson = Get-JsonObject -Body $liveQuote.Body -Label 'Live quote response'
                    Test-QuoteResponse -Quote $liveQuoteJson -ExpectedVariantKey $candidateVariantKey
                    Write-Host ('  PASS: Live variant {0} returned a complete server quote and one-item snapshot.' -f $candidateVariantKey)
                }
                catch {
                    Write-Host ('  FAIL: {0}' -f $_.Exception.Message)
                    $hardFailure = $true
                }
            }
        }
    }

    Write-Host ''
    Write-Host '[Plugin milestone - authenticated cart and order]'
    if (-not $CartMilestoneVerified) {
        Write-Host '  WAITING: REST and quote checks do not prove the Woo cart/order path. Run the authenticated cart, checkout, order-snapshot, and refund test, then re-run with -CartMilestoneVerified and a concise evidence reference.'
        $cartMilestonePending = $true
    }
    elseif ([string]::IsNullOrWhiteSpace($CartMilestoneEvidence)) {
        Write-Host '  FAIL: -CartMilestoneVerified requires -CartMilestoneEvidence (for example, a test order ID and recorded snapshot location).'
        $hardFailure = $true
    }
    else {
        Write-Host ('  ATTESTED: Cart/order milestone evidence recorded as: {0}' -f $CartMilestoneEvidence)
        Write-Host '  NOTE: This script never creates a cart or order; inspect the recorded Woo test evidence before treating the milestone as complete.'
    }
    }

    if ($runUiDeployment) {
    Write-Host ''
    $official = Get-T17Response -Client $client -Url $officialUrl
    Write-Host ('[UI deployment page] {0}' -f $official.Url)
    if ($official.Error) {
        Write-Host ('  FAIL: Request error: {0}' -f $official.Error)
        $hardFailure = $true
    }
    elseif (-not $official.IsSuccess) {
        Write-Host ('  FAIL: Expected a public 2xx response, received HTTP {0}. Location: {1}' -f $official.StatusCode, $official.Location)
        $hardFailure = $true
    }
    else {
        Write-Host ('  PASS: HTTP {0}; content type: {1}' -f $official.StatusCode, $official.ContentType)
        $officialMarkers = Write-PageMarkers -Label 'UI deployment page' -Html $official.Body
        if (-not $officialMarkers[$RequiredUiMarker]) {
            Write-Host ('  FAIL: Required UI marker .{0} was not rendered on this page.' -f $RequiredUiMarker)
            $hardFailure = $true
        }
        else {
            Write-Host ('  PASS: Required UI marker .{0} is rendered without requiring a plugin version change.' -f $RequiredUiMarker)
        }
    }

    Write-Host ''
    $draft = Get-T17Response -Client $client -Url $draftUrl
    Write-Host ('[Draft preview] {0}' -f $draft.Url)
    if ($draft.Error) {
        Write-Host ('  INFO: Unauthenticated draft request could not be completed: {0}' -f $draft.Error)
        Write-Host '  MANUAL: Sign in as an administrator and open the draft preview to verify its rendered output.'
    }
    elseif ($draft.IsSuccess) {
        Write-Host ('  PASS: HTTP {0}; the draft is publicly reachable.' -f $draft.StatusCode)
        Write-PageMarkers -Label 'Draft preview' -Html $draft.Body
        Write-Host '  MANUAL: Confirm that public accessibility is intentional before publishing.'
    }
    else {
        Write-Host ('  EXPECTED: HTTP {0}; draft is not publicly available without a WordPress login. Location: {1}' -f $draft.StatusCode, $draft.Location)
        Write-Host '  MANUAL: Sign in as an administrator and open the draft preview to verify its rendered output.'
    }
    }

    Write-Host ''
    Write-Host '[Manual administrator verification still required]'
    $manualChecks = @()
    if ($runPluginMilestones) {
        if ($ExpectedPluginVersion) {
            $manualChecks += ('Confirm EarthWard T17 Bracelet Builder shows version {0} and remains active in WordPress Plugins.' -f $ExpectedPluginVersion)
        }
        else {
            $manualChecks += 'Confirm EarthWard T17 Bracelet Builder remains active in WordPress Plugins; public REST verification intentionally does not infer its version.'
        }
        $manualChecks += 'Open T17 Materials: test Media Library selection, create/edit one draft variant, then verify it can be saved.'
        $manualChecks += 'Import a small draft-only CSV batch and verify the catalog, stock state, and duplicate stable-ID behavior.'
        $manualChecks += 'Create one hidden Custom Crystal Bracelet carrier product and test a server-quoted DIY design through cart, checkout, order metadata, and refund.'
        $manualChecks += 'Create one official Woo product with a valid recipe; test direct purchase and Customize loading its full sequence.'
        $manualChecks += 'Do not use plugin release updates for frontend iteration; UI changes remain in the independent frontend module and plugin packages stay milestone-only.'
    }
    if ($runUiDeployment) {
        $manualChecks += 'Inspect mobile 320/375/390/425px and desktop 768/1280/1440px: tray fully visible, no global bead size or 3D entry, no overlap with WoodMart/TranslatePress controls.'
        $manualChecks += 'Confirm the UI deployment changed only the intended page/template data and did not require a plugin upload or plugin version bump.'
    }
    $manualChecks += 'Do not migrate the official page until approved materials, prices, stock, and the required plugin milestones are complete.'
    $manualChecks | ForEach-Object { Write-Host ('  - {0}' -f $_) }

    Write-Host ''
    if ($hardFailure) {
        Write-Host 'RESULT: FAILED public verification. Review the failed endpoint(s) before migration.'
        exit 1
    }

    if ($cartMilestonePending) {
        Write-Host 'RESULT: Plugin REST and quote checks passed, but the authenticated Woo cart/order milestone is still pending. UI deployment is not blocked by this result; production commerce is.'
        exit 2
    }

    if ($VerificationScope -eq 'UiDeployment') {
        Write-Host 'RESULT: UI deployment checks passed. No plugin release, REST, quote, cart, or order milestone was asserted.'
    }
    elseif ($VerificationScope -eq 'PluginMilestone') {
        Write-Host 'RESULT: Plugin runtime, REST, quote, and attested cart/order milestone checks passed. No UI deployment was asserted.'
    }
    else {
        Write-Host 'RESULT: UI deployment and plugin milestone checks passed. Manual production gates above still apply.'
    }
    exit 0
}
finally {
    $client.Dispose()
    $handler.Dispose()
}
