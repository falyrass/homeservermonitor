# Quick Start Guide

## 🚀 Launch Immediately

### Option 1: PHP Built-in Server (Easiest)
```bash
cd /home/falyrass/htdocs/homeservermonitor
php -S 0.0.0.0:8000 -t public
# Open: http://localhost:8000
```

### Option 2: With Specific Port
```bash
# php -S 100.100.247.48:8050 -t public
# Open: http://100.100.247.48:3000
```

## ⚙️ Configuration (1 minute)

Edit `src/environment.php`:
## 📊 What You Get

### Real-time Monitoring
- 📈 CPU usage with live charts
- 💾 Memory/RAM tracking
- 💿 Disk space usage
- 🌡️ System temperature
- ⏱️ Uptime status
- 🔧 Service monitoring
- 📡 Network statistics
- 📋 System logs

### Features
- ✔️ Dark/Light theme
- ✔️ Responsive design (Desktop + Mobile)
- ✔️ Auto-refresh (configurable)
- ✔️ IP-based security
- ✔️ Charts & graphs
- ✔️ Real-time updates (1-2 seconds)

## 🌐 Access Points

| Device | URL |
|--------|-----|
| Local Desktop | http://localhost:8000 |
| Home Network | http://100.100.247.48:8000 |
| Mobile Browser | http://100.100.247.48:8000 |

## 📁 Project Structure

```
homeservermonitor/
├── public/                    # Accessible from web
│   ├── index.html            # Dashboard interface
│   ├── css/                  # Styling (dark theme + responsive)
│   ├── js/                   # JavaScript (app logic, charts, API)
│   └── .htaccess             # Apache configuration
├── api/                      # API endpoints
│   ├── metrics.php          # Get current metrics
│   └── history.php          # Get historical data
├── src/                      # Backend logic
│   ├── environment.php      # Configuration
│   ├── Security.php         # IP filtering
│   └── DataCollector.php    # Data gathering
├── data/                     # Data storage
├── logs/                     # Application logs
├── index.php                # Router
├── package.json             # Project info
├── README.md                # Full documentation
├── INSTALL.md               # Installation guide
├── install.sh               # Auto installer
└── QUICK_START.md          # This file
```

## 🔧 Development

### Test API Endpoints
```bash
# Get all metrics
curl http://localhost:8000/api/metrics.php

# Get CPU only
curl http://localhost:8000/api/metrics.php?action=cpu
```

### Enable Debug Mode
Edit `src/environment.php`:
```php
define('APP_DEBUG', true);  // Shows full error messages
```

## 📱 Mobile Responsiveness

Dashboard automatically adapts to:
- 📱 Phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

Try resizing your browser!

## ⚡ Performance

- Page load: **< 500ms**
- Data update: **< 1s**
- Memory usage: **Very light**
- CPU usage: **Minimal**

## 🔐 Security

Default settings:
- IP filter enabled
- Allowed IPs: 127.0.0.1, 192.168.*, 100.100.247.*
- No authentication required (IP-based)

To allow specific IPs, edit `src/environment.php`:
```php
define('ALLOWED_IPS', array(
    '127.0.0.1',        // localhost
    '192.168.',         // Local network
    '100.100.247',      // Your network
));
```

## 🆘 Common Issues

### "Disconnected" Status
→ Check if IP is in ALLOWED_IPS

### API returns 403 Forbidden
→ Your IP might be blocked. Check:
```bash
echo "Your IP: $(hostname -I)"
# Edit src/environment.php to allow it
```

### No data showing
→ Check PHP error logs:
```bash
tail /var/log/apache2/error.log
# or for built-in server, check console output
```

### Mobile view looks wrong
→ Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

## 📖 Learn More

- Full docs: `README.md`
- Installation guide: `INSTALL.md`
- Source code is well-commented

## 🎉 You're All Set!

Start the server and open your dashboard:

```bash
php -S 0.0.0.0:8000 -t public &
# Open http://localhost:8000 in your browser
```

Enjoy your home server monitoring! 🚀

---

**Version**: 1.0.0  
**Created**: March 16, 2026  
**Author**: falyrass
