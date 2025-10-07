import { useState } from 'react';
import { authService } from '../services/authService';
import '../styles/main.css';

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

const LoginPage = ({ setCurrentPage }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 使用实际的API进行登录
      const response = await authService.login({ username, password });
      
      // 保存token到localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // 登录成功后跳转到个人中心
      setCurrentPage('profile');
    } catch (err: any) {
      setError(err.message || '登录失败');
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>用户登录</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">登录</button>
        </form>
        <p>
          还没有账户？ <button onClick={() => setCurrentPage('register')}>立即注册</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;