<template>
  <div class="category-container">
    <div class="category-header">
      <h1>游戏分类</h1>
      <p>浏览不同类型的精彩游戏</p>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>
    
    <!-- 分类列表 -->
    <div v-else-if="categories.length > 0" class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.id || category.name"
        class="category-card"
        @click="filterByCategory(category.name)"
        :class="{ active: selectedCategory === category.name }"
      >
        <div class="category-icon">
          <font-awesome-icon :icon="category.icon" />
        </div>
        <h3>{{ category.name }}</h3>
        <p>{{ category.count || 0 }} 款游戏</p>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <h3>暂无分类数据</h3>
      <p>请稍后重试或联系管理员</p>
    </div>
    
    <!-- 筛选后的游戏 -->
    <div v-if="selectedCategory && !isLoading" class="filtered-games">
      <h2>{{ selectedCategory }}游戏</h2>
      <div v-if="filteredGames.length > 0" class="games-grid">
        <GameCard 
          v-for="game in filteredGames" 
          :key="game.id" 
          :game="game"
        />
      </div>
      <div v-else class="empty-state">
        <h3>该分类下暂无游戏</h3>
        <p>请尝试其他分类或稍后重试</p>
      </div>
      <button @click="clearFilter" class="btn btn-secondary">查看所有分类</button>
    </div>
    
    <!-- 所有游戏 -->
    <div v-else-if="!isLoading" class="all-games">
      <h2>所有游戏</h2>
      <div v-if="categories.length > 0" class="games-by-category" v-for="category in categories" :key="category.id || category.name">
        <h3>{{ category.name }}</h3>
        <div v-if="getGamesByCategory(category.name).length > 0" class="games-grid">
          <GameCard 
            v-for="game in getGamesByCategory(category.name)" 
            :key="game.id" 
            :game="game"
          />
        </div>
        <div v-else class="empty-state">
          <p>该分类下暂无游戏</p>
        </div>
      </div>
      <div v-else class="empty-state">
        <h3>暂无游戏数据</h3>
        <p>请稍后重试或联系管理员</p>
      </div>
    </div>
    
    <!-- 返回顶部按钮 -->
    <button 
      v-if="showBackToTop" 
      class="back-to-top"
      @click="scrollToTop"
    >
      <font-awesome-icon :icon="['fas', 'arrow-up']" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { apiService } from '../../services/apiService';
import GameCard from '../ui/GameCard.vue';

// 分类数据
const categories = ref([]);
// 所有游戏数据
const allGames = ref([]);
// 当前选中的分类
const selectedCategory = ref('');
// 是否显示返回顶部按钮
const showBackToTop = ref(false);
// 加载状态
const isLoading = ref(false);
// 错误信息
const error = ref('');

// 加载分类数据
const loadCategories = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await apiService.categories.getCategories();
    // 为每个分类添加图标映射
    const categoryIcons = {
      '冒险': ['fas', 'hat-cowboy'],
      '动作': ['fas', 'fist-raised'],
      '策略': ['fas', 'chess'],
      '角色扮演': ['fas', 'dragon'],
      '竞速': ['fas', 'car'],
      '模拟': ['fas', 'tractor']
    };
    categories.value = response.data.map(category => ({
      ...category,
      icon: categoryIcons[category.name] || ['fas', 'gamepad']
    }));
  } catch (err) {
    console.error('加载分类失败:', err);
    error.value = '加载分类失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

// 加载游戏数据
const loadGames = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await apiService.games.getGames();
    allGames.value = response.data;
  } catch (err) {
    console.error('加载游戏失败:', err);
    error.value = '加载游戏失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

// 根据分类过滤游戏
const filteredGames = computed(() => {
  if (!selectedCategory.value) return [];
  return allGames.value.filter(game => game.genre === selectedCategory.value);
});

// 获取指定分类的游戏
const getGamesByCategory = (categoryName) => {
  return allGames.value.filter(game => game.genre === categoryName);
};

// 按分类筛选
const filterByCategory = (category) => {
  selectedCategory.value = category;
  // 筛选后滚动到顶部
  scrollToTop();
};

// 清除筛选
const clearFilter = () => {
  selectedCategory.value = '';
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 组件挂载时加载数据和添加滚动监听
onMounted(async () => {
  await Promise.all([loadCategories(), loadGames()]);
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.category-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.category-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: #f8f9fa;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.category-header h1 {
  font-size: 2rem;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
}

.category-header p {
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
  color: #666;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
}

.category-card:hover,
.category-card.active {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #ff69b4;
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #ff69b4;
}

.category-card h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.category-card p {
  color: #666;
  font-size: 0.95rem;
}

.filtered-games h2,
.all-games h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #eee;
}

.games-by-category {
  margin-bottom: 40px;
}

.games-by-category h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.btn-secondary {
  display: block;
  margin: 0 auto;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ff69b4;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top:hover {
  background-color: #ff1493;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 16px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff69b4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 1.1rem;
}

/* 错误信息样式 */
.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 16px 20px;
  border-radius: 8px;
  margin: 0 auto 30px;
  max-width: 800px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background-color: #fef2f2;
  border: 2px dashed #fee2e2;
  border-radius: 12px;
  margin: 20px 0;
}

.empty-state h3 {
  color: #991b1b;
  margin-bottom: 8px;
}

.empty-state p {
  color: #b91c1c;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-container {
    padding: 20px 15px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
  
  .category-card {
    padding: 20px 15px;
  }
  
  .category-icon {
    font-size: 2rem;
  }
  
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .category-header h1 {
    font-size: 1.7rem;
  }
  
  .category-header p {
    font-size: 1rem;
  }
  
  .filtered-games h2,
  .all-games h2 {
    font-size: 1.5rem;
  }
  
  .games-by-category h3 {
    font-size: 1.3rem;
  }
  
  /* 移动端返回顶部按钮 */
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
  
  /* 移动端加载状态 */
  .loading-spinner {
    width: 40px;
    height: 40px;
  }
  
  /* 移动端错误信息 */
  .error-message {
    margin: 0 auto 20px;
    padding: 12px 16px;
    font-size: 0.9rem;
  }
  
  /* 移动端空状态 */
  .empty-state {
    padding: 20px 15px;
    margin: 15px 0;
  }
}
</style>