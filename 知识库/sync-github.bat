@echo off
chcp 65001 >nul
echo ====================================
echo  知识库 - 双向同步（拉取+推送）
echo ====================================
echo.

cd /d "%~dp0"

echo [步骤1] 先从GitHub拉取最新内容...
git pull origin master

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  拉取失败！可能存在冲突
    echo 请解决冲突后再推送
    pause
    exit /b 1
)

echo.
echo [步骤2] 添加本地修改...
git add .

echo.
echo [步骤3] 提交更改...
set /p commit_msg="请输入提交说明（按回车使用默认说明）: "
if "%commit_msg%"=="" set commit_msg=同步更新知识库

git commit -m "%commit_msg%"

echo.
echo [步骤4] 推送到GitHub...
git push origin master

echo.
if %errorlevel% equ 0 (
    echo ✅ 同步完成！本地和GitHub已保持一致
) else (
    echo ⚠️  推送失败，请检查网络连接
)

echo.
echo ====================================
pause
