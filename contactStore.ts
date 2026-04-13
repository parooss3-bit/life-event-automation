import { create } from 'zustand';
import { apiClient } from '../lib/api';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthday?: string;
  relationship: string;
  avatarUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStore {
  contacts: Contact[];
  currentContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  totalContacts: number;
  currentPage: number;

  // Actions
  fetchContacts: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchContact: (id: string) => Promise<void>;
  createContact: (data: Partial<Contact>) => Promise<void>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  bulkImportContacts: (contacts: Partial<Contact>[]) => Promise<void>;
  setCurrentContact: (contact: Contact | null) => void;
  clearError: () => void;
}

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [],
  currentContact: null,
  isLoading: false,
  error: null,
  totalContacts: 0,
  currentPage: 1,

  fetchContacts: async (page = 1, limit = 20, search) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getContacts(page, limit, search);
      set({
        contacts: response.contacts,
        totalContacts: response.total,
        currentPage: page,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch contacts',
        isLoading: false,
      });
    }
  },

  fetchContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getContact(id);
      set({
        currentContact: response,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch contact',
        isLoading: false,
      });
    }
  },

  createContact: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createContact(data);
      set((state) => ({
        contacts: [response, ...state.contacts],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to create contact',
        isLoading: false,
      });
      throw error;
    }
  },

  updateContact: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateContact(id, data);
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? response : c)),
        currentContact: state.currentContact?.id === id ? response : state.currentContact,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to update contact',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteContact(id);
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        currentContact: state.currentContact?.id === id ? null : state.currentContact,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to delete contact',
        isLoading: false,
      });
      throw error;
    }
  },

  bulkImportContacts: async (contacts) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.bulkImportContacts(contacts);
      set((state) => ({
        contacts: [...response.imported, ...state.contacts],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Failed to import contacts',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentContact: (contact) => {
    set({ currentContact: contact });
  },

  clearError: () => {
    set({ error: null });
  },
}));
