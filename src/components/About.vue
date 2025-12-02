<script setup>
</script>

<template>
  <div class="about-container">
    <div class="about-header">
      <h1>关于我们</h1>
      <p class="about-subtitle">发现精彩游戏，享受快乐时光</p>
    </div>
    
    <div class="about-content">
      <section class="about-section">
        <h2>平台介绍</h2>
        <p>游戏展示平台是一个专注于为玩家提供最新、最热门游戏资讯和下载服务的综合性平台。我们致力于打造一个安全、便捷、优质的游戏社区，让每一位玩家都能在这里找到自己喜爱的游戏。</p>
        <p>无论是角色扮演、动作冒险、策略模拟还是休闲益智，我们都能为您提供丰富多样的游戏选择。</p>
      </section>
      
      <section class="about-section">
        <h2>我们的使命</h2>
        <div class="mission-grid">
          <div class="mission-item">
            <div class="mission-icon">
              <font-awesome-icon :icon="['fas', 'gamepad']" size="2x" />
            </div>
            <h3>精选游戏</h3>
            <p>为玩家筛选优质游戏，提供丰富多样的选择</p>
          </div>
          <div class="mission-item">
            <div class="mission-icon">
              <font-awesome-icon :icon="['fas', 'star']" size="2x" />
            </div>
            <h3>专业评测</h3>
            <p>提供客观、专业的游戏评测和攻略</p>
          </div>
          <div class="mission-item">
            <div class="mission-icon">
              <font-awesome-icon :icon="['fas', 'users']" size="2x" />
            </div>
            <h3>玩家社区</h3>
            <p>构建活跃的玩家社区，促进交流与分享</p>
          </div>
          <div class="mission-item">
            <div class="mission-icon">
              <font-awesome-icon :icon="['fas', 'rocket']" size="2x" />
            </div>
            <h3>技术创新</h3>
            <p>持续创新，提供更好的用户体验</p>
          </div>
        </div>
      </section>
      
      <section class="about-section">
        <h2>团队成员</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="team-avatar">
              <font-awesome-icon :icon="['fas', 'user-tie']" size="2x" />
            </div>
            <h3>张三</h3>
            <p>创始人 & CEO</p>
          </div>
          <div class="team-member">
            <div class="team-avatar">
              <font-awesome-icon :icon="['fas', 'laptop-code']" size="2x" />
            </div>
            <h3>李四</h3>
            <p>技术总监</p>
          </div>
          <div class="team-member">
            <div class="team-avatar">
              <font-awesome-icon :icon="['fas', 'palette']" size="2x" />
            </div>
            <h3>王五</h3>
            <p>设计总监</p>
          </div>
          <div class="team-member">
            <div class="team-avatar">
              <font-awesome-icon :icon="['fas', 'edit']" size="2x" />
            </div>
            <h3>赵六</h3>
            <p>内容编辑</p>
          </div>
        </div>
      </section>
      
      <section class="about-section">
        <h2>联系我们</h2>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">
              <font-awesome-icon :icon="['fas', 'envelope']" />
            </span>
            <span>contact@gameplatform.com</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">
              <font-awesome-icon :icon="['fas', 'phone']" />
            </span>
            <span>+86 123 4567 8910</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">
              <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
            </span>
            <span>北京市朝阳区科技园区A座1001室</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: #f8f9fa;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.about-header h1 {
  font-size: 2rem;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
}

.about-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
  color: #666;
}

.about-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
}

.about-section {
  margin-bottom: 60px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eaeaea;
}

.about-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.about-section h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
}

.about-section h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: #6c757d;
  border-radius: 2px;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 16px;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.mission-item {
  text-align: center;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mission-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.mission-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.mission-item h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 12px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 32px;
}

.team-member {
  text-align: center;
}

.team-avatar {
  font-size: 2.5rem;
  margin-bottom: 16px;
  background: #e9ecef;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.team-member h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.team-member p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 32px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.1rem;
  color: #666;
}

.contact-icon {
  font-size: 1.5rem;
  width: 30px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-container {
    padding: 20px 16px;
  }
  
  .about-header {
    padding: 40px 20px;
    margin-bottom: 40px;
  }
  
  .about-header h1 {
    font-size: 2rem;
  }
  
  .about-subtitle {
    font-size: 1.1rem;
  }
  
  .about-content {
    padding: 24px;
  }
  
  .about-section h2 {
    font-size: 1.5rem;
  }
  
  .mission-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .team-avatar {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .about-header h1 {
    font-size: 1.8rem;
  }
  
  .about-section {
    margin-bottom: 40px;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>