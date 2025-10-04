// src/components/StatusModal.js

import React from 'react';
import './StatusModal.css';

/**
 * A reusable SVG icon component to indicate success.
 */
const SuccessIcon = () => (
  <svg className="status-icon success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
  </svg>
);

/**
 * A reusable SVG icon component to indicate an error.
 */
const ErrorIcon = () => (
  <svg className="status-icon error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

/**
 * A simple modal component to display a status message (success or error).
 * It appears as an overlay on the screen.
 *
 * @param {boolean} isOpen - Controls whether the modal is visible or not.
 * @param {string} status - Determines which icon to show ('success' or 'error').
 * @param {string} title - The main heading of the modal.
 * @param {string} message - The descriptive text below the title.
 */
const StatusModal = ({ isOpen, status, title, message }) => {
  // If the modal is not supposed to be open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    <div className="status-modal-overlay">
      <div className="status-modal-content">
        {/* Conditionally render the correct icon based on the 'status' prop. */}
        {status === 'success' && <SuccessIcon />}
        {status === 'error' && <ErrorIcon />}
        
        <h2 className="status-modal-title">{title}</h2>
        <p className="status-modal-message">{message}</p>
      </div>
    </div>
  );
};

export default StatusModal;