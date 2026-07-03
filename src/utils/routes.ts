import type { Game } from '../types/game';

export type Page = 'home' | 'list' | 'disclaimer' | 'links';

export const pageHashes: Record<Page, string> = {
  home: '',
  list: '#/games',
  disclaimer: '#/disclaimer',
  links: '#/links',
};

export function getCurrentGameFromHash(games: Game[]) {
  const match = window.location.hash.match(/^#\/game\/(.+)$/);
  return match ? games.find((game) => game.id === decodeURIComponent(match[1])) : undefined;
}

export function getInitialPage(): Page {
  if (window.location.hash === '#/games') return 'list';
  if (window.location.hash === '#/disclaimer') return 'disclaimer';
  if (window.location.hash === '#/links') return 'links';
  return 'home';
}
