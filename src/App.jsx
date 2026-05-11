import React, { useState, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import KPICards from './components/dashboard/KPICards';
import RiskTable from './components/dashboard/RiskTable';
import DistrictReports from './components/dashboard/DistrictReports';
import SchoolSearch from './components/dashboard/SchoolSearch';
import PolicyAdvisor from './components/ai/PolicyAdvisor';
import Settings from './components/dashboard/Settings';
import AIChatbot from './components/ai/AIChatbot';
import { schoolsData } from './data/schoolsData';
import { predictRisk } from './utils/mlEngine';
import RiskDistributionChart from './components/dashboard/RiskDistributionChart';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Settings & API
  const [apiKey, setApiKey] = useState('');
  const [riskThreshold, setRiskThreshold] = useState(70);

  // Process data through the ML Engine
  const processedSchools = useMemo(() => {
    return schoolsData.map(school => {
      const teachersCount = school.teachers || 1; // Prevent division by zero
      const strValue = (school.students / teachersCount).toFixed(1);

      const mlResult = predictRisk({ ...school, str: strValue });

      // Override category if it meets user threshold
      let finalCategory = mlResult.category;
      if (mlResult.score > riskThreshold) finalCategory = 'High';

      return {
        ...school,
        str: strValue,
        infraDeficit: mlResult.infrastructureDeficit,
        dropoutRisk: mlResult.studentDropoutRisk,
        crs: {
          score: mlResult.score,
          category: finalCategory,
          confidence: mlResult.confidence,
          featureImportance: mlResult.featureImportance
        }
      };
    });
  }, [riskThreshold]);

  const handleSelectSchool = (school) => {
    setSelectedSchool(school);
    setIsChatOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              <KPICards schools={processedSchools} />
              <RiskDistributionChart schools={processedSchools} />
            </div>
            <RiskTable
              schools={processedSchools}
              onSelectSchool={handleSelectSchool}
              selectedSchoolId={selectedSchool?.id}
            />
          </>
        );
      case 'reports':
        return <DistrictReports schools={processedSchools} />;
      case 'search':
        return <SchoolSearch schools={processedSchools} onSelectSchool={handleSelectSchool} />;
      case 'advisor':
        return <PolicyAdvisor selectedSchool={selectedSchool} apiKey={apiKey} />;
      case 'settings':
        return (
          <Settings
            apiKey={apiKey}
            setApiKey={setApiKey}
            threshold={riskThreshold}
            setThreshold={setRiskThreshold}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="main-content">
        <Header
          title={activeTab === 'dashboard' ? "Dashboard" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
          subtitle="Real-time ML Risk Prediction & Policy Synthesis"
        />

        {renderContent()}
      </main>

      <AIChatbot
        selectedSchool={selectedSchool}
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />
    </div>
  );
}

export default App;
