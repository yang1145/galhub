import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react';
import { ActionButton } from '../components/ActionButton';
import { GameCard } from '../components/GameCard';
import type { Game } from '../types/game';

interface GameDetailPageProps {
  game: Game;
  relatedGames: Game[];
  onBack: () => void;
  onSelectTag: (tag: string) => void;
  onOpenGame: (game: Game) => void;
  onPreview: (url: string) => void;
}

export function GameDetailPage({ game, relatedGames, onBack, onSelectTag, onOpenGame, onPreview }: GameDetailPageProps) {
  const CoverWrapper = game.coverLink ? 'a' : 'div';

  return (
    <section className="detail-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} weight="bold" />
        返回列表
      </button>

      <div className="detail-hero">
        <CoverWrapper
          className="detail-cover"
          {...(game.coverLink ? { href: game.coverLink, target: '_blank', rel: 'noreferrer' } : {})}
        >
          <img src={game.coverImage} alt={`${game.title} 封面`} />
          {game.coverLink && <span><ArrowSquareOut size={18} weight="bold" />封面链接</span>}
        </CoverWrapper>

        <div className="detail-copy">
          <p className="eyebrow">{game.developer} / {game.releaseDate}</p>
          <h1>{game.titleZh ?? game.title}</h1>
          <h2>{game.title}</h2>
          <p>{game.description}</p>

          <dl className="meta-grid">
            <div><dt>发行商</dt><dd>{game.publisher}</dd></div>
            <div><dt>平台</dt><dd>{game.platform.join(' / ')}</dd></div>
            <div><dt>评分</dt><dd>{game.rating.toFixed(1)}</dd></div>
          </dl>

          <div className="action-row">
            {(game.buttons ?? []).slice(0, 3).map((button) => (
              <ActionButton key={button.type} button={button} />
            ))}
          </div>

          <div className="detail-tags">
            {game.tags.map((tag) => (
              <button key={tag} onClick={() => onSelectTag(tag)}>{tag}</button>
            ))}
          </div>
        </div>
      </div>

      <section className="screenshot-strip" aria-label="游戏截图">
        {game.screenshots.map((shot) => (
          <button key={shot} onClick={() => onPreview(shot)}>
            <img src={shot} alt={`${game.title} 截图`} />
          </button>
        ))}
      </section>

      {relatedGames.length > 0 && (
        <section className="related-section">
          <h2>相关推荐</h2>
          <div className="related-grid">
            {relatedGames.map((related) => (
              <GameCard key={related.id} game={related} index={0} onOpen={() => onOpenGame(related)} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
