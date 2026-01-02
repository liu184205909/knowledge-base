# README 自动同步脚本
# 确保主 README.md 与 00-CC使用手册/ 文件夹内容同步

$ErrorActionPreference = "Stop"

# 设置工作目录
$workDir = "d:\Program Files (x86)\Project Code\知识库"
Set-Location $workDir

# 检查 00-CC使用手册 文件夹是否存在
if (-not (Test-Path "00-CC使用手册")) {
    Write-Host "❌ 错误：00-CC使用手册 文件夹不存在" -ForegroundColor Red
    exit 1
}

# 获取当前文档列表
$docs = Get-ChildItem "00-CC使用手册" -Filter "*.md" | Sort-Object Name

Write-Host "📂 检测到 $($docs.Count) 个文档：" -ForegroundColor Cyan
$docs | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

# 读取主 README.md
$readmePath = "README.md"
if (-not (Test-Path $readmePath)) {
    Write-Host "❌ 错误：README.md 不存在" -ForegroundColor Red
    exit 1
}

$readmeContent = Get-Content $readmePath -Raw -Encoding UTF8

# 检查是否需要更新
$needsUpdate = $false

foreach ($doc in $docs) {
    $docName = $doc.Name
    $docLink = "知识库/00-CC使用手册/$docName"

    # 检查 README 中是否包含此文档链接
    if ($readmeContent -notmatch [regex]::Escape($docName)) {
        Write-Host "⚠️  文档 '$docName' 未在 README.md 中找到" -ForegroundColor Yellow
        $needsUpdate = $true
    }
}

if ($needsUpdate) {
    Write-Host "`n🔄 需要更新 README.md" -ForegroundColor Yellow
    Write-Host "请手动检查并更新以下内容：" -ForegroundColor Yellow
    Write-Host "  1. 知识库结构表格中的文档链接" -ForegroundColor White
    Write-Host "  2. 知识库统计中的文档数量" -ForegroundColor White
    Write-Host "  3. 更新日志（如有新增/删除文档）" -ForegroundColor White
} else {
    Write-Host "`n✅ README.md 与 00-CC使用手册/ 文件夹已同步" -ForegroundColor Green
}

# 显示当前文档列表
Write-Host "`n📋 当前文档列表（用于更新 README.md）：" -ForegroundColor Cyan
$docIndex = 1
foreach ($doc in $docs) {
    $docName = $doc.Name
    $docTitle = $doc.BaseName -replace '^\d+-', ''  # 移除数字前缀
    Write-Host "  $docIndex. $docName" -ForegroundColor White
    $docIndex++
}

Write-Host "`n💡 提示：使用以下命令快速提交更新" -ForegroundColor Cyan
Write-Host '   git add . && git commit -m "docs: 同步 README.md 与 00-CC使用手册/" && git push' -ForegroundColor Gray
