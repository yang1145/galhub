<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" v-if="game">
    <!-- 返回按钮 -->
    <button 
      class="flex items-center text-slate-500 hover:text-primary-500 transition-colors mb-6 group font-medium" 
      @click="goBack"
    >
      <ArrowLeft class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" /> 
      返回列表
    </button>
    
    <!-- 顶部主要内容区 -->
    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8 flex flex-col md:flex-row">
      <!-- 游戏图片 -->
      <div class="w-full md:w-1/2 lg:w-7/12 relative group">
        <div class="aspect-video w-full h-full overflow-hidden">
           <img 
            :src="game.image" 
            :alt="game.title" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
      </div>
      
      <!-- 游戏信息 -->
      <div class="w-full md:w-1/2 lg:w-5/12 p-8 md:p-10 flex flex-col justify-center bg-white relative">
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
          {{ game.title }}
        </h1>
        
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-50 text-primary-600 border border-primary-100">
            {{ game.genre }}
          </span>
          <div class="flex items-center text-yellow-400 font-bold text-lg">
            <Star class="w-5 h-5 fill-current mr-1.5" />
            <span>{{ game.rating }}</span>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-lg font-bold text-slate-800 mb-2 flex items-center">
            <BookOpen class="w-5 h-5 mr-2 text-primary-500" /> 剧情简介
          </h2>
          <p class="text-slate-600 leading-relaxed text-base">{{ game.description }}</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-slate-100">
          <button class="flex-1 bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center group">
            <Play class="w-5 h-5 mr-2 fill-current" /> 立即启动
          </button>
          <button class="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 hover:text-primary-500 hover:border-primary-200 font-bold py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-center items-center group">
            <Heart class="w-5 h-5 mr-2 group-hover:fill-current transition-colors" /> 收藏
          </button>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 游戏详情扩展信息 (左侧 2/3) -->
      <div class="lg:col-span-2 space-y-8">
         <!-- 详细数据卡片 -->
         <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
              <Info class="w-6 h-6 text-primary-500 mr-2" /> 详细信息
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="flex items-start p-4 rounded-xl bg-slate-50">
                <Calendar class="w-10 h-10 text-primary-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 class="text-sm font-semibold text-slate-500 mb-1">发布日期</h3>
                  <p class="text-lg font-bold text-slate-800">2023-12-15</p>
                </div>
              </div>
              <div class="flex items-start p-4 rounded-xl bg-slate-50">
                <Users class="w-10 h-10 text-primary-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 class="text-sm font-semibold text-slate-500 mb-1">制作组</h3>
                  <p class="text-lg font-bold text-slate-800">Galgame制作工作室</p>
                </div>
              </div>
              <div class="flex items-start p-4 rounded-xl bg-slate-50 sm:col-span-2">
                <Star class="w-10 h-10 text-primary-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 class="text-sm font-semibold text-slate-500 mb-1">玩家评分</h3>
                  <p class="flex items-center text-lg font-bold text-slate-800">
                    <span class="text-yellow-400 mr-2">{{ game.rating }}</span>
                    <span class="text-slate-400 text-sm font-normal">(基于 1,234 条真实评价)</span>
                  </p>
                </div>
              </div>
            </div>
         </div>
         
         <!-- 评论区 -->
         <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
           <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
             <MessageSquare class="w-6 h-6 text-primary-500 mr-2" /> 玩家评论
           </h2>
           <div class="space-y-6">
             <div v-for="comment in comments" :key="comment.id" class="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-100 hover:shadow-sm transition-all duration-300">
               <div class="flex justify-between items-start mb-3">
                 <div class="flex items-center">
                   <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-purple-400 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                     {{ comment.username.charAt(0) }}
                   </div>
                   <span class="font-bold text-slate-700">{{ comment.username }}</span>
                 </div>
                 <div class="flex items-center bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                   <Star class="w-3.5 h-3.5 text-yellow-400 fill-current mr-1" />
                   <span class="text-sm font-bold text-slate-700">{{ comment.rating }}</span>
                 </div>
               </div>
               <p class="text-slate-600 leading-relaxed text-sm pl-13">{{ comment.content }}</p>
             </div>
           </div>
         </div>
      </div>
      
      <!-- 侧边栏推荐 (右侧 1/3) -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h3 class="text-xl font-bold mb-2 relative z-10">喜欢这款游戏？</h3>
          <p class="text-primary-100 mb-6 text-sm relative z-10">加入我们的社区，发现更多同类佳作！</p>
          <button class="w-full bg-white text-primary-600 font-bold py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-sm">
            查看更多推荐
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Star, Play, Heart, Calendar, Users, Info, MessageSquare, BookOpen } from 'lucide-vue-next';

// 定义组件属性
const props = defineProps({
  game: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['goBack']);

// 模拟评论数据
const comments = [
  {
    id: 1,
    username: 'Galgame爱好者',
    rating: 5,
    content: '这款Galgame真的太棒了！画风精美，剧情动人，角色塑造非常出色，强烈推荐给大家！'
  },
  {
    id: 2,
    username: '纯爱战士',
    rating: 4,
    content: '游戏总体来说还是不错的，但是有些剧情分支有点复杂，希望能优化一下。'
  },
  {
    id: 3,
    username: '资深Gal玩家',
    rating: 4.5,
    content: '作为一个资深Galgame玩家，这款游戏的创新剧情让我眼前一亮，期待后续更新！'
  }
];

// 返回列表
const goBack = () => {
  emit('goBack');
};
</script>
