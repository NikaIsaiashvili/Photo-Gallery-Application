import axios from "axios";
import { PhotoStats, SearchResponse } from "../types";
import { Photo } from "../types/photos";

const API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = "https://api.unsplash.com";

// Create axios with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${API_KEY}`,
  },
});

export const photoAPI = {
  // Get popular photos
  getPopularPhotos: async (page = 1, perPage = 20): Promise<Photo[]> => {
    const response = await api.get("/photos", {
      params: {
        page,
        per_page: perPage,
        order_by: "popular",
      },
    });
    return response.data;
  },

  // Search photos
  searchPhotos: async (
    query: string,
    page = 1,
    perPage = 20
  ): Promise<SearchResponse> => {
    const response = await api.get("/search/photos", {
      params: {
        query,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  // Get photo statistics
  getPhotoStats: async (photoId: string): Promise<PhotoStats> => {
    const response = await api.get(`/photos/${photoId}/statistics`);
    return response.data;
  },
};
