<?php
/**
 * DataCollector class - Collect system information
 */

class DataCollector {
    
    /**
     * Get CPU usage percentage
     */
    public static function getCpuUsage() {
        $data = @file_get_contents('/proc/stat');
        if (!$data) {
            return 0;
        }
        
        $cores = substr_count($data, "cpu");
        $lastline = 0;
        if (is_file("/tmp/cpustats.tmp")) {
            $lastline = json_decode(file_get_contents("/tmp/cpustats.tmp"), true);
        }
        
        $stat = explode("\n", trim($data))[0];
        $stat = preg_replace("/^cpu /", "", $stat);
        $stat = preg_split("/[\s]+/", $stat);
        $stat = array_map("intval", $stat);
        
        $cpu_usage = 80; // Default fallback
        
        if (is_array($lastline)) {
            $diff = array_fill(0, count($stat), 0);
            for ($i = 0; $i < count($stat); $i++) {
                $diff[$i] = $stat[$i] - $lastline[$i];
            }
            
            $diffSum = array_sum($diff);
            if ($diffSum > 0) {
                $cpu_usage = ($diff[0] + $diff[1] + $diff[2]) / $diffSum * 100;
                $cpu_usage = round($cpu_usage, 2);
            }
        }
        
        file_put_contents("/tmp/cpustats.tmp", json_encode($stat));
        return $cpu_usage;
    }
    
    /**
     * Get memory usage
     */
    public static function getMemoryUsage() {
        $meminfo = @file_get_contents('/proc/meminfo');
        if (!$meminfo) {
            return ['total' => 0, 'used' => 0, 'free' => 0, 'percent' => 0];
        }
        
        $meminfo = explode("\n", $meminfo);
        $memory = array();
        
        foreach ($meminfo as $line) {
            $items = explode(':', $line);
            if (count($items) === 2) {
                $memory[trim($items[0])] = (int) trim(str_replace('kB', '', $items[1]));
            }
        }
        
        $total = $memory['MemTotal'] ?? 0;
        $available = $memory['MemAvailable'] ?? $memory['MemFree'] ?? 0;
        $used = $total - $available;
        $percent = $total > 0 ? round(($used / $total) * 100, 2) : 0;
        
        return [
            'total' => round($total / 1024, 2),      // MB
            'used' => round($used / 1024, 2),        // MB
            'free' => round($available / 1024, 2),   // MB
            'percent' => $percent
        ];
    }
    
    /**
     * Get disk usage
     */
    public static function getDiskUsage($path = '/') {
        $total = disk_total_space($path);
        $free = disk_free_space($path);
        $used = $total - $free;
        $percent = $total > 0 ? round(($used / $total) * 100, 2) : 0;
        
        return [
            'path' => $path,
            'total' => round($total / (1024 ** 3), 2),   // GB
            'used' => round($used / (1024 ** 3), 2),     // GB
            'free' => round($free / (1024 ** 3), 2),     // GB
            'percent' => $percent
        ];
    }
    
    /**
     * Get network information
     */
    public static function getNetworkInfo() {
        $interfaces = [];
        
        $output = [];
        @exec('ip -s link show', $output);
        
        if (empty($output)) {
            return ['interfaces' => []];
        }
        
        $current = null;
        foreach ($output as $line) {
            if (preg_match('/^\d+:\s+(\w+):/', $line, $matches)) {
                $current = $matches[1];
                if (!isset($interfaces[$current])) {
                    $interfaces[$current] = [
                        'name' => $current,
                        'rx_bytes' => 0,
                        'tx_bytes' => 0
                    ];
                }
            } elseif ($current && preg_match('/RX:\s+bytes\s+(\d+).*TX:\s+bytes\s+(\d+)/', $line, $matches)) {
                $interfaces[$current]['rx_bytes'] = (int)$matches[1];
                $interfaces[$current]['tx_bytes'] = (int)$matches[2];
            }
        }
        
        return ['interfaces' => array_values($interfaces)];
    }
    
    /**
     * Get system uptime
     */
    public static function getUptime() {
        $uptime = @shell_exec('cat /proc/uptime');
        if (!$uptime) {
            return '0 days';
        }
        
        $uptime = explode(' ', trim($uptime))[0];
        $days = floor($uptime / 86400);
        $hours = floor(($uptime % 86400) / 3600);
        $minutes = floor(($uptime % 3600) / 60);
        
        return "{$days}d {$hours}h {$minutes}m";
    }
    
    /**
     * Get system temperature
     */
    public static function getTemperature() {
        $temp = 0;
        
        if (file_exists('/sys/class/thermal/thermal_zone0/temp')) {
            $temp = (int)file_get_contents('/sys/class/thermal/thermal_zone0/temp');
            $temp = round($temp / 1000, 1);
        }
        
        return $temp;
    }
    
    /**
     * Get running services from pm2
     */
    public static function getServices() {
        $services = [];
        
        // Get pm2 list in JSON format using jlist
        $output = [];
        $return_var = 0;
        @exec("pm2 jlist 2>/dev/null", $output, $return_var);
        
        if ($return_var === 0 && !empty($output)) {
            $json = implode('', $output);
            $pm2_list = json_decode($json, true);
            
            if (is_array($pm2_list) && !empty($pm2_list)) {
                foreach ($pm2_list as $item) {
                    $status = isset($item['pm2_env']['status']) ? $item['pm2_env']['status'] : 'unknown';
                    $services[] = [
                        'name' => $item['name'] ?? 'unknown',
                        'status' => $status,
                        'active' => ($status === 'online'),
                        'pid' => $item['pid'] ?? null,
                        'restart_time' => $item['restart_count'] ?? 0
                    ];
                }
            }
        }
        
        // Return list even if empty
        return $services;
    }
    
    /**
     * Get system logs
     */
    public static function getSystemLogs($lines = 20) {
        $logs = [];
        
        $output = [];
        @exec("journalctl -n {$lines} --no-pager -q 2>/dev/null", $output);
        
        foreach ($output as $line) {
            $logs[] = $line;
        }
        
        return $logs;
    }
    
    /**
     * Collect all data
     */
    public static function collectAll() {
        return [
            'timestamp' => date('Y-m-d H:i:s'),
            'cpu' => self::getCpuUsage(),
            'memory' => self::getMemoryUsage(),
            'disk' => self::getDiskUsage(),
            'network' => self::getNetworkInfo(),
            'uptime' => self::getUptime(),
            'temperature' => self::getTemperature(),
            'services' => self::getServices(),
            'logs' => self::getSystemLogs(10)
        ];
    }
}

?>
