import React from "react";
import "./Modal.css";

/**
 * Generic Modal dialog
 * @param {open, children, onClose}
 */
// PUBLIC_INTERFACE
export default function Modal({ open, children, onClose }) {
  if (!open) return null;
  // Public interface
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        {children}
      </div>
    </div>
  );
}
