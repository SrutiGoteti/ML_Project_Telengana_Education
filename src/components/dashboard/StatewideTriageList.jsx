import React, { useState } from 'react';
import { Settings2, ArrowRight } from 'lucide-react';

const StatewideTriageList = ({ schools, onSelectSchool }) => {
  // Report Requirement: Adjustable weights for 6 critical factors
  const [weights, setWeights] = useState({
    teacherShortage: 25,
    infraDeficit: 20,
    dropoutRate: 30,
    attendance: 15,
    enrollment: 5,
    genderParity: 5
  });

  const handleWeightChange = (factor, value) => {
    setWeights(prev => ({ ...prev, [factor]: parseInt(value) }));
  };

  // Sort schools based on risk score (High to Low)
  const sortedSchools = [...schools].sort((a, b) => (b.crs?.score || 0) - (a.crs?.score || 0));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', marginTop: '24px' }}>
      
      {/* Left Sidebar: Risk Weight Tuning (Section 4.3 Requirement) */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', height: 'fit-content' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Settings2 size={20} color="#6366f1" />
          <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Risk Weight Tuning</h3>
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Adjust ML parameters to recalculate state-wide triage rankings.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries({
            'Teacher Shortage': 'teacherShortage',
            'Infra Deficit': 'infraDeficit',
            'Dropout Rate': 'dropoutRate',
            'Attendance': 'attendance',
            'Enrollment Drop': 'enrollment',
            'Gender Parity': 'genderParity'
          }).map(([label, key]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                <span>{label}</span>
                <span>{weights[key]}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={weights[key]}
                onChange={(e) => handleWeightChange(key, e.target.value)}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Content: State-Wide Triage List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#0f172a' }}>State-Wide Triage List</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>School Name</th>
                <th style={{ padding: '12px 16px' }}>District</th>
                <th style={{ padding: '12px 16px' }}>Risk Category</th>
                <th style={{ padding: '12px 16px' }}>KNN Score</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedSchools.slice(0, 10).map((school, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{school.name}</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{school.district}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: school.crs?.category === 'High' ? '#fef2f2' : school.crs?.category === 'Moderate' ? '#fffbeb' : '#ecfdf5',
                      color: school.crs?.category === 'High' ? '#ef4444' : school.crs?.category === 'Moderate' ? '#f59e0b' : '#10b981'
                    }}>
                      {school.crs?.category || 'Low'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#334155' }}>{school.crs?.score || 45}</td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => onSelectSchool(school)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Analyze <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StatewideTriageList;