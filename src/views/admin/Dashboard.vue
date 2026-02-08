<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 侧边栏和主内容区 -->
    <div class="flex">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-md">
        <div class="p-4 border-b">
          <h1 class="text-xl font-bold text-pink-500">GalHub Admin</h1>
        </div>
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <router-link to="/admin" class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700">
                <Home class="w-5 h-5 mr-2" />
                <span>仪表盘</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/games" class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700">
                <Gamepad2 class="w-5 h-5 mr-2" />
                <span>游戏管理</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/users" class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700">
                <Users class="w-5 h-5 mr-2" />
                <span>用户管理</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/change-password" class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700">
                <Lock class="w-5 h-5 mr-2" />
                <span>修改密码</span>
              </router-link>
            </li>
            <li>
              <button @click="handleLogout" class="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 w-full text-left">
                <LogOut class="w-5 h-5 mr-2" />
                <span>退出登录</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- 主内容区 -->
      <main class="flex-1 p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">仪表盘</h2>
          <p class="text-gray-600">欢迎回来，{{ user?.username || '管理员' }}</p>
        </div>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-pink-100">
                <Gamepad2 class="w-6 h-6 text-pink-500" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">游戏总数</p>
                <p class="text-2xl font-bold text-gray-800">{{ gameCount }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100">
                <Users class="w-6 h-6 text-blue-500" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">用户总数</p>
                <p class="text-2xl font-bold text-gray-800">{{ userCount }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100">
                <Star class="w-6 h-6 text-green-500" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">评论总数</p>
                <p class="text-2xl font-bold text-gray-800">{{ reviewCount }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 路由视图 -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Home, Gamepad2, Users, LogOut, Star, Lock } from 'lucide-vue-next';
import { apiService } from '../../services/apiService';

const router = useRouter();
const user = ref(null);
const gameCount = ref(0);
const userCount = ref(0);
const reviewCount = ref(0);

// 获取用户信息
const getUserInfo = async () => {
  try {
    const response = await apiService.auth.getCurrentUser();
    const userData = response.data;
    user.value = userData;
    // 检查是否是管理员
    if (!userData.isAdmin) {
      router.push('/');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    router.push('/');
  }
};

// 获取统计数据
const getStats = async () => {
  try {
    // 这里使用模拟数据，实际项目中应该调用API
    gameCount.value = 42;
    userCount.value = 156;
    reviewCount.value = 234;
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

// 退出登录
const handleLogout = async () => {
  try {
    await apiService.auth.logout();
    router.push('/');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
};

// 页面加载时获取数据
onMounted(async () => {
  await getUserInfo();
  await getStats();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>