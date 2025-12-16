import { useState, useEffect } from 'react';
import Toast from './Toast';
import './ToastContainer.css';

let toastId = 0;

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type, duration } = event.detail;
      const id = ++toastId;
      
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Toast utility functions
export const showToast = {
  success: (message, duration = 4000) => {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message, type: 'success', duration }
    }));
  },
  error: (message, duration = 5000) => {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message, type: 'error', duration }
    }));
  },
  warning: (message, duration = 4000) => {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message, type: 'warning', duration }
    }));
  },
  info: (message, duration = 4000) => {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message, type: 'info', duration }
    }));
  }
};

export default ToastContainer;