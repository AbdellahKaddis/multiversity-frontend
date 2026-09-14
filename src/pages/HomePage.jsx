
import { UniversityHero } from '../components/university/UniversityHero';
import { UniversityStats } from '../components/university/UniversityStats';

export function HomePage({ onNavigate }) {

  return (
    <>
      <UniversityHero onNavigate={onNavigate} />
      <UniversityStats />
    </>
  );
}