import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { GameCard } from '../components/GameCard';
import type { Game, Ranking } from '../types/game';

interface HomePageProps {
  games: Game[];
  rankings: Ranking[];
  onOpenGame: (game: Game) => void;
  onOpenList: () => void;
}

export function HomePage({ games, rankings, onOpenGame, onOpenList }: HomePageProps) {
  const gameMap = useMemo(() => {
    const map = new Map<string, Game>();
    for (const game of games) {
      map.set(game.id, game);
    }
    return map;
  }, [games]);

  const resolveGames = (ids: string[]) =>
    ids.map((id) => gameMap.get(id)).filter(Boolean) as Game[];

  const newArrivals = resolveGames(rankings.find((r) => r.id === 'new-arrivals')?.gameIds ?? games.slice(0, 3).map((g) => g.id));
  const mostPopular = resolveGames(rankings.find((r) => r.id === 'most-popular')?.gameIds ?? []);
  const topRated = resolveGames(rankings.find((r) => r.id === 'top-rated')?.gameIds ?? []);

  const tagGroups = Array.from(new Set(games.flatMap((game) => game.tags))).slice(0, 10);
  const platforms = Array.from(new Set(games.flatMap((game) => game.platform))).slice(0, 8);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeGame = mostPopular[activeSlide] ?? mostPopular[0];

  function goToPreviousSlide() {
    setActiveSlide((current) => (current - 1 + mostPopular.length) % mostPopular.length);
  }

  function goToNextSlide() {
    setActiveSlide((current) => (current + 1) % mostPopular.length);
  }

  return (
    <>
      <section className="hero-section">
        {activeGame && (
          <div className="hero-carousel" aria-label="最热门游戏轮播">
            {mostPopular.map((game, index) => (
              <button
                key={game.id}
                className={index === activeSlide ? 'hero-slide active' : 'hero-slide'}
                onClick={() => onOpenGame(game)}
                aria-hidden={index !== activeSlide}
                tabIndex={index === activeSlide ? 0 : -1}
              >
                <img src={game.coverImage} alt={`${game.title} 封面`} />
                <div>
                  <span>最热门 #{index + 1}</span>
                  <strong>{game.titleZh ?? game.title}</strong>
                  <small>{game.rating.toFixed(1)} / {game.developer}</small>
                </div>
              </button>
            ))}
            <button className="carousel-arrow carousel-prev" onClick={goToPreviousSlide} aria-label="上一张">
              <CaretLeft size={24} weight="bold" />
            </button>
            <button className="carousel-arrow carousel-next" onClick={goToNextSlide} aria-label="下一张">
              <CaretRight size={24} weight="bold" />
            </button>
            <div className="carousel-dots" aria-label="轮播分页">
              {mostPopular.map((game, index) => (
                <button
                  key={game.id}
                  className={index === activeSlide ? 'active' : ''}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`切换到 ${game.title}`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="hero-list-entry">
          <button className="primary-cta" onClick={onOpenList}>查看游戏列表</button>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <p className="eyebrow">Featured games</p>
          <h2>最新收录</h2>
        </div>
        <div className="featured-grid">
          {newArrivals.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} onOpen={() => onOpenGame(game)} />
          ))}
        </div>
      </section>

      <section className="home-discovery">
        <div className="section-heading">
          <p className="eyebrow">Discover</p>
          <h2>快速发现</h2>
        </div>
        <div className="discovery-grid">
          <div className="discovery-panel">
            <h3>按标签浏览</h3>
            <div className="home-chip-cloud">
              {tagGroups.map((tag) => (
                <button key={tag} onClick={onOpenList}>{tag}</button>
              ))}
            </div>
          </div>
          <div className="discovery-panel">
            <h3>按平台浏览</h3>
            <div className="platform-list">
              {platforms.map((platform) => (
                <button key={platform} onClick={onOpenList}>{platform}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ranking-section">
        <div className="section-heading">
          <p className="eyebrow">Top rated</p>
          <h2>高分榜</h2>
        </div>
        <div className="ranking-list">
          {topRated.map((game, index) => (
            <button key={game.id} className="ranking-item" onClick={() => onOpenGame(game)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <img src={game.coverImage} alt={`${game.title} 封面`} />
              <div>
                <strong>{game.titleZh ?? game.title}</strong>
                <small>{game.title}</small>
              </div>
              <em>{game.rating.toFixed(1)}</em>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
