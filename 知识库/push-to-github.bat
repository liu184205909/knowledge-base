@echo off
chcp 65001 > nul
echo ========================================
echo   Push Local Changes to GitHub
echo   推送本地修改到 GitHub
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

echo [1/5] Check current status...
git status
echo.

echo [2/5] Show changes summary...
git diff --stat
echo.

echo [3/5] Add all changes...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to add changes
    pause
    exit /b 1
)
echo Added successfully.
echo.

echo [4/5] Commit changes...
set /p message="Enter commit message (Press Enter for default): "

if "%message%"=="" (
    set "message=update: Update knowledge base"
)

git commit -m "%message%"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Commit failed. Nothing to commit or commit errors.
    pause
    exit /b 1
)
echo Committed successfully.
echo.

echo [5/5] Push to GitHub (origin/main)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Push failed. Please check:
    echo   1. Network connection
    echo   2. GitHub credentials
    echo   3. Branch conflicts
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Successfully pushed to GitHub!
echo   推送成功！
echo ========================================
echo.
echo View your repository:
echo https://github.com/liu184205909/knowledge-base
echo.
pause
