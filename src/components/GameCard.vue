<template>
  <div class="game-card">
    <div class="game-image">
      <img :src="game.image" :alt="game.title" />
    </div>
    <div class="game-info">
      <h3 class="game-title">{{ game.title }}</h3>
      <div class="game-meta">
        <span class="game-genre">{{ game.genre }}</span>
        <div class="game-rating">
          <span class="rating-star">★</span>
          <span class="rating-value">{{ game.rating }}</span>
        </div>
      </div>
      <p class="game-description">{{ game.description }}</p>
      <button class="game-button">了解更多</button>
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
</script>

<style scoped>
.game-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.game-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-image img {
  transform: scale(1.05);
}

.game-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.game-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.game-genre {
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.game-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffc107;
  font-weight: 600;
}

.rating-star {
  font-size: 1rem;
}

.game-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1;
}

.game-button {
  /* 复用全局按钮样式 */
  align-self: flex-start;
}
</style>
