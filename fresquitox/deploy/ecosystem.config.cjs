/** PM2: pm2 start fresquitox/deploy/ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: 'fresquitox',
      cwd: '/var/www/Fresquitox/fresquitox/frontend',
      script: 'dist/frontend/server/server.mjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        FRESQUITOX_DB_PATH: '/var/www/Fresquitox/fresquitox/data/fresquitox.db',
      },
    },
  ],
};
