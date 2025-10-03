import React, { useState, useEffect } from "react";
import { PhotoGrid } from "../components/PhotoGrid";
import { photoAPI } from "../services/api";
import { cacheService } from "../services/cache";
import { Photo } from "../types/photos";
import { InfiniteScroll } from "../components/InfiniteScroll";
import "../styles/HistoryPage.css";

export const HistoryPage: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedSearch, setSelectedSearch] = useState<string>("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
  }, []);

  const handleHistoryClick = async (query: string) => {
    setSelectedSearch(query);
    setPage(1);
    setLoading(true);

    // Check cache first
    const cacheKey = cacheService.getSearchKey(query, 1);
    const cached = cacheService.get(cacheKey) as {
      results: Photo[];
      total_pages: number;
    } | null;
    if (cached) {
      setPhotos(cached.results);
      setHasMore(cached.total_pages > 1);
      setLoading(false);
      return;
    }

    try {
      const data = await photoAPI.searchPhotos(query, 1);
      setPhotos(data.results);
      setHasMore(data.total_pages > 1);
      cacheService.set(cacheKey, data);
    } catch (error) {
      console.error("History search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!selectedSearch || !hasMore || loading) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const data = await photoAPI.searchPhotos(selectedSearch, nextPage);

      // Remove duplicates
      const existingIds = new Set(photos.map((p) => p.id));
      const uniquePhotos = data.results.filter(
        (photo) => !existingIds.has(photo.id)
      );

      setPhotos((prev) => [...prev, ...uniquePhotos]);
      setPage(nextPage);
      setHasMore(nextPage < data.total_pages);
    } catch (error) {
      console.error("ჩატვირთვა ვერ მოხერხა :( :", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
    setSelectedSearch("");
    setPhotos([]);
  };

  return (
    <div className="history-page">
      <h2>საძიებო ისტორია</h2>

      {searchHistory.length === 0 ? (
        <h2>ჯერ არაფერი მოძებნილა</h2>
      ) : (
        <>
          <button className="clear-history" onClick={clearHistory}>
            ისტორიის გასუფთავება
          </button>

          <div className="history-tags">
            {searchHistory.map((query) => (
              <button
                key={query}
                onClick={() => handleHistoryClick(query)}
                className={selectedSearch === query ? "active" : ""}
              >
                {query}
              </button>
            ))}
          </div>
        </>
      )}

      {photos.length > 0 && (
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loading={loading}>
          <PhotoGrid photos={photos} />
        </InfiniteScroll>
      )}
    </div>
  );
};
