param(
    [string]$Version = '0.1.9'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Split-Path -Parent $root
$plugin = Join-Path $project 'plugin'
$build = Join-Path $project 'build'
$topLevel = 'earthward-t17-bracelet-builder'
$output = Join-Path $build "earthward-t17-bracelet-builder-$Version.zip"

if (Test-Path -LiteralPath $output) {
    throw "Candidate already exists and will not be overwritten: $output"
}

$bootstrap = Get-Content -LiteralPath (Join-Path $plugin 't17-bracelet-builder.php') -Raw
if ($bootstrap -notmatch [regex]::Escape("define('EW_T17_VERSION', '$Version')")) {
    throw "Plugin version does not match requested candidate version $Version"
}

& (Join-Path $root 'validate-backend-material-loop.ps1')
& (Join-Path $project 'data\v3\validate-v3-data-contract.ps1')

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$files = @(
    't17-bracelet-builder.php',
    'includes\class-ew-t17-install.php',
    'includes\class-ew-t17-catalog.php',
    'includes\class-ew-t17-commerce.php',
    'includes\class-ew-t17-updates.php',
    'assets\catalog-template.csv',
    'README.md'
)

$archive = [System.IO.Compression.ZipFile]::Open($output, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($relative in $files) {
        $source = Join-Path $plugin $relative
        if (-not (Test-Path -LiteralPath $source)) {
            throw "Required candidate file is missing: $source"
        }
        $entryName = ($topLevel + '/' + ($relative -replace '\\', '/'))
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $source, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally {
    $archive.Dispose()
}

$entries = [System.IO.Compression.ZipFile]::OpenRead($output)
try {
    $entryNames = @($entries.Entries | ForEach-Object FullName)
    foreach ($required in @(
        "$topLevel/t17-bracelet-builder.php",
        "$topLevel/includes/class-ew-t17-install.php",
        "$topLevel/includes/class-ew-t17-catalog.php",
        "$topLevel/includes/class-ew-t17-commerce.php",
        "$topLevel/assets/catalog-template.csv"
    )) {
        if ($entryNames -notcontains $required) { throw "Candidate ZIP is missing $required" }
    }
    foreach ($forbidden in @('class-ew-t17-frontend.php', 'assets/css/t17-builder.css', 'assets/js/t17-builder.js', 'three.module')) {
        if (@($entryNames | Where-Object { $_ -like "*$forbidden*" }).Count -gt 0) { throw "Candidate ZIP contains legacy frontend artifact: $forbidden" }
    }
} finally {
    $entries.Dispose()
}

Write-Output "PASS: candidate ZIP created: $output"
Write-Output 'PASS: candidate contains backend-only plugin files and no legacy frontend assets.'
