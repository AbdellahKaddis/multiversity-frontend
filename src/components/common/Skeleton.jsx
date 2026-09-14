import React from 'react';

export function Skeleton({ type = 'text', className = '' }) {
  const cls = ['skeleton', type === 'text' ? 'skeleton-text' : '', type === 'card' ? 'skeleton-card' : '', className]
    .filter(Boolean).join(' ');
  return <div className={cls} />;
}