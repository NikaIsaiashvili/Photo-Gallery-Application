import { Photo } from "./photos";

export interface PhotoStats {
  downloads: {
    total: number;
  };
  views: {
    total: number;
  };
  likes: {
    total: number;
  };
}

// Search response from API
export interface SearchResponse {
  total: number;
  total_pages: number;
  results: Photo[];
}
