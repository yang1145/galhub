<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-6 border-b border-slate-100">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 flex items-center">
          <Clock class="w-6 h-6 text-primary-500 mr-2" /> 最新游戏
        </h2>
        <p class="text-slate-500 mt-1">探索最新发布的Galgame</p>
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
      <p class="text-lg font-medium text-slate-500">暂无最新游戏数据</p>
      <p class="text-sm">稍后再来看看吧</p>
    </div>
    
    <!-- 游戏列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
import { Clock, Loader2, Gamepad2 } from 'lucide-vue-next';

// 游戏数据
const games = ref([]);
const isLoading = ref(false);
const error = ref('');

// 加载最新游戏数据
const loadLatestGames = async () => {
    try {
      isLoading.value = true;
      error.value = '';
      const response = await apiService.games.getLatestGames();
      games.value = response.data;
    } catch (err) {
      console.error('Failed to load latest games:', err);
      error.value = 'Failed to load latest games. Please try again later.';
      games.value = [];
    } finally {
      isLoading.value = false;
    }
  };

// 初始化数据
onMounted(async () => {
  await loadLatestGames();
});
</script>
