<script setup>
import { 
  Gamepad2, 
  Star, 
  Users, 
  Rocket, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Code2, 
  Palette, 
  PenTool 
} from 'lucide-vue-next';
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    <!-- 头部区域 -->
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-extrabold text-slate-800">关于我们</h1>
      <p class="text-xl text-slate-500 max-w-2xl mx-auto">邂逅心动故事，邂逅美好时光</p>
    </div>
    
    <!-- 平台介绍 -->
    <section class="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
      <h2 class="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-primary-500 pl-4">平台介绍</h2>
      <div class="space-y-4 text-slate-600 leading-relaxed text-lg">
        <p>GalHub 是一个专注于为玩家提供最新、最热门Galgame资讯和下载服务的综合性平台。我们致力于打造一个温馨、浪漫、优质的Galgame社区，让每一位玩家都能在这里邂逅属于自己的心动故事。</p>
        <p>无论是纯爱、悬疑、奇幻还是日常系，我们都能为您提供丰富多样的Galgame选择，让您沉浸在动人的剧情与精美的画面之中。</p>
      </div>
    </section>
      
    <!-- 我们的使命 -->
    <section>
      <h2 class="text-2xl font-bold text-slate-800 mb-8 text-center">我们的使命</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-300 text-center group">
          <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-500 group-hover:scale-110 transition-transform">
            <Gamepad2 class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">精选佳作</h3>
          <p class="text-slate-500">为您精心筛选优质Galgame，提供丰富多样的选择</p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-300 text-center group">
          <div class="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
            <Star class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">用心推荐</h3>
          <p class="text-slate-500">提供真诚、用心的游戏推荐和剧情介绍</p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-300 text-center group">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 group-hover:scale-110 transition-transform">
            <Users class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">Galgame社区</h3>
          <p class="text-slate-500">构建温馨的Galgame社区，促进玩家交流与分享</p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-300 text-center group">
          <div class="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-500 group-hover:scale-110 transition-transform">
            <Rocket class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">持续优化</h3>
          <p class="text-slate-500">持续优化平台体验，提供更美好的游戏时光</p>
        </div>
      </div>
    </section>
      
    <!-- 团队成员 -->
    <section class="bg-slate-50 rounded-3xl p-8 md:p-12">
      <h2 class="text-2xl font-bold text-slate-800 mb-8 text-center">团队成员</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center group">
          <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 shadow-sm group-hover:text-primary-500 group-hover:shadow-md transition-all">
            <User class="w-10 h-10" />
          </div>
          <h3 class="font-bold text-slate-800 text-lg">张三</h3>
          <p class="text-primary-500 text-sm font-medium mt-1">创始人 & CEO</p>
        </div>
        <div class="text-center group">
          <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 shadow-sm group-hover:text-blue-500 group-hover:shadow-md transition-all">
            <Code2 class="w-10 h-10" />
          </div>
          <h3 class="font-bold text-slate-800 text-lg">李四</h3>
          <p class="text-primary-500 text-sm font-medium mt-1">技术总监</p>
        </div>
        <div class="text-center group">
          <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 shadow-sm group-hover:text-pink-500 group-hover:shadow-md transition-all">
            <Palette class="w-10 h-10" />
          </div>
          <h3 class="font-bold text-slate-800 text-lg">王五</h3>
          <p class="text-primary-500 text-sm font-medium mt-1">设计总监</p>
        </div>
        <div class="text-center group">
          <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 shadow-sm group-hover:text-purple-500 group-hover:shadow-md transition-all">
            <PenTool class="w-10 h-10" />
          </div>
          <h3 class="font-bold text-slate-800 text-lg">赵六</h3>
          <p class="text-primary-500 text-sm font-medium mt-1">内容编辑</p>
        </div>
      </div>
    </section>
      
    <!-- 联系我们 -->
    <section class="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
      <h2 class="text-2xl font-bold text-slate-800 mb-8 border-l-4 border-primary-500 pl-4">联系我们</h2>
      <div class="space-y-6">
        <div class="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors group">
          <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mr-4 shadow-sm group-hover:text-primary-500">
            <Mail class="w-5 h-5" />
          </div>
          <span class="text-slate-600 font-medium">contact@galhub.com</span>
        </div>
        <div class="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors group">
          <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mr-4 shadow-sm group-hover:text-primary-500">
             <Phone class="w-5 h-5" />
          </div>
          <span class="text-slate-600 font-medium">+86 123 4567 8910</span>
        </div>
        <div class="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors group">
          <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mr-4 shadow-sm group-hover:text-primary-500">
            <MapPin class="w-5 h-5" />
          </div>
          <span class="text-slate-600 font-medium">北京市朝阳区科技园区A座1001室</span>
        </div>
      </div>
    </section>
  </div>
</template>
