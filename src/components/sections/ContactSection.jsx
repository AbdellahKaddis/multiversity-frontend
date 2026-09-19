import React, { useState } from 'react';
import { Button } from '../common/Button';


export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };
const UNIVERSITY = {
  name: 'MultiVersity',
  logo: 'MV',
  primaryColor: '#0a2a44',
  secondaryColor: '#b8860b',
  description: 'A global leader in higher education, fostering innovation and academic excellence since 1965.',
  mission: 'To empower learners with knowledge, critical thinking, and a global perspective.',
  vision: 'To be a beacon of knowledge and innovation, shaping the future of education worldwide.',
  history: 'Founded in 1965, MultiVersity has grown from a small liberal arts college to a world‑class research university with over 30,000 students from 120 countries.',
  address: '123 University Avenue, Academic City, AC 10001',
  phone: '+1 (555) 234‑5678',
  email: 'info@multiversity.edu',
  website: 'www.multiversity.edu',
  officeHours: 'Mon–Fri, 8:00 AM – 6:00 PM',
  social: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
  },
};
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">We'd love to hear from you. Reach out to us with any questions.</p>
        </div>
        <div className="contact-grid">
          <div>
            <div className="contact-info-item">
              <span className="icon">📍</span>
              <div>
                <div className="label">Address</div>
                <div className="value">{UNIVERSITY.address}</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="icon">📞</span>
              <div>
                <div className="label">Phone</div>
                <div className="value">{UNIVERSITY.phone}</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="icon">✉️</span>
              <div>
                <div className="label">Email</div>
                <div className="value">{UNIVERSITY.email}</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="icon">🕐</span>
              <div>
                <div className="label">Office Hours</div>
                <div className="value">{UNIVERSITY.officeHours}</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="icon">🌐</span>
              <div>
                <div className="label">Website</div>
                <div className="value">{UNIVERSITY.website}</div>
              </div>
            </div>
            <div className="contact-info-item" style={{ marginTop: 'var(--spacing-md)' }}>
              <span className="icon">🗺️</span>
              <div>
                <div className="label">Map</div>
                <div className="value" style={{
                  background: 'var(--color-border-light)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-sm)',
                  textAlign: 'center'
                }}>
                  📍 Campus Map (interactive placeholder)
                </div>
              </div>
            </div>
          </div>
          <div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  placeholder="What is this about?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  placeholder="Your message..."
                />
              </div>
              <Button variant="primary" type="submit" size="lg">
                {submitted ? '✅ Sent!' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}