<template>
  <div class="game-detail" v-if="game">
    <button class="back-button" @click="goBack">
      <font-awesome-icon :icon="['fas', 'arrow-left']" /> 返回列表
    </button>
    
    <div class="game-detail-container">
      <!-- 游戏图片 -->
      <div class="game-detail-image">
        <img :src="game.image" :alt="game.title" />
      </div>
      
      <!-- 游戏信息 -->
      <div class="game-detail-info">
        <h1 class="game-detail-title">{{ game.title }}</h1>
        
        <div class="game-detail-meta">
          <span class="game-detail-genre">{{ game.genre }}</span>
          <div class="game-detail-rating">
            <span class="rating-star">★</span>
            <span class="rating-value">{{ game.rating }}</span>
          </div>
        </div>
        
        <div class="game-detail-description">
          <h2>游戏简介</h2>
          <p>{{ game.description }}</p>
        </div>
        
        <div class="game-detail-actions">
          <button class="action-button primary">
            <font-awesome-icon :icon="['fas', 'play']" /> 立即启动
          </button>
          <button class="action-button secondary">
            <font-awesome-icon :icon="['fas', 'heart']" /> 收藏
          </button>
        </div>
      </div>
    </div>
    
    <!-- 游戏详情扩展信息 -->
    <div class="game-detail-extra">
      <h2>游戏详情</h2>
      <div class="extra-grid">
        <div class="extra-item">
          <h3><font-awesome-icon :icon="['fas', 'calendar-alt']" /> 发布日期</h3>
          <p>2023-12-15</p>
        </div>
        <div class="extra-item">
          <h3><font-awesome-icon :icon="['fas', 'users']" /> 开发者</h3>
          <p>游戏开发工作室</p>
        </div>
        <div class="extra-item">
          <h3><font-awesome-icon :icon="['fas', 'star']" /> 游戏评分</h3>
          <p class="game-rating-display">
            <span class="rating-star">★</span>
            <span class="rating-value">{{ game.rating }}</span>
            <span class="rating-count">(1234 条评价)</span>
          </p>
        </div>
      </div>
    </div>
    
    <!-- 评论区 -->
    <div class="game-detail-comments">
      <h2>玩家评论</h2>
      <div class="comments-list">
        <!-- 评论项 -->
        <div class="comment-item" v-for="comment in comments" :key="comment.id">
          <div class="comment-header">
            <div class="comment-user">
              <font-awesome-icon :icon="['fas', 'user-circle']" class="user-avatar" />
              <span class="username">{{ comment.username }}</span>
            </div>
            <div class="comment-rating">
              <span class="rating-star">★</span>
              <span class="rating-value">{{ comment.rating }}</span>
            </div>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义组件属性
const props = defineProps({
  game: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['goBack']);

// 模拟评论数据
const comments = [
  {
    id: 1,
    username: '游戏爱好者',
    rating: 5,
    content: '这款游戏真的太棒了！画面精美，剧情丰富，玩法多样，强烈推荐给大家！'
  },
  {
    id: 2,
    username: '小明同学',
    rating: 4,
    content: '游戏总体来说还是不错的，但是有些关卡难度有点高，希望能优化一下。'
  },
  {
    id: 3,
    username: '资深玩家',
    rating: 4.5,
    content: '作为一个资深玩家，这款游戏的创新玩法让我眼前一亮，期待后续更新！'
  }
];

// 返回列表
const goBack = () => {
  emit('goBack');
};
</script>

<style scoped>
.game-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  background-color: #f8f9fa;
  color: #343a40;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.game-detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 48px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.game-detail-image {
  width: 100%;
  height: auto;
  overflow: hidden;
}

.game-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-detail-info {
  padding: 32px;
}

.game-detail-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 24px 0;
  font-weight: 700;
}

.game-detail-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 32px;
}

.game-detail-genre {
  background-color: #3498db;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1rem;
}

.game-detail-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffc107;
  font-size: 1.2rem;
  font-weight: 600;
}

.rating-star {
  font-size: 1.4rem;
}

.game-detail-description {
  margin-bottom: 32px;
}

.game-detail-description h2 {
  font-size: 1.5rem;
  color: #34495e;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.game-detail-description p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin: 0;
}

.game-detail-actions {
  display: flex;
  gap: 16px;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-button.primary {
  background-color: #3498db;
  color: white;
}

.action-button.primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.action-button.secondary {
  background-color: #e9ecef;
  color: #343a40;
  border: 1px solid #dee2e6;
}

.action-button.secondary:hover {
  background-color: #dee2e6;
  transform: translateY(-2px);
}

.game-detail-extra {
  background-color: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.game-detail-extra h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 24px 0;
  font-weight: 600;
}

.extra-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.extra-item h3 {
  font-size: 1.1rem;
  color: #34495e;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.extra-item p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* 游戏评分显示样式 */
.game-rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  margin: 0;
}

.game-rating-display .rating-star {
  color: #ffc107;
  font-size: 1.4rem;
}

.game-rating-display .rating-value {
  color: #34495e;
  font-weight: 600;
}

.game-rating-display .rating-count {
  color: #95a5a6;
  font-size: 0.9rem;
}

/* 评论区样式 */
.game-detail-comments {
  background-color: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 32px;
}

.game-detail-comments h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 24px 0;
  font-weight: 600;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-size: 2rem;
  color: #3498db;
}

.username {
  font-size: 1.1rem;
  font-weight: 600;
  color: #34495e;
}

.comment-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffc107;
  font-weight: 600;
}

.comment-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-detail-container {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .game-detail-info {
    padding: 24px;
  }
  
  .game-detail-title {
    font-size: 2rem;
  }
  
  .game-detail-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .extra-grid {
    grid-template-columns: 1fr;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

</style>