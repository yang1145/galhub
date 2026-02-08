<template>
  <div class="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
    <!-- 主要内容区域 -->
    <main class="flex-grow flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <!-- 404 标题 -->
      <div class="mb-8 animate-fade-in">
        <h1 class="text-[clamp(3rem,10vw,6rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 mb-4">404</h1>
        <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold text-slate-800 mb-6">页面不存在</h2>
        <p class="text-slate-500 max-w-md mx-auto">抱歉，您访问的页面不存在或已被移除。请尝试搜索或返回首页。</p>
      </div>

      <!-- 搜索功能 -->
      <div class="w-full max-w-md mb-12 animate-slide-up">
        <form @submit.prevent="handleSearch" class="relative group">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索游戏..." 
            class="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-300 outline-none placeholder-slate-400 shadow-sm"
          />
          <Search class="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <button 
            type="submit" 
            class="absolute right-2 top-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            搜索
          </button>
        </form>
      </div>

      <!-- 热门链接 -->
      <div class="w-full max-w-2xl mb-12 animate-slide-up-delay">
        <h3 class="text-lg font-semibold text-slate-700 mb-6">热门游戏分类</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <router-link 
            :to="{ name: 'Category' }" 
            class="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 hover:border-primary-200"
          >
            <LayoutGrid class="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <span class="text-sm font-medium text-slate-700">全部游戏</span>
          </router-link>
          <router-link 
            :to="{ name: 'Latest' }" 
            class="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 hover:border-primary-200"
          >
            <Clock class="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <span class="text-sm font-medium text-slate-700">最新发布</span>
          </router-link>
          <router-link 
            :to="{ name: 'Popular' }" 
            class="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 hover:border-primary-200"
          >
            <Flame class="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <span class="text-sm font-medium text-slate-700">热门游戏</span>
          </router-link>
          <router-link 
            :to="{ name: 'Home' }" 
            class="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 hover:border-primary-200"
          >
            <Home class="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <span class="text-sm font-medium text-slate-700">返回首页</span>
          </router-link>
        </div>
      </div>

      <!-- 返回首页按钮 -->
      <div class="animate-fade-in-delay">
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all duration-300"
        >
          <Home class="w-5 h-5 mr-2" />
          返回首页
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Home, LayoutGrid, Clock, Flame } from 'lucide-vue-next';

const router = useRouter();
const searchQuery = ref('');

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value.trim() } });
  }
};
</script>

<style scoped>
/* 404页面样式 */

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-slide-up-delay {
  animation: slideUp 0.6s ease-out forwards;
  animation-delay: 0.4s;
  opacity: 0;
}

.animate-fade-in-delay {
  animation: fadeIn 0.6s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;
}
</style>
