import React from 'react';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { COURSES } from '../data/data';

export function CourseDetailsPage({ courseId, onNavigate }) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) {
    return <ErrorState title="Course not found" description="The course you are looking for does not exist." onRetry={() => onNavigate('programs')} />;
  }

  return (
    <>
      <PageHeader title={course.name} subtitle={`${course.code} · ${course.credits} credits`} />
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-loose)' }}>{course.description}</p>
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <div><strong>Teaching Type: </strong><span>{course.teachingType}</span></div>
                <div><strong>Professor: </strong><span>{course.professor}</span></div>
                <div><strong>Program: </strong><span>{course.program}</span></div>
                <div><strong>Semester: </strong><span>{course.semester}</span></div>
              </div>
            </div>
            <div style={{ background: 'var(--color-bg)', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-md)' }}>
              <h4 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>Quick Facts</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>Credits</strong>
                  <span>{course.credits}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>Code</strong>
                  <span>{course.code}</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => onNavigate('programs')}>← Back to Programs</Button>
        </div>
      </section>
    </>
  );
}