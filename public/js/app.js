/**
 * Main Application - ServerMonitor Dashboard
 */
class ServerMonitor {
    constructor() {
        this.refreshInterval = 2000; // 2 seconds
        this.isConnected = true;
        this.dataHistory = [];
        this.maxHistoryPoints = 60;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initCharts();
        this.startAutoRefresh();
        this.updateMetrics();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => this.updateMetrics());
        
        // Menu toggle (mobile)
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleMenu());
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        
        // Close modal on background click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });
    }
    
    initCharts() {
        try {
            // Ensure Chart.js is loaded
            if (typeof Chart === 'undefined') {
                console.error('Chart.js not loaded');
                return;
            }
            
            Charts.initCpuChart();
            Charts.initMemChart();
            Charts.initCpuDetailChart();
            Charts.initMemDonutChart();
            Charts.initDiskChart();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const sectionId = link.dataset.section;
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update active section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${sectionId}`).classList.add('active');
        
        // Update page title
        document.getElementById('pageTitle').textContent = link.textContent;
        
        // Close mobile menu
        this.closeMenu();
    }
    
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        body.classList.remove(isDark ? 'dark-theme' : 'light-theme');
        body.classList.add(isDark ? 'light-theme' : 'dark-theme');
        
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        
        // Reinitialize charts with new theme colors
        setTimeout(() => this.reinitCharts(), 100);
    }
    
    toggleMenu() {
        document.querySelector('.sidebar-nav').classList.toggle('active');
    }
    
    closeMenu() {
        document.querySelector('.sidebar-nav').classList.remove('active');
    }
    
    openSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }
    
    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }
    
    saveSettings() {
        const interval = parseInt(document.getElementById('refreshInterval').value);
        const notifications = document.getElementById('enableNotifications').checked;
        const charts = document.getElementById('enableCharts').checked;
        
        this.refreshInterval = interval * 1000;
        
        localStorage.setItem('settings', JSON.stringify({
            refreshInterval: interval,
            notifications,
            charts
        }));
        
        this.closeSettings();
        this.showNotification('Settings saved!', 'success');
    }
    
    async updateMetrics() {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.classList.add('loading');
        
        try {
            const response = await API.getMetrics();
            
            if (!response || !response.success) {
                this.setConnectionStatus(false);
                return;
            }
            
            this.setConnectionStatus(true);
            const data = response.data;
            
            // Update dashboard stats
            this.updateDashboard(data);
            
            // Store in history
            this.dataHistory.push({
                timestamp: new Date(),
                ...data
            });
            
            if (this.dataHistory.length > this.maxHistoryPoints) {
                this.dataHistory.shift();
            }
            
        } catch (error) {
            console.error('Error updating metrics:', error);
            this.setConnectionStatus(false);
        } finally {
            refreshBtn.classList.remove('loading');
        }
    }
    
    updateDashboard(data) {
        if (data.cpu !== undefined) {
            this.updateCpuStats(data.cpu);
        }
        
        if (data.memory) {
            this.updateMemoryStats(data.memory);
        }
        
        if (data.disk) {
            this.updateDiskStats(data.disk);
        }
        
        if (data.uptime) {
            document.getElementById('uptimeValue').textContent = data.uptime;
        }
        
        if (data.temperature !== undefined) {
            this.updateTemperatureStats(data.temperature);
        }
        
        if (data.services) {
            this.updateServices(data.services);
        }
        
        if (data.logs) {
            this.updateLogs(data.logs);
        }
        
        if (data.network) {
            this.updateNetwork(data.network);
        }
    }
    
    updateCpuStats(value) {
        document.getElementById('cpuValue').textContent = value.toFixed(1);
        document.getElementById('cpuPercent').textContent = `${value.toFixed(1)}%`;
        
        const cpuProgress = document.getElementById('cpuProgress');
        cpuProgress.style.width = `${Math.min(value, 100)}%`;
        
        // Update color based on usage
        if (value > 80) {
            cpuProgress.style.background = 'linear-gradient(90deg, #f38ba8, #f9e2af)';
        } else if (value > 50) {
            cpuProgress.style.background = 'linear-gradient(90deg, #f9e2af, #a6e3a1)';
        } else {
            cpuProgress.style.background = 'linear-gradient(90deg, #a6e3a1, #89dceb)';
        }
        
        Charts.updateCpuChart(value);
    }
    
    updateMemoryStats(data) {
        document.getElementById('memValue').textContent = data.used.toFixed(0);
        document.getElementById('memPercent').textContent = `${data.percent.toFixed(1)}%`;
        
        const memProgress = document.getElementById('memProgress');
        memProgress.style.width = `${Math.min(data.percent, 100)}%`;
        
        // Update color based on usage
        if (data.percent > 80) {
            memProgress.style.background = 'linear-gradient(90deg, #f38ba8, #f9e2af)';
        } else if (data.percent > 50) {
            memProgress.style.background = 'linear-gradient(90deg, #f9e2af, #a6e3a1)';
        } else {
            memProgress.style.background = 'linear-gradient(90deg, #a6e3a1, #89dceb)';
        }
        
        // Update memory section with MB units
        document.getElementById('memTotal').textContent = `${data.total.toFixed(0)} MB`;
        document.getElementById('memUsed').textContent = `${data.used.toFixed(0)} MB`;
        document.getElementById('memFree').textContent = `${data.free.toFixed(0)} MB`;
        document.getElementById('memUsagePercent').textContent = `${data.percent.toFixed(1)}%`;
        
        Charts.updateMemChart(data.percent);
        Charts.updateMemDonutChart(data.used, data.free);
    }
    
    updateDiskStats(data) {
        document.getElementById('diskValue').textContent = data.used.toFixed(1);
        document.getElementById('diskPercent').textContent = `${data.percent.toFixed(1)}%`;
        
        const diskProgress = document.getElementById('diskProgress');
        diskProgress.style.width = `${Math.min(data.percent, 100)}%`;
        
        // Update color based on usage
        if (data.percent > 80) {
            diskProgress.style.background = 'linear-gradient(90deg, #f38ba8, #f9e2af)';
        } else if (data.percent > 50) {
            diskProgress.style.background = 'linear-gradient(90deg, #f9e2af, #a6e3a1)';
        } else {
            diskProgress.style.background = 'linear-gradient(90deg, #a6e3a1, #89dceb)';
        }
        
        // Update disk section
        document.getElementById('diskTotal').textContent = `${data.total.toFixed(1)} GB`;
        document.getElementById('diskUsed').textContent = `${data.used.toFixed(1)} GB`;
        document.getElementById('diskFree').textContent = `${data.free.toFixed(1)} GB`;
        document.getElementById('diskUsagePercent').textContent = `${data.percent.toFixed(1)}%`;
        
        Charts.updateDiskChart(data.used, data.free);
    }
    
    updateTemperatureStats(temp) {
        if (temp === 0) {
            document.getElementById('tempValue').textContent = 'N/A';
            document.getElementById('tempProgress').style.width = '0%';
            return;
        }
        
        document.getElementById('tempValue').textContent = temp.toFixed(1);
        
        // Assume max temp is 100°C
        const tempPercent = Math.min((temp / 100) * 100, 100);
        const tempProgress = document.getElementById('tempProgress');
        tempProgress.style.width = `${tempPercent}%`;
        
        // Color based on temperature
        if (temp > 80) {
            tempProgress.style.background = 'linear-gradient(90deg, #f38ba8, #f9e2af)';
        } else if (temp > 60) {
            tempProgress.style.background = 'linear-gradient(90deg, #f9e2af, #a6e3a1)';
        } else {
            tempProgress.style.background = 'linear-gradient(90deg, #a6e3a1, #89dceb)';
        }
    }
    
    updateServices(services) {
        const container = document.getElementById('servicesList');
        
        let runningCount = 0;
        let html = '';
        
        services.forEach(service => {
            const isRunning = service.active || service.status === 'running';
            if (isRunning) runningCount++;
            
            html += `
                <div class="service-item">
                    <span class="service-name">${service.name}</span>
                    <span class="service-badge ${isRunning ? 'running' : 'stopped'}">
                        ${isRunning ? 'running' : 'stopped'}
                    </span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        document.getElementById('servicesValue').textContent = runningCount;
        document.getElementById('servicesPercent').textContent = `/ ${services.length}`;
    }
    
    updateLogs(logs) {
        const container = document.getElementById('logsList');
        container.textContent = logs.join('\n');
    }
    
    updateNetwork(networkData) {
        const container = document.getElementById('networkContainer');
        
        if (!networkData.interfaces || networkData.interfaces.length === 0) {
            container.innerHTML = '<p class="text-center opacity-50">No network interfaces found</p>';
            return;
        }
        
        let html = '';
        networkData.interfaces.forEach(iface => {
            html += `
                <div class="network-item">
                    <h4>${iface.name}</h4>
                    <div class="network-stats">
                        <div class="network-stat">
                            <div class="network-stat-label">RX Bytes</div>
                            <div class="network-stat-value">${this.formatBytes(iface.rx_bytes)}</div>
                        </div>
                        <div class="network-stat">
                            <div class="network-stat-label">TX Bytes</div>
                            <div class="network-stat-value">${this.formatBytes(iface.tx_bytes)}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    setConnectionStatus(connected) {
        this.isConnected = connected;
        const statusElement = document.getElementById('connectionStatus');
        const statusDot = document.querySelector('.status-dot');
        
        if (connected) {
            statusElement.textContent = 'Connected';
            statusDot.classList.remove('disconnected');
        } else {
            statusElement.textContent = 'Disconnected';
            statusDot.classList.add('disconnected');
        }
    }
    
    startAutoRefresh() {
        setInterval(() => {
            this.updateMetrics();
        }, this.refreshInterval);
    }
    
    reinitCharts() {
        Charts.destroyAll();
        this.initCharts();
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${type === 'success' ? '#a6e3a1' : '#89b4fa'};
            color: #1e1e2e;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px rgba(0,0,0,0.2);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
    
    // Load settings
    const savedSettings = JSON.parse(localStorage.getItem('settings') || '{}');
    if (savedSettings.refreshInterval) {
        document.getElementById('refreshInterval').value = savedSettings.refreshInterval;
    }
    if (savedSettings.notifications !== undefined) {
        document.getElementById('enableNotifications').checked = savedSettings.notifications;
    }
    if (savedSettings.charts !== undefined) {
        document.getElementById('enableCharts').checked = savedSettings.charts;
    }
    
    // Start the app
    window.app = new ServerMonitor();
});
