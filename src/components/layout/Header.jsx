import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: '1rem'
    }} className="fade-in">
      <div>
        <h1>{title}</h1>
        <p className="text-dim" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>{subtitle}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--risk-low)' }}></div>
          <span style={{ fontSize: '0.9rem' }}>System Status: Normal</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
