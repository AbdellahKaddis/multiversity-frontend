
import React from 'react';
import { Button } from '../common/Button';
import { useSelector } from 'react-redux';

export function UniversityHero({ onNavigate }) {
  const university = useSelector(
    (state) => state.university.university
  );

  const currentYear = new Date().getFullYear();

  const yearsOfExcellence = university?.yearEstablished
    ? currentYear - university.yearEstablished
    : null;

  return (
    <section className="hero">
      <div className="container hero-inner">

        <div className="hero-content">

          <span className="hero-eyebrow">
            {university?.name}
          </span>

          <h1>
            Shape Your Future Through <span>Excellence</span>
          </h1>

          <p>
            {university?.description ||
              'Discover an environment where knowledge, innovation, and ambition come together to shape the leaders of tomorrow.'}
          </p>

          {university?.yearEstablished && (
            <div className="hero-meta">
              <span>
                Established in {university.yearEstablished}
              </span>

              <span>•</span>

              <span>
                {yearsOfExcellence}+ years of excellence
              </span>
            </div>
          )}

          <div className="hero-buttons">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('programs')}
            >
              Explore Programs
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('admissions')}
            >
              Admissions
            </Button>
          </div>

        </div>

      <div className="hero-visual">
  {university?.coverImageUrl ? (
    <img
      src={university.coverImageUrl}
      alt={`${university.name} campus`}
      className="hero-image"
    />
  ) : (
    <div className="hero-visual-placeholder">
      <span>🏛️</span>
    </div>
  )}
</div>

      </div>
    </section>
  );
}
