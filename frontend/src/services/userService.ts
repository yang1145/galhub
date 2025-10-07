const API_BASE_URL = 'http://localhost:3000/api';

interface UserProfile {
  uid: number;
  username: string;
  created_at: string;
}

interface GetProfileResponse {
  user: UserProfile;
}

interface UpdateProfileRequest {
  username?: string;
}

interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}

export const userService = {
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

  // 更新用户资料
  async updateProfile(token: string, data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '更新用户资料失败');
    }

    return response.json();
  },

  // 删除账户
  async deleteAccount(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '删除账户失败');
    }

    return response.json();
  },
};