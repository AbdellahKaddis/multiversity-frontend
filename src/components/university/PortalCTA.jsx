import React from 'react';
import { Button } from '../common/Button';

export function PortalCTA({ onClick }) {
  const features = ['Courses', 'Grades', 'Schedule', 'Exams', 'Assignments', 'Attendance', 'Documents'];
  return (
    <section className="portal-cta">
      <div className="container">
        <h2>Everything you need in one place.</h2>
        <p>Access your academic life with ease.</p>
        <div className="portal-features">
          {features.map((f, i) => <span key={i}>{f}</span>)}
        </div>
        <Button variant="accent" size="lg" onClick={onClick}>
          Go to Student Portal
        </Button>
      </div>
    </section>
  );
}