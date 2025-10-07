import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 最近游玩的游戏
  const recentGames: Game[] = [
    { id: 1, name: '超级马里奥', description: '经典平台跳跃游戏', tags: ['动作', '冒险'], image: '', playCount: 12500, lastPlayed: '2023-10-15 14:30' },
    { id: 3, name: '精灵宝可梦', description: '收集养成游戏', tags: ['角色扮演', '收集'], image: '', playCount: 15600, lastPlayed: '2023-10-12 20:15' },
    { id: 8, name: '我的世界', description: '沙盒建造游戏', tags: ['沙盒', '建造'], image: '', playCount: 32000, lastPlayed: '2023-10-10 16:45' },
    { id: 2, name: '塞尔达传说', description: '史诗级冒险游戏', tags: ['冒险', '解谜'], image: '', playCount: 9800, lastPlayed: '2023-10-05 19:20' },
    { id: 5, name: '魂斗罗', description: '经典射击游戏', tags: ['动作', '射击'], image: '', playCount: 11450, lastPlayed: '2023-10-01 15:10' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('未登录');
        }

        const profileData = await authService.getProfile(token);
        setUser(profileData.user);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || '获取用户信息失败');
        setLoading(false);
        
        // 如果是认证错误，跳转到登录页
        if (err.message === '未登录' || err.message.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentPage('login');
        }
      }
    };

    fetchUserProfile();
  }, [setCurrentPage]);

  const handlePlayGame = (gameId: number, gameName: string) => {
    // 这里应该是实际的游戏启动逻辑
    alert(`开始游玩 ${gameName}!`);
    console.log(`用户开始游玩游戏 ID: ${gameId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  if (loading) {
    return <div className="profile-page"><div className="card">加载中...</div></div>;
  }

  if (error) {
    return <div className="profile-page"><div className="card error-message">{error}</div></div>;
  }

  return (
    <div className="profile-page">
      <div className="card">
        <h2>玩家信息</h2>
        <div className="player-info">
          <div className="info-item">
            <span className="label">用户名:</span>
            <span className="value">{user?.username}</span>
          </div>
          <div className="info-item">
            <span className="label">注册日期:</span>
            <span className="value">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}</span>
          </div>
          <div className="info-item">
            <span className="label">总游戏时长:</span>
            <span className="value">0 小时</span>
          </div>
          <div className="info-item">
            <span className="label">最喜欢的游戏类型:</span>
            <span className="value">动作</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>退出登录</button>
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