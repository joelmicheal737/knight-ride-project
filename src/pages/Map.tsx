import React, { useState } from 'react';
import { Search, Filter, MapPin, Fuel, Wrench, Navigation, Star, Phone } from 'lucide-react';
import './Map.css';

const Map: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [nearbyServices] = useState([
    {
      id: 1,
      name: 'HP Petrol Pump',
      type: 'fuel',
      distance: '0.5 km',
      rating: 4.5,
      address: 'Linking Road, Bandra West',
      phone: '+91 9876543210',
      isOpen: true,
    },
    {
      id: 2,
      name: 'Royal Enfield Service',
      type: 'garage',
      distance: '1.2 km',
      rating: 4.8,
      address: 'Hill Road, Bandra West',
      phone: '+91 9876543211',
      isOpen: true,
    },
    {
      id: 3,
      name: 'Shell Petrol Station',
      type: 'fuel',
      distance: '0.8 km',
      rating: 4.3,
      address: 'Turner Road, Bandra West',
      phone: '+91 9876543212',
      isOpen: false,
    },
    {
      id: 4,
      name: 'Bajaj Authorized Service',
      type: 'garage',
      distance: '2.1 km',
      rating: 4.6,
      address: 'SV Road, Khar West',
      phone: '+91 9876543213',
      isOpen: true,
    },
  ]);

  const FilterButton = ({ title, type, icon: Icon }) => (
    <button
      className={`filter-button ${activeFilter === type ? 'active' : ''}`}
      onClick={() => setActiveFilter(type)}
    >
      <Icon size={16} />
      <span>{title}</span>
    </button>
  );

  const ServiceCard = ({ service }) => (
    <div className="service-card">
      <div className="service-header">
        <div className="service-icon">
          {service.type === 'fuel' ? (
            <Fuel size={20} color="#FF9800" />
          ) : (
            <Wrench size={20} color="#2196F3" />
          )}
        </div>
        <div className="service-info">
          <h3 className="service-name">{service.name}</h3>
          <p className="service-address">{service.address}</p>
        </div>
        <div className="service-actions">
          <button className="call-button">
            <Phone size={16} color="#4CAF50" />
          </button>
          <button className="navigate-button">
            <Navigation size={16} color="#FFFFFF" />
          </button>
        </div>
      </div>
      
      <div className="service-details">
        <div className="service-metrics">
          <div className="metric">
            <MapPin size={12} color="#B0BEC5" />
            <span>{service.distance}</span>
          </div>
          <div className="metric">
            <Star size={12} color="#FFCA28" />
            <span>{service.rating}</span>
          </div>
          <div className={`status-badge ${service.isOpen ? 'open' : 'closed'}`}>
            <span>{service.isOpen ? 'Open' : 'Closed'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredServices = nearbyServices.filter(service => {
    if (activeFilter === 'all') return true;
    return service.type === activeFilter;
  });

  return (
    <div className="map-container">
      <div className="map-gradient">
        {/* Header */}
        <div className="header">
          <h1 className="title">Knight Map</h1>
          <p className="subtitle">Your road, your rules</p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <Search size={20} color="#B0BEC5" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for fuel pumps, garages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="filter-icon">
              <Filter size={20} color="#E53935" />
            </button>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="map-placeholder-container">
          <div className="map-placeholder">
            <MapPin size={48} color="#E53935" />
            <h2 className="map-text">Interactive Map</h2>
            <p className="map-subtext">
              {filteredServices.length} services nearby
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filters-container">
          <div className="filters">
            <FilterButton title="All" type="all" icon={MapPin} />
            <FilterButton title="Fuel" type="fuel" icon={Fuel} />
            <FilterButton title="Garage" type="garage" icon={Wrench} />
          </div>
        </div>

        {/* Services List */}
        <div className="services-container">
          <h2 className="services-title">
            Nearby Services ({filteredServices.length})
          </h2>
          <div className="services-list">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;