import { useState, useEffect } from 'react';
import './NetworkError.css';

const NetworkError = ({ onRetry, error }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getErrorMessage = () => {
    if (!isOnline) {
      return {
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
        icon: 'offline'
      };
    }
    
    if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
      return {
        title: 'Server Connection Failed',
        message: 'Unable to connect to the server. Please check if the backend is running.',
        icon: 'server'
      };
    }

    return {
      title: 'Connection Error',
      message: 'Something went wrong with the network request. Please try again.',
      icon: 'error'
    };
  };

  const getIcon = (type) => {
    switch (type) {
      case 'offline':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01L16.67 16l1.42 1.42 1.31-1.31zM8.53 7.26l1.75 1.75L6.09 12 8.53 7.26z"/>
          </svg>
        );
      case 'server':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 9h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM4 17h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM6 3h2v2H6V3zM6 11h2v2H6v-2zM6 19h2v2H6v-2z"/>
          </svg>
        );
      default:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="network-error" role="alert">
      <div className="network-error-content">
        <div className="network-error-icon">
          {getIcon(errorInfo.icon)}
        </div>
        <h3>{errorInfo.title}</h3>
        <p>{errorInfo.message}</p>
        
        <div className="network-error-actions">
          <button className="btn btn-primary" onClick={onRetry}>
            Try Again
          </button>
          {!isOnline && (
            <div className="connection-status">
              <span className="status-indicator offline"></span>
              Offline
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkError;