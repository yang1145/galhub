import { useMemo, useState } from 'react';
import data from './data/games.json';
import { Lightbox } from './components/Lightbox';
import { Topbar } from './components/Topbar';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { GameListPage } from './pages/GameListPage';
import { HomePage } from './pages/HomePage';
import { LinksPage } from './pages/LinksPage';
import type { Game, GameData } from './types/game';
import { filterGames, getGameTags, getRelatedGames } from './utils/games';
import { getCurrentGameFromHash, getInitialPage, pageHashes, type Page } from './utils/routes';

const gameData = data as GameData;

export default function App() {
  const [page, setPage] = useState<Page>(() => getInitialPage());
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('全部');
  const [selectedGame, setSelectedGame] = useState<Game | undefined>(() => getCurrentGameFromHash(gameData.games));
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const tags = useMemo(() => getGameTags(gameData.games), []);
  const filteredGames = useMemo(() => filterGames(gameData.games, query, activeTag), [activeTag, query]);
  const relatedGames = useMemo(() => getRelatedGames(gameData.games, selectedGame), [selectedGame]);

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
          total={gameData.games.length}
          tags={tags}
          onOpenGame={openGame}
          onOpenList={() => goList()}
        />
      )}

      {previewImage && <Lightbox image={previewImage} onClose={() => setPreviewImage(null)} />}
    </main>
  );
}
