module.exports = {
  apps: [{
    name: 'articles-app',
    cwd: './server',
    script: 'src/index.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 80,
      HTTPS_PORT: 443,
      ENABLE_HTTPS: 'true'
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 5000,
      HTTPS_PORT: 443,
      ENABLE_HTTPS: 'false'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};

