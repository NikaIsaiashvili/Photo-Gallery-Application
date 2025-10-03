interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export interface CacheResults<T> {
  results: T;
  total_pages: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();

  // Save data to cache
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Get data from cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    return item.data;
  }

  // Generate cache key for searches
  getSearchKey(query: string, page: number): string {
    return `search_${query}_${page}`;
  }

  // Generate cache key for popular photos
  getPopularKey(page: number): string {
    return `popular_${page}`;
  }
}

export const cacheService = new CacheService();
