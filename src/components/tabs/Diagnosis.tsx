import React, { useState } from 'react';
import { Brain, Stethoscope, Heart, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Diagnosis() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const agents = [
    {
      id: 'cardiology',
      name: 'Cardiology Specialist',
      icon: Heart,
      status: 'completed',
      confidence: 89,
      analysis: 'Likely unstable angina based on symptom pattern, risk factors, and clinical presentation.',
      recommendations: [
        'Immediate ECG and cardiac enzymes',
        'Stress testing within 24-48 hours',
        'Consider dual antiplatelet therapy'
      ]
    },
    {
      id: 'emergency',
      name: 'Emergency Medicine',
      icon: AlertCircle,
      status: 'completed',
      confidence: 85,
      analysis: 'Moderate risk acute coronary syndrome. Requires immediate rule-out protocol.',
      recommendations: [
        'HEART score assessment',
        'Serial troponins q6h x3',
        'Continuous cardiac monitoring'
      ]
    },
    {
      id: 'internal',
      name: 'Internal Medicine',
      icon: Stethoscope,
      status: 'processing',
      confidence: 78,
      analysis: 'Differential includes cardiac vs non-cardiac chest pain. Consider comorbidities.',
      recommendations: [
        'Comprehensive metabolic panel',
        'HbA1c given diabetes history',
        'Chest X-ray'
      ]
    }
  ];

  const synthesizedDiagnosis = {
    primary: 'Unstable Angina Pectoris',
    confidence: 87,
    differential: [
      'Non-ST elevation myocardial infarction',
      'Stable angina with recent change',
      'Atypical chest pain'
    ],
    reasoning: [
      'Classic anginal pain pattern with exertional onset',
      'Risk factors: DM, HTN, family history',
      'Pain radiation to left arm is concerning',
      'New onset symptoms warrant urgent evaluation'
    ],
    recommendations: [
      'Immediate cardiac workup with ECG and troponins',
      'Initiate dual antiplatelet therapy if no contraindications',
      'Urgent cardiology consultation',
      'Consider coronary angiography based on risk stratification'
    ]
  };

  return (
    <div className="space-y-6">
      {/* AI Diagnosis Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Multi-Agent Diagnosis Generation</h2>
            <p className="text-purple-100">Three specialist AI agents analyzing patient case</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Analysis */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Specialist Agent Analysis</h3>
          
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer ${
                  activeAgent === agent.id ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        agent.status === 'completed' ? 'bg-green-100' :
                        agent.status === 'processing' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          agent.status === 'completed' ? 'text-green-600' :
                          agent.status === 'processing' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          {agent.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {agent.status === 'processing' && <Clock className="w-4 h-4 text-yellow-500" />}
                          <span className="capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{agent.confidence}%</div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>
                  </div>
                  
                  {activeAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Analysis</h5>
                          <p className="text-sm text-gray-700">{agent.analysis}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Recommendations</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {agent.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Synthesized Diagnosis */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Synthesized Diagnosis</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Primary Diagnosis</h4>
                <p className="text-sm font-semibold text-blue-600">{synthesizedDiagnosis.primary}</p>
                <div className="flex items-center mt-1">
                  <div className="text-sm text-gray-600">Confidence: {synthesizedDiagnosis.confidence}%</div>
                  <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${synthesizedDiagnosis.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Differential Diagnosis</h4>
                <ul className="space-y-1">
                  {synthesizedDiagnosis.differential.map((dx, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                      <span>{dx}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-2">Clinical Reasoning</h4>
            <ul className="space-y-2">
              {synthesizedDiagnosis.reasoning.map((reason, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Immediate Actions</h4>
            <ul className="space-y-2">
              {synthesizedDiagnosis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}