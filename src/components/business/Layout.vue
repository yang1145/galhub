<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Login from '../ui/Login.vue';
import Register from '../ui/Register.vue';
import { apiService } from '../../services/apiService';
import { 
  Home, 
  LayoutGrid, 
  Clock, 
  Flame, 
  Info, 
  Search, 
  LogIn, 
  UserPlus, 
  User, 
  LogOut, 
  ChevronDown,
  Heart,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail
} from 'lucide-vue-next';

// 用户信息
const user = ref(null);
// 登录注册模态框状态
const showAuthModal = ref(false);
const isRegisterMode = ref(false);
// 加载状态
const isLoading = ref(false);
// 错误信息
const authError = ref('');
// 移动端菜单状态
const isMobileMenuOpen = ref(false);

const props = defineProps(['currentPage']);
const router = useRouter();
const route = useRoute();
const searchQuery = ref('');

// 计算属性：判断用户是否登录
const isLoggedIn = computed(() => !!user.value);

// 切换登录注册模式
const toggleAuthMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  authError.value = '';
};

// 打开登录注册模态框
const openAuthModal = () => {
  showAuthModal.value = true;
  isMobileMenuOpen.value = false;
};

// 关闭登录注册模态框
const closeAuthModal = () => {
  showAuthModal.value = false;
  authError.value = '';
};

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// 处理搜索提交
const handleSearch = (event) => {
  // event.preventDefault(); // v-on:submit.prevent 已经处理了
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value.trim() } });
    isMobileMenuOpen.value = false;
  }
};

// 处理登录
const handleLogin = async (userData) => {
  try {
    isLoading.value = true;
    authError.value = '';
    
    const response = await apiService.auth.login(userData);
    user.value = response.data.user;
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // 在浏览器控制台输出JWT信息
    console.log('JWT令牌信息:', {
      token: response.data.token,
      user: response.data.user
    });
    
    closeAuthModal();
    
    // 检查是否是管理员，如果是则跳转到管理员dashboard
    if (response.data.user && response.data.user.role === "admin") {
      console.log('重定向原因：管理员登录成功，重定向到管理员页面');
      router.push('/admin');
    }
  } catch (error) {
    console.error('登录失败:', error);
    authError.value = error.message || '登录失败，请检查用户名和密码';
  } finally {
    isLoading.value = false;
  }
};

// 处理注册
const handleRegister = async (userData) => {
  try {
    isLoading.value = true;
    authError.value = '';
    
    await apiService.auth.register(userData);
    isRegisterMode.value = false;
    authError.value = '注册成功，请登录';
  } catch (error) {
    console.error('注册失败:', error);
    authError.value = error.message || '注册失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

// 处理退出登录
const handleLogout = async () => {
  try {
    isLoading.value = true;
    await apiService.auth.logout();
  } catch (error) {
    console.error('退出登录失败:', error);
  } finally {
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    isLoading.value = false;
    isMobileMenuOpen.value = false;
  }
};

// 页面加载时检查用户登录状态
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // 在浏览器控制台输出JWT信息
      console.log('从localStorage读取的JWT令牌信息:', {
        token: token,
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
      });
      
      // 尝试从 localStorage 读取用户信息以快速显示
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }
      
      // 验证 token 并获取最新用户信息
      const userData = await apiService.auth.getCurrentUser();
      // 处理不同的API返回格式
      const normalizedUserData = userData.data ? userData.data.user : userData;
      user.value = normalizedUserData;
      localStorage.setItem('user', JSON.stringify(normalizedUserData));
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
    <!-- 导航栏 -->
    <nav class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center cursor-pointer" @click="router.push({ name: 'Home' })">
            <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 hover:opacity-80 transition-opacity">
              GalHub
            </h1>
          </div>

          <!-- 桌面导航菜单 -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link :to="{ name: 'Home' }" class="nav-link" :class="{ 'text-primary-500 font-semibold': route.name === 'Home' }">
              <Home class="w-4 h-4 mr-1.5" /> 首页
            </router-link>
            <router-link :to="{ name: 'Category' }" class="nav-link" :class="{ 'text-primary-500 font-semibold': route.name === 'Category' }">
              <LayoutGrid class="w-4 h-4 mr-1.5" /> 分类
            </router-link>
            <router-link :to="{ name: 'Latest' }" class="nav-link" :class="{ 'text-primary-500 font-semibold': route.name === 'Latest' }">
              <Clock class="w-4 h-4 mr-1.5" /> 最新
            </router-link>
            <router-link :to="{ name: 'Popular' }" class="nav-link" :class="{ 'text-primary-500 font-semibold': route.name === 'Popular' }">
              <Flame class="w-4 h-4 mr-1.5" /> 热门
            </router-link>
            <router-link :to="{ name: 'About' }" class="nav-link" :class="{ 'text-primary-500 font-semibold': route.name === 'About' }">
              <Info class="w-4 h-4 mr-1.5" /> 关于
            </router-link>
          </div>

          <!-- 桌面端右侧操作区 -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- 搜索框 -->
            <form @submit.prevent="handleSearch" class="relative group">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="搜索游戏..." 
                class="pl-10 pr-4 py-2 w-48 rounded-full bg-slate-100 border-none text-sm focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all duration-300 outline-none placeholder-slate-400"
              />
              <Search class="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            </form>

            <!-- 用户操作 -->
            <div v-if="!isLoggedIn" class="flex items-center space-x-3">
              <button 
                @click="openAuthModal(); isRegisterMode = false"
                class="text-slate-600 hover:text-primary-500 text-sm font-medium transition-colors px-3 py-2"
              >
                登录
              </button>
              <button 
                @click="openAuthModal(); isRegisterMode = true"
                class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center"
              >
                <UserPlus class="w-4 h-4 mr-1.5" /> 注册
              </button>
            </div>

            <!-- 已登录用户菜单 -->
            <div v-else class="relative group">
              <button class="flex items-center space-x-2 text-slate-700 hover:text-primary-500 transition-colors py-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-sm font-medium max-w-[100px] truncate">{{ user?.username }}</span>
                <ChevronDown class="w-4 h-4 text-slate-400" />
              </button>
              
              <!-- 下拉菜单 -->
              <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-50">
                <a href="#" class="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <User class="w-4 h-4 mr-3" /> 个人中心
                </a>
                <a href="#" class="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <Heart class="w-4 h-4 mr-3" /> 我的收藏
                </a>
                <div class="h-px bg-slate-100 my-2"></div>
                <a href="#" @click.prevent="handleLogout" class="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut class="w-4 h-4 mr-3" /> 退出登录
                </a>
              </div>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <div class="md:hidden flex items-center">
            <button @click="toggleMobileMenu" class="text-slate-600 hover:text-primary-500 p-2">
              <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端菜单面板 -->
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-lg animate-fade-in-down">
        <div class="px-4 pt-2 pb-4 space-y-1">
          <!-- 搜索框 (移动端) -->
          <div class="mb-4 mt-2">
            <form @submit.prevent="handleSearch" class="relative">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="搜索游戏..." 
                class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 border-none text-sm focus:ring-2 focus:ring-primary-300 outline-none"
              />
              <Search class="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            </form>
          </div>
          
          <router-link :to="{ name: 'Home' }" class="mobile-nav-link" @click="isMobileMenuOpen = false">首页</router-link>
          <router-link :to="{ name: 'Category' }" class="mobile-nav-link" @click="isMobileMenuOpen = false">分类</router-link>
          <router-link :to="{ name: 'Latest' }" class="mobile-nav-link" @click="isMobileMenuOpen = false">最新</router-link>
          <router-link :to="{ name: 'Popular' }" class="mobile-nav-link" @click="isMobileMenuOpen = false">热门</router-link>
          <router-link :to="{ name: 'About' }" class="mobile-nav-link" @click="isMobileMenuOpen = false">关于</router-link>
          
          <div class="border-t border-slate-100 my-2 pt-2">
             <template v-if="!isLoggedIn">
               <button @click="openAuthModal(); isRegisterMode = false" class="block w-full text-left px-3 py-2 text-slate-600 font-medium">登录</button>
               <button @click="openAuthModal(); isRegisterMode = true" class="block w-full text-left px-3 py-2 text-primary-500 font-medium">注册账号</button>
             </template>
             <template v-else>
               <div class="px-3 py-2 flex items-center space-x-3 text-slate-700 font-medium bg-slate-50 rounded-lg mb-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm">
                    {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <span>{{ user?.username }}</span>
               </div>
               <button class="block w-full text-left px-3 py-2 text-slate-600">个人中心</button>
               <button class="block w-full text-left px-3 py-2 text-slate-600">我的收藏</button>
               <button @click="handleLogout" class="block w-full text-left px-3 py-2 text-red-500">退出登录</button>
             </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部栏 -->
    <footer class="bg-white border-t border-slate-200 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <!-- 品牌列 -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 inline-block">GalHub</h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              发现精彩游戏，享受快乐时光。我们致力于为您提供最新、最热门的游戏资讯和下载服务。
            </p>
            <div class="flex space-x-4 pt-2">
              <a href="#" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-primary-500/30">
                <Facebook class="w-5 h-5" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-sky-500/30">
                <Twitter class="w-5 h-5" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-pink-600/30">
                <Instagram class="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <!-- 链接列 -->
          <div>
            <h4 class="text-slate-800 font-bold mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-1 after:bg-primary-400 after:rounded-full">快速链接</h4>
            <ul class="space-y-3">
              <li><router-link :to="{ name: 'Home' }" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">首页</router-link></li>
              <li><router-link :to="{ name: 'Category' }" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">游戏分类</router-link></li>
              <li><router-link :to="{ name: 'Latest' }" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">最新发布</router-link></li>
              <li><router-link :to="{ name: 'Popular' }" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">热门榜单</router-link></li>
            </ul>
          </div>
          
          <!-- 支持列 -->
          <div>
            <h4 class="text-slate-800 font-bold mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-1 after:bg-primary-400 after:rounded-full">支持服务</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">帮助中心</a></li>
              <li><a href="#" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">联系我们</a></li>
              <li><a href="#" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">用户协议</a></li>
              <li><a href="#" class="text-slate-500 hover:text-primary-500 transition-colors text-sm">隐私政策</a></li>
            </ul>
          </div>
          
          <!-- 订阅列 -->
          <div>
            <h4 class="text-slate-800 font-bold mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-1 after:bg-primary-400 after:rounded-full">订阅资讯</h4>
            <p class="text-slate-500 text-sm mb-4">订阅我们的 newsletter 获取最新游戏资讯</p>
            <div class="flex flex-col space-y-3">
              <div class="relative">
                <input type="email" placeholder="您的邮箱地址" class="w-full bg-slate-100 border-none rounded-lg py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary-300 outline-none" />
                <Mail class="absolute right-3 top-3 w-4 h-4 text-slate-400" />
              </div>
              <button class="bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-0.5">
                立即订阅
              </button>
            </div>
          </div>
        </div>
        
        <!-- 底部版权 -->
        <div class="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>&copy; 2025 GalHub. 保留所有权利.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="hover:text-primary-500 transition-colors">网站地图</a>
            <a href="#" class="hover:text-primary-500 transition-colors">友情链接</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- 登录注册模态框 -->
    <div v-if="showAuthModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 animate-fade-in" @click.self="closeAuthModal">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-in">
        <div class="relative p-6">
          <button @click="closeAuthModal" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
          
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-slate-800">{{ isRegisterMode ? '创建账号' : '欢迎回来' }}</h2>
            <p class="text-slate-500 text-sm mt-2">{{ isRegisterMode ? '加入我们，探索更多精彩游戏' : '登录以访问您的个人收藏' }}</p>
          </div>
          
          <!-- 错误信息 -->
          <div v-if="authError" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-start">
             <Info class="w-5 h-5 mr-2 flex-shrink-0" />
             <span>{{ authError }}</span>
          </div>
          
          <!-- 登录表单 -->
          <Login v-if="!isRegisterMode" @login="handleLogin" @switch-to-register="toggleAuthMode" :isLoading="isLoading" />
          
          <!-- 注册表单 -->
          <Register v-else @register="handleRegister" @switch-to-login="toggleAuthMode" :isLoading="isLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../style.css";

.nav-link {
  @apply flex items-center text-slate-600 hover:text-primary-500 transition-colors duration-200 font-medium text-sm;
}

.mobile-nav-link {
  @apply block px-3 py-2.5 text-base font-medium text-slate-600 hover:text-primary-500 hover:bg-slate-50 rounded-lg transition-colors;
}

/* 简单的进入动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -10px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
