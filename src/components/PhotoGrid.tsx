import React, { useState } from "react";
import { Photo } from "../types/photos";
import { PhotoItem } from "./Photo";
import { Modal } from "./Modal";
import "../styles/PhotoGrid.css";
import { PhotoView } from "./PhotoView";

interface PhotoGridProps {
  photos: Photo[];
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="photo-box">
        {photos.map((photo, index) => (
          <PhotoItem
            key={index}
            photo={photo}
            onPhotoClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>

      {selectedPhoto && (
        <Modal onClose={() => setSelectedPhoto(null)}>
          <PhotoView selectedPhoto={selectedPhoto} />
        </Modal>
      )}
    </>
  );
};
