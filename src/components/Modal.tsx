import React from "react";
import "../styles/Modal.css";
import { Photo } from "../types/photos";

interface ModalProps {
  children: React.ReactElement;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};
