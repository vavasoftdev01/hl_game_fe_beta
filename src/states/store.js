import { create }  from 'zustand';

export const useStore = create((set) => ({
  init: () => {
    console.log('Store initialized');
  },
}));