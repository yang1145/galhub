import type { Game } from '../types/game';

export function getGameTags(games: Game[]) {
  return ['全部', ...Array.from(new Set(games.flatMap((game) => game.tags)))];
}

export function filterGames(games: Game[], query: string, activeTag: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return games.filter((game) => {
    const matchesQuery = !normalizedQuery
      || [game.title, game.titleZh, game.developer, game.publisher]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    const matchesTag = activeTag === '全部' || game.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });
}

export function getRelatedGames(games: Game[], selectedGame?: Game) {
  if (!selectedGame) return [];

  return games
    .filter((game) => game.id !== selectedGame.id && game.tags.some((tag) => selectedGame.tags.includes(tag)))
    .slice(0, 3);
}
