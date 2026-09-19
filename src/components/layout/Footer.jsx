
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export function Footer() {
  const university = useSelector(state => state.university.university)

  const navMap = { about: 'About', faculties: 'Faculties', programs: 'Programs', admissions: 'Admissions', news: 'News', events: 'Events', contact: 'Contact' };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>University</h4>
            <ul>
              {Object.entries(navMap).map(([id, label]) => (
                <li key={id}><a href="#" onClick={(e) => { e.preventDefault();  }}>{label}</a></li>
              ))}
            </ul>
          </div>
         

          <div className="footer-col">
            <h4>Contact</h4>
            <p>📍 {university?.address ?? "Not set"}</p>
            <p>📞 {university?.phoneNumber ?? "Not set"}</p>
            <p>✉️ {university?.email ?? "Not set"}</p>
            <div className="footer-social">
              <Link to={`/universities/${university?.id}`} aria-label="Facebook">📘</Link>
              <Link to={`/universities/${university?.id}`} aria-label="Twitter">🐦</Link>
              <Link to={`/universities/${university?.id}`} aria-label="Instagram">📸</Link>
              <Link to={`/universities/${university?.id}`} aria-label="LinkedIn">💼</Link>
              <Link to={`/universities/${university?.id}`} aria-label="YouTube">▶️</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {university?.name}. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}