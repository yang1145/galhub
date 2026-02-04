<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-6 border-b border-slate-100">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 flex items-center">
          <Search class="w-6 h-6 text-primary-500 mr-2" /> 搜索结果
        </h2>
        <p class="text-slate-500 mt-1">关于 "{{ query }}" 的搜索结果</p>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center">
      {{ error }}
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
      <Loader2 class="w-10 h-10 animate-spin mb-4 text-primary-400" />
      <p>正在搜索游戏...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="results.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
      <Ghost class="w-16 h-16 mb-4 text-slate-300" />
      <p class="text-lg font-medium text-slate-500">没有找到相关游戏</p>
      <p class="text-sm">尝试更换关键词搜索</p>
    </div>
    
    <!-- 搜索结果列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
import { Search, Loader2, Ghost } from 'lucide-vue-next';

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
