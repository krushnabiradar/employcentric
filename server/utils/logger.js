
const morgan = require('morgan');
const config = require('../config/config');

// Create custom logger
const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }
};

// Create HTTP request logger middleware
const httpLogger = morgan(config.nodeEnv === 'development' ? 'dev' : 'combined');

module.exports = {
  ...logger,
  httpLogger
};
