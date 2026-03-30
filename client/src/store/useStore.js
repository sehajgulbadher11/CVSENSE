import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null, // Will hold user info and JWT
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
