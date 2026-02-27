import { StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

// Custom storage adapter for IndexedDB
export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return (await get(name)) || null;
    } catch (e) {
      console.warn(`IndexedDB getItem Error (${name}):`, e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await set(name, value);
    } catch (e) {
      console.warn(`IndexedDB setItem Error (${name}):`, e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name);
    } catch (e) {
      console.warn(`IndexedDB removeItem Error (${name}):`, e);
    }
  },
};
