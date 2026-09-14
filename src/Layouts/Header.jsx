import React, { useState } from 'react';
import { Button } from '../common/Button';
import { UNIVERSITY } from '../../data/data';

export function Header({ currentPage, onNavigate, onSearchOpen, onPortalClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'faculties', label: 'Faculties' },
    { id: 'programs', label: 'Programs' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'news', label: 'News' },
    { id: 'events', label: 'Events' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    closeMobile();
  };

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <div className="header-brand" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
            <div className="header-logo">{UNIVERSITY.logo}</div>
            <span className="header-brand-name">{UNIVERSITY.name}</span>
          </div>
          <nav className="header-nav">
            {navItems.map(item => (
              <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); handleNav(item.id); }} className={currentPage === item.id ? 'active' : ''}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="header-search-btn" onClick={onSearchOpen} aria-label="Search">🔍</button>
            <button className="header-lang" aria-label="Select language">EN</button>
            <Button className="header-portal-btn" variant="accent" onClick={onPortalClick}>Student Portal</Button>
            <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={toggleMobile} aria-label="Toggle menu" aria-expanded={mobileOpen}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`} onClick={closeMobile} />
      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`} role="navigation">
        <div className="header-brand">
          <div className="header-logo">{UNIVERSITY.logo}</div>
          <span className="header-brand-name">{UNIVERSITY.name}</span>
        </div>
        {navItems.map(item => (
          <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); handleNav(item.id); }} className={currentPage === item.id ? 'active' : ''}>{item.label}</a>
        ))}
        <Button variant="accent" className="mobile-portal-btn" block onClick={() => { closeMobile(); onPortalClick(); }}>Student Portal</Button>
        <button className="header-lang" style={{ alignSelf: 'flex-start', marginTop: 'var(--spacing-md)' }}>EN</button>
      </nav>
    </>
  );
}