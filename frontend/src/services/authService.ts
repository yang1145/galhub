const API_BASE_URL = 'http://localhost:3000/api';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    uid: number;
    username: string;
  };
}

interface RegisterResponse {
  message: string;
  token: string;
  user: {
    uid: number;
    username: string;
  };
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
}

interface UserProfile {
  uid: number;
  username: string;
  created_at: string;
}

interface GetProfileResponse {
  user: UserProfile;
}

export const authService = {
  // 用户登录
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '登录失败');
    }

    return response.json();
  },

  // 用户注册
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '注册失败');
    }

    return response.json();
  },

  // 获取用户资料
  async getProfile(token: string): Promise<GetProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取用户资料失败');
    }

    return response.json();
  },
};