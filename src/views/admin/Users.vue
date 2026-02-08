<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-800">用户管理</h3>
      <button @click="openAddUserModal" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center">
        <Plus class="w-4 h-4 mr-2" />
        添加用户
      </button>
    </div>
    
    <!-- 搜索和过滤 -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索用户..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>
      <div class="w-full md:w-48">
        <select 
          v-model="filterRole" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">所有角色</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>
      </div>
    </div>
    
    <!-- 用户列表 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              用户名
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              邮箱
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              角色
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ user.username }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ user.isAdmin ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="editUser(user)" 
                class="text-blue-500 hover:text-blue-700 mr-4"
              >
                编辑
              </button>
              <button 
                @click="deleteUser(user.id)" 
                class="text-red-500 hover:text-red-700"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="mt-4 flex justify-center">
      <Loader2 class="w-6 h-6 animate-spin text-pink-500" />
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="filteredUsers.length === 0" class="mt-8 text-center">
      <Ghost class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <p class="text-gray-500">没有找到用户</p>
    </div>
    
    <!-- 分页 -->
    <div v-if="!isLoading && filteredUsers.length > 0" class="mt-6 flex justify-between items-center">
      <p class="text-sm text-gray-500">
        显示 {{ filteredUsers.length }} 个结果
      </p>
      <div class="flex space-x-2">
        <button 
          @click="page--" 
          :disabled="page === 1" 
          class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
        >
          上一页
        </button>
        <button 
          @click="page++" 
          class="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          下一页
        </button>
      </div>
    </div>
    
    <!-- 添加/编辑用户模态框 -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800">
            {{ editingUser ? '编辑用户' : '添加用户' }}
          </h3>
          <button @click="closeUserModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input 
                v-model="userForm.username" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input 
                v-model="userForm.email" 
                type="email" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input 
                v-model="userForm.password" 
                type="password" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                :required="!editingUser"
              />
              <p v-if="editingUser" class="text-xs text-gray-500 mt-1">留空表示不修改密码</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
              <div class="flex items-center">
                <input 
                  v-model="userForm.isAdmin" 
                  type="checkbox" 
                  class="w-4 h-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">管理员</label>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeUserModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              {{ editingUser ? '更新' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, Loader2, Ghost, X } from 'lucide-vue-next';
import { apiService } from '../../services/apiService';

// 用户列表
const users = ref([]);
const isLoading = ref(false);
const error = ref('');

// 搜索和过滤
const searchQuery = ref('');
const filterRole = ref('');
const page = ref(1);

// 模态框状态
const showUserModal = ref(false);
const editingUser = ref(null);

// 用户表单
const userForm = ref({
  username: '',
  email: '',
  password: '',
  isAdmin: false
});

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesRole = !filterRole.value || 
                       (filterRole.value === 'admin' && user.isAdmin) ||
                       (filterRole.value === 'user' && !user.isAdmin);
    return matchesSearch && matchesRole;
  });
});

// 获取用户列表
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await apiService.users.getUsers(page.value);
    users.value = response.data || [];
  } catch (err) {
    console.error('获取用户列表失败:', err);
    error.value = '获取用户列表失败';
    // 使用模拟数据
    users.value = [
      { id: 1, username: 'admin', email: 'admin@example.com', isAdmin: true },
      { id: 2, username: 'user1', email: 'user1@example.com', isAdmin: false },
      { id: 3, username: 'user2', email: 'user2@example.com', isAdmin: false }
    ];
  } finally {
    isLoading.value = false;
  }
};

// 打开添加用户模态框
const openAddUserModal = () => {
  editingUser.value = null;
  userForm.value = {
    username: '',
    email: '',
    password: '',
    isAdmin: false
  };
  showUserModal.value = true;
};

// 编辑用户
const editUser = (user) => {
  editingUser.value = user;
  userForm.value = {
    username: user.username,
    email: user.email,
    password: '',
    isAdmin: user.isAdmin
  };
  showUserModal.value = true;
};

// 关闭用户模态框
const closeUserModal = () => {
  showUserModal.value = false;
  editingUser.value = null;
};

// 保存用户
const saveUser = async () => {
  try {
    isLoading.value = true;
    const userData = { ...userForm.value };
    // 如果是编辑且密码为空，删除密码字段
    if (editingUser.value && !userData.password) {
      delete userData.password;
    }
    
    if (editingUser.value) {
      // 更新用户
      await apiService.users.updateUser(editingUser.value.id, userData);
    } else {
      // 添加新用户
      await apiService.users.createUser(userData);
    }
    closeUserModal();
    await fetchUsers();
  } catch (err) {
    console.error('保存用户失败:', err);
    error.value = '保存用户失败';
  } finally {
    isLoading.value = false;
  }
};

// 删除用户
const deleteUser = async (id) => {
  if (confirm('确定要删除这个用户吗？')) {
    try {
      isLoading.value = true;
      await apiService.users.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error('删除用户失败:', err);
      error.value = '删除用户失败';
    } finally {
      isLoading.value = false;
    }
  }
};

// 页面加载时获取用户列表
onMounted(async () => {
  await fetchUsers();
});
</script>

<style scoped>
/* 自定义样式 */
</style>