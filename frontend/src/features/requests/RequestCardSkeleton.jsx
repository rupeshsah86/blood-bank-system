import './RequestCardSkeleton.css';

const RequestCardSkeleton = () => {
  return (
    <div className="request-card-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-badges">
          <div className="skeleton-badge skeleton-blood"></div>
          <div className="skeleton-badge skeleton-urgency"></div>
        </div>
        <div className="skeleton-badge skeleton-status"></div>
      </div>
      
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-detail"></div>
        <div className="skeleton-detail"></div>
        <div className="skeleton-detail"></div>
        <div className="skeleton-detail short"></div>
      </div>
    </div>
  );
};

export default RequestCardSkeleton;