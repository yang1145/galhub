import { MagnifyingGlass } from '@phosphor-icons/react';
import { GameCard } from '../components/GameCard';
import type { Game } from '../types/game';

interface GameListPageProps {
  games: Game[];
  tags: string[];
  activeTag: string;
  query: string;
  onQueryChange: (query: string) => void;
  onTagChange: (tag: string) => void;
  onOpenGame: (game: Game) => void;
}

export function GameListPage({ games, tags, activeTag, query, onQueryChange, onTagChange, onOpenGame }: GameListPageProps) {
  return (
    <>
      <section className="list-header">
        <p className="eyebrow">Game library</p>
        <h1>游戏列表</h1>
        <p>集中浏览全部游戏，按名称、开发商、发行商或标签快速定位。</p>
      </section>

      <section className="control-deck">
        <label className="search-box">
          <MagnifyingGlass size={22} weight="bold" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索标题、开发商或发行商"
          />
        </label>
        <div className="tag-rail">
          {tags.map((tag) => (
            <button
              key={tag}
              className={tag === activeTag ? 'tag-chip active' : 'tag-chip'}
              onClick={() => onTagChange(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {games.length > 0 ? (
        <section className="game-grid">
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} onOpen={() => onOpenGame(game)} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>没有匹配的游戏</h2>
          <p>换一个关键词或取消当前标签筛选。</p>
        </section>
      )}
    </>
  );
}
