import React, { useEffect, useState } from "react";
import { Photo } from "../types/photos";
import { photoAPI } from "../services/api";
import { PhotoStats } from "../types";
import "../styles/Photoview.css";

interface PhotoViewProps {
  selectedPhoto: Photo;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const PhotoView: React.FC<PhotoViewProps> = ({ selectedPhoto }) => {
  const [photoStats, setPhotoStats] = useState<PhotoStats | null>();

  useEffect(() => {
    getPhotoStats();
  }, []);

  const getPhotoStats = async () => {
    const data = await photoAPI.getPhotoStats(selectedPhoto.id);
    setPhotoStats(data);
  };
  return (
    <div className="photoStats-container">
      <img src={selectedPhoto.urls.full} alt="Selected" />
      <div className="photoStats-info">
        <div>
          Views: <span>{formatNumber(photoStats?.views.total ?? 0)}</span>
        </div>
        <div>
          Downloads:{" "}
          <span>{formatNumber(photoStats?.downloads.total ?? 0)}</span>
        </div>
        <div>
          Likes: <span>{formatNumber(selectedPhoto.likes ?? 0)}</span>
        </div>
      </div>
    </div>
  );
};
