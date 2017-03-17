/* eslint-disable */
// Note: Simply run `pm2 start ecosystem.config.js` to deploy
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : "IACP", // this name is also used inside cronjobs
      script    : "/vagrant/iacp_website/build/server.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      },
      out_file: "/vagrant/iacp_website/logs/out.log",
      error_file: "/vagrant/iacp_website/logs/err.log",
      combine_logs: true,
    },
  ],
}
