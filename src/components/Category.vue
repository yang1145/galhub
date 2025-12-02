<template>
  <div class="category-container">
    <div class="category-header">
      <h1>游戏分类</h1>
      <p>浏览不同类型的精彩游戏</p>
    </div>
    
    <div class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.name"
        class="category-card"
        @click="filterByCategory(category.name)"
        :class="{ active: selectedCategory === category.name }"
      >
        <div class="category-icon">
          <font-awesome-icon :icon="category.icon" />
        </div>
        <h3>{{ category.name }}</h3>
        <p>{{ category.count }} 款游戏</p>
      </div>
    </div>
    
    <div class="filtered-games" v-if="selectedCategory">
      <h2>{{ selectedCategory }}游戏</h2>
      <div class="games-grid">
        <GameCard 
          v-for="game in filteredGames" 
          :key="game.id" 
          :game="game"
        />
      </div>
      <button @click="clearFilter" class="btn btn-secondary">查看所有分类</button>
    </div>
    
    <div class="all-games" v-else>
      <h2>所有游戏</h2>
      <div class="games-by-category" v-for="category in categories" :key="category.name">
        <h3>{{ category.name }}</h3>
        <div class="games-grid">
          <GameCard 
            v-for="game in getGamesByCategory(category.name)" 
            :key="game.id" 
            :game="game"
          />
        </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { games } from '../data/games.js';
import GameCard from './GameCard.vue';

// 计算每个分类的游戏数量
const getCategoryCount = (categoryName) => {
  return games.filter(game => game.genre === categoryName).length;
};

// 分类数据
const categories = ref([
  { name: '冒险', icon: ['fas', 'hat-cowboy'], count: getCategoryCount('冒险') },
  { name: '动作', icon: ['fas', 'fist-raised'], count: getCategoryCount('动作') },
  { name: '策略', icon: ['fas', 'chess'], count: getCategoryCount('策略') },
  { name: '角色扮演', icon: ['fas', 'dragon'], count: getCategoryCount('角色扮演') },
  { name: '竞速', icon: ['fas', 'car'], count: getCategoryCount('竞速') },
  { name: '模拟', icon: ['fas', 'tractor'], count: getCategoryCount('模拟') }
]);

// 当前选中的分类
const selectedCategory = ref('');

// 是否显示返回顶部按钮
const showBackToTop = ref(false);

// 根据分类过滤游戏
const filteredGames = computed(() => {
  if (!selectedCategory.value) return [];
  return games.filter(game => game.genre === selectedCategory.value);
});

// 获取指定分类的游戏
const getGamesByCategory = (categoryName) => {
  return games.filter(game => game.genre === categoryName);
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

// 组件挂载时添加滚动监听
onMounted(() => {
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
  border-color: #3498db;
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #3498db;
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
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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
}
</style>