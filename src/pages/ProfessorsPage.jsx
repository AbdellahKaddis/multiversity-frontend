import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
// import { PROFESSORS } from '../data/data';

export function ProfessorsPage({ onNavigate }) {
  const handleView = (id) => onNavigate('professor', { id });
  return (
    <>
      <PageHeader title="Our Professors" subtitle="Meet the dedicated educators and researchers at MultiVersity." />
      <section className="section">
        <div className="container">
          <div className="dept-list">
            {/* {PROFESSORS.map(p => (
              <div key={p.id} className="dept-item" style={{ cursor: 'pointer' }} onClick={() => handleView(p.id)}>
                <h5>{p.name}</h5>
                <p>{p.grade}</p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{p.department} · {p.faculty}</p>
              </div>
            ))} */}
          </div>
        </div>
      </section>
    </>
  );
}