import React from 'react';
import { Heart, User, Stethoscope, ToggleLeft, ToggleRight } from 'lucide-react';
import type { UserMode } from '../App';

interface HeaderProps {
  userMode: UserMode;
  onModeToggle: () => void;
}

export default function Header({ userMode, onModeToggle }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CardioNova AI</h1>
              <p className="text-sm text-gray-500">Diagnostic Assistant Demo</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                userMode === 'patient' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
              }`}>
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Patient</span>
              </div>
              
              <button
                onClick={onModeToggle}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {userMode === 'patient' ? 
                  <ToggleLeft className="w-6 h-6" /> : 
                  <ToggleRight className="w-6 h-6" />
                }
              </button>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                userMode === 'provider' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'
              }`}>
                <Stethoscope className="w-4 h-4" />
                <span className="text-sm font-medium">Provider</span>
              </div>
            </div>

            {/* Demo Mode Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Demo Mode
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}