import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { School, Users, TrendingDown, AlertCircle, Shield, HeartPulse, Activity, PieChart as PieIcon, BarChart2 } from 'lucide-react';

// --- UPGRADED MOCK DATA ---
const districtDropoutData = [
  { district: 'Hyderabad', dropoutRate: 4.2 },
  { district: 'Medchal', dropoutRate: 6.8 },
  { district: 'Ranga Reddy', dropoutRate: 8.1 },
  { district: 'Nizamabad', dropoutRate: 11.5 },
  { district: 'Adilabad', dropoutRate: 14.2 },
];

// Replaces the confusing Radar chart with clear actionable data
const riskFactorBreakdown = [
  { name: 'Teacher Shortage', value: 45 },
  { name: 'Infrastructure Deficit', value: 30 },
  { name: 'Transport/Access', value: 15 },
  { name: 'Health/Nutrition', value: 10 },
];
const PIE_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

// Replaces the messy Scatter Plot with a professional Trend Analysis
const academicTrendData = [
  { month: 'Jun', attendance: 92, riskIndex: 20 },
  { month: 'Jul', attendance: 88, riskIndex: 25 },
  { month: 'Aug', attendance: 85, riskIndex: 35 },
  { month: 'Sep', attendance: 82, riskIndex: 48 }, // Peak risk during monsoons
  { month: 'Oct', attendance: 89, riskIndex: 30 },
  { month: 'Nov', attendance: 93, riskIndex: 22 },
];

const AnalyticsOverview = () => {
  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '24px 32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '32px', border: '1px solid #f1f5f9' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Statewide Analytics Dashboard</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Real-time ML Risk Prediction & Policy Synthesis</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '50px', fontWeight: '700', fontSize: '14px', border: '1px solid #d1fae5' }}>
          <Shield size={18} color="#059669" />
          <span>System Status: Normal</span>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginLeft: '4px' }}></div>
        </div>
      </div>

      {/* KPI Metric Cards - Forced 3x2 Grid to fix layout gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <KpiCard title="Total Schools Monitored" value="1,432" icon={<School size={28} color="#2563eb"/>} bg="#eff6ff" />
        <KpiCard title="Total Student Body" value="2.4M" icon={<Users size={28} color="#4f46e5"/>} bg="#eef2ff" />
        <KpiCard title="Avg Attendance Rate" value="91%" icon={<Activity size={28} color="#059669"/>} bg="#ecfdf5" />
        <KpiCard title="Critical Priority (Red)" value="329" icon={<AlertCircle size={28} color="#dc2626"/>} bg="#fef2f2" />
        <KpiCard title="High-Risk Students" value="12,450" icon={<TrendingDown size={28} color="#d97706"/>} bg="#fffbeb" />
        <KpiCard title="Overall State Health" value="53%" icon={<HeartPulse size={28} color="#0891b2"/>} bg="#ecfeff" />
      </div>

      {/* Row 1 Charts: Risk Distribution & Risk Factors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
        
        {/* Clean Bar Chart */}
        <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BarChart2 size={24} color="#ef4444" />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Dropout Risk by District</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Average predicted dropout rate (%)</p>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtDropoutData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="district" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `${val}%`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="dropoutRate" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Donut Chart replacing Radar */}
        <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <PieIcon size={24} color="#f59e0b" />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Primary Risk Factors</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Root causes identified by ML engine</p>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskFactorBreakdown} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={4} dataKey="value">
                  {riskFactorBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 500, color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Chart: Full Width Trend Area Chart replacing Scatter Plot */}
      <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <TrendingDown size={24} color="#8b5cf6" />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Systemic Trend Analysis: Attendance vs. Risk Index</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Tracking state-wide health across the academic year</p>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={academicTrendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 500 }}/>
                <Area type="monotone" dataKey="attendance" name="Avg Attendance (%)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                <Area type="monotone" dataKey="riskIndex" name="ML Risk Index" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </div>

    </div>
  );
};

// Polished KPI Card
const KpiCard = ({ title, value, icon, bg }) => (
  <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s ease', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>{title}</p>
      <h3 style={{ margin: '6px 0 0 0', fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' }}>{value}</h3>
    </div>
  </div>
);

export default AnalyticsOverview;