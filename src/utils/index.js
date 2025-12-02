// 时间格式化工具
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 数字格式化工具
export const formatNumber = (num, options = {}) => {
  const { decimals = 0, separator = ',', prefix = '', suffix = '' } = options;
  return `${prefix}${num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator)}${suffix}`;
};

// 评分格式化
export const formatRating = (rating, max = 5) => {
  return `${rating.toFixed(1)} / ${max}`;
};

// 字符串截断
export const truncateString = (str, length = 100, suffix = '...') => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// 验证工具
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password, minLength = 6) => {
  return password.length >= minLength;
};

export const isValidUsername = (username, minLength = 3, maxLength = 20) => {
  return username.length >= minLength && username.length <= maxLength;
};

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 防抖函数
export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 深拷贝
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 数组去重
export const uniqueArray = (arr, key) => {
  if (!key) return [...new Set(arr)];
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// 获取文件扩展名
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// 滚动到顶部
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({ top: 0, behavior });
};

// 检查是否为移动设备
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 检查是否在浏览器环境
export const isBrowser = () => {
  return typeof window !== 'undefined';
};

// 保存到本地存储
export const saveToLocalStorage = (key, value) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// 从本地存储获取
export const getFromLocalStorage = (key, defaultValue = null) => {
  if (!isBrowser()) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// 从本地存储删除
export const removeFromLocalStorage = (key) => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
