<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="text-center px-4">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">页面不存在</h2>
      <p class="text-gray-600 mb-8">抱歉，您访问的页面不存在或已被移除。</p>
      <router-link to="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 404页面组件
</script>

<style scoped>
/* 404页面样式 */
</style>
