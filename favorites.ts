/*
 * Favorites & Saved Searches
 * localStorage-based persistence for user preferences
 */

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  category?: string;
  city?: string;
  createdAt: string;
}

const FAVORITES_KEY = "directory_favorites";
const SAVED_SEARCHES_KEY = "directory_saved_searches";

/**
 * Get all favorite business IDs
 */
export function getFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Add business to favorites
 */
export function addFavorite(businessId: string): void {
  const favorites = getFavorites();
  if (!favorites.includes(businessId)) {
    favorites.push(businessId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

/**
 * Remove business from favorites
 */
export function removeFavorite(businessId: string): void {
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== businessId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

/**
 * Check if business is favorited
 */
export function isFavorite(businessId: string): boolean {
  return getFavorites().includes(businessId);
}

/**
 * Get all saved searches
 */
export function getSavedSearches(): SavedSearch[] {
  try {
    const data = localStorage.getItem(SAVED_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save a search
 */
export function saveSearch(
  name: string,
  query: string,
  category?: string,
  city?: string
): SavedSearch {
  const searches = getSavedSearches();
  const newSearch: SavedSearch = {
    id: Date.now().toString(),
    name,
    query,
    category,
    city,
    createdAt: new Date().toISOString(),
  };
  searches.push(newSearch);
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(searches));
  return newSearch;
}

/**
 * Delete a saved search
 */
export function deleteSavedSearch(id: string): void {
  const searches = getSavedSearches();
  const updated = searches.filter((s) => s.id !== id);
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
}

/**
 * Get a saved search by ID
 */
export function getSavedSearch(id: string): SavedSearch | undefined {
  return getSavedSearches().find((s) => s.id === id);
}

/**
 * Update a saved search
 */
export function updateSavedSearch(
  id: string,
  updates: Partial<SavedSearch>
): SavedSearch | undefined {
  const searches = getSavedSearches();
  const index = searches.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  searches[index] = { ...searches[index], ...updates };
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(searches));
  return searches[index];
}
