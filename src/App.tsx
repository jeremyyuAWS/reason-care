import React, { useState } from 'react';
import { Heart, User, Stethoscope, ToggleLeft, ToggleRight } from 'lucide-react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import PatientIntake from './components/tabs/PatientIntake';
import EHRView from './components/tabs/EHRView';
import Diagnosis from './components/tabs/Diagnosis';
import ResidentReview from './components/tabs/ResidentReview';
import SeniorReview from './components/tabs/SeniorReview';
import FeedbackLoop from './components/tabs/FeedbackLoop';

export type UserMode = 'patient' | 'provider';

export interface AppState {
  userMode: UserMode;
  activeTab: string;
}

function App() {
  const [userMode, setUserMode] = useState<UserMode>('patient');
  const [activeTab, setActiveTab] = useState('intake');

  const tabs = [
    { id: 'intake', label: 'Patient Intake', icon: User, roles: ['patient', 'provider'] },
    { id: 'ehr', label: 'EHR View', icon: Heart, roles: ['patient', 'provider'] },
    { id: 'diagnosis', label: 'Diagnosis', icon: Stethoscope, roles: ['provider'] },
    { id: 'resident', label: 'Resident Review', icon: User, roles: ['provider'] },
    { id: 'senior', label: 'Senior Review', icon: Stethoscope, roles: ['provider'] },
    { id: 'feedback', label: 'Feedback Loop', icon: Heart, roles: ['provider'] }
  ];

  const handleModeToggle = () => {
    const newMode = userMode === 'patient' ? 'provider' : 'patient';
    setUserMode(newMode);
    
    // Reset to first available tab for the new mode
    const availableTabs = tabs.filter(tab => tab.roles.includes(newMode));
    if (availableTabs.length > 0) {
      setActiveTab(availableTabs[0].id);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'intake':
        return <PatientIntake userMode={userMode} />;
      case 'ehr':
        return <EHRView userMode={userMode} />;
      case 'diagnosis':
        return <Diagnosis />;
      case 'resident':
        return <ResidentReview />;
      case 'senior':
        return <SeniorReview />;
      case 'feedback':
        return <FeedbackLoop />;
      default:
        return <PatientIntake userMode={userMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userMode={userMode} 
        onModeToggle={handleModeToggle}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          userMode={userMode}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}

export default App;