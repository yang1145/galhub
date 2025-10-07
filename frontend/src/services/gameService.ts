const API_BASE_URL = 'http://localhost:3000/api';

interface Game {
  id: number;
  name: string;
  brief_description: string;
  detailed_description: string;
  game_link: string;
  cover_image_link: string;
  tag1: string;
  tag2: string;
  tag3: string;
  tag4: string;
  created_at: string;
  updated_at: string;
}

interface GetAllGamesResponse {
  games: Game[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface GetGameByIdResponse extends Game {}

interface AddRecentGameResponse {
  message: string;
}

interface GetUserRecentGamesResponse {
  games: Game[];
}

interface GetAllGamesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const gameService = {
  // 获取所有游戏
  async getAllGames(params?: GetAllGamesParams): Promise<GetAllGamesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const url = `${API_BASE_URL}/games${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取游戏列表失败');
    }

    return response.json();
  },

  // 根据ID获取游戏
  async getGameById(id: number): Promise<GetGameByIdResponse> {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取游戏详情失败');
    }

    return response.json();
  },

  // 添加游戏到最近游玩
  async addRecentGame(token: string, gameId: number): Promise<AddRecentGameResponse> {
    const response = await fetch(`${API_BASE_URL}/games/recent/${gameId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '添加最近游玩游戏失败');
    }

    return response.json();
  },

  // 获取用户最近游玩的游戏
  async getUserRecentGames(token: string): Promise<GetUserRecentGamesResponse> {
    const response = await fetch(`${API_BASE_URL}/games/recent/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取最近游玩游戏失败');
    }

    return response.json();
  },
};