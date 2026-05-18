@echo off
chcp 65001 >nul
echo ========================================
echo Git Auto Commit
echo ========================================
echo.

git status >nul 2>&1
if %errorlevel% neq 0 (
    echo [Error] Not a Git repository!
    pause
    exit /b 1
)

echo [1/3] Checking status...
git status --short
echo.

echo [2/3] Adding files...
git add .
if %errorlevel% neq 0 (
    echo [Error] git add failed!
    pause
    exit /b 1
)

git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [Info] No changes to commit.
    pause
    exit /b 0
)

echo [3/3] Committing...
set /p commit_msg=Enter commit message: 
if "%commit_msg%"=="" (
    echo [Error] Commit message cannot be empty!
    pause
    exit /b 1
)

git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo [Error] git commit failed!
    pause
    exit /b 1
)

echo.
echo Pushing to remote...
git push
if %errorlevel% neq 0 (
    echo [Warn] First push failed, retrying...
    timeout /t 3 /nobreak >nul
    git push
    if %errorlevel% neq 0 (
        echo [Error] Push failed!
    ) else (
        echo [Success] Push completed!
    )
) else (
    echo [Success] Push completed!
)

echo.
echo ========================================
echo Done!
echo ========================================
pause
