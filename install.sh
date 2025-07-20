#!/bin/bash
# ============================================================================
# DocuBuddy Answer Central - Installation Script
# ============================================================================
# Automated setup script for the entire project
# Run with: bash install.sh
# ============================================================================

set -e  # Exit on any error

echo "🚀 DocuBuddy Answer Central - Installation Starting..."
echo "============================================================"

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python --version 2>&1 | cut -d" " -f2 | cut -d"." -f1,2)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ Python $python_version is compatible (minimum: $required_version)"
else
    echo "❌ Python $python_version is not compatible. Please install Python $required_version or higher."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi
echo "✅ Virtual environment activated"

# Upgrade pip
echo "⬆️ Upgrading pip..."
python -m pip install --upgrade pip
echo "✅ Pip upgraded"

# Install requirements
echo "📦 Installing Python dependencies..."
echo "   Installing main requirements..."
pip install -r requirements.txt
echo "✅ Main requirements installed"

# Verify installation
echo "🔍 Verifying installation..."
pip check
echo "✅ No dependency conflicts found"

# Install Node.js dependencies
if command -v npm &> /dev/null; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    echo "✅ Node.js dependencies installed"
else
    echo "⚠️ npm not found. Please install Node.js manually and run 'npm install'"
fi

# Check for environment file
if [ ! -f ".env" ]; then
    echo "⚠️ .env file not found. Please create one based on .env.example"
    if [ -f ".env.example" ]; then
        echo "📋 Example .env file exists. You can copy it:"
        echo "   cp .env.example .env"
    fi
else
    echo "✅ .env file found"
fi

echo ""
echo "============================================================"
echo "🎉 Installation completed successfully!"
echo "============================================================"
echo ""
echo "📝 Next steps:"
echo "1. Configure your .env file with API keys"
echo "2. Start the Python backend: python main.py"
echo "3. Start the frontend: npm run dev"
echo "4. Visit http://localhost:8081"
echo ""
echo "💡 Useful commands:"
echo "   - Test backend: python -c 'import main; print(\"Backend imports OK\")'"
echo "   - Check dependencies: pip check"
echo "   - Update packages: pip install -r requirements.txt --upgrade"
echo ""
echo "🔧 Troubleshooting:"
echo "   - If you get import errors, try: pip install -r requirements.txt --force-reinstall"
echo "   - For development tools: pip install -r requirements-dev.txt"
echo "   - For production: pip install -r requirements-prod.txt"
echo "   - For minimal install: pip install -r requirements-minimal.txt"
echo ""
