import React from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/main.css';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
}

const Header = ({ setCurrentPage }: HeaderProps) => {
  return (
    <header className="app-header">
      <div className="container">
        <h1>WEBGAL</h1>
        <div className="header-controls">
          <nav>
            <button onClick={() => setCurrentPage('home')}>首页</button>
            <button onClick={() => setCurrentPage('games')}>全部游戏</button>
            <button onClick={() => setCurrentPage('profile')}>个人中心</button>
            <button onClick={() => setCurrentPage('login')}>登录</button>
            <button onClick={() => setCurrentPage('register')}>注册</button>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;