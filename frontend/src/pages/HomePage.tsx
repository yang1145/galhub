import { useState } from 'react';
import GameCarousel from '../components/GameCarousel';
import '../styles/main.css';

interface Game {
  id: number;
  name: string;
  description: string;
  tags: string[];
  image: string;
  playCount: number;
  lastPlayed: string;
}

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage = ({ setCurrentPage }: HomePageProps) => {
  // 热门游戏数据示例
  const featuredGames: Game[] = [
    { id: 1, name: '超级马里奥', description: '经典平台跳跃游戏', tags: ['动作', '冒险'], image: '/game1.jpg', playCount: 12500, lastPlayed: '' },
    { id: 2, name: '塞尔达传说', description: '史诗级冒险游戏', tags: ['冒险', '解谜'], image: '/game2.jpg', playCount: 9800, lastPlayed: '' },
    { id: 3, name: '精灵宝可梦', description: '收集养成游戏', tags: ['角色扮演', '收集'], image: '/game3.jpg', playCount: 15600, lastPlayed: '' },
    { id: 4, name: '动物森友会', description: '模拟生活游戏', tags: ['模拟', '社交'], image: '/game4.jpg', playCount: 8700, lastPlayed: '' },
  ];

  const carouselGames = [
    { id: 1, name: '超级马里奥', description: '经典平台跳跃游戏，帮助马里奥营救公主！', image: '/game1.jpg' },
    { id: 2, name: '塞尔达传说', description: '探索广阔的海拉鲁王国，解开古老的谜题', image: '/game2.jpg' },
    { id: 3, name: '精灵宝可梦', description: '捕捉并训练各种宝可梦，成为最强的宝可梦大师', image: '/game3.jpg' },
  ];

  const handleViewDetails = (gameId: number) => {
    // 设置当前游戏ID并切换到详情页面
    (window as any).setCurrentGameId && (window as any).setCurrentGameId(gameId);
    setCurrentPage('game-detail');
  };

  return (
    <div>
      <GameCarousel games={carouselGames} />
      
      {/* 广告位区域 */}
      <div className="ad-section">
        <div className="ad-placeholder">
          <p>广告位招商</p>
          <span>联系邮箱：ad@example.com</span>
        </div>
      </div>
      
      <section className="featured-games">
        <h2>热门游戏</h2>
        <div className="games-grid">
          {featuredGames.map(game => (
            <div key={game.id} className="card game-card">
              <div className="game-image-container">
                <img src={game.image} alt={game.name} className="game-image" />
              </div>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
              <div className="game-stats">
                <span className="play-count">游玩次数: {game.playCount.toLocaleString()}</span>
              </div>
              <div className="tags">
                {game.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <button className="play-button" onClick={() => handleViewDetails(game.id)}>
                游玩
              </button>
            </div>
          ))}
        </div>
      </section>
      
      {/* 底部广告位区域 */}
      <div className="ad-section">
        <div className="ad-placeholder">
          <p>广告位招商</p>
          <span>联系邮箱：ad@example.com</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;