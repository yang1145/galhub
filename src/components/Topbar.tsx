import type { Page } from '../utils/routes';

interface TopbarProps {
  page: Page;
  totalGames: number;
  lastUpdated: string;
  hasSelectedGame: boolean;
  onHome: () => void;
  onList: () => void;
  onPage: (page: Page) => void;
}

export function Topbar({ page, totalGames, lastUpdated, hasSelectedGame, onHome, onList, onPage }: TopbarProps) {
  return (
    <header className="topbar">
      <button className="brand-mark" onClick={onHome} aria-label="返回首页">
        GalHub
      </button>
      <nav className="main-nav" aria-label="主导航">
        <button className={page === 'home' && !hasSelectedGame ? 'active' : ''} onClick={onHome}>首页</button>
        <button className={page === 'list' && !hasSelectedGame ? 'active' : ''} onClick={onList}>游戏列表</button>
        <button className={page === 'disclaimer' && !hasSelectedGame ? 'active' : ''} onClick={() => onPage('disclaimer')}>免责声明</button>
        <button className={page === 'links' && !hasSelectedGame ? 'active' : ''} onClick={() => onPage('links')}>友情链接</button>
      </nav>
      <div className="topbar-meta">
        <span>{totalGames} 款游戏</span>
        <span>更新于 {lastUpdated}</span>
      </div>
    </header>
  );
}
