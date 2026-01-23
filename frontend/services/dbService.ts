import { State, LaunchKit } from '../types';

const DB_KEY_PREFIX = 'souqra_kits_';

// Helper function to get the user-specific storage key
const getUserKey = (user: string): string => `${DB_KEY_PREFIX}${user}`;

/**
 * Retrieves all launch kits for a given user from localStorage.
 * Mimics an async API call.
 */
export const getLaunchKits = async (user: string): Promise<LaunchKit[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userKey = getUserKey(user);
      const data = localStorage.getItem(userKey);
      resolve(data ? JSON.parse(data) : []);
    }, 500); // Simulate network latency
  });
};

/**
 * Saves a new launch kit for a given user to localStorage.
 * Mimics an async API call.
 * @returns The updated list of all kits for that user.
 */
export const saveLaunchKit = async (user: string, kitState: State): Promise<LaunchKit[]> => {
  return new Promise(async (resolve) => {
    const existingKits = await getLaunchKits(user);
    
    const newKit: LaunchKit = {
      id: new Date().toISOString(),
      productName: kitState.userInput?.productName || 'Untitled Kit',
      createdAt: new Date().toISOString(),
      state: kitState,
    };
    
    const updatedKits = [...existingKits, newKit];
    
    const userKey = getUserKey(user);
    localStorage.setItem(userKey, JSON.stringify(updatedKits));
    
    setTimeout(() => {
      resolve(updatedKits);
    }, 500); // Simulate network latency
  });
};
