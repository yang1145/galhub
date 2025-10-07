import { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import GameCarousel from '../components/GameCarousel';
import '../styles/main.css';

interface Game {
  id: number;
  name: string;
  brief_description: string;
  cover_image_link: string;
  tag1: string;
  tag2: string;
  tag3: string;
  tag4: string;
  created_at: string;
}

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage = ({ setCurrentPage }: HomePageProps) => {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 热门游戏数据示例
  const carouselGames = [
    { id: 1, name: '超级马里奥', description: '经典平台跳跃游戏，帮助马里奥营救公主！', image: '/game1.jpg' },
    { id: 2, name: '塞尔达传说', description: '探索广阔的海拉鲁王国，解开古老的谜题', image: '/game2.jpg' },
    { id: 3, name: '精灵宝可梦', description: '捕捉并训练各种宝可梦，成为最强的宝可梦大师', image: '/game3.jpg' },
  ];

  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        const response = await gameService.getAllGames({ limit: 4 });
        setFeaturedGames(response.games);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || '获取游戏数据失败');
        setLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  const handleViewDetails = (gameId: number) => {
    // 设置当前游戏ID并切换到详情页面
    (window as any).setCurrentGameId && (window as any).setCurrentGameId(gameId);
    setCurrentPage('game-detail');
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

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
                <img 
                  src={game.cover_image_link || '/game1.jpg'} 
                  alt={game.name} 
                  className="game-image" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/game1.jpg';
                  }}
                />
              </div>
              <h3>{game.name}</h3>
              <p>{game.brief_description}</p>
              <div className="tags">
                {[game.tag1, game.tag2, game.tag3, game.tag4]
                  .filter(tag => tag)
                  .map((tag, index) => (
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