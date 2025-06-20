import React, { useState } from 'react';
import { RotateCcw, TrendingUp, Database, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

export default function FeedbackLoop() {
  const [selectedUpdate, setSelectedUpdate] = useState<string | null>(null);

  const feedbackData = {
    totalCases: 1247,
    approvedCases: 1089,
    modifiedCases: 158,
    accuracyImprovement: 12.5
  };

  const recentUpdates = [
    {
      id: 'update-1',
      timestamp: '2 hours ago',
      category: 'Diagnosis Refinement',
      description: 'Updated unstable angina diagnostic criteria based on 15 senior physician reviews',
      impact: 'High',
      casesAffected: 34,
      confidence: '+3.2%'
    },
    {
      id: 'update-2',
      timestamp: '1 day ago',
      category: 'Risk Stratification',
      description: 'Enhanced diabetes-related cardiac risk factors based on endocrinology feedback',
      impact: 'Medium',
      casesAffected: 89,
      confidence: '+1.8%'
    },
    {
      id: 'update-3',
      timestamp: '3 days ago',
      category: 'Treatment Guidelines',
      description: 'Integrated latest AHA guidelines for acute coronary syndrome management',
      impact: 'High',
      casesAffected: 156,
      confidence: '+4.1%'
    }
  ];

  const learningMetrics = {
    diagnosticAccuracy: 89.5,
    treatmentRecommendations: 92.1,
    riskAssessment: 87.3,
    patientSafety: 95.8
  };

  const pendingUpdates = [
    {
      source: 'Dr. Williams (Cardiology)',
      feedback: 'Consider adding troponin kinetics analysis for better MI discrimination',
      priority: 'High',
      votes: 12
    },
    {
      source: 'Dr. Chen (Internal Medicine)',
      feedback: 'Include BMI and metabolic syndrome factors in cardiovascular risk scoring',
      priority: 'Medium',
      votes: 8
    },
    {
      source: 'Emergency Department Protocol',
      feedback: 'Adjust HEART score weighting based on patient demographics',
      priority: 'Medium',
      votes: 15
    }
  ];

  return (
    <div className="space-y-6">
      {/* Feedback Loop Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RotateCcw className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">AI Learning & Feedback Loop</h2>
              <p className="text-indigo-100">Continuous improvement through physician feedback</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-100">System Status</div>
            <div className="text-xl font-bold flex items-center">
              <CheckCircle className="w-5 h-5 mr-1" />
              Active Learning
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Learning Performance</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{feedbackData.totalCases}</div>
                <div className="text-xs text-gray-600">Total Cases</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{feedbackData.approvedCases}</div>
                <div className="text-xs text-gray-600">Approved</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{feedbackData.modifiedCases}</div>
                <div className="text-xs text-gray-600">Modified</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">+{feedbackData.accuracyImprovement}%</div>
                <div className="text-xs text-gray-600">Accuracy Gain</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Performance Metrics</h4>
              {Object.entries(learningMetrics).map(([metric, score]) => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 90 ? 'bg-green-500' : 
                          score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-10">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent AI Updates</h3>
            </div>
            
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div
                  key={update.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedUpdate === update.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedUpdate(selectedUpdate === update.id ? null : update.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{update.category}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          update.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {update.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{update.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{update.timestamp}</span>
                        <span>•</span>
                        <span>{update.casesAffected} cases affected</span>
                        <span>•</span>
                        <span className="text-green-600">{update.confidence} accuracy improvement</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedUpdate === update.id && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Implementation Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>• Updated diagnostic algorithms with new criteria</p>
                        <p>• Retrained models on {update.casesAffected} historical cases</p>
                        <p>• Validated improvements through cross-validation</p>
                        <p>• Deployed to production with A/B testing</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pending Feedback */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Pending Updates</h3>
            </div>
            
            <div className="space-y-3">
              {pendingUpdates.map((pending, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">{pending.source}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pending.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {pending.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{pending.feedback}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{pending.votes} votes</span>
                    <div className="flex space-x-1">
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                        Approve
                      </button>
                      <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Learning Sources</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Physician Feedback</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Clinical Guidelines</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Literature Updates</span>
                <span className="font-medium">7%</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">System Health</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Learning Pipeline Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Models Updated Daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Feedback Processing Normal</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Today's Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">New Feedback</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Updates Deployed</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cases Processed</span>
                <span className="font-medium">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}