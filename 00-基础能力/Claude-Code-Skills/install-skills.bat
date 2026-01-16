@echo off
REM ========================================
REM Claude Code Skills 一键安装脚本
REM ========================================

echo.
echo ========================================
echo Claude Code Skills 安装向导
echo ========================================
echo.

REM 检查Claude Code Skills目录是否存在
set "SOURCE_DIR=%~dp0"
set "TARGET_DIR=%USERPROFILE%\.claude\skills"

echo [1/3] 检查源目录...
if not exist "%SOURCE_DIR%" (
    echo ❌ 错误: 找不到Skills源目录
    echo    路径: %SOURCE_DIR%
    pause
    exit /b 1
)
echo ✅ 源目录: %SOURCE_DIR%
echo.

echo [2/3] 检查目标目录...
if not exist "%TARGET_DIR%" (
    echo ⚠️  目标目录不存在，将创建: %TARGET_DIR%
    mkdir "%TARGET_DIR%"
) else (
    echo ✅ 目标目录: %TARGET_DIR%
)
echo.

echo [3/3] 复制Skills文件...
echo 正在复制，请稍候...
xcopy "%SOURCE_DIR%" "%TARGET_DIR%" /E /I /Y /EXCLUDE:%SOURCE_DIR%\.exclude

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ 安装成功！
    echo ========================================
    echo.
    echo 已安装的Skills:
    echo   - market-analysis (市场分析)
    echo   - content-strategy (内容策略)
    echo   - blog-production (博客内容生产)
    echo   - social-production (社媒内容生产)
    echo   - marketing-master (主控Skill)
    echo.
    echo 下一步:
    echo   1. 重启Claude Code
    echo   2. 输入: "检查已安装的Skills列表"
    echo   3. 开始使用!
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ 安装失败
    echo ========================================
    echo.
    echo 请检查:
    echo   1. Claude Code是否已安装
    echo   2. 目标目录权限: %TARGET_DIR%
    echo   3. 源目录是否完整: %SOURCE_DIR%
    echo.
)

pause
