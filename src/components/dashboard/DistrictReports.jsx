import React, { useMemo } from 'react';
import AnalyticsOverview from './AnalyticsOverview';
import ColumnTooltip from './ColumnTooltip';

/** Official metric definitions used in column header tooltips */
const COLUMN_DEFINITIONS = {
  schoolsMonitored: "Total number of schools actively tracked by the EWS in this district. Derived from the UDISE+ grounded dataset.",
  avgRiskScore: "The average ML-derived Composite Risk Score (0–100) across all schools in the district. Higher values indicate greater predicted risk of school failure. Calculated by the Random Forest engine using attendance, dropout rate, STR, and infrastructure data.",
  avgTeacherLoad: "Average Pupil-Teacher Ratio (PTR) across the district. A value above 40 is flagged as 'Overloaded' per Telangana Teacher Rationalization norms. Target benchmark: ≤ 30:1.",
  criticalSchools: "Count of schools classified as 'High Risk' by the ML engine (Risk Score > 65). These schools are prioritized for immediate inspection by Mandal Educational Officers (MEOs).",
  healthIndex: "Visual indicator calculated as (100 − Average Risk Score). A longer green bar represents a healthier district. Green ≥ 65, Amber 40–64, Red < 40."
};

const DistrictReports = ({ schools }) => {
  const districtStats = useMemo(() => {
    const stats = {};
    schools.forEach(school => {
      if (!stats[school.district]) {
        stats[school.district] = {
          name: school.district,
          count: 0,
          totalRisk: 0,
          criticalCount: 0,
          avgSTR: 0,
          totalStudents: 0,
          totalTeachers: 0
        };
      }
      const s = stats[school.district];
      s.count += 1;
      s.totalRisk += school.crs.score;
      s.totalStudents += school.students;
      s.totalTeachers += school.teachers;
      if (school.crs.category === 'High') s.criticalCount += 1;
    });

    return Object.values(stats).map(d => ({
      ...d,
      avgRisk: Math.round(d.totalRisk / d.count),
      avgSTR: (d.totalStudents / d.totalTeachers).toFixed(1)
    })).sort((a, b) => b.avgRisk - a.avgRisk);
  }, [schools]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-purple) 100%)', color: 'white' }}>
        <h2>State-Wide District Analytics</h2>
        <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Aggregated performance and risk data across all 33 districts of Telangana.</p>
      </div>

      <AnalyticsOverview schools={schools} />

      <div className="glass-card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h2>District Performance Leaderboard</h2>
          <p className="text-dim" style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
            Hover over the <span style={{ color: 'var(--accent)', fontWeight: 600 }}>ⓘ</span> icons to learn what each column measures.
          </p>
        </div>
        
        <div style={{ overflowX: 'auto', padding: '1rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                 <th>District Name</th>
                 <th>
                   Schools Monitored
                   <ColumnTooltip label="Schools Monitored" definition={COLUMN_DEFINITIONS.schoolsMonitored} />
                 </th>
                 <th>
                   Avg Risk Score
                   <ColumnTooltip label="Avg Risk Score" definition={COLUMN_DEFINITIONS.avgRiskScore} />
                 </th>
                 <th>
                   Avg Teacher Load
                   <ColumnTooltip label="Avg Teacher Load" definition={COLUMN_DEFINITIONS.avgTeacherLoad} />
                 </th>
                 <th>
                   Critical Schools
                   <ColumnTooltip label="Critical Schools" definition={COLUMN_DEFINITIONS.criticalSchools} />
                 </th>
                 <th>
                   Health Index
                   <ColumnTooltip label="Health Index" definition={COLUMN_DEFINITIONS.healthIndex} />
                 </th>
              </tr>
            </thead>
            <tbody>
              {districtStats.map((district) => (
                <tr key={district.name}>
                  <td style={{ fontWeight: '600' }}>{district.name}</td>
                  <td>{district.count}</td>
                  <td style={{ fontWeight: '700', color: district.avgRisk > 60 ? 'var(--risk-high)' : 'var(--text-main)' }}>
                    {district.avgRisk}
                  </td>
                  <td>{district.avgSTR}</td>
                  <td style={{ color: district.criticalCount > 0 ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                    {district.criticalCount}
                  </td>
                  <td>
                    <div style={{ width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${100 - district.avgRisk}%`, 
                        height: '100%', 
                        background: district.avgRisk < 35 ? 'var(--risk-low)' : district.avgRisk < 60 ? 'var(--risk-mod)' : 'var(--risk-high)' 
                      }}></div>
                    </div>
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

export default DistrictReports;
