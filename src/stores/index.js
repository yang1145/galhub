import { ref, reactive, computed } from 'vue';
import apiService from '../services/apiService.js';

export const useUserStore = () => {
  const user = ref(null);
  const isLoggedIn = computed(() => !!user.value);

  const login = (userData) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
    apiService.auth.logout();
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await apiService.auth.getCurrentUser();
      if (response.success && response.data.user) {
        user.value = response.data.user;
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    loadUser,
    fetchCurrentUser
  };
};

export const useGameStore = () => {
  const games = ref([]);
  const selectedGame = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchGames = async (page = 1, limit = 20) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.games.getGames(page, limit);
      if (response.success) {
        games.value = response.data;
        pagination.value = response.pagination || {
          page,
          limit,
          total: response.data.length,
          totalPages: Math.ceil(response.data.length / limit)
        };
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching games:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchGameById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.games.getGameById(id);
      if (response.success) {
        selectedGame.value = response.data;
      }
    } catch (err) {
      error.value = err.message;
      console.error(`Error fetching game with id ${id}:`, err);
    } finally {
      loading.value = false;
    }
  };

  const fetchLatestGames = async (limit = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.games.getLatestGames(limit);
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching latest games:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchPopularGames = async (limit = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.games.getPopularGames(limit);
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching popular games:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const createGame = async (gameData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.games.createGame(gameData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create game');
    } catch (err) {
      error.value = err.message;
      console.error('Error creating game:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getGamesByTag = computed(() => (tagName) => {
    if (!tagName) return games.value;
    return games.value.filter(game => 
      game.tags && game.tags.some(tag => tag.name === tagName)
    );
  });

  return {
    games,
    selectedGame,
    loading,
    error,
    pagination,
    fetchGames,
    fetchGameById,
    fetchLatestGames,
    fetchPopularGames,
    createGame,
    getGamesByTag
  };
};

export const useSearchStore = () => {
  const searchQuery = ref('');
  const searchResults = ref([]);
  const isSearching = ref(false);
  const error = ref(null);

  const searchGames = async (query) => {
    searchQuery.value = query;
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }

    isSearching.value = true;
    error.value = null;
    try {
      const response = await apiService.games.getGames(1, 100);
      if (response.success) {
        searchResults.value = response.data.filter(game => 
          game.title.toLowerCase().includes(query.toLowerCase()) ||
          game.description.toLowerCase().includes(query.toLowerCase()) ||
          (game.tags && game.tags.some(tag => tag.name.toLowerCase().includes(query.toLowerCase())))
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error searching games:', err);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
    error.value = null;
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    error,
    searchGames,
    clearSearch
  };
};

// 主题状态管理
export const useThemeStore = () => {
  const isDarkMode = ref(false);

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDarkMode.value.toString());
  };

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true';
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
      }
    }
  };

  return {
    isDarkMode,
    toggleTheme,
    loadTheme
  };
};

export const useTagStore = () => {
  const tags = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchTags = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.tags.getTags();
      if (response.success) {
        tags.value = response.data;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching tags:', err);
      tags.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createTag = async (tagName) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.tags.createTag(tagName);
      if (response.success) {
        tags.value.push(response.data);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create tag');
    } catch (err) {
      error.value = err.message;
      console.error('Error creating tag:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag
  };
};

export const useReviewStore = () => {
  const reviews = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchGameReviews = async (gameId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.reviews.getGameReviews(gameId);
      if (response.success) {
        reviews.value = response.data;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching game reviews:', err);
      reviews.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchUserReviews = async (userId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.reviews.getUserReviews(userId);
      if (response.success) {
        reviews.value = response.data;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching user reviews:', err);
      reviews.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createReview = async (reviewData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.reviews.createReview(reviewData);
      if (response.success) {
        reviews.value.push(response.data);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create review');
    } catch (err) {
      error.value = err.message;
      console.error('Error creating review:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.reviews.updateReview(reviewId, reviewData);
      if (response.success) {
        const index = reviews.value.findIndex(r => r.id === reviewId);
        if (index !== -1) {
          reviews.value[index] = response.data;
        }
        return response.data;
      }
      throw new Error(response.message || 'Failed to update review');
    } catch (err) {
      error.value = err.message;
      console.error('Error updating review:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteReview = async (reviewId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.reviews.deleteReview(reviewId);
      if (response.success) {
        reviews.value = reviews.value.filter(r => r.id !== reviewId);
        return true;
      }
      throw new Error(response.message || 'Failed to delete review');
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting review:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    reviews,
    loading,
    error,
    fetchGameReviews,
    fetchUserReviews,
    createReview,
    updateReview,
    deleteReview
  };
};
