<?php
/**
 * PHP Built-in Server Router
 * Run with: php -S 0.0.0.0:8050 router.php
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Route /api/* to the api/ directory
if (preg_match('#^/api/(.+\.php)#', $uri, $matches)) {
    $file = __DIR__ . '/api/' . $matches[1];
    if (file_exists($file)) {
        require $file;
        return true;
    }
    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found']);
    return true;
}

// Serve static files from public/ with proper MIME types
$publicFile = __DIR__ . '/public' . $uri;

if (file_exists($publicFile) && is_file($publicFile)) {
    $mimeTypes = [
        '.js' => 'application/javascript',
        '.css' => 'text/css',
        '.json' => 'application/json',
        '.html' => 'text/html',
        '.png' => 'image/png',
        '.jpg' => 'image/jpeg',
        '.jpeg' => 'image/jpeg',
        '.gif' => 'image/gif',
        '.svg' => 'image/svg+xml',
        '.woff' => 'font/woff',
        '.woff2' => 'font/woff2',
        '.ttf' => 'font/ttf',
    ];
    
    $ext = strtolower(pathinfo($publicFile, PATHINFO_EXTENSION));
    $mimeType = $mimeTypes['.' . $ext] ?? 'application/octet-stream';
    
    header('Content-Type: ' . $mimeType);
    echo file_get_contents($publicFile);
    return true;
}

// Fallback: serve index.html for SPA routes
if (is_file(__DIR__ . '/public/index.html')) {
    header('Content-Type: text/html');
    echo file_get_contents(__DIR__ . '/public/index.html');
}
return true;
