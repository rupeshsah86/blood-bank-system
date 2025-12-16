import { useState, useEffect } from 'react';
import { donorService } from './donorService';
import { authService } from '../auth/authService';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import NetworkError from '../../components/NetworkError';
import { showToast } from '../../components/ToastContainer';
import './Donor.css';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [user, setUser] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      setError('');
      const response = await donorService.getDonors();
      console.log('Donors response:', response);
      
      if (response && response.success && response.data) {
        setDonors(response.data);
      } else if (response && Array.isArray(response)) {
        setDonors(response);
      } else {
        setDonors([]);
        console.log('No donors data found in response');
      }
    } catch (error) {
      console.error('Error loading donors:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 3001.');
      } else if (error.response?.status === 401) {
        setError('Please login to view donors');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view donors');
      } else {
        setError(error.response?.data?.message || 'Failed to load donors. Please try again.');
      }
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !filterBloodGroup || donor.bloodGroup === filterBloodGroup;
    return matchesSearch && matchesBloodGroup;
  });

  if (loading) {
    return (
      <div className="donor-list">
        <div className="section-header">
          <h2>Donor Directory</h2>
          <p>Manage and view all registered donors</p>
        </div>
        <SkeletonLoader variant="card" count={6} />
      </div>
    );
  }

  return (
    <div className="donor-list">
      <div className="section-header">
        <h2>Donor Directory</h2>
        <p>Manage and view all registered donors</p>
        {process.env.NODE_ENV === 'development' && (
          <small style={{ color: 'var(--gray-500)' }}>
            Debug: {donors.length} donors loaded, Loading: {loading.toString()}, Error: {error || 'none'}
          </small>
        )}
      </div>

      {error && error.includes('connect') ? (
        <NetworkError onRetry={loadDonors} error={{ code: 'ERR_NETWORK' }} />
      ) : error ? (
        <div className="error-message">
          {error}
          <button 
            onClick={loadDonors} 
            className="retry-btn"
            style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '0.75rem' }}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="filters" role="search" aria-label="Filter donors">
        <div className="search-box">
          <label htmlFor="donor-search" className="sr-only">Search donors</label>
          <input
            id="donor-search"
            type="text"
            placeholder="Search donors by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search donors by name, email, or city"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="blood-group-filter" className="sr-only">Filter by blood group</label>
          <select
            id="blood-group-filter"
            value={filterBloodGroup}
            onChange={(e) => setFilterBloodGroup(e.target.value)}
            aria-label="Filter donors by blood group"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="donors-grid grid grid-cols-3">
        {donors.length === 0 && !error ? (
          <EmptyState
            variant="no-data"
            title="No Donors Registered"
            description="Start building your donor database by adding new donors to the system."
            action={
              <button className="btn btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Add First Donor
              </button>
            }
          />
        ) : filteredDonors.length === 0 && donors.length > 0 ? (
          <EmptyState
            variant="search"
            title="No Matching Donors"
            description="No donors found matching your search criteria. Try adjusting your filters."
            action={
              <button className="btn btn-outline" onClick={() => { setSearchTerm(''); setFilterBloodGroup(''); }}>
                Clear Filters
              </button>
            }
          />
        ) : (
          filteredDonors.map(donor => (
            <div 
              key={donor._id} 
              className="donor-card"
              tabIndex="0"
              role="article"
              aria-label={`Donor ${donor.name}, blood type ${donor.bloodGroup}, located in ${donor.city}`}
            >
              <div className="donor-header">
                <h3>{donor.name}</h3>
                <span 
                  className={`blood-badge ${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}
                  aria-label={`Blood type ${donor.bloodGroup}`}
                >
                  {donor.bloodGroup}
                </span>
              </div>
              <div className="donor-info">
                <p><strong>Email:</strong> <span aria-label={`Email address ${donor.email}`}>{donor.email}</span></p>
                <p><strong>Phone:</strong> <span aria-label={`Phone number ${donor.phone}`}>{donor.phone}</span></p>
                <p><strong>City:</strong> {donor.city}</p>
                <p><strong>Age:</strong> {donor.age} years</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonorList;