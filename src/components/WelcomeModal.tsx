import React from 'react';
import { X, HelpCircle, Settings, Database, Stethoscope, User, Heart, AlertTriangle } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  const tabs = [
    {
      name: 'Patient Intake',
      icon: User,
      description: 'Voice/chat symptom intake with clarifying questions',
      api: 'POST /api/intake/voice',
      requirements: 'NLP pipeline or voice transcription service'
    },
    {
      name: 'EHR View',
      icon: Heart,
      description: 'Review/edit patient medical history',
      api: 'GET/PUT /api/ehr/:patientId',
      requirements: 'EHR integration with patient data access'
    },
    {
      name: 'Diagnosis Generation',
      icon: Stethoscope,
      description: 'AI generates diagnosis from EHR/symptoms',
      api: 'POST /api/diagnosis/generate',
      requirements: 'Multi-agent AI diagnostic system'
    },
    {
      name: 'Resident Review',
      icon: User,
      description: 'Review/edit diagnosis before final sign-off',
      api: 'PUT /api/diagnosis/update',
      requirements: 'Medical resident authentication and workflow'
    },
    {
      name: 'Senior Review',
      icon: AlertTriangle,
      description: 'Final approval or feedback to regenerate',
      api: 'POST /api/diagnosis/approve OR /reject',
      requirements: 'Senior physician authentication and approval workflow'
    },
    {
      name: 'Feedback & Guidelines',
      icon: Database,
      description: 'Update internal guidelines with doctor feedback',
      api: 'POST /api/guidelines/update',
      requirements: 'AI model retraining and guideline management system'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Welcome to ReasonCare Developer Mode</h2>
                <p className="text-blue-100">Explainable AI for Confident Medical Decisions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Application Overview</h3>
            <p className="text-blue-800 text-sm mb-3">
              This app simulates a multi-agent diagnostic workflow. You can use it in two ways:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-800"><strong>Demo Mode</strong> — Load mock data for quick demos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-blue-800"><strong>Production Mode</strong> — Plug into real APIs</span>
              </div>
            </div>
          </div>

          {/* Tab Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-600" />
              Tab-by-Tab Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">{tab.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{tab.description}</p>
                        <div className="bg-gray-50 rounded p-2 mb-2">
                          <code className="text-xs text-gray-800">{tab.api}</code>
                        </div>
                        <p className="text-xs text-gray-500">{tab.requirements}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environment Configuration */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Environment Configuration</h3>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded border">
                <code className="text-sm text-gray-800">REACT_APP_DEMO_MODE=true</code>
                <p className="text-xs text-gray-600 mt-1">Enable demo mode with mock data</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <code className="text-sm text-gray-800">REACT_APP_API_BASE_URL=https://api.reasoncare.io</code>
                <p className="text-xs text-gray-600 mt-1">Base URL for production API endpoints</p>
              </div>
            </div>
          </div>

          {/* Mode Toggle Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Getting Started</h3>
            <div className="text-sm text-amber-800 space-y-1">
              <p>1. Use the Patient/Provider toggle in the header to switch between user modes</p>
              <p>2. Each tab demonstrates a different part of the diagnostic workflow</p>
              <p>3. Currently running in <strong>Demo Mode</strong> with simulated data</p>
              <p>4. Mock data files are located in <code>/mock/</code> directory</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}