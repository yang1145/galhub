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
    getGames: async (page = 1, limit = 20) => {
      const params = new URLSearchParams({ page, limit });
      return request(`/games?${params}`);
    },
    
    getGameById: async (id) => {
      return request(`/games/${id}`);
    },
    
    getLatestGames: async (limit = 10) => {
      const params = new URLSearchParams({ limit });
      return request(`/games/latest?${params}`);
    },
    
    getPopularGames: async (limit = 10) => {
      const params = new URLSearchParams({ limit });
      return request(`/games/popular?${params}`);
    },
    
    createGame: async (gameData) => {
      return request('/games', {
        method: 'POST',
        body: JSON.stringify(gameData),
      });
    },
    
    updateGame: async (id, gameData) => {
      return request(`/games/${id}`, {
        method: 'PUT',
        body: JSON.stringify(gameData),
      });
    },
    
    deleteGame: async (id) => {
      return request(`/games/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // 用户相关（管理员功能）
  users: {
    getUsers: async (page = 1, limit = 20) => {
      const params = new URLSearchParams({ page, limit });
      return request(`/users?${params}`);
    },
    
    getUserById: async (id) => {
      return request(`/users/${id}`);
    },
    
    createUser: async (userData) => {
      return request('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    
    updateUser: async (id, userData) => {
      return request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },
    
    deleteUser: async (id) => {
      return request(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // 标签相关
  tags: {
    getTags: async () => {
      return request('/tags');
    },
    
    createTag: async (tagName) => {
      return request('/tags', {
        method: 'POST',
        body: JSON.stringify({ name: tagName }),
      });
    },
  },
  
  reviews: {
    getGameReviews: async (gameId) => {
      return request(`/reviews/game/${gameId}`);
    },
    
    getUserReviews: async (userId) => {
      return request(`/reviews/user/${userId}`);
    },
    
    createReview: async (reviewData) => {
      return request('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },
    
    updateReview: async (reviewId, reviewData) => {
      return request(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData),
      });
    },
    
    deleteReview: async (reviewId) => {
      return request(`/reviews/${reviewId}`, {
        method: 'DELETE',
      });
    },
  },
};

// 导出API服务
export default apiService;