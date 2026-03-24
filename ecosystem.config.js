module.exports = {
  apps: [
    {
      name: 'jobsira',
      script: './.next/standalone/server.js',
      instances: 2, // You can change this to 'max' for cluster mode if needed
      exec_mode: 'cluster', // Standalone performs better in fork or cluster mode depending on setup
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1', // Ensure it binds to all interfaces for Nginx to proxy
      },
    },
  ],
};
