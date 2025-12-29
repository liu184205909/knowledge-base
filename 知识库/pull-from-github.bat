@echo off
chcp 65001 >nul
echo ====================================
echo  知识库 - 从GitHub拉取最新内容
echo ====================================
echo.

cd /d "%~dp0"

echo [1/3] 检查当前状态...
git status

echo.
echo [2/3] 拉取GitHub最新内容...
git pull origin master

echo.
if %errorlevel% equ 0 (
    echo ✅ 成功！知识库已是最新版本
) else (
    echo ⚠️  拉取失败，请检查网络连接或是否有冲突
)

echo.
echo ====================================
pause
