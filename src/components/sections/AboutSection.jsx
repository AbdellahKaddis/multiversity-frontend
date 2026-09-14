import React from 'react';
import { Button } from '../common/Button';
import { UNIVERSITY } from '../../data/data';

export function AboutSection({ onReadMore }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Our University</h2>
          <p className="section-subtitle">A legacy of excellence, a future of innovation.</p>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>{UNIVERSITY.history}</p>
            <p>With a diverse community of scholars and students from around the world, MultiVersity is dedicated to advancing knowledge and preparing the next generation of leaders.</p>
            <Button variant="primary" onClick={onReadMore}>Read More →</Button>
          </div>
          <div>
            <div className="about-mission">
              <h4>🎯 Mission</h4>
              <p>{UNIVERSITY.mission}</p>
            </div>
            <div className="about-mission">
              <h4>👁️ Vision</h4>
              <p>{UNIVERSITY.vision}</p>
            </div>
            <div className="about-mission">
              <h4>📚 Academic Excellence</h4>
              <p>Our faculty are leaders in their fields, and our students are driven to make a difference. We foster a culture of curiosity, integrity, and impact.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}