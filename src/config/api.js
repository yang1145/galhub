// API配置

export const API_CONFIG = {
  // API基础URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // API端点配置
  ENDPOINTS: {
    GAMES: '/games',
    GAME_DETAIL: (id) => `/games/${id}`,
    CATEGORIES: '/categories',
    SEARCH: '/search',
    USER_LOGIN: '/auth/login',
    USER_REGISTER: '/auth/register',
    USER_PROFILE: '/users/profile',
    USER_FAVORITES: '/users/favorites',
    USER_REVIEWS: '/users/reviews'
  },
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // 重试配置
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 12
  },
  
  // 响应状态码
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
};
