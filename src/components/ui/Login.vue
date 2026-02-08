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
    
    <!-- 验证码输入 -->
    <div class="space-y-2">
      <label for="captcha" class="text-sm font-semibold text-slate-700 block">验证码</label>
      <div class="flex space-x-3">
        <div class="relative flex-1">
          <input 
            type="text" 
            id="captcha" 
            v-model="captchaText" 
            placeholder="请输入验证码" 
            class="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
            required
          />
        </div>
        <div class="flex-shrink-0">
          <div 
            class="w-32 h-12 border border-slate-200 rounded-lg overflow-hidden cursor-pointer"
            @click="refreshCaptcha"
            title="点击刷新验证码"
          >
            <div v-if="captchaSvg" v-html="captchaSvg" class="w-full h-full" />
            <div v-else class="w-full h-full flex items-center justify-center bg-slate-100">
              <RefreshCw class="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          </div>
        </div>
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
      :disabled="isLoading || !captchaId"
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
import { ref, onMounted } from 'vue';
import { User, Lock, LogIn, Loader2, RefreshCw } from 'lucide-vue-next';
import { apiService } from '../../services/apiService';

// 定义props
const props = defineProps(['isLoading']);
// 定义事件
const emit = defineEmits(['login', 'switch-to-register']);

// 表单数据
const username = ref('');
const password = ref('');
const captchaText = ref('');
const error = ref('');

// 验证码相关
const captchaId = ref('');
const captchaSvg = ref('');
const isLoadingCaptcha = ref(false);

// 生成验证码
const generateCaptcha = async () => {
  try {
    isLoadingCaptcha.value = true;
    const response = await apiService.captcha.generate();
    if (response.success) {
      captchaId.value = response.data.captchaId;
      captchaSvg.value = response.data.svg;
    } else {
      error.value = '验证码生成失败，请刷新重试';
    }
  } catch (err) {
    console.error('生成验证码失败:', err);
    error.value = '验证码生成失败，请刷新重试';
    // 使用模拟数据
    captchaId.value = 'mock-captcha-id';
    captchaSvg.value = '<svg width="128" height="48" xmlns="http://www.w3.org/2000/svg"><rect width="128" height="48" fill="#f0f0f0"/><text x="20" y="32" font-family="Arial" font-size="24" font-weight="bold" fill="#333">ABCD</text></svg>';
  } finally {
    isLoadingCaptcha.value = false;
  }
};

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha();
};

// 处理登录
const handleLogin = () => {
  // 表单验证
  if (!username.value.trim() || !password.value.trim()) {
    error.value = '请输入用户名和密码';
    return;
  }
  
  if (!captchaText.value.trim()) {
    error.value = '请输入验证码';
    return;
  }
  
  if (!captchaId.value) {
    error.value = '验证码无效，请刷新重试';
    return;
  }
  
  // 清除错误信息
  error.value = '';
  
  // 发送登录请求到父组件
  emit('login', {
    username: username.value.trim(),
    password: password.value.trim(),
    captchaId: captchaId.value,
    captchaText: captchaText.value.trim()
  });
};

// 页面加载时生成验证码
onMounted(() => {
  generateCaptcha();
});
</script>
