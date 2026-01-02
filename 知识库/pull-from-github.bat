@echo off
chcp 65001 > nul
echo ========================================
echo   From GitHub Pull Latest Updates
echo   从 GitHub 拉取最新更新
echo ========================================
echo.

cd /d "d:\Program Files (x86)\Project Code\知识库"

if not exist ".git" (
    echo [ERROR] Not a Git repository
    echo.
    echo Please run in the knowledge base directory.
    echo.
    pause
    exit /b 1
)

echo [1/3] Current branch:
git branch --show-current
echo.

echo [2/3] Fetching from origin/main...
git fetch origin main
echo.

echo [3/3] Pulling latest updates...
git pull origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   Successfully synced from GitHub!
    echo   同步完成！
    echo ========================================
) else (
    echo ========================================
    echo   Sync failed. Please check errors above.
    echo   同步失败，请检查上面的错误信息
    echo ========================================
)

echo.
pause
