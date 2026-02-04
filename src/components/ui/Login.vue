<template>
  <form class="space-y-6" @submit.prevent="handleLogin">
    <!-- 用户名输入 -->
    <div class="space-y-2">
      <label for="username" class="text-sm font-semibold text-slate-700 block">用户名</label>
      <div class="relative">
        <User class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="请输入用户名" 
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
          required
        />
      </div>
    </div>
    
    <!-- 密码输入 -->
    <div class="space-y-2">
      <label for="password" class="text-sm font-semibold text-slate-700 block">密码</label>
      <div class="relative">
        <Lock class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="请输入密码" 
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
          required
        />
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
      {{ error }}
    </div>
    
    <!-- 登录按钮 -->
    <button 
      type="submit" 
      class="w-full bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
      :disabled="isLoading"
    >
      <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin mr-2" />
      <LogIn v-else class="w-5 h-5 mr-2" />
      {{ isLoading ? '登录中...' : '立即登录' }}
    </button>
    
    <!-- 注册链接 -->
    <div class="text-center text-sm text-slate-500 mt-4">
      <span>还没有账号？</span>
      <a href="#" @click.prevent="$emit('switch-to-register')" class="text-primary-500 hover:text-primary-600 font-semibold hover:underline ml-1">
        立即注册
      </a>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { User, Lock, LogIn, Loader2 } from 'lucide-vue-next';

// 定义props
const props = defineProps(['isLoading']);
// 定义事件
const emit = defineEmits(['login', 'switch-to-register']);

// 表单数据
const username = ref('');
const password = ref('');
const error = ref('');

// 处理登录
const handleLogin = () => {
  // 表单验证
  if (!username.value.trim() || !password.value.trim()) {
    error.value = '请输入用户名和密码';
    return;
  }
  
  // 清除错误信息
  error.value = '';
  
  // 发送登录请求到父组件
  emit('login', { username: username.value.trim(), password: password.value.trim() });
};
</script>
