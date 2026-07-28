param(
    [string]$Version = '0.1.35'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Split-Path -Parent $root
$plugin = Join-Path $project 'plugin'
$build = Join-Path $project 'build'
$topLevel = 'earthward-t17-bracelet-builder'
$output = Join-Path $build "earthward-t17-bracelet-builder-$Version.zip"
$legacy3dFiles = @(
    'crystal-bracelet-builder-deploy.html',
    'crystal-bracelet-builder-preview.html',
    'crystal-bracelet-builder-wp-fragment.html',
    'generate-deploy.js',
    'generate.js',
    'prototype.html',
    'vendor\OrbitControls.js',
    'vendor\three.module.min.js'
) | ForEach-Object { Join-Path $build $_ } | Where-Object { Test-Path -LiteralPath $_ }

if ($legacy3dFiles) {
    throw "Legacy 3D artifacts must be manually removed before creating a T17 candidate ZIP:`n$($legacy3dFiles -join "`n")"
}

$legacyPluginFiles = @(
    'assets\css\t17-builder.css',
    'assets\js\t17-builder.js',
    'assets\js\three.module.min.js',
    'assets\js\OrbitControls.js',
    'vendor\three.module.min.js',
    'vendor\OrbitControls.js'
) | ForEach-Object { Join-Path $plugin $_ } | Where-Object { Test-Path -LiteralPath $_ }

if ($legacyPluginFiles) {
    throw "Plugin source still contains legacy frontend artifacts:`n$($legacyPluginFiles -join "`n")"
}

if (Test-Path -LiteralPath $output) {
    throw "Candidate already exists and will not be overwritten: $output"
}

$bootstrap = Get-Content -LiteralPath (Join-Path $plugin 't17-bracelet-builder.php') -Raw
if ($bootstrap -notmatch [regex]::Escape("define('EW_T17_VERSION', '$Version')")) {
    throw "Plugin version does not match requested candidate version $Version"
}

& (Join-Path $root 'validate-backend-material-loop.ps1')
& (Join-Path $project 'data\v3\validate-v3-data-contract.ps1')
& (Join-Path $project 'data\v3\preflight-approved-production-import.ps1')
& (Join-Path $project 'frontend\validate-frontend-bundle.ps1')

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$files = @(
    't17-bracelet-builder.php',
    'includes\class-ew-t17-install.php',
    'includes\class-ew-t17-catalog.php',
    'includes\class-ew-t17-commerce.php',
    'includes\class-ew-t17-updates.php',
    'includes\class-ew-t17-frontend.php',
    'assets\catalog-template.csv',
    'assets\catalog-labels-template.csv',
    'assets\css\t17-builder-ui.css',
    'assets\js\t17-builder-ui.js',
    'assets\images\tray-default.png',
    'assets\images\tray-celadon-alpha.png',
    'assets\images\tray-blue-alpha.png',
    'assets\images\tray-ice-alpha.png',
    'assets\images\tray-walnut-alpha.png',
    'assets\images\tutorial-add-materials-dev.png',
    'assets\images\tutorial-size-dev.png',
    'assets\images\tutorial-drag-dev.png',
    'assets\images\tutorial-remove-dev.png',
    'assets\partials\t17-builder-fragment.php',
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
        "$topLevel/includes/class-ew-t17-frontend.php",
        "$topLevel/assets/css/t17-builder-ui.css",
        "$topLevel/assets/js/t17-builder-ui.js",
        "$topLevel/assets/images/tray-celadon-alpha.png",
        "$topLevel/assets/images/tray-blue-alpha.png",
        "$topLevel/assets/images/tray-ice-alpha.png",
        "$topLevel/assets/images/tray-walnut-alpha.png",
        "$topLevel/assets/images/tutorial-add-materials-dev.png",
        "$topLevel/assets/images/tutorial-size-dev.png",
        "$topLevel/assets/images/tutorial-drag-dev.png",
        "$topLevel/assets/images/tutorial-remove-dev.png",
        "$topLevel/assets/partials/t17-builder-fragment.php",
        "$topLevel/assets/catalog-template.csv",
        "$topLevel/assets/catalog-labels-template.csv"
    )) {
        if ($entryNames -notcontains $required) { throw "Candidate ZIP is missing $required" }
    }
    foreach ($forbidden in @('assets/css/t17-builder.css', 'assets/js/t17-builder.js', 'three.module', 'OrbitControls')) {
        if (@($entryNames | Where-Object { $_ -like "*$forbidden*" }).Count -gt 0) { throw "Candidate ZIP contains legacy frontend artifact: $forbidden" }
    }
} finally {
    $entries.Dispose()
}

Write-Output "PASS: candidate ZIP created: $output"
Write-Output 'PASS: candidate contains the v3 2D frontend and no legacy 3D assets.'
