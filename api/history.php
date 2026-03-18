<?php
/**
 * API Endpoint - Get historical data
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../src/environment.php';
require_once __DIR__ . '/../src/Security.php';

try {
    $metric = $_GET['metric'] ?? 'cpu';
    $limit = (int)($_GET['limit'] ?? 60);
    
    $history_file = DATA_PATH . '/history.json';
    
    if (file_exists($history_file)) {
        $history = json_decode(file_get_contents($history_file), true) ?? [];
    } else {
        $history = [];
    }
    
    // Return limited history
    $data = array_slice($history, -$limit);
    
    echo json_encode([
        'success' => true,
        'metric' => $metric,
        'data' => $data,
        'count' => count($data)
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => APP_DEBUG ? $e->getMessage() : 'Server error'
    ]);
}

?>
