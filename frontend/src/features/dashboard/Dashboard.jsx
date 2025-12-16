import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { bloodService } from '../blood/bloodService';
import { donorService } from '../donor/donorService';
import AddDonor from '../donor/AddDonor';
import DonorList from '../donor/DonorList';
import BloodStock from '../blood/BloodStock';
import BloodRequests from '../requests/BloodRequests';
import Loader from '../../components/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ donors: 0, bloodStock: 0, requests: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [donorsRes, stockRes, requestsRes] = await Promise.all([
        donorService.getDonors().catch((err) => {
          console.log('Donors API error:', err.response?.status);
          return { data: [] };
        }),
        bloodService.getBloodStock().catch((err) => {
          console.log('Blood stock API error:', err.response?.status);
          return { data: [] };
        }),
        bloodService.getBloodRequests().catch((err) => {
          console.log('Requests API error:', err.response?.status);
          return { data: [] };
        })
      ]);
      
      const donorCount = donorsRes?.success ? donorsRes.data?.length || 0 : (Array.isArray(donorsRes) ? donorsRes.length : 0);
      const stockCount = stockRes?.success ? stockRes.data?.length || 0 : (Array.isArray(stockRes) ? stockRes.length : 0);
      const requestCount = requestsRes?.success ? requestsRes.data?.length || 0 : (Array.isArray(requestsRes) ? requestsRes.length : 0);
      
      setStats({
        donors: donorCount,
        bloodStock: stockCount,
        requests: requestCount
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}</h1>
          <p>Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            Donors
          </button>
          <button 
            className={`tab ${activeTab === 'blood' ? 'active' : ''}`}
            onClick={() => setActiveTab('blood')}
          >
            Blood Stock
          </button>
          {(user?.role === 'admin' || user?.role === 'hospital') && (
            <button 
              className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
          )}
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon donors">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3.72 5.6L8.5 11.5C7.67 10.67 6.83 10 6 10s-1.67.67-2.5 1.5L2 13v7h2v-5.5l1.5-1.5L7 15.5V22h2v-7l2.72-2.72L14.5 16H18v6h2z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.donors}</h3>
                    <p>Total Donors</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon blood">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.bloodStock}</h3>
                    <p>Blood Units</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon requests">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.requests}</h3>
                    <p>Active Requests</p>
                  </div>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('donors')}
                  >
                    Add New Donor
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => navigate('/find-donors')}
                  >
                    Find Donors
                  </button>
                  {user?.role === 'admin' && (
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('blood')}
                    >
                      Manage Blood Stock
                    </button>
                  )}
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('requests')}
                  >
                    Blood Requests
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donors' && (
            <div className="donors-section">
              <AddDonor onDonorAdded={loadDashboardData} />
              <DonorList key={stats.donors} />
            </div>
          )}

          {activeTab === 'blood' && (
            <BloodStock userRole={user?.role} onStockUpdated={loadDashboardData} />
          )}

          {activeTab === 'requests' && (
            <BloodRequests userRole={user?.role} onRequestUpdated={loadDashboardData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;