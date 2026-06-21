module.exports = {
  apps: [
    {
      name: 'jobsira',
      script: './.next/standalone/server.js',
      instances: 1, // You can change this to 'max' for cluster mode if needed
      exec_mode: 'fork', // Standalone performs better in fork or cluster mode depending on setup
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1', // Ensure it binds to all interfaces for Nginx to proxy
      },
    },
    {
      name: 'jobsira-rembg',
      script: 'venv/bin/python3',
      args: '-m uvicorn main:app --host 127.0.0.1 --port 3001',
      cwd: './microservices/bg_removal',
      env: {
        // Environment variables for rembg if needed
      }
    }
  ],
};
