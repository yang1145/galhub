<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">登录</h2>
      <form class="auth-form" @submit.prevent="handleLogin">
        <!-- 用户名输入 -->
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <div class="input-wrapper">
            <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="请输入用户名" 
              class="form-input"
              required
            />
          </div>
        </div>
        
        <!-- 密码输入 -->
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="input-wrapper">
            <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="请输入密码" 
              class="form-input"
              required
            />
          </div>
        </div>
        
        <!-- 错误信息 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <!-- 登录按钮 -->
        <button type="submit" class="auth-button" :disabled="isLoading">
          <font-awesome-icon v-if="!isLoading" :icon="['fas', 'sign-in-alt']" /> 
          <font-awesome-icon v-else :icon="['fas', 'spinner']" spin /> 
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        
        <!-- 注册链接 -->
        <div class="auth-footer">
          <span>还没有账号？</span>
          <a href="#" @click.prevent="$emit('switch-to-register')" class="auth-link">立即注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 0;
}

.auth-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 2rem 0;
  font-weight: 700;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #34495e;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
  font-size: 1.1rem;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 3rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background-color: #fee;
  border-radius: 4px;
}

.auth-button {
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.auth-button:hover {
  background-color: #ff1493;
  transform: translateY(-2px);
}

.auth-footer {
  text-align: center;
  font-size: 0.95rem;
  color: #666;
  margin-top: 1rem;
}

.auth-link {
  color: #ff69b4;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #ff1493;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-card {
    padding: 2rem;
    margin: 0 1rem;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
}
</style>