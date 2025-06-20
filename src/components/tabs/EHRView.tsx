import React from 'react';
import { FileText, Calendar, Activity, AlertTriangle, User, Heart } from 'lucide-react';
import type { UserMode } from '../../App';

interface EHRViewProps {
  userMode: UserMode;
}

export default function EHRView({ userMode }: EHRViewProps) {
  const patientData = {
    demographics: {
      name: 'Sarah Johnson',
      dob: '1970-03-15',
      age: 54,
      gender: 'Female',
      mrn: 'P-2024-0847'
    },
    vitals: {
      bp: '142/88 mmHg',
      hr: '88 bpm',
      temp: '98.6°F',
      resp: '16/min',
      o2sat: '98%'
    },
    symptoms: [
      { symptom: 'Chest pain', onset: '3 days ago', severity: 'Moderate' },
      { symptom: 'Left arm discomfort', onset: '2 days ago', severity: 'Mild' },
      { symptom: 'Shortness of breath', onset: '1 day ago', severity: 'Mild' }
    ],
    history: [
      'Hypertension (2018)',
      'Type 2 Diabetes (2020)',
      'Family history of CAD'
    ],
    medications: [
      'Lisinopril 10mg daily',
      'Metformin 500mg BID',
      'Atorvastatin 20mg daily'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patientData.demographics.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>DOB: {patientData.demographics.dob}</span>
                <span>•</span>
                <span>Age: {patientData.demographics.age}</span>
                <span>•</span>
                <span>MRN: {patientData.demographics.mrn}</span>
              </div>
            </div>
          </div>
          
          {userMode === 'provider' && (
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Record
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Print Summary
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Visit */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vital Signs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
              <span className="text-sm text-gray-500">Today, 2:45 PM</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(patientData.vitals).map(([key, value]) => (
                <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{value.split(' ')[0]}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {key === 'bp' ? 'Blood Pressure' :
                     key === 'hr' ? 'Heart Rate' :
                     key === 'temp' ? 'Temperature' :
                     key === 'resp' ? 'Respiratory' :
                     'O2 Saturation'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{value.split(' ').slice(1).join(' ')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Symptoms */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">Current Symptoms</h3>
            </div>
            
            <div className="space-y-3">
              {patientData.symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{symptom.symptom}</div>
                    <div className="text-sm text-gray-500">Onset: {symptom.onset}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    symptom.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                    symptom.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {symptom.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Structured Data */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI-Structured Assessment</h3>
              <div className="flex items-center text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                ReasonCare Generated
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Risk Stratification</h4>
                <div className="text-2xl font-bold text-amber-600">Moderate</div>
                <p className="text-sm text-gray-600 mt-1">Based on symptoms and risk factors</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Urgency Level</h4>
                <div className="text-2xl font-bold text-orange-600">Priority</div>
                <p className="text-sm text-gray-600 mt-1">Requires immediate evaluation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Medical History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Medical History</h3>
            <div className="space-y-2">
              {patientData.history.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Current Medications</h3>
            <div className="space-y-2">
              {patientData.medications.map((med, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                  {med}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {userMode === 'provider' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Order ECG
                </button>
                <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Schedule Stress Test
                </button>
                <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Refer to Cardiology
                </button>
                <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Add Lab Orders
                </button>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          {userMode === 'patient' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Your Privacy</h3>
              <p className="text-xs text-gray-600">
                Your health information is protected by HIPAA and processed securely by ReasonCare AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}