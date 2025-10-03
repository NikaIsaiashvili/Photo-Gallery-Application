import React from "react";
import { Photo } from "../types/photos";

interface IPhotoItem {
  photo: Photo;
  onPhotoClick?: (photo: Photo) => void;
}

export const PhotoItem: React.FC<IPhotoItem> = ({ photo, onPhotoClick }) => {
  return (
    <div
      style={{
        cursor: onPhotoClick ? "pointer" : "default",
      }}
      onClick={() => onPhotoClick && onPhotoClick(photo)}
    >
      <img src={photo.urls.thumb} alt={photo.alt_description || "Photo"} />
    </div>
  );
};
