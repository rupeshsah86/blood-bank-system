import { useState, useEffect } from 'react';
import { donorService } from './donorService';
import { authService } from '../auth/authService';
import Loader from '../../components/Loader';
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
        <Loader />
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

      {error && (
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
      )}

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search donors by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterBloodGroup}
            onChange={(e) => setFilterBloodGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="donors-grid">
        {donors.length === 0 && !error ? (
          <div className="no-donors">
            <p>No donors registered yet.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '8px' }}>
              Add donors using the "Add New Donor" section above.
            </p>
          </div>
        ) : filteredDonors.length === 0 && donors.length > 0 ? (
          <div className="no-donors">
            <p>No donors found matching your search criteria.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '8px' }}>
              Try adjusting your search terms or blood group filter.
            </p>
          </div>
        ) : (
          filteredDonors.map(donor => (
            <div key={donor._id} className="donor-card">
              <div className="donor-header">
                <h3>{donor.name}</h3>
                <span className={`blood-badge ${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                  {donor.bloodGroup}
                </span>
              </div>
              <div className="donor-info">
                <p><strong>Email:</strong> {donor.email}</p>
                <p><strong>Phone:</strong> {donor.phone}</p>
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