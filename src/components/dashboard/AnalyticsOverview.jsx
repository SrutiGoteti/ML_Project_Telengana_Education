import React, { useState, useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LabelList, ZAxis
} from 'recharts';

const AnalyticsOverview = ({ schools }) => {
  const [xAxisKey, setXAxisKey] = useState('infraDeficit');
  const [yAxisKey, setYAxisKey] = useState('dropoutRisk');

  const metrics = [
    { key: 'infraDeficit', label: 'Infra Deficit' },
    { key: 'dropoutRisk', label: 'Dropout Risk' },
    { key: 'str', label: 'Teacher Load' },
    { key: 'crs.score', label: 'Risk Score' }
  ];

  // 1. Dynamic Correlation Data
  const correlationData = useMemo(() => {
    return schools.map(s => ({
      x: xAxisKey === 'crs.score' ? s.crs.score : s[xAxisKey],
      y: yAxisKey === 'crs.score' ? s.crs.score : s[yAxisKey],
      name: s.name,
      district: s.district
    }));
  }, [schools, xAxisKey, yAxisKey]);

  // 2. District Leaderboard Data
  const districtStats = useMemo(() => {
    const stats = {};
    schools.forEach(s => {
      if (!stats[s.district]) stats[s.district] = { name: s.district, totalRisk: 0, count: 0 };
      stats[s.district].totalRisk += s.crs.score;
      stats[s.district].count += 1;
    });
    return Object.values(stats)
      .map(d => ({ name: d.name, avgRisk: Math.round(d.totalRisk / d.count) }))
      .sort((a, b) => b.avgRisk - a.avgRisk)
      .slice(0, 6);
  }, [schools]);

  const leaderboardData = districtStats;

  // 3. Automated Written Analysis
  const getStrategicInsight = () => {
    const highRiskDistricts = districtStats.filter(d => d.avgRisk > 60);
    const avgInfra = (schools.reduce((acc, s) => acc + s.infraDeficit, 0) / schools.length).toFixed(1);
    
    return `The state-wide analysis reveals an average Infrastructure Deficit of ${avgInfra} points. 
    ${highRiskDistricts.length > 0 ? `Urgent attention is required in ${highRiskDistricts[0].name}, which currently leads the risk leaderboard.` : 'District health is generally stable.'} 
    The correlation between ${metrics.find(m => m.key === xAxisKey).label} and ${metrics.find(m => m.key === yAxisKey).label} provides a statistical baseline for Phase 2 budget allocation.`;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
      {/* Written Analysis Header */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)', background: 'rgba(56, 189, 248, 0.05)' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>🎯 Strategic Insight Engine</h3>
        <p style={{ lineHeight: '1.6', fontSize: '1rem', color: 'var(--text-main)' }}>
          {getStrategicInsight()}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        {/* Dynamic Correlation Plot */}
        <div className="glass-card" style={{ height: '450px' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem' }}>📈 Dynamic Discovery Lab</h2>
              <p className="text-dim">Cross-compare educational indicators</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select value={xAxisKey} onChange={(e) => setXAxisKey(e.target.value)} style={{ padding: '0.4rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                {metrics.map(m => <option key={m.key} value={m.key}>X: {m.label}</option>)}
              </select>
              <select value={yAxisKey} onChange={(e) => setYAxisKey(e.target.value)} style={{ padding: '0.4rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                {metrics.map(m => <option key={m.key} value={m.key}>Y: {m.label}</option>)}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis type="number" dataKey="x" name={xAxisKey} axisLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name={yAxisKey} axisLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
              <ZAxis range={[50, 400]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass" style={{ padding: '0.75rem', borderRadius: '10px' }}>
                        <p style={{ fontWeight: '600' }}>{data.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{data.district}</p>
                        <hr style={{ margin: '0.5rem 0', opacity: 0.1 }} />
                        <p style={{ fontSize: '0.8rem' }}>Value X: {data.x}</p>
                        <p style={{ fontSize: '0.8rem' }}>Value Y: {data.y}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Schools" data={correlationData} fill="var(--accent)" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* District Priority Leaderboard */}
        <div className="glass-card" style={{ height: '450px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>🏆 Top Critical Districts</h2>
            <p className="text-dim">Highest average risk scores</p>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart layout="vertical" data={leaderboardData} margin={{ left: 10, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-main)', fontSize: 11, fontWeight: 500 }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="avgRisk" radius={[0, 4, 4, 0]} barSize={20}>
                {leaderboardData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--risk-high)' : 'var(--accent)'} />
                ))}
                <LabelList dataKey="avgRisk" position="right" style={{ fontSize: 11, fill: 'var(--text-dim)' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
