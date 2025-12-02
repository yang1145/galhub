// 应用配置

export const APP_CONFIG = {
  // 应用基本信息
  NAME: import.meta.env.VITE_APP_NAME || 'GalHub',
  VERSION: import.meta.env.VITE_APP_VERSION || '0.0.0',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || '游戏展示平台',
  AUTHOR: 'GalHub Team',
  
  // 路由配置
  ROUTES: {
    HOME: '/',
    ABOUT: '/about',
    CATEGORY: '/category/:id',
    GAME_DETAIL: '/game/:id',
    SEARCH: '/search',
    POPULAR: '/popular',
    LATEST: '/latest'
  },
  
  // 主题配置
  THEME: {
    // 颜色配置
    COLORS: {
      PRIMARY: '#3498db',
      SECONDARY: '#2ecc71',
      ACCENT: '#e74c3c',
      BACKGROUND: '#f5f5f5',
      SURFACE: '#ffffff',
      TEXT: '#2c3e50',
      TEXT_LIGHT: '#7f8c8d',
      BORDER: '#e0e0e0',
      ERROR: '#e74c3c',
      SUCCESS: '#2ecc71',
      WARNING: '#f39c12',
      INFO: '#3498db'
    },
    
    // 字体配置
    FONTS: {
      PRIMARY: '"Helvetica Neue", Arial, sans-serif',
      SIZE: {
        SMALL: '0.875rem',
        NORMAL: '1rem',
        LARGE: '1.25rem',
        XLARGE: '1.5rem',
        XXLARGE: '2rem'
      },
      WEIGHT: {
        LIGHT: 300,
        REGULAR: 400,
        MEDIUM: 500,
        SEMIBOLD: 600,
        BOLD: 700
      }
    },
    
    // 间距配置
    SPACING: {
      XS: '0.25rem',
      SM: '0.5rem',
      MD: '1rem',
      LG: '1.5rem',
      XL: '2rem',
      XXL: '3rem'
    },
    
    // 边框圆角
    BORDER_RADIUS: {
      SM: '0.25rem',
      MD: '0.5rem',
      LG: '0.75rem',
      XL: '1rem',
      FULL: '9999px'
    },
    
    // 阴影配置
    SHADOW: {
      SM: '0 1px 3px rgba(0,0,0,0.12)',
      MD: '0 4px 6px rgba(0,0,0,0.1)',
      LG: '0 10px 15px rgba(0,0,0,0.1)',
      XL: '0 20px 25px rgba(0,0,0,0.15)'
    }
  },
  
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    PAGE_SIZE_OPTIONS: [12, 24, 36, 48]
  },
  
  // 游戏评分配置
  RATING: {
    MAX: 5,
    STEP: 0.5
  },
  
  // 图片配置
  IMAGES: {
    DEFAULT_GAME_IMAGE: '/assets/default-game.jpg',
    DEFAULT_AVATAR: '/assets/default-avatar.jpg',
    THUMBNAIL_SIZE: {
      WIDTH: 200,
      HEIGHT: 300
    },
    COVER_SIZE: {
      WIDTH: 800,
      HEIGHT: 450
    }
  },
  
  // 搜索配置
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    DEBOUNCE_DELAY: 300
  },
  
  // 存储配置
  STORAGE: {
    USER_KEY: 'galhub_user',
    THEME_KEY: 'galhub_theme',
    SEARCH_HISTORY_KEY: 'galhub_search_history',
    FAVORITES_KEY: 'galhub_favorites'
  },
  
  // 社交分享配置
  SOCIAL: {
    TWITTER: 'https://twitter.com/share',
    FACEBOOK: 'https://www.facebook.com/sharer/sharer.php',
    EMAIL: 'mailto:'
  }
};
