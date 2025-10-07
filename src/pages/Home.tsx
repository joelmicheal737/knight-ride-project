import React, { useState, useEffect } from 'react';
import { MapPin, Fuel, Wrench, Phone, AlertTriangle, Navigation, Clock, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rideStats] = useState({
    totalRides: 127,
    totalDistance: '2,340 km',
    fuelSaved: '₹8,240',
    safetyScore: 95
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const QuickActionCard = ({ icon: Icon, title, subtitle, onClick, color = '#E53935' }) => (
    <div className="quick-action-card" onClick={onClick}>
      <div className="quick-action-gradient">
        <div className="quick-action-icon" style={{ backgroundColor: color }}>
          <Icon size={24} color="#FFFFFF" />
        </div>
        <h3 className="quick-action-title">{title}</h3>
        <p className="quick-action-subtitle">{subtitle}</p>
      </div>
    </div>
  );

  const StatCard = ({ label, value, icon: Icon }) => (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} color="#E53935" />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="home-container">
      <div className="home-gradient">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="greeting">{getGreeting()}, {user?.name || 'Knight'}</h1>
            <p className="welcome-text">Your Safety Companion</p>
          </div>
          <div className="time-container">
            <div className="time">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="date">{currentTime.toLocaleDateString()}</div>
          </div>
        </div>

        {/* Safety Status */}
        <div className="safety-status">
          <div className="safety-gradient">
            <div className="safety-content">
              <Star size={24} color="#FFFFFF" />
              <span className="safety-text">Safety Score: {rideStats.safetyScore}%</span>
            </div>
            <p className="safety-subtext">All systems active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <QuickActionCard
              icon={Fuel}
              title="Find Fuel"
              subtitle="Nearby pumps"
              color="#FF9800"
              onClick={() => console.log('Find fuel')}
            />
            <QuickActionCard
              icon={Wrench}
              title="Garage"
              subtitle="Service help"
              color="#2196F3"
              onClick={() => console.log('Find garage')}
            />
            <QuickActionCard
              icon={Phone}
              title="Call Help"
              subtitle="24/7 support"
              color="#4CAF50"
              onClick={() => console.log('Call help')}
            />
            <QuickActionCard
              icon={AlertTriangle}
              title="Emergency"
              subtitle="SOS alert"
              color="#E53935"
              onClick={() => console.log('Emergency')}
            />
          </div>
        </div>

        {/* Ride Stats */}
        <div className="section">
          <h2 className="section-title">Your Ride Stats</h2>
          <div className="stats-grid">
            <StatCard
              label="Total Rides"
              value={rideStats.totalRides}
              icon={Navigation}
            />
            <StatCard
              label="Distance"
              value={rideStats.totalDistance}
              icon={MapPin}
            />
            <StatCard
              label="Fuel Saved"
              value={rideStats.fuelSaved}
              icon={Fuel}
            />
            <StatCard
              label="Safety Score"
              value={`${rideStats.safetyScore}%`}
              icon={Star}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-card">
            <div className="activity-item">
              <div className="activity-icon">
                <Fuel size={16} color="#FF9800" />
              </div>
              <div className="activity-content">
                <h4 className="activity-title">Fuel Stop - HP Petrol Pump</h4>
                <p className="activity-time">2 hours ago • Bandra, Mumbai</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <Wrench size={16} color="#2196F3" />
              </div>
              <div className="activity-content">
                <h4 className="activity-title">Service Reminder</h4>
                <p className="activity-time">Next service due in 500 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;