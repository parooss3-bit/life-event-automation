import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem('token');

    // Add auth interceptor
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Auth endpoints
  async signup(email: string, password: string, name: string) {
    const response = await this.client.post('/api/v1/auth/signup', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/api/v1/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async facebookLogin(accessToken: string) {
    const response = await this.client.post('/api/v1/auth/facebook/callback', {
      accessToken,
    });
    return response.data;
  }

  async syncFacebookContacts() {
    const response = await this.client.post('/api/v1/auth/facebook/sync-contacts');
    return response.data;
  }

  // User endpoints
  async getProfile() {
    const response = await this.client.get('/api/v1/users/me');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.put('/api/v1/users/me', data);
    return response.data;
  }

  async getDashboard() {
    const response = await this.client.get('/api/v1/users/dashboard');
    return response.data;
  }

  // Contact endpoints
  async getContacts(page = 1, limit = 20, search?: string) {
    const response = await this.client.get('/api/v1/contacts', {
      params: { page, limit, search },
    });
    return response.data;
  }

  async getContact(id: string) {
    const response = await this.client.get(`/api/v1/contacts/${id}`);
    return response.data;
  }

  async createContact(data: any) {
    const response = await this.client.post('/api/v1/contacts', data);
    return response.data;
  }

  async updateContact(id: string, data: any) {
    const response = await this.client.put(`/api/v1/contacts/${id}`, data);
    return response.data;
  }

  async deleteContact(id: string) {
    const response = await this.client.delete(`/api/v1/contacts/${id}`);
    return response.data;
  }

  async bulkImportContacts(contacts: any[]) {
    const response = await this.client.post('/api/v1/contacts/bulk-import', {
      contacts,
    });
    return response.data;
  }

  // Event endpoints
  async getEvents(page = 1, limit = 20, filter?: string) {
    const response = await this.client.get('/api/v1/events', {
      params: { page, limit, filter },
    });
    return response.data;
  }

  async getEvent(id: string) {
    const response = await this.client.get(`/api/v1/events/${id}`);
    return response.data;
  }

  async createEvent(data: any) {
    const response = await this.client.post('/api/v1/events', data);
    return response.data;
  }

  async updateEvent(id: string, data: any) {
    const response = await this.client.put(`/api/v1/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string) {
    const response = await this.client.delete(`/api/v1/events/${id}`);
    return response.data;
  }

  // Gift endpoints
  async getGiftRecommendations(eventId: string, budget?: number, interests?: string[]) {
    const response = await this.client.get('/api/v1/gifts/recommendations', {
      params: {
        eventId,
        budget,
        interests: interests?.join(','),
      },
    });
    return response.data;
  }

  async getTrendingGifts(eventType = 'birthday', limit = 5) {
    const response = await this.client.get('/api/v1/gifts/trending', {
      params: { eventType, limit },
    });
    return response.data;
  }

  async saveGift(eventId: string, giftId: string, giftTitle: string, giftPrice: number, giftUrl: string, notes?: string) {
    const response = await this.client.post('/api/v1/gifts/save', {
      eventId,
      giftId,
      giftTitle,
      giftPrice,
      giftUrl,
      notes,
    });
    return response.data;
  }

  async getSavedGifts(eventId: string) {
    const response = await this.client.get(`/api/v1/gifts/saved/${eventId}`);
    return response.data;
  }

  async markGiftPurchased(giftId: string, purchasePrice?: number) {
    const response = await this.client.put(`/api/v1/gifts/${giftId}/mark-purchased`, {
      purchasePrice,
      purchaseDate: new Date(),
    });
    return response.data;
  }

  async getGiftBudget(eventId: string) {
    const response = await this.client.get(`/api/v1/gifts/budget/${eventId}`);
    return response.data;
  }

  // Reminder endpoints
  async getReminders(page = 1, limit = 20) {
    const response = await this.client.get('/api/v1/reminders', {
      params: { page, limit },
    });
    return response.data;
  }

  async sendImmediateReminder(eventId: string) {
    const response = await this.client.post(`/api/v1/reminders/send-immediate/${eventId}`);
    return response.data;
  }

  async getReminderStats() {
    const response = await this.client.get('/api/v1/reminders/stats/summary');
    return response.data;
  }
}

export const apiClient = new ApiClient();
