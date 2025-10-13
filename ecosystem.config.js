module.exports = {
  apps: [{
    name: 'articles-app',
    script: 'server/src/index.js',
    cwd: './',
    instances: 1, // Single instance for memory efficiency
    exec_mode: 'fork', // Use fork mode instead of cluster for lower memory usage
    max_memory_restart: '800M', // Restart if memory usage exceeds 800MB
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Memory optimization settings
    node_args: '--max-old-space-size=512 --max-semi-space-size=64',
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Auto restart settings
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    // Health monitoring
    health_check_grace_period: 3000,
    // Resource limits
    kill_timeout: 5000,
    listen_timeout: 3000
  }]
};