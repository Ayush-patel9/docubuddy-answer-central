# Requirements Documentation

## 📦 Available Requirements Files

This project provides multiple requirements files for different use cases:

### 🎯 **requirements.txt** (RECOMMENDED)
**Complete dependency list with all packages and exact versions**
- ✅ **128 packages** - Everything needed for full functionality
- ✅ **Version pinned** - Guaranteed compatibility
- ✅ **Zero missing libraries** - No import errors
- ✅ **Production ready** - Includes all optional dependencies

```bash
pip install -r requirements.txt
```

### 🚀 **requirements-minimal.txt**
**Essential packages only for basic functionality**
- ⚡ **16 packages** - Lightweight installation
- ⚡ **Core features only** - Document processing and chat
- ⚠️ **May need additional packages** - Some features might require extra installs

```bash
pip install -r requirements-minimal.txt
```

### 🏭 **requirements-prod.txt**
**Production-optimized with performance packages**
- 🔒 **Security focused** - Latest security patches
- 🚀 **Performance optimized** - Includes gunicorn and optimized JSON
- 🏗️ **Production grade** - Ready for deployment

```bash
pip install -r requirements-prod.txt
```

### 🛠️ **requirements-dev.txt**
**Development tools and testing frameworks**
- 🧪 **Testing tools** - pytest, coverage, mocking
- 🎨 **Code quality** - black, flake8, mypy
- 📊 **Profiling** - memory and performance profilers
- 📚 **Documentation** - Sphinx and themes

```bash
pip install -r requirements-dev.txt
```

## 🔧 Installation Methods

### Method 1: Automated Installation (RECOMMENDED)

**Windows:**
```cmd
install.bat
```

**Linux/Mac:**
```bash
bash install.sh
```

### Method 2: Manual Installation

1. **Create virtual environment:**
```bash
python -m venv venv
```

2. **Activate virtual environment:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install requirements:**
```bash
pip install -r requirements.txt
```

## 🏗️ Package Categories

### **Core Framework (6 packages)**
- FastAPI, Uvicorn, Pydantic for web API

### **Google APIs (9 packages)**
- Google Drive, Authentication, AI services

### **LangChain (6 packages)**
- Document processing, AI chains, embeddings

### **Document Processing (15 packages)**
- PDF, Excel, HTML, XML, text processing

### **Vector Database (2 packages)**
- FAISS for similarity search and embeddings

### **HTTP & Networking (11 packages)**
- Modern HTTP clients and server components

### **Utilities & Support (79 packages)**
- JSON, async, crypto, monitoring, and more

## 🧪 Verification

**Check installation:**
```bash
pip check
```

**Test imports:**
```bash
python -c "import main; print('✅ Backend imports successfully')"
```

**List installed packages:**
```bash
pip list
```

## 🔍 Troubleshooting

### Common Issues:

**Import Errors:**
```bash
pip install -r requirements.txt --force-reinstall
```

**Dependency Conflicts:**
```bash
pip check
pip install --upgrade pip
```

**Missing Visual C++ (Windows):**
- Install Microsoft C++ Build Tools
- Or use pre-compiled wheels

**Memory Issues:**
```bash
# Use minimal version
pip install -r requirements-minimal.txt
# Then add packages as needed
```

## 📋 Requirements Summary

| File | Packages | Use Case | Install Time |
|------|----------|----------|--------------|
| `requirements.txt` | 128 | Full functionality | ~5-10 min |
| `requirements-minimal.txt` | 16 | Basic features | ~1-2 min |
| `requirements-prod.txt` | 45 | Production deploy | ~3-5 min |
| `requirements-dev.txt` | 150+ | Development | ~10-15 min |

## 🚀 Quick Start

For immediate setup with zero configuration:

```bash
# Clone and setup
git clone <repository>
cd docubuddy-answer-central

# Install everything (Windows)
install.bat

# Install everything (Linux/Mac)
bash install.sh

# Start the application
python main.py
```

**That's it! 🎉 Your environment is ready with all dependencies installed.**
