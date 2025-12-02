<template>
  <div class="search-results-content">
    <h2>搜索结果</h2>
    <p>关于 "{{ query }}" 的搜索结果</p>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <font-awesome-icon :icon="['fas', 'spinner']" spin size="3x" />
      <p>正在搜索游戏...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="results.length === 0" class="empty-state">
      <font-awesome-icon :icon="['fas', 'search']" size="3x" />
      <p>没有找到相关游戏</p>
    </div>
    
    <!-- 搜索结果列表 -->
    <div v-else class="game-grid">
      <GameCard 
        v-for="game in results" 
        :key="game.id" 
        :game="game" 
        @select="(game) => $router.push(`/game/${game.id}`)" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import GameCard from '../components/ui/GameCard.vue';
import { apiService } from '../services/apiService';

// 从路由参数获取搜索查询
const props = defineProps({
  query: {
    type: String,
    default: ''
  }
});

// 搜索结果
const results = ref([]);
const isLoading = ref(false);
const error = ref('');

// 执行搜索
const performSearch = async (searchQuery) => {
  try {
    isLoading.value = true;
    error.value = '';
    // 这里使用模拟数据进行搜索，实际项目中应该调用API
    const response = await apiService.games.getGames();
    // 在前端过滤结果
    results.value = response.data.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } catch (err) {
    console.error('Search failed:', err);
    error.value = 'Search failed. Please try again later.';
    results.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 初始化搜索
onMounted(async () => {
  if (props.query) {
    await performSearch(props.query);
  }
});

// 监听查询变化
watch(() => props.query, async (newQuery) => {
  await performSearch(newQuery);
});
</script>

<style scoped>
.search-results-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
}

.loading-state i, .empty-state i {
  margin-bottom: 15px;
  color: #409eff;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style>