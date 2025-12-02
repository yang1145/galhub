// API服务层 - 处理所有API请求

// 导入API配置
import { API_CONFIG } from '../config/api.js';

// 基础URL
const BASE_URL = API_CONFIG.BASE_URL;

// 通用请求方法
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  // 默认请求配置
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // 合并配置
  const config = { ...defaultOptions, ...options };
  
  // 如果有token，添加到请求头
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, config);
    
    // 解析响应数据
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { success: false, message: 'Invalid JSON response' };
    }
    
    // 处理错误状态码
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// API服务对象
export const apiService = {
  // 用户认证相关
  auth: {
    // 用户登录
    login: async (credentials) => {
      const data = await request('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // 保存token到localStorage
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      return data;
    },
    
    // 用户注册
    register: async (userData) => {
      const data = await request('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      // 保存token到localStorage
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      return data;
    },
    
    // 获取当前用户信息
    getCurrentUser: async () => {
      return request('/me');
    },
    
    // 用户登出
    logout: () => {
      localStorage.removeItem('token');
    },
  },
  
  // 游戏相关
  games: {
    // 获取游戏列表
    getGames: async () => {
      return request('/games');
    },
    
    // 创建新游戏（需要认证）
    createGame: async (gameData) => {
      return request('/games', {
        method: 'POST',
        body: JSON.stringify(gameData),
      });
    },
  },
  
  // 标签相关
  tags: {
    // 获取标签列表
    getTags: async () => {
      return request('/tags');
    },
    
    // 创建新标签（需要认证）
    createTag: async (tagName) => {
      return request('/tags', {
        method: 'POST',
        body: JSON.stringify({ name: tagName }),
      });
    },
  },
  
  // 评论相关
  reviews: {
    // 获取特定游戏的所有评论
    getGameReviews: async (gameId) => {
      return request(`/reviews/game/${gameId}`);
    },
    
    // 创建评论（需要认证）
    createReview: async (reviewData) => {
      return request('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },
  },
};

// 导出API服务
export default apiService;