<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-800">游戏管理</h3>
      <button @click="openAddGameModal" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center">
        <Plus class="w-4 h-4 mr-2" />
        添加游戏
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
            placeholder="搜索游戏..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>
      <div class="w-full md:w-48">
        <select 
          v-model="filterGenre" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">所有类型</option>
          <option value="动作">动作</option>
          <option value="冒险">冒险</option>
          <option value="角色扮演">角色扮演</option>
          <option value="策略">策略</option>
          <option value="模拟">模拟</option>
        </select>
      </div>
    </div>
    
    <!-- 游戏列表 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              标题
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              类型
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              评分
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="game in filteredGames" :key="game.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ game.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ game.title }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ game.genre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ game.rating }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="editGame(game)" 
                class="text-blue-500 hover:text-blue-700 mr-4"
              >
                编辑
              </button>
              <button 
                @click="deleteGame(game.id)" 
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
    <div v-else-if="filteredGames.length === 0" class="mt-8 text-center">
      <Ghost class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <p class="text-gray-500">没有找到游戏</p>
    </div>
    
    <!-- 分页 -->
    <div v-if="!isLoading && filteredGames.length > 0" class="mt-6 flex justify-between items-center">
      <p class="text-sm text-gray-500">
        显示 {{ filteredGames.length }} 个结果
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
    
    <!-- 添加/编辑游戏模态框 -->
    <div v-if="showGameModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800">
            {{ editingGame ? '编辑游戏' : '添加游戏' }}
          </h3>
          <button @click="closeGameModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="saveGame">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input 
                v-model="gameForm.title" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <input 
                v-model="gameForm.genre" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">评分</label>
              <input 
                v-model.number="gameForm.rating" 
                type="number" 
                min="0" 
                max="5" 
                step="0.1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
              <input 
                v-model="gameForm.image" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea 
                v-model="gameForm.description" 
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              ></textarea>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeGameModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              {{ editingGame ? '更新' : '保存' }}
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

// 游戏列表
const games = ref([]);
const isLoading = ref(false);
const error = ref('');

// 搜索和过滤
const searchQuery = ref('');
const filterGenre = ref('');
const page = ref(1);

// 模态框状态
const showGameModal = ref(false);
const editingGame = ref(null);

// 游戏表单
const gameForm = ref({
  title: '',
  genre: '',
  rating: 0,
  image: '',
  description: ''
});

// 过滤后的游戏列表
const filteredGames = computed(() => {
  return games.value.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesGenre = !filterGenre.value || game.genre === filterGenre.value;
    return matchesSearch && matchesGenre;
  });
});

// 获取游戏列表
const fetchGames = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await apiService.games.getGames(page.value);
    games.value = response.data || [];
  } catch (err) {
    console.error('获取游戏列表失败:', err);
    error.value = '获取游戏列表失败';
    // 使用模拟数据
    games.value = [
      { id: 1, title: '游戏1', genre: '动作', rating: 4.5, image: 'https://example.com/game1.jpg', description: '这是游戏1的描述' },
      { id: 2, title: '游戏2', genre: '冒险', rating: 4.2, image: 'https://example.com/game2.jpg', description: '这是游戏2的描述' },
      { id: 3, title: '游戏3', genre: '角色扮演', rating: 4.8, image: 'https://example.com/game3.jpg', description: '这是游戏3的描述' }
    ];
  } finally {
    isLoading.value = false;
  }
};

// 打开添加游戏模态框
const openAddGameModal = () => {
  editingGame.value = null;
  gameForm.value = {
    title: '',
    genre: '',
    rating: 0,
    image: '',
    description: ''
  };
  showGameModal.value = true;
};

// 编辑游戏
const editGame = (game) => {
  editingGame.value = game;
  gameForm.value = {
    title: game.title,
    genre: game.genre,
    rating: game.rating,
    image: game.image,
    description: game.description
  };
  showGameModal.value = true;
};

// 关闭游戏模态框
const closeGameModal = () => {
  showGameModal.value = false;
  editingGame.value = null;
};

// 保存游戏
const saveGame = async () => {
  try {
    isLoading.value = true;
    if (editingGame.value) {
      // 更新游戏
      await apiService.games.updateGame(editingGame.value.id, gameForm.value);
    } else {
      // 添加新游戏
      await apiService.games.createGame(gameForm.value);
    }
    closeGameModal();
    await fetchGames();
  } catch (err) {
    console.error('保存游戏失败:', err);
    error.value = '保存游戏失败';
  } finally {
    isLoading.value = false;
  }
};

// 删除游戏
const deleteGame = async (id) => {
  if (confirm('确定要删除这个游戏吗？')) {
    try {
      isLoading.value = true;
      await apiService.games.deleteGame(id);
      await fetchGames();
    } catch (err) {
      console.error('删除游戏失败:', err);
      error.value = '删除游戏失败';
    } finally {
      isLoading.value = false;
    }
  }
};

// 页面加载时获取游戏列表
onMounted(async () => {
  await fetchGames();
});
</script>

<style scoped>
/* 自定义样式 */
</style>