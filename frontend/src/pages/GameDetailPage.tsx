import { useState } from 'react';
import '../styles/main.css';

interface Game {
  id: number;
  name: string;
  description: string;
  tags: string[];
  image: string;
  playCount: number;
  lastPlayed: string;
  developer: string;
  releaseDate: string;
  size: string;
  rating: number;
  screenshots: string[];
  details: string;
}

interface GameDetailPageProps {
  setCurrentPage: (page: string) => void;
  gameId?: number;
}

const GameDetailPage = ({ setCurrentPage, gameId }: GameDetailPageProps) => {
  // 示例游戏数据
  const gameData: Game = {
    id: gameId || 1,
    name: '超级马里奥',
    description: '经典平台跳跃游戏',
    tags: ['动作', '冒险', '平台'],
    image: '/game1.jpg',
    playCount: 12500,
    lastPlayed: '2025-09-15',
    developer: '任天堂',
    releaseDate: '1985-09-13',
    size: '15MB',
    rating: 4.8,
    screenshots: ['/game1.jpg', '/game2.jpg', '/game3.jpg'],
    details: '《超级马里奥兄弟》是任天堂开发并于1985年发行的平台游戏。玩家操控马里奥，必要时也可选择他的弟弟路易吉，目标是从大反派酷霸王手中救回碧姬公主。游戏主要在横版卷轴的平台场景中进行，玩家需要跳跃躲避障碍物和敌人，并收集金币和其他增强道具。本作被广泛认为是电子游戏历史上最具影响力的作品之一，它成功地让电子游戏重新焕发活力，也奠定了马里奥系列的地位。'
  };

  const handlePlayGame = () => {
    // 这里应该是实际的游戏启动逻辑
    alert(`开始游玩 ${gameData.name}!`);
    console.log(`用户开始游玩游戏 ID: ${gameData.id}`);
  };

  const handleBack = () => {
    setCurrentPage('games');
  };

  return (
    <div className="game-detail-page">
      <button className="back-button" onClick={handleBack}>
        ← 返回游戏列表
      </button>

      <div className="game-detail-card">
        <div className="game-header">
          <div className="game-image-container detail">
            <img src={gameData.image} alt={gameData.name} className="game-image" />
          </div>
          <div className="game-info">
            <h1>{gameData.name}</h1>
            <div className="game-meta">
              <span className="developer">开发商: {gameData.developer}</span>
              <span className="release-date">发行日期: {gameData.releaseDate}</span>
              <span className="size">大小: {gameData.size}</span>
              <span className="rating">评分: {gameData.rating}/5.0</span>
            </div>
            <div className="tags">
              {gameData.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <div className="play-stats">
              <span className="play-count">游玩次数: {gameData.playCount.toLocaleString()}</span>
            </div>
            <button className="play-button large" onClick={handlePlayGame}>
              开始游戏
            </button>
          </div>
        </div>

        <div className="game-content">
          <div className="game-description">
            <h2>游戏介绍</h2>
            <p>{gameData.description}</p>
            <p>{gameData.details}</p>
          </div>

          <div className="game-screenshots">
            <h2>游戏截图</h2>
            <div className="screenshots-grid">
              {gameData.screenshots.map((screenshot, index) => (
                <div key={index} className="screenshot-item">
                  <img src={screenshot} alt={`截图 ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;