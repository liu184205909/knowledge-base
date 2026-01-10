@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 > nul
echo ========================================
echo   Smart Sync Tool
echo   智能同步工具
echo ========================================
echo.
rem Use the directory of this script as the repo root (no hard-coded paths)
set "REPO_DIR=%~dp0"
if "%REPO_DIR:~-1%"=="\" set "REPO_DIR=%REPO_DIR:~0,-1%"
echo Select an option:
echo.
echo [1] Pull from GitHub (Download updates)
echo [2] Push to GitHub (Upload changes)
echo [3] Sync both ways (Pull then Push)
echo [4] View status
echo [5] View recent commits
echo [0] Exit
echo.

set /p choice="Enter your choice (0-5): "

if "%choice%"=="1" goto pull
if "%choice%"=="2" goto push
if "%choice%"=="3" goto sync
if "%choice%"=="4" goto status
if "%choice%"=="5" goto log
if "%choice%"=="0" goto end
goto invalid

:pull
cls
echo ========================================
echo   Pull from GitHub
echo ========================================
echo.
cd /d "%REPO_DIR%"

echo [Step 1] Checking local changes...
set "HAS_CHANGES="
for /f "delims=" %%A in ('git status --porcelain') do (
    set "HAS_CHANGES=1"
    goto pull_has_changes
)
:pull_has_changes
if defined HAS_CHANGES (
    echo.
    echo [WARNING] You have uncommitted local changes!
    echo.
    echo Choose:
    echo [1] Commit changes first
    echo [2] Stash changes temporarily
    echo [3] Discard local changes (DANGER!)
    echo [0] Cancel
    echo.
    set /p action="Enter choice: "

    if "%action%"=="1" (
        goto commit
    ) else if "%action%"=="2" (
        git stash
        echo Changes stashed.
    ) else if "%action%"=="3" (
        git reset --hard HEAD
        echo Local changes discarded.
    ) else (
        echo Operation cancelled.
        goto end
    )
)

echo.
echo [Step 2] Pulling from GitHub...
git pull origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Sync completed!
) else (
    echo.
    echo [ERROR] Sync failed. Please check the errors above.
)
goto end

:push
cls
echo ========================================
echo   Push to GitHub
echo ========================================
echo.
cd /d "%REPO_DIR%"

echo [Step 1] Checking status...
set "HAS_CHANGES="
for /f "delims=" %%A in ('git status --porcelain') do (
    set "HAS_CHANGES=1"
    goto push_has_changes
)
:push_has_changes
if not defined HAS_CHANGES (
    echo.
    echo [WARNING] No changes to push!
    pause
    goto end
)

echo.
echo [Step 2] Reviewing changes...
git diff --stat
echo.

set /p confirm="Continue to push? (y/n): "
if /i not "%confirm%"=="y" (
    echo Operation cancelled.
    goto end
)

echo.
echo [Step 3] Adding all changes...
git add .

echo.
echo [Step 4] Committing changes...
set /p message="Enter commit message: "
if "%message%"=="" set "message=update: Update knowledge base"

git commit -m "%message%"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Commit failed!
    pause
    goto end
)

echo.
echo [Step 5] Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Push completed!
) else (
    echo.
    echo [ERROR] Push failed. Please check:
    echo   - Network connection
    echo   - GitHub credentials
    echo   - Branch conflicts
)
goto end

:sync
cls
echo ========================================
echo   Two-way Sync
echo ========================================
echo.
cd /d "%REPO_DIR%"

echo [Step 1] Pull from GitHub...
git pull origin main

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Pull failed!
    pause
    goto end
)

echo.
echo [Step 2] Check for local changes...
set "HAS_CHANGES="
for /f "delims=" %%A in ('git status --porcelain') do (
    set "HAS_CHANGES=1"
    goto sync_has_changes
)
:sync_has_changes
if not defined HAS_CHANGES (
    echo No local changes to push.
    echo.
    echo [SUCCESS] Sync completed (Pull only)!
    pause
    goto end
)

echo.
echo Local changes detected. Pushing to GitHub...
git add .

set /p message="Enter commit message: "
if "%message%"=="" set "message=update: Update knowledge base"

git commit -m "%message%"
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Two-way sync completed!
) else (
    echo.
    echo [ERROR] Push failed!
)
goto end

:commit
cls
echo ========================================
echo   Quick Commit
echo ========================================
echo.
cd /d "%REPO_DIR%"

git add .
set /p message="Enter commit message: "
git commit -m "%message%"
goto pull

:status
cls
echo ========================================
echo   Repository Status
echo ========================================
echo.
cd /d "%REPO_DIR%"

echo [Current Branch]
git branch --show-current
echo.

echo [Remote URL]
git remote get-url origin
echo.

echo [Local Changes]
git status --short
echo.

echo [Recent Commits]
git log --oneline -5
echo.
pause
goto end

:log
cls
echo ========================================
echo   Recent Commits
echo ========================================
echo.
cd /d "%REPO_DIR%"

git log --oneline --graph --all -10
echo.
pause
goto end

:invalid
cls
echo.
echo [ERROR] Invalid choice. Please enter 0-5.
pause
goto end

:end
echo.
echo Press any key to exit...
pause > nul
