// utils/logger.js
class Logger {
  static info(message, data = '') {
    console.log(`[INFO] ${message}`, data);
  }

  static error(message, error) {
    console.error(`[ERROR] ${message}`, error);
  }

  static debug(message, data = '') {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
}

export default Logger;
