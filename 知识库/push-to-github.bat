@echo off
chcp 65001 >nul
echo ====================================
echo  知识库 - 推送本地更新到GitHub
echo ====================================
echo.

cd /d "%~dp0"

echo [1/4] 检查当前状态...
git status

echo.
echo [2/4] 添加所有修改...
git add .

echo.
echo [3/4] 提交更改...
set /p commit_msg="请输入提交说明（按回车使用默认说明）: "
if "%commit_msg%"=="" set commit_msg=更新知识库内容

git commit -m "%commit_msg%"

echo.
echo [4/4] 推送到GitHub...
git push origin master

echo.
if %errorlevel% equ 0 (
    echo ✅ 成功！内容已推送到GitHub
) else (
    echo ⚠️  推送失败，请检查网络连接
)

echo.
echo ====================================
pause
