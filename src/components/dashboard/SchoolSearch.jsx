import React, { useState } from 'react';

const SchoolSearch = ({ schools, onSelectSchool }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');

  const districts = ['All', ...new Set(schools.map(s => s.district))];

  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'All' || s.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <input 
            type="text" 
            placeholder="Search by School Name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '12px', 
              border: '1px solid var(--glass-border)',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
        </div>
        <select 
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          style={{ 
            padding: '1rem', 
            borderRadius: '12px', 
            border: '1px solid var(--glass-border)',
            background: 'white'
          }}
        >
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h2>Search Results ({filteredSchools.length})</h2>
        </div>
        <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '1rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>District</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map(school => (
                <tr key={school.id}>
                  <td style={{ fontWeight: '600' }}>{school.name}</td>
                  <td>{school.district}</td>
                  <td>
                    <span className={`badge ${school.crs.category === 'High' ? 'badge-high' : school.crs.category === 'Moderate' ? 'badge-mod' : 'badge-low'}`}>
                      {school.crs.category}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => onSelectSchool(school)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        background: 'var(--accent)', 
                        color: 'white', 
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Analyze
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

export default SchoolSearch;
