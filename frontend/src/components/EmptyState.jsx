import './EmptyState.css';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  variant = 'default',
  className = '' 
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'no-data':
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h6a1 1 0 100-2H9zM4 5a2 2 0 012-2h1a1 1 0 000 2H6v6.5a.5.5 0 001 0V7h10v4.5a.5.5 0 001 0V5h-1a1 1 0 100-2h1a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
          </svg>
        );
      case 'search':
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        );
      default:
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        );
    }
  };

  return (
    <div className={`empty-state empty-state-${variant} ${className}`} role="region" aria-label="Empty state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon || getDefaultIcon()}
      </div>
      <div className="empty-state-content">
        <h3 className="empty-state-title">{title}</h3>
        {description && (
          <p className="empty-state-description">{description}</p>
        )}
        {action && (
          <div className="empty-state-action">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;