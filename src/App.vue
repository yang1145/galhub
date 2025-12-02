<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Layout from './components/Layout.vue';

// 获取当前路由信息
const route = useRoute();

// 当前页面状态（用于导航高亮）
const currentPage = ref(route.name || 'home');

// 监听路由变化，更新当前页面状态
watch(route, (newRoute) => {
  currentPage.value = newRoute.name || 'home';
}, { immediate: true });
</script>

<template>
  <Layout 
    :current-page="currentPage" 
  >
    <!-- 路由视图 -->
    <router-view />
  </Layout>
</template>

<style scoped>
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 错误信息样式 */
.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px 20px;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
  font-weight: 500;
}

.error-close-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 12px;
}

.error-close-btn:hover {
  color: #b91c1c;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: #64748b;
  font-size: 1.1rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 1.2rem;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .error-message {
    margin: 16px;
    padding: 10px 16px;
  }
  
  .loading-container {
    min-height: 300px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
  }
}
</style>
