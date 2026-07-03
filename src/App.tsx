import { useEffect, useMemo, useState } from 'react';
import gamesData from './data/games.json';
import rankingsData from './data/rankings.json';
import { Lightbox } from './components/Lightbox';
import { Topbar } from './components/Topbar';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { GameListPage } from './pages/GameListPage';
import { HomePage } from './pages/HomePage';
import { LinksPage } from './pages/LinksPage';
import type { Game, GameData, RankingsData } from './types/game';
import { filterGames, getGameTags, getRelatedGames } from './utils/games';
import { getCurrentGameFromHash, getInitialPage, pageHashes, type Page } from './utils/routes';

const gameData = gamesData as GameData;
const rankingData = rankingsData as RankingsData;

const pageSeo: Record<Page, { title: string; description: string }> = {
  home: {
    title: 'GalHub - 视觉小说 & Galgame 收录平台',
    description: 'GalHub 收录海量视觉小说与 Galgame 作品，提供游戏详情、评分、标签等全方位信息，助你发现下一部心头好。',
  },
  list: {
    title: '游戏列表 - GalHub',
    description: '浏览 GalHub 收录的游戏，支持按名称、开发商、发行商和标签筛选。',
  },
  disclaimer: {
    title: '免责声明 - GalHub',
    description: '查看 GalHub 关于内容来源、外部链接、版权归属和使用风险的免责声明。',
  },
  links: {
    title: '友情链接 - GalHub',
    description: '查看 GalHub 推荐的游戏资料库、发行平台和相关站点。',
  },
};

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(property ? 'property' : 'name', name);
    document.head.appendChild(element);
  }

  element.content = content;
}

export default function App() {
  const [page, setPage] = useState<Page>(() => getInitialPage());
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('全部');
  const [selectedGame, setSelectedGame] = useState<Game | undefined>(() => getCurrentGameFromHash(gameData.games));
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const tags = useMemo(() => getGameTags(gameData.games), []);
  const filteredGames = useMemo(() => filterGames(gameData.games, query, activeTag), [activeTag, query]);
  const relatedGames = useMemo(() => getRelatedGames(gameData.games, selectedGame), [selectedGame]);

  useEffect(() => {
    const seo = selectedGame
      ? {
        title: `${selectedGame.titleZh ?? selectedGame.title} - GalHub`,
        description: selectedGame.description,
        image: selectedGame.coverImage,
      }
      : { ...pageSeo[page], image: gameData.games[0]?.coverImage };

    document.title = seo.title;
    setMeta('description', seo.description);
    setMeta('og:title', seo.title, true);
    setMeta('og:description', seo.description, true);
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    if (seo.image) {
      setMeta('og:image', seo.image, true);
    }
  }, [page, selectedGame]);

  function openGame(game: Game) {
    window.location.hash = `/game/${game.id}`;
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goHome() {
    goPage('home');
  }

  function goList(tag?: string) {
    window.location.hash = pageHashes.list;
    setPage('list');
    setSelectedGame(undefined);
    if (tag) setActiveTag(tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goPage(nextPage: Page) {
    window.location.hash = pageHashes[nextPage];
    setPage(nextPage);
    setSelectedGame(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="site-shell">
      <div className="noise-layer" />
      <Topbar
        page={page}
        totalGames={gameData.games.length}
        lastUpdated={gameData.lastUpdated}
        hasSelectedGame={Boolean(selectedGame)}
        onHome={goHome}
        onList={() => goList()}
        onPage={goPage}
      />

      {selectedGame ? (
        <GameDetailPage
          game={selectedGame}
          relatedGames={relatedGames}
          onBack={() => goList()}
          onSelectTag={(tag) => goList(tag)}
          onOpenGame={openGame}
          onPreview={setPreviewImage}
        />
      ) : page === 'list' ? (
        <GameListPage
          games={filteredGames}
          tags={tags}
          activeTag={activeTag}
          query={query}
          onQueryChange={setQuery}
          onTagChange={setActiveTag}
          onOpenGame={openGame}
        />
      ) : page === 'disclaimer' ? (
        <DisclaimerPage lastUpdated={gameData.lastUpdated} />
      ) : page === 'links' ? (
        <LinksPage />
      ) : (
        <HomePage
          games={gameData.games}
          rankings={rankingData.rankings}
          onOpenGame={openGame}
          onOpenList={() => goList()}
        />
      )}

      {previewImage && <Lightbox image={previewImage} onClose={() => setPreviewImage(null)} />}
    </main>
  );
}
