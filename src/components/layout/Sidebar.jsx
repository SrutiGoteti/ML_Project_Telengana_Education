import React from 'react';

const Sidebar = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'reports', label: 'District Reports', icon: '📁' },
    { id: 'search', label: 'School Search', icon: '🔍' },
    { id: 'advisor', label: 'Policy Advisor', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h2 style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>TS-EduAnalytics</h2>
        <p className="text-dim">Telangana State Education Portal</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2.5rem' }}>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            style={{
              padding: '1rem',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              background: activeTab === item.id ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === item.id ? 'var(--accent)' : 'var(--text-dim)',
              transition: 'all 0.2s ease',
              border: activeTab === item.id ? '1px solid var(--glass-border)' : '1px solid transparent'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span style={{ fontWeight: activeTab === item.id ? '600' : '500' }}>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div className="glass-card" style={{ padding: '1rem', fontSize: '0.8rem', background: 'rgba(79, 70, 229, 0.05)' }}>
          <p style={{ marginBottom: '0.5rem', opacity: 0.7 }}>Logged in as:</p>
          <p style={{ color: 'var(--accent)', fontWeight: '700' }}>DEO_MAHABUBNAGAR</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
