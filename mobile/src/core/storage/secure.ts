import * as SecureStore from 'expo-secure-store';


export interface SecureStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  deleteItem(key: string): Promise<void>;
}

export const secureStoreAdapter: SecureStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  deleteItem: (key) => SecureStore.deleteItemAsync(key),
};


export function createSecureStorage(adapter: SecureStorage = secureStoreAdapter): SecureStorage {
  return {
    getItem: (key) => adapter.getItem(key),
    setItem: (key, value) => adapter.setItem(key, value),
    deleteItem: (key) => adapter.deleteItem(key),
  };
}

export const secureStorage = createSecureStorage();
