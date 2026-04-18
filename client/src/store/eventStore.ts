import { create } from 'zustand';
import { apiClient } from '../lib/api';

export interface Event {
  id: string;
  contactId: string;
  eventType: string;
  title: string;
  eventDate: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  reminderDaysBefore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface EventStore {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  totalEvents: number;
  currentPage: number;

  // Actions
  fetchEvents: (page?: number, limit?: number, filter?: string) => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  createEvent: (data: Partial<Event>) => Promise<void>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
  clearError: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
  totalEvents: 0,
  currentPage: 1,

  fetchEvents: async (page = 1, limit = 20, filter) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getEvents(page, limit, filter);
      set({
        events: response.events,
        totalEvents: response.total,
        currentPage: page,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch events',
        isLoading: false,
      });
    }
  },

  fetchEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getEvent(id);
      set({
        currentEvent: response,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch event',
        isLoading: false,
      });
    }
  },

  createEvent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createEvent(data);
      set((state) => ({
        events: [response, ...state.events],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to create event',
        isLoading: false,
      });
      throw error;
    }
  },

  updateEvent: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateEvent(id, data);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? response : e)),
        currentEvent: state.currentEvent?.id === id ? response : state.currentEvent,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to update event',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteEvent(id);
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to delete event',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentEvent: (event) => {
    set({ currentEvent: event });
  },

  clearError: () => {
    set({ error: null });
  },
}));
