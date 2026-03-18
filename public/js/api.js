/**
 * API Module - Handle all API calls
 */
const API = {
    baseUrl: '/api',
    
    /**
     * Fetch metrics from server
     */
    async getMetrics() {
        try {
            const response = await fetch(`${this.baseUrl}/metrics.php?action=all`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching metrics:', error);
            return null;
        }
    },
    
    /**
     * Fetch history data
     */
    async getHistory(metric, limit = 60) {
        try {
            const response = await fetch(`${this.baseUrl}/history.php?metric=${metric}&limit=${limit}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching history:', error);
            return null;
        }
    },
    
    /**
     * Fetch CPU metrics
     */
    async getCpuMetrics() {
        try {
            const response = await fetch(`${this.baseUrl}/metrics.php?action=cpu`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching CPU metrics:', error);
            return null;
        }
    },
    
    /**
     * Fetch memory metrics
     */
    async getMemoryMetrics() {
        try {
            const response = await fetch(`${this.baseUrl}/metrics.php?action=memory`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching memory metrics:', error);
            return null;
        }
    }
};
