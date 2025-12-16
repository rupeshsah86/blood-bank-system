import { useState, useEffect } from 'react';
import { donorService } from '../donor/donorService';
import { bloodService } from '../blood/bloodService';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    bloodGroupDistribution: {},
    urgencyStats: {},
    totalStats: {
      donors: 0,
      requests: 0,
      bloodUnits: 0,
      criticalRequests: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [donorsRes, requestsRes, stockRes] = await Promise.all([
        donorService.getDonors().catch(() => ({ data: [] })),
        bloodService.getBloodRequests().catch(() => ({ data: [] })),
        bloodService.getBloodStock().catch(() => ({ data: [] }))
      ]);

      const donors = donorsRes?.success ? donorsRes.data : (Array.isArray(donorsRes) ? donorsRes : []);
      const requests = requestsRes?.success ? requestsRes.data : (Array.isArray(requestsRes) ? requestsRes : []);
      const stock = stockRes?.success ? stockRes.data : (Array.isArray(stockRes) ? stockRes : []);

      const bloodGroupDist = {};
      donors.forEach(donor => {
        bloodGroupDist[donor.bloodGroup] = (bloodGroupDist[donor.bloodGroup] || 0) + 1;
      });

      const urgencyStats = {};
      requests.forEach(request => {
        urgencyStats[request.urgency] = (urgencyStats[request.urgency] || 0) + 1;
      });

      const totalBloodUnits = stock.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const criticalRequests = requests.filter(req => req.urgency === 'critical').length;

      setAnalytics({
        bloodGroupDistribution: bloodGroupDist,
        urgencyStats,
        totalStats: {
          donors: donors.length,
          requests: requests.length,
          bloodUnits: totalBloodUnits,
          criticalRequests
        }
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'var(--blood-red)', 'A-': 'var(--blood-red)',
      'B+': 'var(--medical-blue)', 'B-': 'var(--medical-blue)',
      'AB+': '#7c3aed', 'AB-': '#7c3aed',
      'O+': 'var(--life-green)', 'O-': 'var(--life-green)'
    };
    return colors[bloodGroup] || 'var(--gray-400)';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'low': 'var(--life-green)',
      'medium': 'var(--warning-orange)',
      'high': 'var(--blood-red)',
      'critical': 'var(--blood-dark-red)'
    };
    return colors[urgency] || 'var(--gray-400)';
  };

  if (loading) {
    return (
      <div className="analytics">
        <div className="analytics-loading">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>System Analytics</h2>
        <p>Overview of blood bank system performance and statistics</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Blood Group Distribution</h3>
          <div className="chart-container">
            {Object.entries(analytics.bloodGroupDistribution).map(([group, count]) => (
              <div key={group} className="chart-bar">
                <div className="bar-info">
                  <span className="bar-label">{group}</span>
                  <span className="bar-value">{count}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(count / Math.max(...Object.values(analytics.bloodGroupDistribution))) * 100}%`,
                      backgroundColor: getBloodGroupColor(group)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Request Urgency Levels</h3>
          <div className="urgency-stats">
            {Object.entries(analytics.urgencyStats).map(([urgency, count]) => (
              <div key={urgency} className="urgency-item">
                <div 
                  className="urgency-indicator"
                  style={{ backgroundColor: getUrgencyColor(urgency) }}
                ></div>
                <span className="urgency-label">{urgency.charAt(0).toUpperCase() + urgency.slice(1)}</span>
                <span className="urgency-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Key Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon donors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3.72 5.6L8.5 11.5C7.67 10.67 6.83 10 6 10s-1.67.67-2.5 1.5L2 13v7h2v-5.5l1.5-1.5L7 15.5V22h2v-7l2.72-2.72L14.5 16H18v6h2z"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-number">{analytics.totalStats.donors}</span>
                <span className="metric-label">Total Donors</span>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon blood">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-number">{analytics.totalStats.bloodUnits}</span>
                <span className="metric-label">Blood Units</span>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon requests">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-number">{analytics.totalStats.requests}</span>
                <span className="metric-label">Total Requests</span>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon critical">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-number">{analytics.totalStats.criticalRequests}</span>
                <span className="metric-label">Critical Requests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;