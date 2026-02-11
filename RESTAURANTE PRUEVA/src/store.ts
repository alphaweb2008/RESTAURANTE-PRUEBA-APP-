import { create } from 'zustand';
import type { MenuItem, Reservation, BusinessInfo } from './types';
import {
  saveBusinessInfo,
  listenBusinessInfo,
  saveMenuItem,
  deleteMenuItem as fbDeleteMenuItem,
  listenMenu,
  saveReservation as fbSaveReservation,
  updateReservation as fbUpdateReservation,
  deleteReservation as fbDeleteReservation,
  deleteAllReservations as fbDeleteAllReservations,
  listenReservations,
  saveAdminPassword,
  listenAdminPassword,
} from './firebaseService';

/* eslint-disable @typescript-eslint/no-unused-vars */
interface AppState {
  // Business
  businessName: string;
  logoUrl: string;
  phone: string;
  address: string;
  slogan: string;
  setBusinessInfo: (info: BusinessInfo) => void;

  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: string) => void;

  // Reservations
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  removeReservation: (id: string) => void;
  clearAllReservations: () => void;

  // Admin
  adminPassword: string;
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (v: boolean) => void;
  changePassword: (newPass: string) => void;

  // Loading
  loading: boolean;

  // Init listeners
  initFirebase: () => void;
}

export const useStore = create<AppState>((set, _get) => ({
  businessName: 'Restaurante',
  logoUrl: '',
  phone: '',
  address: '',
  slogan: '',
  menuItems: [],
  reservations: [],
  adminPassword: 'admin123',
  isAdminLoggedIn: false,
  loading: true,

  setBusinessInfo: (info) => {
    set({
      businessName: info.businessName,
      logoUrl: info.logoUrl,
      phone: info.phone,
      address: info.address,
      slogan: info.slogan,
    });
    saveBusinessInfo(info);
  },

  addMenuItem: async (item) => {
    const tempId = '';
    await saveMenuItem({ ...item, id: tempId });
  },

  updateMenuItem: async (item) => {
    await saveMenuItem(item);
  },

  removeMenuItem: async (id) => {
    await fbDeleteMenuItem(id);
  },

  addReservation: async (res) => {
    await fbSaveReservation(res);
  },

  updateReservationStatus: async (id, status) => {
    await fbUpdateReservation(id, { status });
  },

  removeReservation: async (id) => {
    await fbDeleteReservation(id);
  },

  clearAllReservations: async () => {
    await fbDeleteAllReservations();
  },

  setAdminLoggedIn: (v) => {
    set({ isAdminLoggedIn: v });
    if (v) {
      sessionStorage.setItem('adminLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('adminLoggedIn');
    }
  },

  changePassword: (newPass) => {
    set({ adminPassword: newPass });
    saveAdminPassword(newPass);
  },

  initFirebase: () => {
    // Listen for business info changes in real time
    listenBusinessInfo((info) => {
      set({
        businessName: info.businessName || 'Restaurante',
        logoUrl: info.logoUrl || '',
        phone: info.phone || '',
        address: info.address || '',
        slogan: info.slogan || '',
        loading: false,
      });
    });

    // Listen for menu changes in real time
    listenMenu((items) => {
      set({ menuItems: items, loading: false });
    });

    // Listen for reservations in real time
    listenReservations((items) => {
      set({ reservations: items });
    });

    // Listen for admin password
    listenAdminPassword((password) => {
      set({ adminPassword: password });
    });

    // Check if admin was logged in
    const wasLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (wasLoggedIn) {
      set({ isAdminLoggedIn: true });
    }

    // Set loading false after a timeout in case no data exists yet
    setTimeout(() => {
      set({ loading: false });
    }, 3000);
  },
}));
