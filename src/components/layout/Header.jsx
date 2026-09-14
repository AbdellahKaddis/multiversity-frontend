import React, { useState } from 'react';
import { Button } from '../common/Button';
import { UNIVERSITY } from '../../data/data';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export function Header({ onSearchOpen, onPortalClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const university = useSelector(
    state => state.university.university
  );

  const { universityId } = useParams();
  const navigate = useNavigate();

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: `/universities/${universityId}`
    },
    {
      id: 'faculties',
      label: 'Faculties',
      path: `/universities/${universityId}/faculties`
    },
    {
      id: 'programs',
      label: 'Programs',
      path: `/universities/${universityId}/programs`
    },
    {
      id: 'admissions',
      label: 'Admissions',
      path: `/universities/${universityId}/admissions`
    },
    {
      id: 'contact',
      label: 'Contact',
      path: `/universities/${universityId}/contact`
    }
  ];

  return (
    <>
      <header className="header-public">
        <div className="container header-inner">

          {/* Logo */}
          <div
            className="header-brand"
            onClick={() => navigate(`/universities/${universityId}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="header-logo">
              {UNIVERSITY.logo}
            </div>

            <span className="header-brand-name">
              {university?.name}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            {navItems.map(item => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.id === 'home'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">

            <button
              className="header-search-btn"
              onClick={() => {
                closeMobile();
                onSearchOpen();
              }}
              aria-label="Search"
            >
              🔍
            </button>

            <button
              className="header-lang"
              aria-label="Select language"
            >
              EN
            </button>

            <Button
              className="header-portal-btn"
              variant="accent"
              onClick={() => {
                closeMobile();
                onPortalClick();
              }}
            >
              Student Portal
            </Button>

            <button
              className={`hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={toggleMobile}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={closeMobile}
      />

      {/* Mobile navigation */}
      <nav
        className={`mobile-nav ${mobileOpen ? 'open' : ''}`}
        role="navigation"
      >

        <div className="header-brand">
          <div className="header-logo">
            {UNIVERSITY.logo}
          </div>

          <span className="header-brand-name">
            {university?.name}
          </span>
        </div>

        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.id === 'home'}
            onClick={closeMobile}
          >
            {item.label}
          </NavLink>
        ))}

        <Button
          variant="accent"
          className="mobile-portal-btn"
          block
          onClick={() => {
            closeMobile();
            onPortalClick();
          }}
        >
          Student Portal
        </Button>

        <button
          className="header-lang"
          style={{
            alignSelf: 'flex-start',
            marginTop: 'var(--spacing-md)'
          }}
        >
          EN
        </button>

      </nav>
    </>
  );
}