import { useState } from 'react';
import HomePage from './pages/HomePage';
import AllGamesPage from './pages/AllGamesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameDetailPage from './pages/GameDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/main.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);

  // 将设置游戏ID的方法暴露给全局，方便子组件调用
  (window as any).setCurrentGameId = setCurrentGameId;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'games':
        return <AllGamesPage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage setCurrentPage={setCurrentPage} />;
      case 'game-detail':
        return <GameDetailPage setCurrentPage={setCurrentPage} gameId={currentGameId || undefined} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <Header setCurrentPage={setCurrentPage} />
      <main>
        <div className="container">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;