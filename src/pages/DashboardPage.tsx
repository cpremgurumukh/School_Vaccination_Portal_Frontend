import React, { useEffect, useState, useCallback } from 'react';
import { getDashboardData } from '../services/dashboardService';
import { DashboardData } from '../types/dashboard.types';
import { useLocation } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchData = useCallback(async () => {
    console.log("DashboardPage: Fetching data...");
    try {
        setLoading(true);
        setError(null);
        const data = await getDashboardData();
      console.log("DashboardPage: Data RECEIVED from API:", JSON.stringify(data, null, 2)); // LOG THE RAW DATA
        setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
      console.error("DashboardPage fetchData error:", err);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, location.key]);
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!dashboardData) return <p>No dashboard data available.</p>;

  return (
    <div>
      <h1 className="page-title">Vaccination Portal Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <h3>Total Students</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboardData.totalStudents ?? 'N/A'}</p>
        </div>
        <div className="card">
          <h3>Total Vaccinated</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboardData.vaccinatedStudents ?? 'N/A'}</p>
        </div>
        <div className="card">
          <h3>Vaccination Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {typeof dashboardData.vaccinatedPercentage === 'number' 
              ? (dashboardData.vaccinatedPercentage ).toFixed(2) + '%' 
              : 'N/A'}
          </p>
        </div>
        <div className="card">
          
          <h3>Upcoming Drives</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboardData.upcomingDrives.length ?? 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;