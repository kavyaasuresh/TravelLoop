import { create } from 'zustand';
import api from '../api';

export const useTripStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  loading: false,
  error: null,

  fetchTrips: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/trips');
      set({ trips: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTripById: async (id) => {
    set({ loading: true });
    try {
      const response = await api.get(`/trips/${id}`);
      set({ currentTrip: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createTrip: async (tripData) => {
    set({ loading: true });
    try {
      const response = await api.post('/trips', tripData);
      set((state) => ({ 
        trips: [response.data, ...state.trips], 
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addStop: async (tripId, stopData) => {
    try {
      const response = await api.post(`/trips/${tripId}/stops`, stopData);
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },

  addActivity: async (stopId, activityData) => {
    try {
      const response = await api.post(`/trips/stops/${stopId}/activities`, activityData);
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },

  togglePackingItem: async (itemId) => {
    try {
      const response = await api.patch(`/trips/packing/${itemId}/toggle`);
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },

  addPackingItem: async (tripId, itemData) => {
    try {
      const response = await api.post(`/trips/${tripId}/packing`, itemData);
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },

  addBudgetCategory: async (tripId, categoryData) => {
    try {
      const response = await api.post(`/trips/${tripId}/budget`, categoryData);
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateBudgetCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.patch(`/trips/budget-categories/${categoryId}`, categoryData);
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },

  addNote: async (tripId, noteData) => {
    try {
      const response = await api.post(`/trips/${tripId}/notes`, noteData);
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },

  markComplete: async (tripId) => {
    try {
      const response = await api.patch(`/trips/${tripId}/complete`);
      set((state) => ({
        currentTrip: response.data,
        trips: state.trips.map(t => t.id === response.data.id ? response.data : t)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateCoverImage: async (tripId, coverImage) => {
    try {
      const response = await api.patch(`/trips/${tripId}/cover-image`, { coverImage });
      set({ currentTrip: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  }
}));
