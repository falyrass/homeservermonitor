# Nginx Configuration for ServerMonitor

## Server Block Configuration

Create `/etc/nginx/sites-available/servermonitor`:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name 100.100.247.48 servermonitor.local;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name 100.100.247.48 servermonitor.local;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Root directory
    root /home/falyrass/htdocs/homeservermonitor/public;
    index index.html index.php;
    
    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # API endpoints
    location ~ ^/api/ {
        try_files $uri =404;
        
        # Pass to PHP
        location ~ \.php$ {
            fastcgi_pass unix:/run/php/php-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }
    }
    
    # Routes
    location / {
        try_files $uri $uri/ =404;
        
        # For single page app
        error_page 404 =200 /index.html;
    }
    
    # PHP handler (for public directory)
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Logs
    access_log /var/log/nginx/servermonitor-access.log;
    error_log /var/log/nginx/servermonitor-error.log;
    
    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ ~$ {
        deny all;
    }
}
```

## Installation Steps

1. **Create the configuration file:**
```bash
sudo nano /etc/nginx/sites-available/servermonitor
# Paste the configuration above
# Save: Ctrl+O, Enter, Ctrl+X
```

2. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/servermonitor /etc/nginx/sites-enabled/
```

3. **Test configuration:**
```bash
sudo nginx -t
```

4. **Restart Nginx:**
```bash
sudo systemctl restart nginx
```

5. **Set permissions:**
```bash
chmod -R 755 /home/falyrass/htdocs/homeservermonitor
chmod -R 755 /home/falyrass/htdocs/homeservermonitor/data
chmod -R 755 /home/falyrass/htdocs/homeservermonitor/logs
```

## PHP-FPM Configuration

1. **Check PHP-FPM socket:**
```bash
ls /run/php/
# Should show php*-fpm.sock
```

2. **Adjust socket path in nginx config if needed:**
```bash
# Check installed PHP version
php -v

# Common socket paths:
# PHP 7.4: /run/php/php7.4-fpm.sock
# PHP 8.0: /run/php/php8.0-fpm.sock
# PHP 8.1: /run/php/php8.1-fpm.sock
```

3. **Ensure PHP-FPM is running:**
```bash
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
```

## SSL/TLS Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d 100.100.247.48 -d servermonitor.local

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Testing

```bash
# Test HTTP requests
curl -I http://100.100.247.48

# Test HTTPS
curl -I https://100.100.247.48

# Test API
curl http://100.100.247.48/api/metrics.php
```

## Troubleshooting

### 502 Bad Gateway
```bash
# Check PHP-FPM status
systemctl status php-fpm

# Check socket exists
ls -la /run/php/php*-fpm.sock

# Restart PHP-FPM
sudo systemctl restart php-fpm
```

### 403 Forbidden
```bash
# Check file permissions
ls -la /home/falyrass/htdocs/homeservermonitor/

# Fix permissions
chmod -R 755 /home/falyrass/htdocs/homeservermonitor/
```

### Check Nginx errors
```bash
sudo tail -f /var/log/nginx/error.log
```

## Performance Optimization

### HTTP/2 Push
Add to server block:
```nginx
http2_push /css/styles.css;
http2_push /js/app.js;
http2_push /js/charts.js;
```

### Rate Limiting
Add to http block:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Then in location:
location ~ ^/api/ {
    limit_req zone=api burst=20;
}
```

## Cleanup

To disable the site:
```bash
sudo rm /etc/nginx/sites-enabled/servermonitor
sudo systemctl reload nginx
```

To remove completely:
```bash
sudo rm /etc/nginx/sites-available/servermonitor
sudo rm /etc/nginx/sites-enabled/servermonitor
sudo systemctl reload nginx
```
