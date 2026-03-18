#!/bin/bash

# ServerMonitor Installation Script
# This script automates the installation and configuration

set -e

echo "========================================"
echo "ServerMonitor Installation Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   exit 1
fi

INSTALL_DIR="/home/falyrass/htdocs/homeservermonitor"

echo -e "${YELLOW}Step 1: Setting up directory permissions...${NC}"
chmod -R 755 "$INSTALL_DIR"
chmod -R 755 "$INSTALL_DIR/data"
chmod -R 755 "$INSTALL_DIR/logs"
echo -e "${GREEN}✓ Permissions set${NC}"

echo ""
echo -e "${YELLOW}Step 2: Checking PHP installation...${NC}"
if ! command -v php &> /dev/null; then
    echo -e "${RED}PHP is not installed${NC}"
    echo "Install PHP with: sudo apt-get install php php-cli"
    exit 1
fi

PHP_VERSION=$(php -v | head -n 1 | grep -oP 'PHP \K[^-]+')
echo -e "${GREEN}✓ PHP $PHP_VERSION found${NC}"

echo ""
echo -e "${YELLOW}Step 3: Creating data and logs directories...${NC}"
mkdir -p "$INSTALL_DIR/data"
mkdir -p "$INSTALL_DIR/logs"
echo -e "${GREEN}✓ Directories created${NC}"

echo ""
echo -e "${YELLOW}Step 4: Configuration${NC}"
echo "Server Host: 100.100.247.48"
echo "Server Port: 3000"
echo "Server User: falyrass"
echo -e "${GREEN}✓ Using default configuration${NC}"

echo ""
echo -e "${YELLOW}Step 5: Verifying installation...${NC}"
if [ -f "$INSTALL_DIR/src/environment.php" ]; then
    echo -e "${GREEN}✓ Configuration file found${NC}"
else
    echo -e "${RED}✗ Configuration file not found${NC}"
    exit 1
fi

if [ -f "$INSTALL_DIR/public/index.html" ]; then
    echo -e "${GREEN}✓ HTML interface found${NC}"
else
    echo -e "${RED}✗ HTML interface not found${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================"
echo "Installation Complete!"
echo "========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Edit configuration: $INSTALL_DIR/src/environment.php"
echo "2. Start development server: php -S 0.0.0.0:8000 -t $INSTALL_DIR/public"
echo "3. Access dashboard: http://localhost:8000"
echo ""
echo "For production setup, see: $INSTALL_DIR/INSTALL.md"
echo ""
