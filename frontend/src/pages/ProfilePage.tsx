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

interface ProfilePageProps {
  setCurrentPage: (page: string) => void;
}

const ProfilePage = ({ setCurrentPage }: ProfilePageProps) => {
  // 玩家信息示例
  const playerInfo = {
    username: '张三',
    joinDate: '2023-01-15',
    totalPlayTime: 125,
    favoriteGenre: '动作'
  };

  // 最近游玩的游戏
  const recentGames: Game[] = [
    { id: 1, name: '超级马里奥', description: '经典平台跳跃游戏', tags: ['动作', '冒险'], image: '', playCount: 12500, lastPlayed: '2023-10-15 14:30' },
    { id: 3, name: '精灵宝可梦', description: '收集养成游戏', tags: ['角色扮演', '收集'], image: '', playCount: 15600, lastPlayed: '2023-10-12 20:15' },
    { id: 8, name: '我的世界', description: '沙盒建造游戏', tags: ['沙盒', '建造'], image: '', playCount: 32000, lastPlayed: '2023-10-10 16:45' },
    { id: 2, name: '塞尔达传说', description: '史诗级冒险游戏', tags: ['冒险', '解谜'], image: '', playCount: 9800, lastPlayed: '2023-10-05 19:20' },
    { id: 5, name: '魂斗罗', description: '经典射击游戏', tags: ['动作', '射击'], image: '', playCount: 11450, lastPlayed: '2023-10-01 15:10' },
  ];

  const handlePlayGame = (gameId: number, gameName: string) => {
    // 这里应该是实际的游戏启动逻辑
    alert(`开始游玩 ${gameName}!`);
    console.log(`用户开始游玩游戏 ID: ${gameId}`);
  };

  return (
    <div className="profile-page">
      <div className="card">
        <h2>玩家信息</h2>
        <div className="player-info">
          <div className="info-item">
            <span className="label">用户名:</span>
            <span className="value">{playerInfo.username}</span>
          </div>
          <div className="info-item">
            <span className="label">注册日期:</span>
            <span className="value">{playerInfo.joinDate}</span>
          </div>
          <div className="info-item">
            <span className="label">总游戏时长:</span>
            <span className="value">{playerInfo.totalPlayTime} 小时</span>
          </div>
          <div className="info-item">
            <span className="label">最喜欢的游戏类型:</span>
            <span className="value">{playerInfo.favoriteGenre}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>最近游玩的游戏</h2>
        <div className="recent-games-list">
          <table className="games-table">
            <thead>
              <tr>
                <th>游戏名称</th>
                <th>游戏类型</th>
                <th>游玩次数</th>
                <th>最后游玩时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {recentGames.map(game => (
                <tr key={game.id}>
                  <td>{game.name}</td>
                  <td>
                    {game.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </td>
                  <td>{game.playCount.toLocaleString()}</td>
                  <td>{game.lastPlayed}</td>
                  <td>
                    <button className="play-button small" onClick={() => handlePlayGame(game.id, game.name)}>
                      游玩
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;