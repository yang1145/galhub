import { ref, reactive, computed } from 'vue';

// 用户状态管理
export const useUserStore = () => {
  const user = ref(null);
  const isLoggedIn = computed(() => !!user.value);

  const login = (userData) => {
    user.value = userData;
    // 这里可以添加保存到本地存储的逻辑
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    loadUser
  };
};

// 游戏状态管理
export const useGameStore = () => {
  const games = ref([]);
  const selectedGame = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchGames = async () => {
    loading.value = true;
    error.value = null;
    try {
      // 这里可以替换为实际的API调用
      // const response = await apiService.getGames();
      // games.value = response.data;
      
      // 目前使用模拟数据
      const { games: mockGames } = await import('../data/games.js');
      games.value = mockGames;
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
      // 这里可以替换为实际的API调用
      // const response = await apiService.getGameById(id);
      // selectedGame.value = response.data;
      
      // 目前使用模拟数据
      const { games: mockGames } = await import('../data/games.js');
      selectedGame.value = mockGames.find(game => game.id === id);
    } catch (err) {
      error.value = err.message;
      console.error(`Error fetching game with id ${id}:`, err);
    } finally {
      loading.value = false;
    }
  };

  const getGamesByCategory = computed(() => (category) => {
    if (!category) return games.value;
    return games.value.filter(game => game.category === category);
  });

  const getPopularGames = computed(() => {
    return [...games.value].sort((a, b) => b.rating - a.rating).slice(0, 8);
  });

  const getLatestGames = computed(() => {
    return [...games.value].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 8);
  });

  return {
    games,
    selectedGame,
    loading,
    error,
    fetchGames,
    fetchGameById,
    getGamesByCategory,
    getPopularGames,
    getLatestGames
  };
};

// 搜索状态管理
export const useSearchStore = () => {
  const searchQuery = ref('');
  const searchResults = ref([]);
  const isSearching = ref(false);

  const searchGames = async (query) => {
    searchQuery.value = query;
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }

    isSearching.value = true;
    try {
      // 这里可以替换为实际的API调用
      // const response = await apiService.searchGames(query);
      // searchResults.value = response.data;
      
      // 目前使用模拟数据
      const { games: mockGames } = await import('../data/games.js');
      searchResults.value = mockGames.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase()) ||
        game.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (err) {
      console.error('Error searching games:', err);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
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

// 分类状态管理
export const useCategoryStore = () => {
  const categories = ref([]);

  const fetchCategories = async () => {
    try {
      // 这里可以替换为实际的API调用
      // const response = await apiService.getCategories();
      // categories.value = response.data;
      
      // 目前使用模拟数据
      const { games } = await import('../data/games.js');
      const categorySet = new Set();
      games.forEach(game => categorySet.add(game.category));
      categories.value = Array.from(categorySet);
    } catch (err) {
      console.error('Error fetching categories:', err);
      categories.value = [];
    }
  };

  return {
    categories,
    fetchCategories
  };
};
