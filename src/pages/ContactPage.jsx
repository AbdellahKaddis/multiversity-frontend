import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ContactSection } from '../components/sections/ContactSection';

export function ContactPage({ onNavigate }) {
  return (
    <>
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you. Reach out with any questions." />
      <section className="section">
        <div className="container">
          <ContactSection onNavigate={onNavigate} />
        </div>
      </section>
    </>
  );
}