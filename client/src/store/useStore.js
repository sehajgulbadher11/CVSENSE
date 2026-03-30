import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null, // Will hold user info and JWT
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    delete window.__axios_logout_trigger; // To notify axios if needed, or just import axios
    set({ user: null });
  },
  
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
