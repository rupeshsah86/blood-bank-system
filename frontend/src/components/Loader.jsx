import './Loader.css';

const Loader = ({ variant = 'spinner', size = 'md' }) => {
  if (variant === 'spinner') {
    return (
      <div className={`loader-container loader-${size}`} role="status" aria-label="Loading" aria-busy="true">
        <div className="loader">
          <div className="blood-drop"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="inline-loader" role="status" aria-label="Loading" aria-busy="true">
      <div className="spinner"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;