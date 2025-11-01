@echo off
echo ==========================================
echo   Course Data Loader for EduConnect
echo ==========================================
echo.

REM Activate virtual environment if it exists
if exist ".venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call .venv\Scripts\activate.bat
    echo.
)

REM Run the Python loader script
python load_courses.py

echo.
pause
