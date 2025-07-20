@echo off
REM ============================================================================
REM DocuBuddy Answer Central - Windows Installation Script
REM ============================================================================
REM Automated setup script for Windows
REM Run with: install.bat
REM ============================================================================

echo 🚀 DocuBuddy Answer Central - Installation Starting...
echo ============================================================

REM Check Python version
echo 📋 Checking Python version...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set python_version=%%i
echo ✅ Python %python_version% found

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 🔧 Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip
echo ✅ Pip upgraded

REM Install requirements
echo 📦 Installing Python dependencies...
echo    Installing main requirements...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install requirements
    pause
    exit /b 1
)
echo ✅ Main requirements installed

REM Verify installation
echo 🔍 Verifying installation...
pip check
if errorlevel 1 (
    echo ⚠️ Some dependency issues found, but installation may still work
) else (
    echo ✅ No dependency conflicts found
)

REM Install Node.js dependencies
where npm >nul 2>&1
if errorlevel 1 (
    echo ⚠️ npm not found. Please install Node.js manually and run 'npm install'
) else (
    echo 📦 Installing Node.js dependencies...
    npm install
    if errorlevel 1 (
        echo ⚠️ npm install failed, but Python backend should still work
    ) else (
        echo ✅ Node.js dependencies installed
    )
)

REM Check for environment file
if not exist ".env" (
    echo ⚠️ .env file not found. Please create one based on .env.example
    if exist ".env.example" (
        echo 📋 Example .env file exists. You can copy it:
        echo    copy .env.example .env
    )
) else (
    echo ✅ .env file found
)

echo.
echo ============================================================
echo 🎉 Installation completed successfully!
echo ============================================================
echo.
echo 📝 Next steps:
echo 1. Configure your .env file with API keys
echo 2. Start the Python backend: python main.py
echo 3. Start the frontend: npm run dev
echo 4. Visit http://localhost:8081
echo.
echo 💡 Useful commands:
echo    - Test backend: python -c "import main; print('Backend imports OK')"
echo    - Check dependencies: pip check
echo    - Update packages: pip install -r requirements.txt --upgrade
echo.
echo 🔧 Troubleshooting:
echo    - If you get import errors, try: pip install -r requirements.txt --force-reinstall
echo    - For development tools: pip install -r requirements-dev.txt
echo    - For production: pip install -r requirements-prod.txt
echo    - For minimal install: pip install -r requirements-minimal.txt
echo.
pause
