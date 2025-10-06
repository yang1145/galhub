import { useState } from 'react';
import '../styles/main.css';

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

const RegisterPage = ({ setCurrentPage }: RegisterPageProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 注册逻辑处理
    if (password !== confirmPassword) {
      alert('密码不匹配');
      return;
    }
    console.log('注册:', { username, email, password });
    alert('注册功能演示');
    // 注册成功后跳转到个人中心
    setCurrentPage('profile');
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>用户注册</h2>
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