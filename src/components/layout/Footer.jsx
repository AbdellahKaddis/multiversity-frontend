import React from 'react';
import { UNIVERSITY } from '../../data/data';
import { useSelector } from 'react-redux';

export function Footer({ onNavigate }) {
  const university = useSelector(state => state.university.university)
  const handleNav = (id) => {
    if (onNavigate) onNavigate(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navMap = { about: 'About', faculties: 'Faculties', programs: 'Programs', admissions: 'Admissions', news: 'News', events: 'Events', contact: 'Contact' };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>University</h4>
            <ul>
              {Object.entries(navMap).map(([id, label]) => (
                <li key={id}><a href="#" onClick={(e) => { e.preventDefault(); handleNav(id); }}>{label}</a></li>
              ))}
            </ul>
          </div>
         
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('news'); }}>News</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('events'); }}>Events</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNav('contact'); }}>Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>📍 {university?.address ?? "Not set"}</p>
            <p>📞 {university?.phoneNumber ?? "Not set"}</p>
            <p>✉️ {university?.email ?? "Not set"}</p>
            <div className="footer-social">
              <a href={UNIVERSITY.social.facebook} aria-label="Facebook">📘</a>
              <a href={UNIVERSITY.social.twitter} aria-label="Twitter">🐦</a>
              <a href={UNIVERSITY.social.instagram} aria-label="Instagram">📸</a>
              <a href={UNIVERSITY.social.linkedin} aria-label="LinkedIn">💼</a>
              <a href={UNIVERSITY.social.youtube} aria-label="YouTube">▶️</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {UNIVERSITY.name}. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}