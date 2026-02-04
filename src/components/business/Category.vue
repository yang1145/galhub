<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    <!-- 头部区域 -->
    <div class="text-center py-12 bg-white rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50 -ml-10 -mb-10"></div>
      
      <div class="relative z-10">
        <h1 class="text-3xl font-extrabold text-slate-800 mb-4 flex items-center justify-center">
          <LayoutGrid class="w-8 h-8 mr-3 text-primary-500" /> 游戏分类
        </h1>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto">浏览不同类型的Galgame，邂逅你的心动之选</p>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center flex items-center justify-center">
      <AlertCircle class="w-5 h-5 mr-2" />
      {{ error }}
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
      <Loader2 class="w-10 h-10 animate-spin mb-4 text-primary-400" />
      <p>正在加载分类数据...</p>
    </div>
    
    <!-- 分类列表 -->
    <div v-else-if="categories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      <button 
        v-for="category in categories" 
        :key="category.id || category.name"
        class="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 group"
        @click="filterByCategory(category.name)"
        :class="{ 'ring-2 ring-primary-400 border-primary-400 bg-primary-50': selectedCategory === category.name }"
      >
        <component :is="category.icon" class="w-10 h-10 mb-3 text-primary-400 group-hover:text-primary-600 transition-colors" />
        <h3 class="font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{{ category.name }}</h3>
        <p class="text-xs text-slate-400 mt-1">{{ category.count || 0 }} 款游戏</p>
      </button>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
      <Inbox class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-slate-500">暂无分类数据</h3>
      <p class="text-slate-400 text-sm">请稍后重试或联系管理员</p>
    </div>
    
    <!-- 筛选后的游戏 -->
    <div v-if="selectedCategory && !isLoading" class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center">
          <span class="text-primary-500 mr-2">#</span> {{ selectedCategory }}
          <span class="text-base font-normal text-slate-500 ml-2">({{ filteredGames.length }} 款游戏)</span>
        </h2>
        <button @click="clearFilter" class="text-sm font-medium text-slate-500 hover:text-primary-500 flex items-center transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100">
          <X class="w-4 h-4 mr-1" /> 清除筛选
        </button>
      </div>
      
      <div v-if="filteredGames.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GameCard 
          v-for="game in filteredGames" 
          :key="game.id" 
          :game="game"
        />
      </div>
      <div v-else class="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Ghost class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 class="text-lg font-medium text-slate-600">该分类下暂无游戏</h3>
        <p class="text-slate-400 text-sm mb-6">请尝试其他分类或稍后重试</p>
        <button @click="clearFilter" class="text-primary-500 font-medium hover:underline">查看所有游戏</button>
      </div>
    </div>
    
    <!-- 所有游戏 (按分类展示) -->
    <div v-else-if="!isLoading" class="space-y-12 animate-fade-in">
      <div v-for="category in categories" :key="category.id || category.name" class="space-y-6">
        <div v-if="getGamesByCategory(category.name).length > 0">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-xl font-bold text-slate-800 border-l-4 border-primary-500 pl-3">
               {{ category.name }}
             </h3>
             <button @click="filterByCategory(category.name)" class="text-sm font-medium text-primary-500 hover:text-primary-600 hover:underline">
               查看更多 &rarr;
             </button>
           </div>
           
           <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             <GameCard 
               v-for="game in getGamesByCategory(category.name)" 
               :key="game.id" 
               :game="game"
             />
           </div>
        </div>
      </div>
    </div>
    
    <!-- 返回顶部按钮 -->
    <transition name="fade">
      <button 
        v-if="showBackToTop" 
        class="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 z-50"
        @click="scrollToTop"
      >
        <ArrowUp class="w-6 h-6" />
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue';
import { apiService } from '../../services/apiService';
import GameCard from '../ui/GameCard.vue';
import { 
  LayoutGrid, 
  Loader2, 
  AlertCircle, 
  Inbox, 
  Ghost, 
  X, 
  ArrowUp,
  Compass,     // 冒险
  Zap,         // 动作
  Brain,       // 策略
  Swords,      // 角色扮演
  Flag,        // 竞速
  Hammer,      // 模拟
  Gamepad2     // 默认
} from 'lucide-vue-next';

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
    
    // 图标映射
    // 注意：使用 shallowRef 或直接存储组件对象，避免响应式包装组件导致性能问题
    const categoryIcons = {
      '冒险': Compass,
      '动作': Zap,
      '策略': Brain,
      '角色扮演': Swords,
      '竞速': Flag,
      '模拟': Hammer
    };
    
    categories.value = response.data.map(category => ({
      ...category,
      icon: categoryIcons[category.name] || Gamepad2
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
/* 简单的淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
