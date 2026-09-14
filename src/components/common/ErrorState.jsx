import React from 'react';
import { Button } from './Button';

export function ErrorState({ title = 'Something went wrong', description = 'Please try again.', onRetry }) {
  return (
    <div className="error-state">
      <span className="error-state-icon">⚠️</span>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-desc">{description}</p>
      {onRetry && <Button variant="primary" onClick={onRetry}>Try Again</Button>}
    </div>
  );
}