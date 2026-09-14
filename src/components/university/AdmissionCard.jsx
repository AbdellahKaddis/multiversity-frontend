import React from 'react';
import { Button } from '../common/Button';
import { Card, CardBody } from '../common/Card';
import { Link, useParams } from 'react-router-dom';

export function AdmissionCard({ admission }) {
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
const {universityId} = useParams()
  return (
    <Card className="admission-card">
      <CardBody>
        <div className="admission-title">{admission.title}</div>
        <div>
          <strong>Requirements:</strong>
          <ul>
            {admission.requirements.map((r) => <li key={r.id}>{r.name}</li>)}
          </ul>
        </div>
        <div style={{ margin: 'var(--spacing-sm) 0' }}>
          <strong>Application Period: </strong>
          <span>{formatDate(admission.startDate) + ' → ' + formatDate(admission.endDate)}</span>
        </div>
        <div style={{ margin: 'var(--spacing-sm) 0' }}>
          <strong>Process: </strong>
          <span>{admission.process}</span>
        </div>
        <Link to={`/universities/${universityId}/faculties/${admission.facultyId}/programs/${admission.programId}`}>
        <Button variant="primary" size="sm" className="mt-1">Learn More</Button></Link>
      </CardBody>
    </Card>
  );
}