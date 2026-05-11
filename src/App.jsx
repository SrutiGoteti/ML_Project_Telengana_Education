import React, { useState, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import RiskTable from './components/dashboard/RiskTable';
import DistrictReports from './components/dashboard/DistrictReports';
import SchoolSearch from './components/dashboard/SchoolSearch';
import PolicyAdvisor from './components/ai/PolicyAdvisor';
import Settings from './components/dashboard/Settings';
import AIChatbot from './components/ai/AIChatbot';
import { schoolsData } from './data/schoolsData';
import { predictRisk } from './utils/mlEngine';

// IMPORT OUR NEW DASHBOARD COMPONENT
import AnalyticsOverview from './components/dashboard/AnalyticsOverview'; 

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
      const teachersCount = school.teachers || 1; 
      const strValue = (school.students / teachersCount).toFixed(1);

      const mlResult = predictRisk({ ...school, str: strValue });

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

  // CLEANED UP: Only ONE renderContent function here!
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ marginTop: '-1.5rem' }}>
            <AnalyticsOverview />
          </div>
        );
      case 'reports':
        return <DistrictReports schools={processedSchools} />;
      case 'search':
        // This handles the Search, the Sliders, AND the Deep Dive Profile now!
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
        {/* Hide the default header ONLY on the dashboard */}
        {activeTab !== 'dashboard' && (
          <Header
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            subtitle="Real-time ML Risk Prediction & Policy Synthesis"
          />
        )}

        {/* Just call the function once here to render the page */}
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