import React from 'react';

const RiskTable = ({ schools, onSelectSchool, selectedSchoolId }) => {
  // Sort schools by risk score descending
  const sortedSchools = [...schools].sort((a, b) => b.crs.score - a.crs.score);

  const getBadgeClass = (category) => {
    switch(category) {
      case 'High': return 'badge-high';
      case 'Moderate': return 'badge-mod';
      default: return 'badge-low';
    }
  };

  return (
    <div className="glass-card fade-in" style={{ padding: '0' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>School Risk Assessment Matrix</h2>
        <span className="badge" style={{ background: 'var(--accent)', color: 'white' }}>{schools.length} Schools Processed</span>
      </div>
      
      <div style={{ maxHeight: '550px', overflowY: 'auto', padding: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>School Name</th>
              <th>District</th>
              <th>Teacher Load</th>
              <th>Infra Deficit</th>
              <th>Dropout Risk</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedSchools.map((school) => (
              <tr 
                key={school.id} 
                onClick={() => onSelectSchool(school)}
                style={{
                  background: selectedSchoolId === school.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  transform: selectedSchoolId === school.id ? 'scale(1.01)' : 'scale(1)'
                }}
              >
                <td style={{ fontWeight: '600' }}>{school.name}</td>
                <td>{school.district}</td>
                <td>{school.str}</td>
                <td>{school.infraDeficit}</td>
                <td>{school.dropoutRisk}</td>
                <td style={{ fontWeight: '700', color: school.crs.score > 65 ? 'var(--risk-high)' : school.crs.score > 35 ? 'var(--risk-mod)' : 'var(--risk-low)' }}>
                  {school.crs.score}
                </td>
                <td>
                  <span className={`badge ${getBadgeClass(school.crs.category)}`}>
                    {school.crs.category} Risk
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
