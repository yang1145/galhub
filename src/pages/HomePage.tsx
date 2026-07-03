import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useState } from 'react';
import { GameCard } from '../components/GameCard';
import type { Game } from '../types/game';

interface HomePageProps {
  games: Game[];
  onOpenGame: (game: Game) => void;
  onOpenList: () => void;
}

export function HomePage({ games, onOpenGame, onOpenList }: HomePageProps) {
  const featuredGames = games.slice(0, 3);
  const popularGames = [...games].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeGame = popularGames[activeSlide] ?? popularGames[0];

  function goToPreviousSlide() {
    setActiveSlide((current) => (current - 1 + popularGames.length) % popularGames.length);
  }

  function goToNextSlide() {
    setActiveSlide((current) => (current + 1) % popularGames.length);
  }

  return (
    <>
      <section className="hero-section">
        {activeGame && (
          <div className="hero-carousel" aria-label="最热门游戏轮播">
            {popularGames.map((game, index) => (
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
              {popularGames.map((game, index) => (
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
          {featuredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} onOpen={() => onOpenGame(game)} />
          ))}
        </div>
      </section>
    </>
  );
}
