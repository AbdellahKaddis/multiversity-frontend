import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardBody, CardTitle, CardText } from '../common/Card';
import { Link, useParams } from 'react-router-dom';

export function ProgramCard({ program }) {
  const {universityId} = useParams();
  return (
    <Card className="program-card">
      <CardBody>
        <Badge variant="secondary">{program.degreeName}</Badge>
        <CardTitle>{program.name}</CardTitle>
        <div className="program-meta">{program.facultyName}</div>
        <div className="program-duration">⏱ {program.durationInYears} Years</div>
        <CardText>{program.description}</CardText>
        <Link to={`/universities/${universityId}/faculties/${program.facultyId}/programs/${program.id}`}>
        <Button variant="primary" size="sm" >
          View Program
        </Button></Link>
      </CardBody>
    </Card>
  );
}