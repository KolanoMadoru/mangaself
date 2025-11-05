#!/bin/bash

# Deploy Check Script untuk MangaSelf
# Script untuk memvalidasi konfigurasi sebelum deploy ke Netlify

echo "🔍 MangaSelf - Netlify Deploy Check"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check node_modules
echo "1. Checking dependencies..."
if [ -d "node_modules" ]; then
    check "node_modules folder exists"
else
    echo -e "${RED}✗${NC} node_modules not found. Run: npm install"
    exit 1
fi

# 2. Check required files
echo ""
echo "2. Checking configuration files..."
[ -f "netlify.toml" ] && check "netlify.toml exists" || exit 1
[ -f "package.json" ] && check "package.json exists" || exit 1
[ -f "vite.config.js" ] && check "vite.config.js exists" || exit 1
[ -f "public/_redirects" ] && check "public/_redirects exists" || warn "public/_redirects not found"
[ -f "public/_headers" ] && check "public/_headers exists" || warn "public/_headers not found"

# 3. Check environment variables
echo ""
echo "3. Checking environment setup..."
if [ -f ".env.example" ]; then
    check ".env.example exists (template ready)"
else
    warn ".env.example not found"
fi

if [ -f ".env" ]; then
    warn ".env exists (don't commit this!)"
    
    # Check if .env is in .gitignore
    if grep -q "^\.env$" .gitignore 2>/dev/null; then
        check ".env is in .gitignore"
    else
        echo -e "${RED}✗${NC} .env NOT in .gitignore! Add it now!"
    fi
else
    check "No .env file (good for deployment)"
fi

# 4. Test build
echo ""
echo "4. Testing build process..."
echo "   Running: npm run build"
npm run build > /dev/null 2>&1
if check "Build successful"; then
    # Check dist folder
    [ -d "dist" ] && check "dist folder created" || exit 1
    [ -f "dist/index.html" ] && check "dist/index.html exists" || exit 1
    [ -d "dist/assets" ] && check "dist/assets folder exists" || exit 1
    
    # Check if _redirects copied
    if [ -f "dist/_redirects" ]; then
        check "dist/_redirects copied"
    else
        warn "dist/_redirects not found (might affect routing)"
    fi
    
    # Check if _headers copied
    if [ -f "dist/_headers" ]; then
        check "dist/_headers copied"
    else
        warn "dist/_headers not found (missing security headers)"
    fi
else
    echo -e "${RED}Build failed! Check errors above.${NC}"
    exit 1
fi

# 5. Check package.json scripts
echo ""
echo "5. Checking package.json scripts..."
if grep -q '"build".*"vite build"' package.json; then
    check "Build script configured"
else
    echo -e "${RED}✗${NC} Build script not found or incorrect"
    exit 1
fi

# 6. Check .gitignore
echo ""
echo "6. Checking .gitignore..."
if [ -f ".gitignore" ]; then
    check ".gitignore exists"
    grep -q "node_modules" .gitignore && check "node_modules in .gitignore" || warn "Add node_modules to .gitignore"
    grep -q "dist" .gitignore && check "dist in .gitignore" || warn "Add dist to .gitignore"
    grep -q "\.env" .gitignore && check ".env in .gitignore" || warn "Add .env to .gitignore"
else
    echo -e "${RED}✗${NC} .gitignore not found!"
    exit 1
fi

# 7. Check netlify.toml configuration
echo ""
echo "7. Validating netlify.toml..."
if grep -q 'publish.*=.*"dist"' netlify.toml; then
    check "Publish directory set to 'dist'"
else
    echo -e "${RED}✗${NC} Publish directory not set correctly"
    exit 1
fi

if grep -q 'command.*=.*"npm run build"' netlify.toml; then
    check "Build command set correctly"
else
    echo -e "${RED}✗${NC} Build command not set correctly"
    exit 1
fi

# 8. Summary
echo ""
echo "=================================="
echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""
echo "📦 Build size:"
du -sh dist 2>/dev/null || echo "   (run build first)"
echo ""
echo "🚀 Ready to deploy to Netlify!"
echo ""
echo "Next steps:"
echo "  1. Push to GitHub: git push origin main"
echo "  2. Connect repo to Netlify"
echo "  3. Set environment variables:"
echo "     - VITE_SUPABASE_URL"
echo "     - VITE_SUPABASE_ANON_KEY"
echo "  4. Deploy!"
echo ""
echo "Or use Netlify CLI:"
echo "  netlify deploy --prod"
echo ""
