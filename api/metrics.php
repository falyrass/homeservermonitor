<?php
/**
 * API Endpoint - Get server metrics
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

require_once __DIR__ . '/../src/environment.php';
require_once __DIR__ . '/../src/Security.php';
require_once __DIR__ . '/../src/DataCollector.php';

try {
    // Get requested metric or all
    $action = $_GET['action'] ?? 'all';
    
    $data = DataCollector::collectAll();
    
    // Filter by action if specified
    if ($action !== 'all' && isset($data[$action])) {
        $data = [$action => $data[$action]];
    }
    
    // Store in JSON file for historical data
    $history_file = DATA_PATH . '/latest.json';
    @file_put_contents($history_file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    echo json_encode([
        'success' => true,
        'data' => $data,
        'timestamp' => time()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => APP_DEBUG ? $e->getMessage() : 'Server error'
    ]);
}

?>
