# README 自动更新脚本
# 自动更新主 README.md 中的知识库结构表格

$ErrorActionPreference = "Stop"

# 设置工作目录
$workDir = "d:\Program Files (x86)\Project Code\知识库"
Set-Location $workDir

# 定义知识库结构
$knowledgeBase = @{
    "00-CC使用手册" = @{
        Docs = @(
            @{ Name = "01-claude code安装指南.md"; Desc = "插件+MCP安装配置（AI自动执行）" }
            @{ Name = "02-Skills核心概念.md"; Desc = "Skills概念与原理" }
            @{ Name = "03-UI设计自动化.md"; Desc = "aura.build使用指南" }
        )
    }
    "01-AI营销实战" = @{
        Path = "知识库/01-AI营销实战"
        Docs = @(
            @{ Name = "01-前置研究/01-前置研究.md"; Desc = "竞品分析与用户洞察" }
            @{ Name = "02-内容生产/02-内容生产.md"; Desc = "批量内容生产策略" }
            @{ Name = "02-内容生产/Prompt模板库.md"; Desc = "营销专用Prompt" }
            @{ Name = "02-内容生产/社媒自动化.md"; Desc = "社交媒体自动化" }
            @{ Name = "04-智能优化/03-推广优化.md"; Desc = "效果优化策略" }
        )
    }
    "02-AI开发实战" = @{
        Path = "知识库/02-AI开发实战"
        Docs = @(
            @{ Name = "01-产品设计/00-产品前置工作.md"; Desc = "产品规划与需求分析" }
            @{ Name = "02-AI开发流程/feature-dev开发流程.md"; Desc = "功能开发工作流" }
            @{ Name = "02-AI开发流程/Vibe-Coding多AI协作.md"; Desc = "多AI协作模式" }
            @{ Name = "超级个体实践指南.md"; Desc = "超级个体培养方法论" }
            @{ Name = "02-AI开发流程/自动化流水线案例.md"; Desc = "CI/CD自动化案例" }
        )
    }
    "03-GEO前沿探索" = @{
        Path = "知识库/03-GEO前沿探索"
        Docs = @(
            @{ Name = "GEO完全指南.md"; Desc = "AI时代的SEO指南" }
            @{ Name = "GEO知识图谱索引.md"; Desc = "知识体系导航" }
            @{ Name = "GEO增长案例.md"; Desc = "实战增长案例" }
        )
    }
    "04-团队协作" = @{
        Path = "知识库/04-团队协作"
        Docs = @(
            @{ Name = "README.md"; Desc = "团队协作框架" }
        )
    }
}

# 读取主 README.md
$readmePath = "README.md"
$readmeContent = Get-Content $readmePath -Raw -Encoding UTF8

# 构建新的知识库结构表格
$tableLines = @()
$tableLines += "| 目录 | 文档 | 说明 |"
$tableLines += "|------|------|------|"

$totalDocs = 0

foreach ($folder in $knowledgeBase.Keys | Sort-Object) {
    $info = $knowledgeBase[$folder]
    $folderPath = if ($info.Path) { $info.Path } else { "知识库/$folder" }

    $firstDoc = $true
    foreach ($doc in $info.Docs) {
        $totalDocs++

        if ($firstDoc) {
            $tableLines += "| **$folder** | [$($doc.Name)]($folderPath/$($doc.Name)) | $($doc.Desc) |"
            $firstDoc = $false
        } else {
            $tableLines += "| | [$($doc.Name)]($folderPath/$($doc.Name)) | $($doc.Desc) |"
        }
    }
}

# 查找并替换知识库结构表格
$tablePattern = '(?s)(## 📚 知识库结构.*?\n)(.*?)(\n---\s*?\n## 🎓 学习路径)'

$newTable = @"
## 📚 知识库结构

$($tableLines -join "`n")

---

## 🎓 学习路径
"@

if ($readmeContent -match $tablePattern) {
    $readmeContent = $readmeContent -replace $tablePattern, $newTable

    # 更新统计数据
    $statsPattern = '\*\*总计\*\*\s*\|\s*\*\*\d+个\*\*\s*\|\s*\*~[\d,]+行'
    $newStats = "**总计** | **$($totalDocs)个** | **~25,000行，重复内容<5%**"
    $readmeContent = $readmeContent -replace $statsPattern, $newStats

    # 写回文件
    $readmeContent | Out-File -FilePath $readmePath -Encoding UTF8 -NoNewline

    Write-Host "✅ README.md 更新成功！" -ForegroundColor Green
    Write-Host "📊 统计：$totalDocs 个文档" -ForegroundColor Cyan
} else {
    Write-Host "❌ 未找到知识库结构表格，请检查 README.md 格式" -ForegroundColor Red
    exit 1
}

# 提示提交
Write-Host "`n💡 使用以下命令提交更新：" -ForegroundColor Yellow
Write-Host '   git add README.md && git commit -m "docs: 自动同步 README.md 知识库结构" && git push' -ForegroundColor Gray
