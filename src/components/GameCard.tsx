import { ArrowSquareOut, Star } from '@phosphor-icons/react';
import type { CSSProperties } from 'react';
import type { Game } from '../types/game';

interface GameCardProps {
  game: Game;
  index: number;
  onOpen: () => void;
}

export function GameCard({ game, index, onOpen }: GameCardProps) {
  return (
    <article className="game-card" style={{ '--delay': `${index * 70}ms` } as CSSProperties}>
      <button className="cover-button" onClick={onOpen} aria-label={`查看 ${game.title} 详情`}>
        <img src={game.coverImage} alt={`${game.title} 封面`} />
      </button>
      <div className="game-card-body">
        <div>
          <p>{game.titleZh ?? game.title}</p>
          <h2>{game.title}</h2>
        </div>
        <div className="rating-row">
          <Star size={18} weight="fill" />
          <span>{game.rating.toFixed(1)}</span>
          <small>{game.developer}</small>
        </div>
        <div className="card-tags">
          {game.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <button className="detail-button" onClick={onOpen}>
          查看详情
          <ArrowSquareOut size={16} weight="bold" />
        </button>
      </div>
    </article>
  );
}
