/**
 * Charts Module - Initialize and manage all charts
 */
const Charts = {
    instances: {},
    
    /**
     * Destroy all existing charts
     */
    destroyAll() {
        for (const key in this.instances) {
            if (this.instances[key]) {
                this.instances[key].destroy();
                delete this.instances[key];
            }
        }
        this.instances = {};
    },
    
    /**
     * Initialize CPU chart
     */
    initCpuChart() {
        const ctx = document.getElementById('cpuChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.instances.cpuChart) {
            this.instances.cpuChart.destroy();
        }
        
        this.instances.cpuChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'CPU Usage (%)',
                    data: [],
                    borderColor: '#89b4fa',
                    backgroundColor: 'rgba(137, 180, 250, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(137, 180, 250, 0.1)'
                        },
                        ticks: {
                            color: '#bac2de'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#bac2de'
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Initialize Memory chart
     */
    initMemChart() {
        const ctx = document.getElementById('memChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.instances.memChart) {
            this.instances.memChart.destroy();
        }
        
        this.instances.memChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Memory Usage (%)',
                    data: [],
                    borderColor: '#f38ba8',
                    backgroundColor: 'rgba(243, 139, 168, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(243, 139, 168, 0.1)'
                        },
                        ticks: {
                            color: '#bac2de'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#bac2de'
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Initialize CPU Detail chart
     */
    initCpuDetailChart() {
        const ctx = document.getElementById('cpuDetailChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.instances.cpuDetailChart) {
            this.instances.cpuDetailChart.destroy();
        }
        
        this.instances.cpuDetailChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'CPU Usage (%)',
                    data: [],
                    borderColor: '#89b4fa',
                    backgroundColor: 'rgba(137, 180, 250, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 1,
                    pointBackgroundColor: '#89b4fa',
                    pointBorderColor: '#1e1e2e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#cdd6f4'
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(137, 180, 250, 0.1)'
                        },
                        ticks: {
                            color: '#bac2de'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(137, 180, 250, 0.05)'
                        },
                        ticks: {
                            color: '#bac2de'
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Initialize Memory Donut chart
     */
    initMemDonutChart() {
        const ctx = document.getElementById('memDonutChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.instances.memDonutChart) {
            this.instances.memDonutChart.destroy();
        }
        
        this.instances.memDonutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Free'],
                datasets: [{
                    data: [50, 50],
                    backgroundColor: ['#f38ba8', 'rgba(243, 139, 168, 0.2)'],
                    borderColor: '#313244',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cdd6f4',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Initialize Disk chart
     */
    initDiskChart() {
        const ctx = document.getElementById('diskChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.instances.diskChart) {
            this.instances.diskChart.destroy();
        }
        
        this.instances.diskChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Free'],
                datasets: [{
                    data: [50, 50],
                    backgroundColor: ['#a6e3a1', 'rgba(166, 227, 161, 0.2)'],
                    borderColor: '#313244',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cdd6f4',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Update CPU chart data
     */
    updateCpuChart(value) {
        if (!this.instances.cpuChart) return;
        
        const chart = this.instances.cpuChart;
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        chart.data.labels.push(timestamp);
        chart.data.datasets[0].data.push(value);
        
        // Keep only last 60 points
        if (chart.data.labels.length > 60) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update('none');
    },
    
    /**
     * Update Memory chart data
     */
    updateMemChart(value) {
        if (!this.instances.memChart) return;
        
        const chart = this.instances.memChart;
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        chart.data.labels.push(timestamp);
        chart.data.datasets[0].data.push(value);
        
        // Keep only last 60 points
        if (chart.data.labels.length > 60) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update('none');
    },
    
    /**
     * Update Memory Donut chart
     */
    updateMemDonutChart(used, free) {
        if (!this.instances.memDonutChart) return;
        
        this.instances.memDonutChart.data.datasets[0].data = [used, free];
        this.instances.memDonutChart.update();
    },
    
    /**
     * Update Disk chart
     */
    updateDiskChart(used, free) {
        if (!this.instances.diskChart) return;
        
        this.instances.diskChart.data.datasets[0].data = [used, free];
        this.instances.diskChart.update();
    }
};
