import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RiskDistributionChart = ({ schools }) => {
  const data = [
    { name: 'Low', count: schools.filter(s => s.crs.category === 'Low').length, color: 'var(--risk-low)' },
    { name: 'Moderate', count: schools.filter(s => s.crs.category === 'Moderate').length, color: 'var(--risk-mod)' },
    { name: 'High', count: schools.filter(s => s.crs.category === 'High').length, color: 'var(--risk-high)' },
  ];

  return (
    <div className="glass-card fade-in" style={{ height: '350px', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>🏫 Risk Distribution Summary</h2>
        <p className="text-dim">State-wide priority breakdown</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--glass-border)',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskDistributionChart;
