<script setup>
// 导入模块化组件和数据
import { ref } from 'vue';
import { games } from './data/games.js';
import GameCard from './components/GameCard.vue';
import Layout from './components/Layout.vue';
import About from './components/About.vue';
import Category from './components/Category.vue';
import GameDetail from './components/GameDetail.vue';

// 页面状态管理
const currentPage = ref('home');
// 选中的游戏
const selectedGame = ref(null);

// 切换页面
const navigateTo = (page) => {
  currentPage.value = page;
  selectedGame.value = null; // 清除选中的游戏
};

// 选择游戏
const selectGame = (game) => {
  selectedGame.value = game;
  currentPage.value = 'detail'; // 切换到详情页
};

// 返回列表
const goBack = () => {
  selectedGame.value = null;
  currentPage.value = 'home'; // 返回到首页
};
</script>

<template>
  <Layout :current-page="currentPage" @navigate="navigateTo">
    <!-- 首页内容 -->
    <div v-if="currentPage === 'home'" class="games-grid">
      <GameCard 
        v-for="game in games" 
        :key="game.id" 
        :game="game"
        @select="selectGame"
      />
    </div>
    
    <!-- 游戏详情页 -->
    <GameDetail 
      v-else-if="currentPage === 'detail'" 
      :game="selectedGame"
      @go-back="goBack"
    />
    
    <!-- 分类页面 -->
    <Category v-else-if="currentPage === 'category'" />
    
    <!-- 关于页面内容 -->
    <About v-else-if="currentPage === 'about'" />
  </Layout>
</template>

<style scoped>
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}
</style>
