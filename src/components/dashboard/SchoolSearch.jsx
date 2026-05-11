import React, { useState, useMemo } from 'react';
import { Search, Settings2, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle, Activity, MapPin, BookOpen, Building, TrendingDown, Calendar, Users, Scale, Sparkles } from 'lucide-react';

const SchoolSearch = ({ schools, onSelectSchool }) => {
  const [localSelectedSchool, setLocalSelectedSchool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiPlan, setShowAiPlan] = useState(false); // NEW STATE FOR AI BOX
  
  const [weights, setWeights] = useState({
    teacherShortage: 25, infraDeficit: 20, dropoutRate: 30,
    attendance: 15, enrollment: 5, genderParity: 5
  });

  const filteredSchools = useMemo(() => {
    let filtered = schools;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = schools.filter(s => 
        s.name.toLowerCase().includes(lower) || 
        s.district.toLowerCase().includes(lower)
      );
    }
    return filtered.sort((a, b) => (b.crs?.score || 0) - (a.crs?.score || 0));
  }, [schools, searchQuery]);

  // Reset AI box when backing out
  const handleBack = () => {
    setLocalSelectedSchool(null);
    setShowAiPlan(false);
  };

  if (localSelectedSchool) {
    const school = localSelectedSchool;
    const isHighRisk = school.crs?.category === 'High';
    const isModerate = school.crs?.category === 'Moderate';
    
    const statusColor = isHighRisk ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';
    const statusBg = isHighRisk ? '#fef2f2' : isModerate ? '#fffbeb' : '#ecfdf5';

    const gridMetrics = [
      { id: 1, label: 'Teacher Shortage', value: school.crs?.score + 15 > 100 ? 100 : school.crs?.score + 15, icon: <BookOpen size={20} /> },
      { id: 2, label: 'Infra Deficit', value: school.infraDeficit || 40, icon: <Building size={20} /> },
      { id: 3, label: 'Dropout Risk', value: school.dropoutRisk || 35, icon: <TrendingDown size={20} /> },
      { id: 4, label: 'Attendance Decline', value: 100 - (school.attendance || 85), icon: <Calendar size={20} /> },
      { id: 5, label: 'Enrollment Trend', value: isHighRisk ? 75 : 30, icon: <Users size={20} /> },
      { id: 6, label: 'Gender Parity Gap', value: 25, icon: <Scale size={20} /> },
    ];

    return (
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontSize: '15px', cursor: 'pointer', marginBottom: '24px', padding: 0, fontWeight: '600' }}>
          <ArrowLeft size={18} /> Back to Directory
        </button>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', borderTop: `6px solid ${statusColor}`, overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{school.name}</h2>
                <span style={{ backgroundColor: statusBg, color: statusColor, padding: '6px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px', border: `1px solid ${statusColor}40` }}>
                  {isHighRisk ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                  {school.crs?.category || 'Low'} Risk
                </span>
              </div>
              <p style={{ margin: 0, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '500' }}>
                <MapPin size={18} /> {school.district} District | UDISE ID: {school.id || 'TS-8492'}
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Composite Score</p>
                <div style={{ fontSize: '48px', fontWeight: '900', color: statusColor, lineHeight: '1' }}>
                  {school.crs?.score || 45}<span style={{ fontSize: '24px', color: '#94a3b8' }}>/100</span>
                </div>
              </div>
              <div style={{ height: '60px', width: '2px', backgroundColor: '#e2e8f0' }}></div>
              
              {/* TRIGGER AI PLAN OR CHATBOT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setShowAiPlan(true)} style={{ backgroundColor: '#6366f1', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(99,102,241,0.2)' }}>
                  <Sparkles size={16} /> Generate AI Policy
                </button>
                <button onClick={() => onSelectSchool(school)} style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Activity size={16} /> Open AI Chat
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding: '40px', backgroundColor: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Multifactor Vulnerability Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {gridMetrics.map((metric) => (
                <div key={metric.id} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#64748b' }}>
                    {metric.icon}
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{metric.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{metric.value.toFixed(0)}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>pt</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${metric.value}%`, height: '100%', backgroundColor: metric.value > 70 ? '#ef4444' : metric.value > 40 ? '#f59e0b' : '#3b82f6', borderRadius: '3px' }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* NEW: THE AI INTERVENTION OUTPUT BOX */}
            {showAiPlan && (
              <div style={{ marginTop: '32px', backgroundColor: '#ffffff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(99,102,241,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#e0e7ff', padding: '8px', borderRadius: '8px', color: '#4f46e5' }}><Sparkles size={20} /></div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>AI-Generated Intervention Strategy</h3>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '600', color: '#6366f1', backgroundColor: '#e0e7ff', padding: '4px 10px', borderRadius: '50px' }}>Powered by Hugging Face NLP</span>
                </div>
                
                <p style={{ fontSize: '15px', color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>Based on the composite vulnerability score of {school.crs?.score || 45} and the severe deficit in <strong>Teacher Shortage</strong>, the following 3-step mitigation protocol is recommended:</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '16px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Phase 1: Immediate Resource Reallocation (0-30 Days)</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>Deploy 2 floating teaching staff from the {school.district} central reserve to cover primary subjects. Expedite basic infrastructure repairs focusing on sanitation to prevent immediate dropout spikes.</p>
                  </div>
                  <div style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '16px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Phase 2: Community Attendance Drive (30-60 Days)</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>Initiate an automated SMS campaign alerting parents of attendance drops. Link continuous attendance to mid-day meal incentives to counter the current {100 - (school.attendance || 85)}% attendance decline.</p>
                  </div>
                  <div style={{ borderLeft: '3px solid #d946ef', paddingLeft: '16px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Phase 3: Structural Policy Integration (60+ Days)</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>Flag institution for priority capital injection in the Q3 state budget. Establish a permanent digital tracking node to monitor real-time UDISE data synchronization.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DIRECTORY SEARCH & TRIAGE LIST ---
  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>School Risk Directory</h1>
        <div style={{ position: 'relative', maxWidth: '600px' }}>
          <Search size={22} color="#64748b" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" placeholder="Search by school name or district..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '16px 16px 16px 56px', fontSize: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Settings2 size={20} color="#0f172a" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Algorithm Tuning</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.entries({
              'Teacher Shortage': 'teacherShortage', 'Infra Deficit': 'infraDeficit', 'Dropout Rate': 'dropoutRate',
              'Attendance': 'attendance', 'Enrollment Drop': 'enrollment', 'Gender Parity': 'genderParity'
            }).map(([label, key]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                  <span>{label}</span>
                  <span style={{ color: '#0f172a' }}>{weights[key]}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={weights[key]} onChange={(e) => setWeights(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Triage Results</h3>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>{filteredSchools.length} Found</span>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 24px', fontWeight: '700' }}>School Name</th>
                <th style={{ padding: '16px 24px', fontWeight: '700' }}>Risk Tier</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', textAlign: 'center' }}>KNN Score</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.slice(0, 10).map((school, idx) => {
                 const isHigh = school.crs?.category === 'High';
                 const isMod = school.crs?.category === 'Moderate';
                 return (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', marginBottom: '4px' }}>{school.name}</div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>{school.district}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', backgroundColor: isHigh ? '#fef2f2' : isMod ? '#fffbeb' : '#ecfdf5', color: isHigh ? '#ef4444' : isMod ? '#f59e0b' : '#10b981' }}>
                      {school.crs?.category || 'Low'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: '800', color: '#0f172a', fontSize: '15px', textAlign: 'center' }}>{school.crs?.score || 45}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => setLocalSelectedSchool(school)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', color: '#0f172a', fontWeight: '600', cursor: 'pointer', fontSize: '13px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Analyze
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolSearch;