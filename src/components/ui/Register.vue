<template>
  <form class="space-y-5" @submit.prevent="handleRegister">
    <!-- 用户名输入 -->
    <div class="space-y-1.5">
      <label for="reg-username" class="text-sm font-semibold text-slate-700 block">用户名</label>
      <div class="relative">
        <User class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          id="reg-username" 
          v-model="username" 
          placeholder="请输入用户名" 
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
          required
          minlength="3"
          maxlength="20"
        />
      </div>
    </div>
    
    <!-- 邮箱输入 -->
    <div class="space-y-1.5">
      <label for="email" class="text-sm font-semibold text-slate-700 block">邮箱</label>
      <div class="relative">
        <Mail class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="请输入邮箱" 
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
          required
        />
      </div>
    </div>
    
    <!-- 密码输入 -->
    <div class="space-y-1.5">
      <label for="reg-password" class="text-sm font-semibold text-slate-700 block">密码</label>
      <div class="relative">
        <Lock class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="password" 
          id="reg-password" 
          v-model="password" 
          placeholder="请输入密码 (至少6位)" 
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
          required
          minlength="6"
        />
      </div>
    </div>
    
    <!-- 确认密码 -->
    <div class="space-y-1.5">
      <label for="confirm-password" class="text-sm font-semibold text-slate-700 block">确认密码</label>
      <div class="relative">
        <CheckCircle2 class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="password" 
          id="confirm-password" 
          v-model="confirmPassword" 
          placeholder="请再次输入密码" 
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
          required
        />
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
      {{ error }}
    </div>
    
    <!-- 注册按钮 -->
    <button 
      type="submit" 
      class="w-full bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
      :disabled="isLoading"
    >
      <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin mr-2" />
      <UserPlus v-else class="w-5 h-5 mr-2" />
      {{ isLoading ? '注册中...' : '立即注册' }}
    </button>
    
    <!-- 登录链接 -->
    <div class="text-center text-sm text-slate-500 mt-4">
      <span>已有账号？</span>
      <a href="#" @click.prevent="$emit('switch-to-login')" class="text-primary-500 hover:text-primary-600 font-semibold hover:underline ml-1">
        立即登录
      </a>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { User, Lock, Mail, CheckCircle2, UserPlus, Loader2 } from 'lucide-vue-next';

// 定义props
const props = defineProps(['isLoading']);
// 定义事件
const emit = defineEmits(['register', 'switch-to-login']);

// 表单数据
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

// 处理注册
const handleRegister = () => {
  // 表单验证
  if (!username.value.trim() || !email.value.trim() || !password.value || !confirmPassword.value) {
    error.value = '请填写所有字段';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = '密码和确认密码不匹配';
    return;
  }
  
  if (password.value.length < 6) {
    error.value = '密码长度至少为6个字符';
    return;
  }
  
  // 清除错误信息
  error.value = '';
  
  // 发送注册请求到父组件
  emit('register', {
    username: username.value.trim(),
    email: email.value.trim(),
    password: password.value
  });
};
</script>
