import React from 'react';
import { Button } from './Button';

export function SearchInput({ value, onChange, onSearch, placeholder = 'Search...', loading = false }) {
  return (
    <div className="search-input-wrap">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch()}
        aria-label="Search"
      />
      <Button variant="primary" onClick={onSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
}