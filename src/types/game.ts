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
