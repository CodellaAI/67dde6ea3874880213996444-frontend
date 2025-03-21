
'use client';

import { useState } from 'react';

export function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  
  return (
    <div>
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-reddit-blue text-reddit-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="py-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
