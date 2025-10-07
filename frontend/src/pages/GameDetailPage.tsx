import { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import '../styles/main.css';

interface Game {
  id: number;
  name: string;
  brief_description: string;
  detailed_description: string;
  game_link: string;
  cover_image_link: string;
  tag1: string;
  tag2: string;
  tag3: string;
  tag4: string;
  created_at: string;
  updated_at: string;
}

interface GameDetailPageProps {
  setCurrentPage: (page: string) => void;
  gameId?: number;
}

const GameDetailPage = ({ setCurrentPage, gameId }: GameDetailPageProps) => {
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!gameId) {
        setError('游戏ID无效');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const game = await gameService.getGameById(gameId);
        setGameData(game);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || '获取游戏详情失败');
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const handlePlayGame = async () => {
    if (!gameData) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        setCurrentPage('login');
        return;
      }

      // 添加到最近游玩的游戏
      await gameService.addRecentGame(token, gameData.id);
      
      // 这里应该是实际的游戏启动逻辑
      alert(`开始游玩 ${gameData.name}!`);
      console.log(`用户开始游玩游戏 ID: ${gameData.id}`);
    } catch (err: any) {
      alert(err.message || '开始游戏失败');
    }
  };

  const handleBack = () => {
    setCurrentPage('games');
  };

  if (loading) {
    return <div className="game-detail-page">加载中...</div>;
  }

  if (error) {
    return <div className="game-detail-page">错误: {error}</div>;
  }

  if (!gameData) {
    return <div className="game-detail-page">未找到游戏数据</div>;
  }

  return (
    <div className="game-detail-page">
      <button className="back-button" onClick={handleBack}>
        ← 返回游戏列表
      </button>

      <div className="game-detail-card">
        <div className="game-header">
          <div className="game-image-container detail">
            <img 
              src={gameData.cover_image_link || '/game1.jpg'} 
              alt={gameData.name} 
              className="game-image" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/game1.jpg';
              }}
            />
          </div>
          <div className="game-info">
            <h1>{gameData.name}</h1>
            <div className="game-meta">
              <span className="release-date">发行日期: {new Date(gameData.created_at).toLocaleDateString()}</span>
            </div>
            <div className="tags">
              {[gameData.tag1, gameData.tag2, gameData.tag3, gameData.tag4]
                .filter(tag => tag)
                .map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
            </div>
            <button className="play-button large" onClick={handlePlayGame}>
              开始游戏
            </button>
          </div>
        </div>

        <div className="game-content">
          <div className="game-description">
            <h2>游戏介绍</h2>
            <p>{gameData.brief_description}</p>
            <p>{gameData.detailed_description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;