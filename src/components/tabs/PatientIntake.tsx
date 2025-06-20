import React, { useState } from 'react';
import { MessageSquare, Mic, Send, User, Clock, MapPin } from 'lucide-react';
import type { UserMode } from '../../App';

interface PatientIntakeProps {
  userMode: UserMode;
}

export default function PatientIntake({ userMode }: PatientIntakeProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const chatHistory = [
    {
      sender: 'ai',
      message: "Hello! I'm your CardioNova AI assistant. I'm here to help understand your symptoms. Could you tell me what's been bothering you lately?",
      timestamp: '2:30 PM'
    },
    {
      sender: 'user',
      message: "I've been having chest pain for the past few days, especially when I walk up stairs.",
      timestamp: '2:31 PM'
    },
    {
      sender: 'ai',
      message: "I understand you're experiencing chest pain during physical activity. Can you describe the pain? Is it sharp, dull, burning, or crushing?",
      timestamp: '2:31 PM'
    },
    {
      sender: 'user',
      message: "It's more of a dull, tight feeling across my chest. Sometimes it spreads to my left arm.",
      timestamp: '2:32 PM'
    }
  ];

  const patientInfo = {
    name: 'Sarah Johnson',
    age: 54,
    id: 'P-2024-0847'
  };

  return (
    <div className="space-y-6">
      {/* Patient Info Header */}
      {userMode === 'provider' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{patientInfo.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Age: {patientInfo.age}</span>
                <span>•</span>
                <span>ID: {patientInfo.id}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Active Session
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-96">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">CardioNova Assistant</h3>
                  <p className="text-sm text-gray-500">AI-powered symptom intake</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Nova Active
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    chat.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{chat.message}</p>
                    <p className={`text-xs mt-1 ${
                      chat.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {chat.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={userMode === 'patient' ? "Describe your symptoms..." : "Ask follow-up questions..."}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Intake Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Session Summary</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Chief Complaint</h4>
                <p className="text-sm text-gray-600 mt-1">Chest pain with exertion</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Duration</h4>
                <p className="text-sm text-gray-600 mt-1">Several days</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Characteristics</h4>
                <p className="text-sm text-gray-600 mt-1">Dull, tight sensation with radiation to left arm</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Triggers</h4>
                <p className="text-sm text-gray-600 mt-1">Physical activity, stairs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">AI Analysis</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Confidence Score</span>
                <span className="font-medium text-green-600">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Based on symptom patterns and patient responses
              </p>
            </div>
          </div>

          {userMode === 'provider' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Provider Notes</h3>
              <textarea
                placeholder="Add clinical observations..."
                className="w-full p-2 text-sm border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}