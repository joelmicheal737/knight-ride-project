import React, { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Map, Phone, AlertTriangle, Settings } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/help', icon: Phone, label: 'Help' },
    { path: '/sos', icon: AlertTriangle, label: 'SOS' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="layout">
      <main className="main-content">
        {children}
      </main>
      <nav className="bottom-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span className="nav-label">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;