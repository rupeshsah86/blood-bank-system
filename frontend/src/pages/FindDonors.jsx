import { useState, useEffect } from 'react';
import { donorService } from '../features/donor/donorService';
import Loader from '../components/Loader';
import './FindDonors.css';

const FindDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    bloodGroup: '',
    city: '',
    name: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleFilterChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await donorService.getDonors();
      const allDonors = response?.success ? response.data : (Array.isArray(response) ? response : []);
      
      const filtered = allDonors.filter(donor => {
        const matchesBloodGroup = !searchFilters.bloodGroup || donor.bloodGroup === searchFilters.bloodGroup;
        const matchesCity = !searchFilters.city || donor.city.toLowerCase().includes(searchFilters.city.toLowerCase());
        const matchesName = !searchFilters.name || donor.name.toLowerCase().includes(searchFilters.name.toLowerCase());
        
        return matchesBloodGroup && matchesCity && matchesName;
      });
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching donors:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchFilters({ bloodGroup: '', city: '', name: '' });
    setSearchResults([]);
    setHasSearched(false);
  };

  const getCompatibleBloodGroups = (bloodGroup) => {
    const compatibility = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };
    return compatibility[bloodGroup] || [];
  };

  return (
    <div className="find-donors-page">
      <div className="container">
        <section className="find-donors-hero">
          <h1>Find Blood Donors</h1>
          <p>Search for available blood donors in your area</p>
        </section>

        <div className="search-section">
          <div className="search-card">
            <h2>Search Donors</h2>
            <div className="search-form">
              <div className="search-row">
                <div className="search-group">
                  <label htmlFor="bloodGroup">Blood Group Needed</label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={searchFilters.bloodGroup}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="search-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={searchFilters.city}
                    onChange={handleFilterChange}
                    placeholder="Enter city name"
                  />
                </div>

                <div className="search-group">
                  <label htmlFor="name">Donor Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={searchFilters.name}
                    onChange={handleFilterChange}
                    placeholder="Enter donor name"
                  />
                </div>
              </div>

              <div className="search-actions">
                <button 
                  onClick={handleSearch} 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <Loader /> : 'Search Donors'}
                </button>
                <button 
                  onClick={clearSearch} 
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>

          {searchFilters.bloodGroup && (
            <div className="compatibility-info">
              <h3>Compatible Donors for {searchFilters.bloodGroup}</h3>
              <div className="compatible-groups">
                {getCompatibleBloodGroups(searchFilters.bloodGroup).map(group => (
                  <span key={group} className={`blood-badge ${group.replace('+', 'pos').replace('-', 'neg')}`}>
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasSearched && (
          <div className="results-section">
            <h2>Search Results</h2>
            {loading ? (
              <div className="loading-container">
                <Loader />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--gray-400)">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3>No Donors Found</h3>
                <p>No donors match your search criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="donors-grid">
                {searchResults.map(donor => (
                  <div key={donor._id} className="donor-card">
                    <div className="donor-header">
                      <h3>{donor.name}</h3>
                      <span className={`blood-badge ${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                        {donor.bloodGroup}
                      </span>
                    </div>
                    <div className="donor-info">
                      <div className="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gray-500)">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>{donor.city}</span>
                      </div>
                      <div className="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gray-500)">
                          <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3v2h18V4z"/>
                        </svg>
                        <span>{donor.age} years old</span>
                      </div>
                      <div className="contact-info">
                        <p><strong>Email:</strong> {donor.email}</p>
                        <p><strong>Phone:</strong> {donor.phone}</p>
                      </div>
                    </div>
                    <div className="donor-actions">
                      <button className="btn btn-primary btn-sm">
                        Contact Donor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="emergency-section">
          <div className="emergency-card">
            <h2>Emergency Blood Request</h2>
            <p>Need blood urgently? Contact our emergency hotline for immediate assistance.</p>
            <div className="emergency-actions">
              <a href="tel:911" className="btn btn-primary">
                Call Emergency: 911
              </a>
              <a href="tel:5551234567" className="btn btn-secondary">
                Blood Bank: (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDonors;