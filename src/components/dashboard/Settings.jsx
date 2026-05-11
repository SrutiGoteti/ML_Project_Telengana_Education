import React from 'react';

const Settings = ({ apiKey, setApiKey, threshold, setThreshold }) => {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem' }}>AI Configuration</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Gemini API Key</label>
          <input 
            type="password" 
            placeholder="Paste your Gemini API Key here..." 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              border: '1px solid var(--glass-border)',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Your key is only stored in memory for this session. Get one for free at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>AI Studio</a>.
          </p>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem' }}>ML Threshold Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Critical Risk Threshold</label>
              <span style={{ fontWeight: '700', color: 'var(--risk-high)' }}>{threshold}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="90" 
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--risk-high)' }}
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Schools with an ML confidence score above this threshold will be flagged as "High Risk."
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>System Status</h3>
        <p style={{ fontSize: '0.9rem' }}>ML Engine: <strong>Active (Random Forest)</strong></p>
        <p style={{ fontSize: '0.9rem' }}>Training Data: <strong>40 Schools + 200 Synthetic</strong></p>
      </div>
    </div>
  );
};

export default Settings;
