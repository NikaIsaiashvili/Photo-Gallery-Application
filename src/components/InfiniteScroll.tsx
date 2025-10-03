import React, { useEffect, useRef, useCallback, useState } from "react";
import "../styles/infiniteScroll.css";

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  hasMore,
  loading,
  children,
}) => {
  const observeRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (loading) {
      setShowLoading(true);
    } else {
      // hide after 0.5s
      timer = setTimeout(() => setShowLoading(false), 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [loadMore, hasMore, loading]
  );
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    observeRef.current = new IntersectionObserver(handleObserver, option);

    if (loadingRef.current) {
      observeRef.current.observe(loadingRef.current);
    }
    return () => {
      if (observeRef.current) {
        observeRef.current.disconnect();
      }
    };
  }, [handleObserver]);
  return (
    <div className="loading-box">
      {children}
      <div ref={loadingRef} style={{ height: "20px" }}>
        {showLoading && <div className="loading">იტვირთება...</div>}
      </div>
    </div>
  );
};
