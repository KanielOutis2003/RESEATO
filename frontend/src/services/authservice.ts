
import api, { handleApiError } from './api';
import { User, UserRole } from '../../../shared/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data.data;
      
      this.setSession(user, token);
      return { user, token };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data.data;
      
      this.setSession(user, token);
      return { user, token };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put('/auth/profile', data);
      const user = response.data.data;
      
      // Update stored user
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  private setSession(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();