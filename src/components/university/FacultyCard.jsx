
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Card, CardBody, CardTitle, CardText } from '../common/Card';

export function FacultyCard({ faculty }) {
  return (
    <Card className="faculty-card">
      <CardBody>
        <div className="faculty-code">{faculty.code}</div>
        <CardTitle>{faculty.name}</CardTitle>
        <CardText>{faculty.description}</CardText>
        <div className="faculty-depts">{faculty.departmentCount} Departments</div>
         <Link to={`/universities/${faculty.universityId}/faculties/${faculty.id}`}>
         <Button variant="primary" size="sm">
          View Faculty
        </Button>
         </Link>
      </CardBody>
    </Card>
  );
}