import { create } from 'zustand';
import { apiClient } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  facebookLogin: (accessToken: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: apiClient.isAuthenticated(),

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.signup(email, password, name);
      apiClient.setToken(response.token);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.token);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  facebookLogin: async (accessToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.facebookLogin(accessToken);
      apiClient.setToken(response.token);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Facebook login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    apiClient.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getProfile();
      set({
        user: response,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch profile',
        isLoading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateProfile(data);
      set({
        user: response,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to update profile',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
