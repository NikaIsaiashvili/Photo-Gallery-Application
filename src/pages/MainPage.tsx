import React, { useState, useEffect } from "react";
import { SearchBar } from "../components/SearchBar";
import { PhotoGrid } from "../components/PhotoGrid";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { photoAPI } from "../services/api";
import { CacheResults, cacheService } from "../services/cache";
import { Photo } from "../types/photos";

export const MainPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadPopularPhotos();
  }, []);

  const loadPopularPhotos = async () => {
    setLoading(true);

    // Check cache first
    const cacheKey = cacheService.getPopularKey(1);
    const cached = cacheService.get<Photo[]>(cacheKey);

    if (cached) {
      setPhotos(cached);
      setLoading(false);
      return;
    }

    try {
      const data = await photoAPI.getPopularPhotos(1);
      setPhotos(data);
      cacheService.set(cacheKey, data);
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      loadPopularPhotos();
      return;
    }

    setCurrentQuery(query);
    setCurrentPage(1);
    setLoading(true);

    // Save to history
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    if (!history.includes(query)) {
      history.unshift(query);
      if (history.length > 20) history.pop();
      localStorage.setItem("searchHistory", JSON.stringify(history));
    }

    // Check cache
    const cacheKey = cacheService.getSearchKey(query, 1);
    const cached = cacheService.get<CacheResults<Photo[]>>(cacheKey);

    if (cached) {
      setPhotos(cached.results);
      setHasMore(cached.total_pages > 1);
      setLoading(false);
      return;
    }

    // Fetch from API
    try {
      const data = await photoAPI.searchPhotos(query, 1);
      setPhotos(data.results);
      setHasMore(data.total_pages > 1);
      cacheService.set(cacheKey, data);
    } catch (error) {
      console.error("შეცდომა ძებნაში:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (hasError || loading || !hasMore) return;

    setLoading(true);
    const nextPage = currentPage + 1;

    try {
      let data;
      if (currentQuery) {
        const response = await photoAPI.searchPhotos(currentQuery, nextPage);
        data = response.results;
        setHasMore(nextPage < response.total_pages);
      } else {
        data = await photoAPI.getPopularPhotos(nextPage);
      }

      const existingIds = new Set(photos.map((p) => p.id));
      const uniqueData = data.filter((photo) => !existingIds.has(photo.id));

      setPhotos((prev) => [...prev, ...uniqueData]);
      setCurrentPage(nextPage);
      setHasError(false);
      setLoading(false);
    } catch (error) {
      console.error("რაღაც შეცდომაა..:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-page">
      <SearchBar onSearch={handleSearch} />
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loading={loading}>
        <PhotoGrid photos={photos} />
      </InfiniteScroll>
    </div>
  );
};
