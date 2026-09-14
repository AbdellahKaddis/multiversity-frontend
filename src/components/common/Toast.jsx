import React from 'react';

export function Toast({ message, variant = '', onClose }) {
  const cls = ['toast', variant ? `toast-${variant}` : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <span>{message}</span>
      <button onClick={onClose} style={{
        background: 'none',
        border: 'none',
        marginLeft: 'auto',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: 'var(--color-text-muted)'
      }}>×</button>
    </div>
  );
}