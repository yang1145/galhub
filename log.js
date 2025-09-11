const fs = require('fs');
const path = require('path');

// 确保logs目录存在
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * 获取当前日期字符串 (YYYY-MM-DD)
 * @returns {string} 格式化的日期字符串
 */
function getCurrentDate() {
  const now = new Date();
  return now.getFullYear() + '-' + 
         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
         String(now.getDate()).padStart(2, '0');
}

/**
 * 获取当前时间字符串 (HH:mm:ss)
 * @returns {string} 格式化的时间字符串
 */
function getCurrentTime() {
  const now = new Date();
  return String(now.getHours()).padStart(2, '0') + ':' + 
         String(now.getMinutes()).padStart(2, '0') + ':' + 
         String(now.getSeconds()).padStart(2, '0');
}

/**
 * 获取当前时间戳字符串 (YYYY-MM-DD_HH-mm-ss)
 * @returns {string} 格式化的时间戳字符串
 */
function getTimestamp() {
  const now = new Date();
  return now.getFullYear() + '-' + 
         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
         String(now.getDate()).padStart(2, '0') + '_' + 
         String(now.getHours()).padStart(2, '0') + '-' + 
         String(now.getMinutes()).padStart(2, '0') + '-' + 
         String(now.getSeconds()).padStart(2, '0');
}

/**
 * 获取当前日志文件路径
 * @returns {string} 日志文件路径
 */
function getLogFilePath() {
  const date = getCurrentDate();
  return path.join(logsDir, `${date}.log`);
}

/**
 * 写入日志到文件
 * @param {string} level 日志级别
 * @param {string} message 日志消息
 * @param {object} metadata 元数据
 */
function writeLogToFile(level, message, metadata = null) {
  try {
    const logFilePath = getLogFilePath();
    const timestamp = new Date().toISOString();
    const time = getCurrentTime();
    
    let logEntry = `[${time}] [${level.toUpperCase()}] ${message}`;
    
    if (metadata) {
      logEntry += ` | Metadata: ${JSON.stringify(metadata)}`;
    }
    
    // 添加换行符
    logEntry += '\n';
    
    // 写入文件（追加模式）
    fs.appendFileSync(logFilePath, logEntry);
  } catch (err) {
    // 如果写入文件失败，输出到控制台
    console.error('写入日志文件失败:', err.message);
  }
}

/**
 * 日志级别枚举
 */
const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * 记录错误日志
 * @param {string} message 日志消息
 * @param {object} metadata 元数据
 */
function error(message, metadata = null) {
  console.error(`[ERROR] ${message}`, metadata || '');
  writeLogToFile(LogLevel.ERROR, message, metadata);
}

/**
 * 记录警告日志
 * @param {string} message 日志消息
 * @param {object} metadata 元数据
 */
function warn(message, metadata = null) {
  console.warn(`[WARN] ${message}`, metadata || '');
  writeLogToFile(LogLevel.WARN, message, metadata);
}

/**
 * 记录信息日志
 * @param {string} message 日志消息
 * @param {object} metadata 元数据
 */
function info(message, metadata = null) {
  console.info(`[INFO] ${message}`, metadata || '');
  writeLogToFile(LogLevel.INFO, message, metadata);
}

/**
 * 记录调试日志
 * @param {string} message 日志消息
 * @param {object} metadata 元数据
 */
function debug(message, metadata = null) {
  console.debug(`[DEBUG] ${message}`, metadata || '');
  writeLogToFile(LogLevel.DEBUG, message, metadata);
}

/**
 * 记录HTTP请求日志
 * @param {object} req Express请求对象
 */
function logRequest(req) {
  const metadata = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };
  
  info(`收到HTTP请求: ${req.method} ${req.url}`, metadata);
}

/**
 * 记录HTTP错误日志
 * @param {object} err 错误对象
 * @param {object} req Express请求对象
 */
function logError(err, req = null) {
  const metadata = {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  };
  
  if (req) {
    metadata.request = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
  }
  
  error('发生未处理的错误', metadata);
}

module.exports = {
  error,
  warn,
  info,
  debug,
  logRequest,
  logError,
  getCurrentDate,
  getTimestamp,
  LogLevel
};