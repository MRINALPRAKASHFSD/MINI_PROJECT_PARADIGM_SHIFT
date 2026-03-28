import React from 'react';
import './Toast.css';

function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={'toast-item toast-' + toast.type}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
