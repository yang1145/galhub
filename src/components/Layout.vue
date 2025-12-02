<script setup>
// 接收当前页面状态
const props = defineProps(['currentPage']);
// 定义导航事件
const emit = defineEmits(['navigate']);

// 导航到指定页面
const navigate = (page) => {
  emit('navigate', page);
};
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo和标题 -->
        <div class="navbar-brand">
          <h1 class="app-title">游戏展示平台</h1>
        </div>
        
        <!-- 桌面导航菜单 -->
        <ul class="nav-menu">
          <li class="nav-item">
            <a 
              href="#" 
              class="nav-link" 
              :class="{ active: currentPage === 'home' }"
              @click.prevent="navigate('home')"
            >
              <font-awesome-icon :icon="['fas', 'home']" /> 首页
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              class="nav-link" 
              :class="{ active: currentPage === 'category' }"
              @click.prevent="navigate('category')"
            >
              <font-awesome-icon :icon="['fas', 'th-large']" /> 分类
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link"><font-awesome-icon :icon="['fas', 'clock']" /> 最新</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link"><font-awesome-icon :icon="['fas', 'fire']" /> 热门</a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              class="nav-link" 
              :class="{ active: currentPage === 'about' }"
              @click.prevent="navigate('about')"
            >
              <font-awesome-icon :icon="['fas', 'info-circle']" /> 关于
            </a>
          </li>
        </ul>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <input type="text" placeholder="搜索游戏..." class="search-input" />
          <button class="search-btn">
            <font-awesome-icon :icon="['fas', 'search']" />
          </button>
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
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #333333;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.navbar-brand .app-title {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  color: #34495e;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.nav-link:hover,
.nav-link.active {
  color: #2980b9;
  background-color: rgba(41, 128, 185, 0.1);
}

.search-container {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
}

.search-input {
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
  width: 200px;
}

.search-btn {
  background-color: #2980b9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #1c5a85;
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
  color: #3498db;
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
  background-color: #3498db;
  border-radius: 1px;
  transition: width 0.3s ease;
}

.footer-section h3:hover::after {
  width: 100%;
}

.footer-section h4 {
  color: #3498db;
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
  background-color: #3498db;
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
  background-color: #3498db;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
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
  color: #3498db;
}

.footer-links a:hover {
  color: #3498db;
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
  border-color: #3498db;
  background-color: #2c3e50;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.newsletter-input::placeholder {
  color: #95a5a6;
}

.newsletter-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.85rem 1.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.2);
  min-width: 100px;
}

.newsletter-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
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
  background-color: #3498db;
  transition: width 0.3s ease;
}

.footer-extra-links a:hover {
  color: #3498db;
}

.footer-extra-links a:hover::after {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .navbar-container {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .search-container {
    order: 3;
    width: 100%;
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
