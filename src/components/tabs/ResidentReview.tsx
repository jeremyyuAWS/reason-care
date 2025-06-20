import React, { useState } from 'react';
import { GraduationCap, Edit3, Save, X, MessageSquare, CheckCircle } from 'lucide-react';

export default function ResidentReview() {
  const [isEditing, setIsEditing] = useState(false);
  const [residentNotes, setResidentNotes] = useState('');
  const [modifications, setModifications] = useState({
    diagnosis: 'Unstable Angina Pectoris',
    confidence: 87,
    additionalTests: '',
    treatmentPlan: ''
  });

  const originalDiagnosis = {
    primary: 'Unstable Angina Pectoris',
    confidence: 87,
    workup: [
      'Immediate ECG and cardiac enzymes',
      'Serial troponins q6h x3',
      'Stress testing within 24-48 hours'
    ],
    treatment: [
      'Dual antiplatelet therapy',
      'Atorvastatin optimization',
      'Beta-blocker if no contraindications'
    ]
  };

  const residentFeedback = [
    {
      timestamp: '3:15 PM',
      comment: 'Agree with primary diagnosis. Would add consideration for NSTEMI given risk factors.',
      status: 'approved'
    },
    {
      timestamp: '3:18 PM',
      comment: 'Suggest adding BNP to rule out heart failure component.',
      status: 'modification'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Resident Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Resident Review</h2>
              <p className="text-green-100">Dr. Michael Chen, Internal Medicine PGY-3</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-100">Review Status</div>
            <div className="text-xl font-bold">In Progress</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Diagnosis Review */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI-Generated Diagnosis</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Primary Diagnosis */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Primary Diagnosis</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={modifications.diagnosis}
                    onChange={(e) => setModifications({...modifications, diagnosis: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-blue-600 font-semibold">{modifications.diagnosis}</p>
                )}
                
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  {isEditing ? (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={modifications.confidence}
                      onChange={(e) => setModifications({...modifications, confidence: parseInt(e.target.value)})}
                      className="mx-2 flex-1"
                    />
                  ) : (
                    <div className="ml-2 flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${modifications.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <span className="text-sm font-medium">{modifications.confidence}%</span>
                </div>
              </div>

              {/* Diagnostic Workup */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Diagnostic Workup</h4>
                <ul className="space-y-1">
                  {originalDiagnosis.workup.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {isEditing && (
                  <div className="mt-3">
                    <textarea
                      placeholder="Additional tests or modifications..."
                      value={modifications.additionalTests}
                      onChange={(e) => setModifications({...modifications, additionalTests: e.target.value})}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Treatment Plan */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Treatment Plan</h4>
                <ul className="space-y-1">
                  {originalDiagnosis.treatment.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {isEditing && (
                  <div className="mt-3">
                    <textarea
                      placeholder="Treatment modifications or additions..."
                      value={modifications.treatmentPlan}
                      onChange={(e) => setModifications({...modifications, treatmentPlan: e.target.value})}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resident Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Notes</h3>
            <textarea
              placeholder="Add your clinical assessment, additional considerations, or modifications to the AI diagnosis..."
              value={residentNotes}
              onChange={(e) => setResidentNotes(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={6}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {residentNotes.length} / 1000 characters
              </span>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Review History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Review History</h3>
            <div className="space-y-3">
              {residentFeedback.map((feedback, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">{feedback.timestamp}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feedback.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-green-600 hover:bg-green-50 rounded">
                Approve Diagnosis
              </button>
              <button className="w-full text-left p-2 text-sm text-yellow-600 hover:bg-yellow-50 rounded">
                Request Modifications
              </button>
              <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                Consult Senior Physician
              </button>
              <button className="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded">
                Flag for Review
              </button>
            </div>
          </div>

          {/* Guidelines Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Guidelines</h3>
            <div className="space-y-1">
              <a href="#" className="block text-sm text-blue-700 hover:underline">
                AHA/ACC Unstable Angina Guidelines
              </a>
              <a href="#" className="block text-sm text-blue-700 hover:underline">
                ESC Acute Coronary Syndrome Guidelines
              </a>
              <a href="#" className="block text-sm text-blue-700 hover:underline">
                Hospital Chest Pain Protocol
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}