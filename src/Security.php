<?php
/**
 * Security class for IP filtering and request validation
 */

require_once __DIR__ . '/environment.php';

class Security {
    
    /**
     * Check if current request IP is allowed
     */
    public static function isIpAllowed() {
        if (!ENABLE_IP_FILTER) {
            return true;
        }
        
        $clientIp = self::getClientIp();
        
        foreach (ALLOWED_IPS as $allowed) {
            if (strpos($allowed, '*') !== false) {
                // Wildcard matching
                $pattern = str_replace('*', '.*', str_replace('.', '\.', $allowed));
                if (preg_match('/^' . $pattern . '/', $clientIp)) {
                    return true;
                }
            } else if (strpos($allowed, '.') === strlen($allowed) - 1) {
                // Partial IP (e.g., "192.168.")
                if (strpos($clientIp, rtrim($allowed, '.')) === 0) {
                    return true;
                }
            } else if ($clientIp === $allowed) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get real client IP address
     */
    public static function getClientIp() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        }
        
        return trim($ip);
    }
    
    /**
     * Validate JSON request
     */
    public static function validateJsonRequest() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return false;
        }
        
        if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) {
            return false;
        }
        
        return true;
    }
}

// Check IP access
if (!Security::isIpAllowed()) {
    http_response_code(403);
    die(json_encode(['error' => 'Access denied. Your IP is not allowed.']));
}

?>
