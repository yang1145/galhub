import { useState } from 'react';
import { authService } from '../services/authService';
import '../styles/main.css';

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

const RegisterPage = ({ setCurrentPage }: RegisterPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 注册逻辑处理
    if (password !== confirmPassword) {
      setError('密码不匹配');
      return;
    }
    
    try {
      // 使用实际的API进行注册
      const response = await authService.register({ username, password });
      
      // 保存token到localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // 注册成功后跳转到个人中心
      setCurrentPage('profile');
    } catch (err: any) {
      setError(err.message || '注册失败');
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>用户注册</h2>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">注册</button>
        </form>
        <p>
          已有账户？ <button onClick={() => setCurrentPage('login')}>立即登录</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;