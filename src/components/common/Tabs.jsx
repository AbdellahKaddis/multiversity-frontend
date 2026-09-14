import React from 'react';

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="detail-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`detail-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}