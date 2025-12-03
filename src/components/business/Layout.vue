<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Login from '../ui/Login.vue';
import Register from '../ui/Register.vue';
import { apiService } from '../../services/apiService';

// 用户信息
const user = ref(null);
// 登录注册模态框状态
const showAuthModal = ref(false);
const isRegisterMode = ref(false);
// 加载状态
const isLoading = ref(false);
// 错误信息
const authError = ref('');
// 接收当前页面状态
const props = defineProps(['currentPage']);
// 路由
const router = useRouter();
const route = useRoute();
// 搜索查询
const searchQuery = ref('');

// 计算属性：判断用户是否登录
const isLoggedIn = computed(() => !!user.value);

// 切换登录注册模式
const toggleAuthMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  // 切换模式时清除错误信息
  authError.value = '';
};

// 打开登录注册模态框
const openAuthModal = () => {
  showAuthModal.value = true;
};

// 关闭登录注册模态框
const closeAuthModal = () => {
  showAuthModal.value = false;
  // 关闭模态框时清除错误信息
  authError.value = '';
};

// 处理搜索提交
const handleSearch = (event) => {
  event.preventDefault();
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value.trim() } });
  }
};

// 处理登录
const handleLogin = async (userData) => {
  try {
    isLoading.value = true;
    authError.value = '';
    
    const response = await apiService.auth.login(userData);
    user.value = response.user;
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    closeAuthModal();
    // 可以添加成功提示或路由跳转
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
    // 注册成功后切换到登录模式
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
  }
};

// 页面加载时检查用户登录状态
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = await apiService.auth.getCurrentUser();
      user.value = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 清除无效的token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
});
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-container">
        
        <!-- 桌面导航菜单 -->
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link 
              :to="{ name: 'Home' }" 
              class="nav-link" 
              :class="{ active: route.name === 'Home' }"
            >
              <font-awesome-icon :icon="['fas', 'home']" /> 首页
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              :to="{ name: 'Category' }" 
              class="nav-link" 
              :class="{ active: route.name === 'Category' }"
            >
              <font-awesome-icon :icon="['fas', 'th-large']" /> 分类
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              :to="{ name: 'Latest' }" 
              class="nav-link"
            >
              <font-awesome-icon :icon="['fas', 'clock']" /> 最新
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              :to="{ name: 'Popular' }" 
              class="nav-link"
            >
              <font-awesome-icon :icon="['fas', 'fire']" /> 热门
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              :to="{ name: 'About' }" 
              class="nav-link" 
              :class="{ active: route.name === 'About' }"
            >
              <font-awesome-icon :icon="['fas', 'info-circle']" /> 关于
            </router-link>
          </li>
        </ul>
        
        <!-- 搜索框和用户操作区 -->
        <div class="search-and-user">
          <!-- 搜索框 -->
          <div class="search-container">
            <form @submit.prevent="handleSearch">
              <input 
                type="text" 
                placeholder="搜索游戏..." 
                class="search-input"
                v-model="searchQuery"
              />
              <button type="submit" class="search-btn">
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
            </form>
          </div>
          
          <!-- 用户相关导航 -->
          <div class="user-actions">
            <!-- 未登录状态 -->
            <div v-if="!isLoggedIn" class="auth-buttons">
              <a 
                href="#" 
                class="nav-link auth-btn login-btn" 
                :class="{ active: currentPage === 'login' }"
                @click.prevent="navigate('login')"
              >
                <font-awesome-icon :icon="['fas', 'sign-in-alt']" /> 登录
              </a>
              <a 
                href="#" 
                class="nav-link auth-btn register-btn" 
                :class="{ active: currentPage === 'register' }"
                @click.prevent="navigate('register')"
              >
                <font-awesome-icon :icon="['fas', 'user-plus']" /> 注册
              </a>
            </div>
            
            <!-- 已登录用户菜单 -->
            <div v-if="isLoggedIn" class="user-menu">
              <div class="user-profile">
                <div class="user-avatar">{{ currentUser?.username?.charAt(0).toUpperCase() || 'U' }}</div>
                <span class="username">{{ currentUser?.username }}</span>
                <font-awesome-icon :icon="['fas', 'caret-down']" class="dropdown-icon" />
              </div>
              <div class="dropdown-menu">
                <a href="#" class="dropdown-item">
                  <font-awesome-icon :icon="['fas', 'user']" /> 个人中心
                </a>
                <a href="#" class="dropdown-item">
                  <font-awesome-icon :icon="['fas', 'heart']" /> 我的收藏
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout-item" @click.prevent="handleLogout">
                  <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> 退出登录
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <main>
      <slot></slot> <!-- 插槽用于插入主要内容 -->
    </main>
    
    <!-- 底部栏 -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>游戏展示平台</h3>
          <p class="footer-description">发现精彩游戏，享受快乐时光。我们致力于为您提供最新、最热门的游戏资讯和下载服务。</p>
          <div class="social-icons">
            <a href="#" class="social-icon">
              <font-awesome-icon :icon="['fab', 'facebook-f']" />
            </a>
            <a href="#" class="social-icon">
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a href="#" class="social-icon">
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
            <a href="#" class="social-icon">
              <font-awesome-icon :icon="['fab', 'youtube']" />
            </a>
          </div>
        </div>
        
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul class="footer-links">
            <li><a href="#">首页</a></li>
            <li><a href="#">分类</a></li>
            <li><a href="#">最新游戏</a></li>
            <li><a href="#">热门推荐</a></li>
            <li><a href="#">即将发布</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
            <h4>支持服务</h4>
            <ul class="footer-links">
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">反馈建议</a></li>
              <li><a href="#">用户协议</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </div>
        
        <div class="footer-section">
          <h4>订阅资讯</h4>
          <p class="newsletter-description">订阅我们的 newsletter 获取最新游戏资讯</p>
          <div class="newsletter-form">
            <input type="email" placeholder="您的邮箱地址" class="newsletter-input">
            <button class="newsletter-button">订阅</button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-container">
          <p class="copyright">&copy; 2025 游戏展示平台. 保留所有权利.</p>
          <div class="footer-extra-links">
            <a href="#">网站地图</a>
            <a href="#">合作伙伴</a>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- 登录注册模态框 -->
    <div v-if="showAuthModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAuthModal">&times;</span>
        
        <!-- 错误信息 -->
        <div v-if="authError" class="auth-error">{{ authError }}</div>
        
        <!-- 登录表单 -->
        <Login v-if="!isRegisterMode" @login="handleLogin" @switch-to-register="toggleAuthMode" :isLoading="isLoading" />
        
        <!-- 注册表单 -->
        <Register v-else @register="handleRegister" @switch-to-login="toggleAuthMode" :isLoading="isLoading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.navbar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  color: #2c3e50;
  padding: 0.75rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 导航栏滚动效果 */
.navbar.scrolled {
  padding: 0.5rem 0;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  gap: 2rem;
}

/* 应用标题样式 */
.navbar-brand .app-title {
  margin: 0;
  font-size: 1.9rem;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  cursor: pointer;
}

.navbar-brand .app-title:hover {
  transform: translateY(-1px);
}

/* 导航菜单样式 */
.nav-menu {
  display: flex;
  flex-direction: row;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-item {
  position: relative;
  display: inline-block;
}

.nav-link {
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
  white-space: nowrap;
}

/* 导航链接图标样式 */
.nav-link i {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
  display: inline-block;
}

/* 导航链接悬停效果 */
.nav-link:hover {
  color: #ff69b4;
  background-color: rgba(255, 105, 180, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.15);
}

.nav-link:hover i {
  transform: translateX(3px);
}

/* 导航链接激活状态 */
.nav-link.active {
  color: #ffffff;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.25);
}

/* 导航链接底部指示器 */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav-link:hover::after {
  width: 30%;
}

.nav-link.active::after {
  width: 0;
}

/* 搜索框和用户操作区 */
.search-and-user {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  min-width: 380px;
  justify-content: flex-end;
}

/* 搜索框样式 */
.search-container {
  display: flex;
  align-items: center;
  background-color: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-container:focus-within {
  background-color: #ffffff;
  border-color: #3498db;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.15);
  transform: translateY(-1px);
}

.search-input {
  padding: 0.65rem 1.25rem;
  border: none;
  outline: none;
  background: transparent;
  width: 220px;
  font-size: 0.95rem;
  color: #475569;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #94a3b8;
  font-size: 0.9rem;
}

.search-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  padding: 0.65rem 1.4rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  border-radius: 25px;
  margin: 0.2rem;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
}

.search-btn:hover {
  background: linear-gradient(135deg, #ff1493 0%, #c71585 100%);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
}

/* 用户操作区 */
.user-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* 登录注册按钮样式 */
.auth-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.auth-btn {
  padding: 0.65rem 1.4rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
}

/* 登录按钮样式 */
.login-btn {
  background-color: transparent;
  color: #ff69b4;
  border-color: #ff69b4;
}

.login-btn:hover {
  background-color: rgba(255, 105, 180, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.15);
}

/* 注册按钮样式 */
.register-btn {
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  border-color: #ff69b4;
}

.register-btn:hover {
  background: linear-gradient(135deg, #ff1493 0%, #c71585 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 105, 180, 0.25);
  border-color: #ff1493;
}

/* 用户菜单样式 */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-radius: 25px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background-color: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-menu:hover {
  background-color: #ffffff;
  border-color: #ff69b4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.15);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.25);
  border: 2px solid transparent;
}

.user-menu:hover .user-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.35);
}

.username {
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.user-menu:hover .username {
  color: #ff69b4;
}

.dropdown-icon {
  font-size: 0.85rem;
  color: #94a3b8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 0.25rem;
}

.user-menu:hover .dropdown-icon {
  transform: rotate(180deg) scale(1.1);
  color: #ff69b4;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 下拉菜单箭头 */
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, transparent 50%, #ffffff 50%);
  transform: rotate(45deg);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  border-left: 1px solid rgba(148, 163, 184, 0.2);
  z-index: -1;
}

.user-menu:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.dropdown-item {
  padding: 0.85rem 1.25rem;
  color: #475569;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 0;
  position: relative;
}

/* 下拉项图标 */
.dropdown-item i {
  font-size: 1rem;
  color: #94a3b8;
  transition: all 0.3s ease;
  width: 18px;
  text-align: center;
}

.dropdown-item:hover {
  background-color: rgba(255, 105, 180, 0.08);
  color: #ff69b4;
  padding-left: 1.5rem;
}

.dropdown-item:hover i {
  color: #ff69b4;
  transform: translateX(3px);
}

/* 下拉菜单分隔线 */
.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.2) 50%, transparent 100%);
  margin: 0.25rem 0;
}

/* 退出登录项 */
.logout-item {
  color: #ef4444;
}

.logout-item i {
  color: #ef4444;
}

.logout-item:hover {
  background-color: rgba(239, 68, 68, 0.08);
  color: #dc2626;
}

.logout-item:hover i {
  color: #dc2626;
}

/* 下拉菜单第一个和最后一个项的圆角 */
.dropdown-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* 主要内容区域 */
main {
  flex: 1;
  padding: 2rem;
}

/* 底部栏样式 */
.app-footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  margin-top: auto;
  padding: 3rem 0 2rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
}

.footer-section h3 {
  color: #ff69b4;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: #ff69b4;
  border-radius: 1px;
  transition: width 0.3s ease;
}

.footer-section h3:hover::after {
  width: 100%;
}

.footer-section h4 {
  color: #ff69b4;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #ff69b4;
  border-radius: 1px;
  transition: width 0.3s ease;
}

.footer-section h4:hover::after {
  width: 80%;
}

/* 增加底部栏各部分之间的间距 */
.footer-section {
  margin-bottom: 2rem;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.7;
  margin-bottom: 1.8rem;
  font-size: 0.98rem;
  text-align: justify;
}

.social-icons {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background-color: #34495e;
  color: #ecf0f1;
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.social-icon:hover {
  background-color: #ff69b4;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 1rem;
  position: relative;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.98rem;
  display: inline-block;
  position: relative;
}

.footer-links a::before {
  content: '→';
  position: absolute;
  left: -15px;
  opacity: 0;
  transition: all 0.3s ease;
  color: #ff69b4;
}

.footer-links a:hover {
  color: #ff69b4;
  padding-left: 10px;
}

.footer-links a:hover::before {
  left: 0;
  opacity: 1;
}

.newsletter-description {
  color: #bdc3c7;
  margin-bottom: 1.3rem;
  font-size: 0.98rem;
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.2rem;
  flex-wrap: wrap;
}

.newsletter-input {
  flex: 1;
  min-width: 180px;
  padding: 0.85rem 1rem;
  border: 1px solid transparent;
  border-radius: 25px;
  background-color: #34495e;
  color: #ecf0f1;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.newsletter-input:focus {
  outline: none;
  border-color: #ff69b4;
  background-color: #2c3e50;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

.newsletter-input::placeholder {
  color: #95a5a6;
}

.newsletter-button {
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.85rem 1.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(255, 105, 180, 0.2);
  min-width: 100px;
}

.newsletter-button:hover {
  background-color: #ff1493;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);
}

.footer-bottom {
  background-color: #1a2530;
  padding: 2rem 0;
  margin-top: 3rem;
  border-top: 1px solid rgba(52, 152, 219, 0.1);
}

.footer-bottom .footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  gap: 1.5rem;
}

.copyright {
  color: #95a5a6;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 400;
}

.footer-extra-links {
  display: flex;
  gap: 1.75rem;
}

.footer-extra-links a {
  color: #95a5a6;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
}

.footer-extra-links a::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #ff69b4;
  transition: width 0.3s ease;
}

.footer-extra-links a:hover {
  color: #ff69b4;
}

.footer-extra-links a:hover::after {
  width: 100%;
}

/* 登录注册模态框样式 */
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: #000;
}

/* 认证错误信息样式 */
.auth-error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
  text-align: center;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .navbar-container {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .search-and-user {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .search-container {
    max-width: 300px;
  }
  
  .footer-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
  
  main {
    padding: 1rem;
  }
  
  .app-footer {
    padding: 2rem 0 1.5rem;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
    padding: 0 1.5rem;
  }
  
  .footer-section h3,
  .footer-section h4 {
    display: block;
    text-align: center;
  }
  
  .footer-section h3::after,
  .footer-section h4::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-section h3:hover::after {
    width: 50px;
  }
  
  .footer-section h4:hover::after {
    width: 40px;
  }
  
  .footer-description {
    text-align: center;
  }
  
  .social-icons {
    justify-content: center;
  }
  
  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }
  
  .newsletter-input {
    width: 100%;
    max-width: 300px;
  }
  
  .newsletter-button {
    width: 100%;
    max-width: 300px;
  }
  
  .footer-bottom {
    padding: 1.5rem 0;
    margin-top: 2rem;
  }
  
  .footer-bottom .footer-container {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 0 1.5rem;
  }
  
  .footer-extra-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .navbar-brand .app-title {
    font-size: 1.5rem;
  }
  
  .nav-menu {
    gap: 0.25rem;
  }
  
  .nav-link {
    font-size: 0.8rem;
    padding: 0.25rem;
  }
  
  .search-input {
    width: 150px;
  }
  
  .app-footer {
    padding: 1.5rem 0 1rem;
  }
  
  .footer-container {
    padding: 0 1rem;
    gap: 1.5rem;
  }
  
  .footer-section {
    margin-bottom: 1.5rem;
  }
  
  .footer-section h3 {
    font-size: 1.3rem;
  }
  
  .footer-section h4 {
    font-size: 1.1rem;
  }
  
  .newsletter-input {
    min-width: auto;
  }
  
  .newsletter-button {
    min-width: auto;
  }
  
  .footer-bottom {
    padding: 1.25rem 0;
    margin-top: 1.5rem;
  }
  
  .footer-bottom .footer-container {
    padding: 0 1rem;
  }
  
  .footer-extra-links {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
