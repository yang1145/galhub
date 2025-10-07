import { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
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

interface AllGamesPageProps {
  setCurrentPage: (page: string) => void;
}

const AllGamesPage = ({ setCurrentPage }: AllGamesPageProps) => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        setLoading(true);
        const response = await gameService.getAllGames();
        setAllGames(response.games);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || '获取游戏数据失败');
        setLoading(false);
      }
    };

    fetchAllGames();
  }, []);

  // 获取所有标签
  const allTags = ['全部', ...Array.from(new Set(
    allGames.flatMap(game => [game.tag1, game.tag2, game.tag3, game.tag4])
  )).filter(tag => tag) as string[]];

  // 根据标签和搜索关键词筛选游戏
  const filteredGames = allGames.filter(game => {
    // 标签筛选
    const tagMatch = selectedTag === '全部' || 
      [game.tag1, game.tag2, game.tag3, game.tag4].includes(selectedTag);
    
    // 搜索关键词筛选
    const searchMatch = searchQuery === '' || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.brief_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return tagMatch && searchMatch;
  });

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
      <h2>全部游戏</h2>
      
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索游戏..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <h3>按标签筛选:</h3>
        <div className="tag-filters">
          {allTags.map(tag => (
            <button 
              key={tag} 
              className={selectedTag === tag ? 'active' : ''}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="games-grid">
        {filteredGames.map(game => (
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
    </div>
  );
};

export default AllGamesPage;