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
}

interface AllGamesPageProps {
  setCurrentPage: (page: string) => void;
}

const AllGamesPage = ({ setCurrentPage }: AllGamesPageProps) => {
  // 全部游戏数据示例
  const allGames: Game[] = [
    { id: 1, name: '超级马里奥', description: '经典平台跳跃游戏', tags: ['动作', '冒险'], image: '/game1.jpg', playCount: 12500, lastPlayed: '' },
    { id: 2, name: '塞尔达传说', description: '史诗级冒险游戏', tags: ['冒险', '解谜'], image: '/game2.jpg', playCount: 9800, lastPlayed: '' },
    { id: 3, name: '精灵宝可梦', description: '收集养成游戏', tags: ['角色扮演', '收集'], image: '/game3.jpg', playCount: 15600, lastPlayed: '' },
    { id: 4, name: '动物森友会', description: '模拟生活游戏', tags: ['模拟', '社交'], image: '/game4.jpg', playCount: 8700, lastPlayed: '' },
    { id: 5, name: '魂斗罗', description: '经典射击游戏', tags: ['动作', '射击'], image: '/game5.jpg', playCount: 11450, lastPlayed: '' },
    { id: 6, name: '街头霸王', description: '经典格斗游戏', tags: ['动作', '格斗'], image: '/game6.jpg', playCount: 9200, lastPlayed: '' },
    { id: 7, name: '俄罗斯方块', description: '经典益智游戏', tags: ['益智'], image: '/game7.jpg', playCount: 25600, lastPlayed: '' },
    { id: 8, name: '我的世界', description: '沙盒建造游戏', tags: ['沙盒', '建造'], image: '/game8.jpg', playCount: 32000, lastPlayed: '' },
  ];

  const [selectedTag, setSelectedTag] = useState<string>('全部');

  // 获取所有标签
  const allTags = ['全部', ...Array.from(new Set(allGames.flatMap(game => game.tags)))];

  // 根据标签筛选游戏
  const filteredGames = selectedTag === '全部' 
    ? allGames 
    : allGames.filter(game => game.tags.includes(selectedTag));

  const handleViewDetails = (gameId: number) => {
    // 设置当前游戏ID并切换到详情页面
    (window as any).setCurrentGameId && (window as any).setCurrentGameId(gameId);
    setCurrentPage('game-detail');
  };

  return (
    <div>
      <h2>全部游戏</h2>
      
      <div className="filters">
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
    </div>
  );
};

export default AllGamesPage;