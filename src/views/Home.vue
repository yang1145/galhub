<template>
  <div class="space-y-8">
    <!-- 欢迎头部 -->
    <div class="text-center py-12 bg-white rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
      <!-- 装饰背景 -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300"></div>
      <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div class="relative z-10 px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
          欢迎来到 <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">GalHub</span>
        </h1>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto">
          探索最新最热门的Galgame，邂逅属于你的心动与感动。
        </p>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center">
      {{ error }}
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
      <Loader2 class="w-10 h-10 animate-spin mb-4 text-primary-400" />
      <p>正在加载游戏数据...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="games.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
      <Gamepad2 class="w-16 h-16 mb-4 text-slate-300" />
      <p class="text-lg font-medium text-slate-500">暂无游戏数据</p>
      <p class="text-sm">稍后再来看看吧</p>
    </div>
    
    <!-- 游戏列表 -->
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center">
          <Sparkles class="w-5 h-5 text-primary-500 mr-2" /> 精选推荐
        </h2>
        <button class="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">查看全部 &rarr;</button>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GameCard 
          v-for="game in games" 
          :key="game.id" 
          :game="game" 
          @select="(game) => $router.push(`/game/${game.id}`)" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GameCard from '../components/ui/GameCard.vue';
import { apiService } from '../services/apiService';
import { Loader2, Gamepad2, Sparkles } from 'lucide-vue-next';

// 游戏数据
const games = ref([]);
const isLoading = ref(false);
const error = ref('');

// 加载游戏数据
const loadGames = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await apiService.games.getGames();
    games.value = response.data;
  } catch (err) {
    console.error('Failed to load games:', err);
    error.value = 'Failed to load games. Please try again later.';
    games.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 初始化数据
onMounted(async () => {
  await loadGames();
});
</script>
