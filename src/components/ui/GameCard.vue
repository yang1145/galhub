<template>
  <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer" @click="selectGame">
    <!-- 图片区域 -->
    <div class="relative aspect-[16/9] w-full overflow-hidden">
      <img 
        :src="game.image" 
        :alt="game.title" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <!-- 悬浮时的遮罩 (可选) -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <!-- 内容区域 -->
    <div class="p-5 flex flex-col flex-1">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-primary-500 transition-colors">
          {{ game.title }}
        </h3>
      </div>
      
      <!-- 标签与评分 -->
      <div class="flex items-center justify-between mb-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {{ game.genre }}
        </span>
        <div class="flex items-center text-yellow-400 font-bold text-sm">
          <Star class="w-3.5 h-3.5 fill-current mr-1" />
          <span>{{ game.rating }}</span>
        </div>
      </div>

      <p class="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
        {{ game.description }}
      </p>

      <!-- 底部按钮 -->
      <div class="pt-4 border-t border-slate-50 flex justify-end">
        <button class="text-sm font-medium text-primary-500 hover:text-primary-600 flex items-center transition-all group/btn">
          了解更多 
          <ArrowRight class="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Star, ArrowRight } from 'lucide-vue-next';

// 定义组件属性
const props = defineProps({
  game: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['select']);

// 选择游戏
const selectGame = () => {
  emit('select', props.game);
};
</script>
