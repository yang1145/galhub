export type ButtonType = 'download' | 'website' | 'play';

export interface GameButton {
  type: ButtonType;
  label: string;
  url: string;
}

export interface Game {
  id: string;
  title: string;
  titleZh?: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  platform: string[];
  rating: number;
  coverImage: string;
  coverLink?: string;
  screenshots: string[];
  tags: string[];
  description: string;
  buttons?: GameButton[];
}

export interface GameData {
  games: Game[];
  lastUpdated: string;
}

export interface Ranking {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  gameIds: string[];
}

export interface RankingsData {
  rankings: Ranking[];
  lastUpdated: string;
}

export interface FriendLink {
  name: string;
  description: string;
  url: string;
  favicon: string;
}

export interface FriendLinksData {
  links: FriendLink[];
  lastUpdated: string;
}
