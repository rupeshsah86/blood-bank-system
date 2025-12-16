import './SkeletonLoader.css';

const SkeletonLoader = ({ variant = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <div className="skeleton-header">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-text-group">
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-subtitle"></div>
              </div>
            </div>
            <div className="skeleton-body">
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line-short"></div>
            </div>
          </div>
        );
      
      case 'table-row':
        return (
          <div className={`skeleton-table-row ${className}`}>
            <div className="skeleton-cell skeleton-text"></div>
            <div className="skeleton-cell skeleton-text"></div>
            <div className="skeleton-cell skeleton-text"></div>
            <div className="skeleton-cell skeleton-badge"></div>
          </div>
        );
      
      case 'stats':
        return (
          <div className={`skeleton-stats ${className}`}>
            <div className="skeleton-stat-icon"></div>
            <div className="skeleton-stat-content">
              <div className="skeleton-text skeleton-number"></div>
              <div className="skeleton-text skeleton-label"></div>
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div className={`skeleton-chart ${className}`}>
            <div className="skeleton-chart-header">
              <div className="skeleton-text skeleton-title"></div>
            </div>
            <div className="skeleton-chart-body">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-chart-bar">
                  <div className="skeleton-text skeleton-bar-label"></div>
                  <div className="skeleton-bar" style={{ width: `${Math.random() * 80 + 20}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`skeleton-text ${className}`}></div>
        );
    }
  };

  return (
    <div className="skeleton-container">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;