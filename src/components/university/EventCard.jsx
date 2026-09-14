import React from 'react';
import { Button } from '../common/Button';
import { Card, CardBody, CardTitle, CardText } from '../common/Card';

export function EventCard({ event, onView }) {
  return (
    <Card className="event-card">
      <CardBody>
        <div className="event-date-box">
          <span className="month">{event.month}</span>
          <span className="day">{event.day}</span>
        </div>
        <CardTitle>{event.title}</CardTitle>
        <div className="event-location">📍 {event.location}</div>
        <CardText>{event.description}</CardText>
        <Button variant="outline" size="sm" className="mt-1" onClick={() => onView(event.id)}>
          View Event
        </Button>
      </CardBody>
    </Card>
  );
}