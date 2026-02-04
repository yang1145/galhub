// API配置

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  ENDPOINTS: {
    GAMES: '/games',
    GAME_DETAIL: (id) => `/games/${id}`,
    GAMES_LATEST: '/games/latest',
    GAMES_POPULAR: '/games/popular',
    TAGS: '/tags',
    REVIEWS: '/reviews',
    REVIEWS_GAME: (gameId) => `/reviews/game/${gameId}`,
    REVIEWS_USER: (userId) => `/reviews/user/${userId}`,
    REVIEWS_DETAIL: (id) => `/reviews/${id}`,
    REGISTER: '/register',
    LOGIN: '/login',
    ME: '/me'
  },
  
  TIMEOUT: 10000,
  
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 20
  },
  
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500
  }
};
