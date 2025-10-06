import { useState } from 'react';
import '../styles/main.css';

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

const LoginPage = ({ setCurrentPage }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 登录逻辑处理
    console.log('登录:', { email, password });
    alert('登录功能演示');
    // 登录成功后跳转到个人中心
    setCurrentPage('profile');
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>用户登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">邮箱:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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