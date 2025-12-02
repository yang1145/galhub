<template>
  <div class="popular-content">
    <h2>热门游戏</h2>
    <p>这里展示最受欢迎的美少女游戏</p>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <font-awesome-icon :icon="['fas', 'spinner']" spin size="3x" />
      <p>正在加载游戏数据...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="games.length === 0" class="empty-state">
      <font-awesome-icon :icon="['fas', 'gamepad']" size="3x" />
      <p>暂无热门游戏数据</p>
    </div>
    
    <!-- 游戏列表 -->
    <div v-else class="game-grid">
      <GameCard 
        v-for="game in games" 
        :key="game.id" 
        :game="game" 
        @select="(game) => $router.push(`/game/${game.id}`)" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GameCard from '../components/ui/GameCard.vue';
import { apiService } from '../services/apiService';

// 游戏数据
const games = ref([]);
const isLoading = ref(false);
const error = ref('');

// 加载热门游戏数据
const loadPopularGames = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await apiService.games.getGames();
    // 假设API返回的是按热度排序的游戏列表，或者在这里添加排序逻辑
    games.value = response.data;
  } catch (err) {
    console.error('Failed to load popular games:', err);
    error.value = 'Failed to load popular games. Please try again later.';
    games.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 初始化数据
onMounted(async () => {
  await loadPopularGames();
});
</script>

<style scoped>
.popular-content {
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