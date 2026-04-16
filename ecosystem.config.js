module.exports = {
  apps: [
    {
      name: 'najjo-booking',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/najjo-booking-error.log',
      out_file: '/var/log/pm2/najjo-booking-out.log',
      log_file: '/var/log/pm2/najjo-booking-combined.log'
    }
  ]
};
