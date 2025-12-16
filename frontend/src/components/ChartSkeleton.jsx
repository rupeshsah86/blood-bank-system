import './ChartSkeleton.css';

const ChartSkeleton = ({ type = 'bar', height = '300px' }) => {
  const renderBarChart = () => (
    <div className="chart-skeleton-bars">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="chart-bar" 
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="chart-skeleton-line">
      <svg width="100%" height="100%" viewBox="0 0 400 200">
        <path
          d="M20,150 Q100,50 180,100 T360,80"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          opacity="0.3"
        />
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={20 + i * 50}
            cy={Math.random() * 100 + 50}
            r="4"
            fill="currentColor"
            opacity="0.3"
          />
        ))}
      </svg>
    </div>
  );

  const renderPieChart = () => (
    <div className="chart-skeleton-pie">
      <svg width="100%" height="100%" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          strokeDasharray="50 10 30 10 40 10"
          opacity="0.3"
        />
      </svg>
    </div>
  );

  return (
    <div className="chart-skeleton" style={{ height }}>
      <div className="chart-skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <div className="chart-skeleton-content">
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>
    </div>
  );
};

export default ChartSkeleton;