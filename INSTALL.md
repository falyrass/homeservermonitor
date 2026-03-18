# Installation Guide for ServerMonitor

## Quick Start (Development)

### 1. Using PHP Built-in Server
```bash
cd /home/falyrass/htdocs/homeservermonitor
php -S 0.0.0.0:8000 -t public/
```
Then access: `http://localhost:8000`

### 2. Using Apache (Production)

#### Enable Rewrite Module
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```
    ServerAlias 100.100.247.48:8050
#### Create Virtual Host
Create `/etc/apache2/sites-available/servermonitor.conf`:
```apache
<VirtualHost *:80>
    ServerName servermonitor.local
    ServerAlias 100.100.247.48
    
    DocumentRoot /home/falyrass/htdocs/homeservermonitor/public
    
    <Directory /home/falyrass/htdocs/homeservermonitor/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Rewrite rules
        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.html [L]
    </Directory>
    
    # API directory
    <Directory /home/falyrass/htdocs/homeservermonitor/api>
        <FilesMatch "\.php$">
            AddType application/x-httpd-php .php
        </FilesMatch>
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/servermonitor-error.log
    CustomLog ${APACHE_LOG_DIR}/servermonitor-access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite servermonitor.conf
sudo systemctl restart apache2
```

#### Permissions
```bash
chmod -R 755 /home/falyrass/htdocs/homeservermonitor
chmod -R 755 /home/falyrass/htdocs/homeservermonitor/data
chmod -R 755 /home/falyrass/htdocs/homeservermonitor/logs
```

## Configuration
define('SERVER_PORT', 8050);
Edit `src/environment.php` to customize:

```php
// Server configuration
define('SERVER_HOST', '100.100.247.48');
define('SERVER_PORT', 3000);
define('SERVER_USER', 'falyrass');

// Security
define('ALLOWED_IPS', array(
    '127.0.0.1',
    '192.168.',
    '100.100.247'
));

// Features
define('ENABLE_CHARTS', true);
define('ENABLE_ALERTS', true);
define('REFRESH_INTERVAL', 2000);  // milliseconds
```

## Troubleshooting

### 404 Errors on API Calls
- Enable Apache mod_rewrite: `sudo a2enmod rewrite`
- Check .htaccess in public/ directory
- Verify API files are accessible

### Permission Denied Errors
```bash
sudo chown -R www-data:www-data /home/falyrass/htdocs/homeservermonitor/data
sudo chown -R www-data:www-data /home/falyrass/htdocs/homeservermonitor/logs
chmod -R 755 /home/falyrass/htdocs/homeservermonitor
```

### Dashboard Shows Disconnected
- Check if your IP is in ALLOWED_IPS
- Verify API is accessible: `curl http://serverip/api/metrics.php`
- Check browser console (F12) for errors
- Check PHP error logs

### High Memory Usage
- Reduce REFRESH_INTERVAL in environment.php
- Limit CHART_MAX_POINTS value
- Disable unused features

## First Run Checklist

- [ ] Edit server credentials in `src/environment.php`
- [ ] Add your IP to ALLOWED_IPS
- [ ] Set correct permissions on data/ and logs/ folders
- [ ] Test API endpoints: `curl http://localhost/api/metrics.php`
- [ ] Access dashboard and verify data loads
- [ ] Configure refresh interval in Settings
- [ ] Test responsiveness on mobile device

## Updating

To update to a new version:
1. Backup current installation
2. Replace files (keeping src/environment.php)
3. Clear browser cache (Ctrl+Shift+Del)
4. Test all features

## Support

Check browser console (F12) for JavaScript errors
Check PHP logs: `tail -f /var/log/apache2/error.log`
Check application logs: `cat logs/*`
