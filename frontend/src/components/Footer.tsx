import React from 'react';
import '../styles/main.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>WEBGAL</h3>
            <p>发现并畅玩最新最热门的游戏</p>
          </div>
          
          <div className="footer-section">
            <h4>链接</h4>
            <ul>
              <li><a href="#">首页</a></li>
              <li><a href="#">全部游戏</a></li>
              <li><a href="#">个人中心</a></li>
              <li><a href="#">帮助中心</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>联系我们</h4>
            <ul>
              <li>邮箱: contact@gameplatform.com</li>
              <li>电话: 400-123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 WEBGAL. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;