<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-800">修改密码</h3>
    </div>
    
    <div class="max-w-md mx-auto">
      <form @submit.prevent="updatePassword">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                v-model="passwordForm.currentPassword" 
                type="password" 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="请输入当前密码"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                v-model="passwordForm.newPassword" 
                type="password" 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="请输入新密码"
                required
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">至少8个字符，必须包含字母和数字</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="请确认新密码"
                required
              />
            </div>
          </div>
        </div>
        
        <!-- 错误信息 -->
        <div v-if="error" class="mt-4 text-red-500 text-sm bg-red-50 p-2 rounded-lg">
          {{ error }}
        </div>
        
        <!-- 成功信息 -->
        <div v-if="success" class="mt-4 text-green-500 text-sm bg-green-50 p-2 rounded-lg">
          {{ success }}
        </div>
        
        <div class="mt-6 flex space-x-3">
          <button 
            type="button" 
            @click="resetForm"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            重置
          </button>
          <button 
            type="submit" 
            class="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin mr-2 inline" />
            保存修改
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Lock, Loader2 } from 'lucide-vue-next';
import { apiService } from '../../services/apiService';

// 密码表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 状态
const isLoading = ref(false);
const error = ref('');
const success = ref('');

// 重置表单
const resetForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  error.value = '';
  success.value = '';
};

// 更新密码
const updatePassword = async () => {
  try {
    // 表单验证
    if (!passwordForm.value.currentPassword) {
      error.value = '请输入当前密码';
      success.value = '';
      return;
    }
    
    if (!passwordForm.value.newPassword) {
      error.value = '请输入新密码';
      success.value = '';
      return;
    }
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      error.value = '两次输入的密码不一致';
      success.value = '';
      return;
    }
    
    // 密码强度验证
    if (passwordForm.value.newPassword.length < 8 || !/[a-zA-Z]/.test(passwordForm.value.newPassword) || !/[0-9]/.test(passwordForm.value.newPassword)) {
      error.value = '密码至少8个字符，必须包含字母和数字';
      success.value = '';
      return;
    }
    
    // 防止新密码与当前密码相同
    if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
      error.value = '新密码不能与当前密码相同';
      success.value = '';
      return;
    }
    
    isLoading.value = true;
    error.value = '';
    success.value = '';
    
    // 调用API更新密码
    await apiService.auth.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    // 显示成功信息
    success.value = '密码修改成功';
    
    // 重置表单
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (err) {
    console.error('修改密码失败:', err);
    error.value = err.message || '修改密码失败，请重试';
    success.value = '';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>