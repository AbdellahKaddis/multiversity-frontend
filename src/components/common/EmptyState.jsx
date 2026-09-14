import React from 'react';

export function EmptyState({ title = 'Nothing found', description = 'Try adjusting your search or filters.', icon = '📭' }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}