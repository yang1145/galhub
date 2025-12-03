<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">注册</h2>
      <form class="auth-form" @submit.prevent="handleRegister">
        <!-- 用户名输入 -->
        <div class="form-group">
          <label for="reg-username" class="form-label">用户名</label>
          <div class="input-wrapper">
            <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
            <input 
              type="text" 
              id="reg-username" 
              v-model="username" 
              placeholder="请输入用户名" 
              class="form-input"
              required
              minlength="3"
              maxlength="20"
            />
          </div>
        </div>
        
        <!-- 邮箱输入 -->
        <div class="form-group">
          <label for="email" class="form-label">邮箱</label>
          <div class="input-wrapper">
            <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="请输入邮箱" 
              class="form-input"
              required
            />
          </div>
        </div>
        
        <!-- 密码输入 -->
        <div class="form-group">
          <label for="reg-password" class="form-label">密码</label>
          <div class="input-wrapper">
            <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
            <input 
              type="password" 
              id="reg-password" 
              v-model="password" 
              placeholder="请输入密码" 
              class="form-input"
              required
              minlength="6"
            />
          </div>
        </div>
        
        <!-- 确认密码 -->
        <div class="form-group">
          <label for="confirm-password" class="form-label">确认密码</label>
          <div class="input-wrapper">
            <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
            <input 
              type="password" 
              id="confirm-password" 
              v-model="confirmPassword" 
              placeholder="请再次输入密码" 
              class="form-input"
              required
            />
          </div>
        </div>
        
        <!-- 错误信息 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <!-- 注册按钮 -->
        <button type="submit" class="auth-button" :disabled="isLoading">
          <font-awesome-icon v-if="!isLoading" :icon="['fas', 'user-plus']" />
          <font-awesome-icon v-else :icon="['fas', 'spinner']" spin />
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
        
        <!-- 登录链接 -->
        <div class="auth-footer">
          <span>已有账号？</span>
          <a href="#" @click.prevent="$emit('switch-to-login')" class="auth-link">立即登录</a>
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
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 2.5rem;
  width: 100%;
  max-width: 100%;
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