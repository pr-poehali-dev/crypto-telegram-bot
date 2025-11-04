const FAVORITES_KEY = 'crypto_favorites';

export const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addFavorite = (coinId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(coinId)) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, coinId]));
    window.dispatchEvent(new Event('favoritesUpdated'));
  }
};

export const removeFavorite = (coinId: string): void => {
  const favorites = getFavorites();
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites.filter(id => id !== coinId))
  );
  window.dispatchEvent(new Event('favoritesUpdated'));
};

export const isFavorite = (coinId: string): boolean => {
  return getFavorites().includes(coinId);
};