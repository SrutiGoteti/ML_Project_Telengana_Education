import React from 'react';

const KPICard = ({ title, value, icon, color }) => (
  <div className="glass-card fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span className="badge" style={{
        background: `${color}22`,
        color: color,
        border: `1px solid ${color}`,
        fontSize: '0.7rem'
      }}>Real-time</span>
    </div>
    <h3 className="text-dim" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</h3>
    <h2 style={{ fontSize: '2rem' }}>{value}</h2>
  </div>
);

const KPICards = ({ schools }) => {
  const totalSchools = schools.length;
  const criticalSchools = schools.filter(s => s.crs.score > 65).length;
  const avgAttendance = Math.round(schools.reduce((acc, s) => acc + s.attendance, 0) / totalSchools);
  const avgRisk = Math.round(schools.reduce((acc, s) => acc + s.crs.score, 0) / totalSchools);

  return (
    <div className="kpi-grid">
      <KPICard
        title="Total Schools"
        value={totalSchools}
        icon="🏫"
        color="var(--accent)"
      />
      <KPICard
        title="Critical Priority"
        value={criticalSchools}
        icon="⚠️"
        color="var(--risk-high)"
      />
      <KPICard
        title="Avg Attendance"
        value={`${avgAttendance}%`}
        icon="👨‍🎓"
        color="var(--risk-low)"
      />
      <KPICard
        title="District Health"
        value={`${100 - avgRisk}%`}
        icon="🛡️"
        color="var(--accent)"
      />
    </div>
  );
};

export default KPICards;
