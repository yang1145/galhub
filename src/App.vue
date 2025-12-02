<script setup>
// 导入模块化组件和数据
import { ref } from 'vue';
import { games } from './data/games.js';
import GameCard from './components/GameCard.vue';
import Layout from './components/Layout.vue';
import About from './components/About.vue';
import Category from './components/Category.vue';

// 页面状态管理
const currentPage = ref('home');

// 切换页面
const navigateTo = (page) => {
  currentPage.value = page;
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
      />
    </div>
    
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
