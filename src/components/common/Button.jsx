import React from 'react';

export function Button({ isDisabled=false, variant = 'primary', size, block, children, className = '', ...props }) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : '',
    variant === 'secondary' ? 'btn-secondary' : '',
    variant === 'accent' ? 'btn-accent' : '',
    variant === 'outline' ? 'btn-outline' : '',
    size === 'sm' ? 'btn-sm' : '',
    size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
    className,
  ].filter(Boolean).join(' ');
  return <button className={cls} {...props} disabled={isDisabled}>{children}</button>;
}