import { GameCard } from '../components/GameCard';
import type { Game } from '../types/game';

interface HomePageProps {
  games: Game[];
  total: number;
  tags: string[];
  onOpenGame: (game: Game) => void;
  onOpenList: () => void;
}

export function HomePage({ games, total, tags, onOpenGame, onOpenList }: HomePageProps) {
  const featuredGames = games.slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">JSON driven static catalogue</p>
          <h1>把游戏目录发布成一个无需后端的网站。</h1>
          <p>
            每次构建读取本地游戏 JSON，生成可部署到静态托管平台的前端页面。浏览、筛选、详情与外部跳转都在客户端完成。
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={onOpenList}>查看游戏列表</button>
          </div>
        </div>
        <div className="hero-panel">
          <div>
            <span>总游戏数</span>
            <strong>{total}</strong>
          </div>
          <div>
            <span>精选展示</span>
            <strong>{featuredGames.length}</strong>
          </div>
          <div>
            <span>标签数量</span>
            <strong>{tags.length - 1}</strong>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <p className="eyebrow">Featured games</p>
          <h2>最新收录</h2>
        </div>
        <div className="featured-grid">
          {featuredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} onOpen={() => onOpenGame(game)} />
          ))}
        </div>
      </section>
    </>
  );
}
