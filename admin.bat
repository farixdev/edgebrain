@echo off
title EdgeBrain Admin Panel
echo.
echo  ============================================
echo   EdgeBrain Studios - Admin Panel
echo  ============================================
echo.
echo  Starting dev server...
echo  Admin panel will open in your browser.
echo.
echo  Login:
echo    Email:    admin@edgebrain.com
echo    Password: edgebrain123@
echo.
echo  After editing, save in the panel, then:
echo    git add -A
echo    git commit -m "Update content"
echo    git push
echo.
echo  Vercel will auto-deploy with your changes.
echo  ============================================
echo.

cd /d "%~dp0"

start "" "http://localhost:3000/admin" 2>nul

npm run dev
