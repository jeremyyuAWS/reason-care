import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { UserMode } from '../App';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  userMode: UserMode;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, userMode, onTabChange }: TabNavigationProps) {
  const availableTabs = tabs.filter(tab => tab.roles.includes(userMode));

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className={`mr-2 w-5 h-5 ${
                isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {tab.label}
              
              <HelpCircle className="ml-2 w-4 h-4 text-gray-300 hover:text-gray-500 cursor-pointer" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}