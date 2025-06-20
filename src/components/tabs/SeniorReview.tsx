import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, MessageSquare, Clock, AlertTriangle } from 'lucide-react';

export default function SeniorReview() {
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [seniorComments, setSeniorComments] = useState('');

  const residentSubmission = {
    diagnosis: 'Unstable Angina Pectoris',
    confidence: 89,
    modifications: [
      'Added BNP to rule out heart failure component',
      'Increased confidence from 87% to 89% based on clinical correlation',
      'Emphasized need for urgent cardiology consultation'
    ],
    residentNotes: 'Patient presents with classic anginal symptoms with concerning features including new onset, exertional pattern, and radiation to left arm. Given her risk factors (DM, HTN, family history), this warrants aggressive workup. I agree with the AI assessment but would add BNP given her diabetes history and potential for heart failure.'
  };

  const qualityMetrics = {
    clinicalAccuracy: 92,
    evidenceBased: 88,
    patientSafety: 95,
    guidelineAdherence: 90
  };

  const handleApproval = (status: 'approved' | 'rejected') => {
    setReviewStatus(status);
  };

  return (
    <div className="space-y-6">
      {/* Senior Physician Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Senior Physician Review</h2>
              <p className="text-purple-100">Dr. Sarah Williams, MD - Cardiology Attending</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-100">Case Priority</div>
            <div className="text-xl font-bold flex items-center">
              <AlertTriangle className="w-5 h-5 mr-1" />
              High
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resident's Final Assessment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Resident's Final Assessment</h3>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Ready for Review
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Final Diagnosis</h4>
                <p className="text-lg font-semibold text-blue-600">{residentSubmission.diagnosis}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <div className="ml-2 w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${residentSubmission.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{residentSubmission.confidence}%</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Resident Modifications</h4>
                <ul className="space-y-2">
                  {residentSubmission.modifications.map((mod, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Clinical Reasoning</h4>
                <p className="text-sm text-gray-700">{residentSubmission.residentNotes}</p>
              </div>
            </div>
          </div>

          {/* Quality Assessment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(qualityMetrics).map(([metric, score]) => (
                <div key={metric} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        score >= 90 ? 'bg-green-500' : 
                        score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Senior Review Comments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Senior Physician Comments</h3>
            <textarea
              placeholder="Provide feedback on the resident's assessment, diagnostic accuracy, and clinical reasoning..."
              value={seniorComments}
              onChange={(e) => setSeniorComments(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              rows={5}
            />
            
            {/* Review Actions */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Your feedback will be used to improve AI diagnostic accuracy
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproval('rejected')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    reviewStatus === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'border border-red-300 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleApproval('approved')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    reviewStatus === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'border border-green-300 text-green-600 hover:bg-green-50'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Review Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Review Status</h3>
            <div className="space-y-3">
              <div className={`flex items-center space-x-2 p-2 rounded ${
                reviewStatus === 'pending' ? 'bg-yellow-100' : 
                reviewStatus === 'approved' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {reviewStatus === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                {reviewStatus === 'approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {reviewStatus === 'rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                <span className={`text-sm font-medium ${
                  reviewStatus === 'pending' ? 'text-yellow-800' : 
                  reviewStatus === 'approved' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {reviewStatus === 'pending' ? 'Pending Review' : 
                   reviewStatus === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Submitted: 3:45 PM</p>
                <p>• Time in review: 15 minutes</p>
                <p>• Priority: High</p>
              </div>
            </div>
          </div>

          {/* Case Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Case Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Patient Intake</p>
                  <p className="text-xs text-gray-500">2:30 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">AI Diagnosis Generated</p>
                  <p className="text-xs text-gray-500">3:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Resident Review</p>
                  <p className="text-xs text-gray-500">3:15 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Senior Review</p>
                  <p className="text-xs text-gray-500">3:45 PM - Now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Review Guidelines</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Assess clinical reasoning</li>
              <li>• Verify evidence-based approach</li>
              <li>• Ensure patient safety priorities</li>
              <li>• Evaluate guideline adherence</li>
            </ul>
          </div>

          {/* Educational Resources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Teaching Points</h3>
            <div className="space-y-1">
              <a href="#" className="block text-sm text-blue-600 hover:underline">
                Unstable Angina Management
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:underline">
                Risk Stratification Tools
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:underline">
                AI in Clinical Decision Making
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}