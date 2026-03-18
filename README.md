# ServerMonitor - Home Server Dashboard

## Installation

1. Place the project in your web root (e.g., `/var/www/html/homeservermonitor`)
2. Ensure PHP 7.4+ is installed
3. Give write permissions to the `data/` and `logs/` directories:
   ```bash
   chmod 755 src/
   chmod 755 api/
   chmod 755 public/
   chmod 755 data/
   chmod 755 logs/
   ```

## Configuration

Edit `src/environment.php` to configure:
- **SERVER_HOST**: Your server IP address (100.100.247.48)
- **SERVER_PORT**: Server port (3000)
- **SERVER_USER**: Server username (falyrass)
- **ALLOWED_IPS**: IPs allowed to access the dashboard
- **ENABLE_IP_FILTER**: Enable/disable IP filtering
- **REFRESH_INTERVAL**: Data refresh interval (milliseconds)

## Project Structure

```
homeservermonitor/
├── public/
│   ├── index.html          # Main HTML file
│   ├── .htaccess           # Apache configuration
│   ├── css/
│   │   ├── styles.css      # Main styles
│   │   ├── dark-theme.css  # Theme styles
│   │   └── responsive.css  # Responsive design
│   └── js/
│       ├── app.js          # Main application logic
│       ├── api.js          # API integration
│       └── charts.js       # Chart.js integration
├── api/
│   ├── metrics.php         # Metrics endpoint
│   └── history.php         # History data endpoint
├── src/
│   ├── environment.php     # Configuration file
│   ├── Security.php        # Security and IP filtering
│   └── DataCollector.php   # System data collection
├── data/                   # Data storage
├── logs/                   # Application logs
└── README.md              # This file
```

## Features

### Dashboard Overview
- **CPU Usage**: Real-time CPU usage with percentage and progress bar
- **Memory**: RAM usage, total, used, and free memory
- **Disk Space**: Storage usage with percentage
- **Temperature**: System temperature if available
- **Uptime**: Server uptime display
- **Services**: Monitor running system services
- **System Logs**: View latest system logs
- **Network**: Network interface statistics

### Advanced Features
- **Real-time Charts**: Line and donut charts for visualization
- **Time-series Data**: Historical data tracking (last 60 points)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between dark and light themes
- **IP-based Security**: Access control by IP address
- **Auto-refresh**: Automatic data updates (configurable)
- **Multiple Views**: Dashboard, detailed CPU, Memory, Disk, Network, Services, and Logs sections

## Usage

1. Access the dashboard at: `http://your-server-ip/homeservermonitor/public/`
2. The dashboard auto-refreshes every 2 seconds (configurable in Settings)
3. Click the settings icon to adjust refresh interval and enable/disable features
4. Use the sidebar navigation to view detailed metrics for each component
5. Toggle theme with the moon icon in the header

## API Endpoints

### Get All Metrics
```
GET /api/metrics.php?action=all
```

### Get Specific Metric
```
GET /api/metrics.php?action=cpu
GET /api/metrics.php?action=memory
GET /api/metrics.php?action=disk
```

### Get Historical Data
```
GET /api/history.php?metric=cpu&limit=60
```

## Performance

- Lightweight: ~150KB of CSS/JS combined
- Efficient data collection using system commands
- Minimal server load
- Charts update without full page reload
- Progressive enhancement

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

1. **IP Filtering**: Enable IP filtering in `environment.php` for better security
2. **HTTPS**: Use HTTPS in production environments
3. **User Authentication**: Consider adding basic authentication for multi-user access
4. **Data Limit**: Metrics are stored in memory, not persisted by default

## Troubleshooting

### Dashboard shows "Disconnected"
- Check if the API endpoints are accessible
- Verify IP is in the allowed list (check `src/environment.php`)
- Ensure `/api/*.php` files are accessible

### Charts not displaying
- Verify Chart.js is loaded (check browser console)
- Enable charts in Settings
- Check browser console for JavaScript errors

### Permission errors
- Ensure `data/` and `logs/` directories are writable:
  ```bash
  chmod 755 data/ logs/
  ```

### High CPU usage
- Reduce refresh interval in Settings
- Disable unused features in Settings
- Check system with external tools (top, htop)

## Advanced Customization

### Add Custom Metrics
Edit `DataCollector.php` and add new methods:
```php
public static function getCustomMetric() {
    // Your custom logic
    return $data;
}
```

### Add Custom Charts
Edit `charts.js` and add new Chart instances using Chart.js documentation.

### Modify Theme Colors
Edit `dark-theme.css` and `responsive.css` to change primary colors:
```css
--primary: #89b4fa;      /* Primary blue */
--secondary: #f38ba8;    /* Secondary pink */
--success: #a6e3a1;      /* Success green */
```

## License

This project is provided as-is for personal use.

## Support

For issues or questions, check the following:
1. Browser console (F12 > Console tab) for errors
2. Server logs in `logs/` directory
3. Network tab (F12 > Network) to inspect API calls
4. System resources with top/htop commands

## Version

**ServerMonitor v1.0.0**
- Initial release
- Real-time dashboard
- Multiple metric views
- Responsive design
- Dark/Light theme
