import React from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Activity, BookOpen, Users, MapPin } from 'lucide-react';

const SchoolRiskProfile = ({ school, onBack, onOpenChat }) => {
  if (!school) return null;

  // Derive colors based on risk category
  const isHighRisk = school.crs?.category === 'High';
  const isModerate = school.crs?.category === 'Moderate';
  const statusColor = isHighRisk ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';
  const bgColor = isHighRisk ? '#fef2f2' : isModerate ? '#fffbeb' : '#ecfdf5';

  // Mocking the 6 critical factors from your report (normalized to 100)
  const factors = [
    { label: 'Teacher Shortage', value: school.crs?.score + 15 > 100 ? 100 : school.crs?.score + 15 },
    { label: 'Infrastructure Deficit', value: school.infraDeficit || 40 },
    { label: 'Dropout Rate (Predicted)', value: school.dropoutRisk || 35 },
    { label: 'Attendance Decline', value: 100 - (school.attendance || 85) },
    { label: 'Enrollment Trend', value: isHighRisk ? 75 : 30 },
    { label: 'Gender Parity Gap', value: 25 },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginTop: '24px' }}>
      
      {/* Header & Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer', marginBottom: '16px', padding: 0, fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to Triage List
          </button>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{school.name}</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} /> {school.district} District | ID: {school.id}
          </p>
        </div>
        <div style={{ backgroundColor: bgColor, color: statusColor, padding: '12px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', border: `1px solid ${statusColor}40` }}>
          {isHighRisk ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          {school.crs?.category || 'Low'} Risk Status
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Left Column: Composite Score */}
        <div style={{ backgroundColor: '#f8fafc', padding: '32px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '16px' }}>Composite Vulnerability Score</h3>
          <div style={{ fontSize: '72px', fontWeight: '900', color: statusColor, lineHeight: '1' }}>
            {school.crs?.score || 45}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>Calculated via KNN Algorithm</p>
          
          <button onClick={onOpenChat} style={{ marginTop: '32px', backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
            <Activity size={18} /> Generate AI Intervention Plan
          </button>
        </div>

        {/* Right Column: The 6 Parameter Breakdown */}
        <div>
          <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '18px' }}>Risk Factor Breakdown (0-100 Severity)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {factors.map((factor, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  <span>{factor.label}</span>
                  <span>{factor.value.toFixed(1)} / 100</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${factor.value}%`, height: '100%', backgroundColor: factor.value > 70 ? '#ef4444' : factor.value > 40 ? '#f59e0b' : '#10b981', borderRadius: '10px', transition: 'width 1s ease-in-out' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRiskProfile;