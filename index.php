<?php
/**
 * Index.php - Router for API requests
 * Routes all requests to the appropriate API endpoint
 */

// Define application root
define('APP_ROOT', dirname(__FILE__));

// Load configuration
require_once APP_ROOT . '/src/environment.php';
require_once APP_ROOT . '/src/Security.php';

// Get request path
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$script = basename($request);

// Route to appropriate file
if (strpos($request, '/api/') !== false) {
    // API requests
    if (strpos($request, '/metrics') !== false) {
        require APP_ROOT . '/api/metrics.php';
    } elseif (strpos($request, '/history') !== false) {
        require APP_ROOT . '/api/history.php';
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
} else {
    // Regular requests
    require APP_ROOT . '/public/index.html';
}

?>
