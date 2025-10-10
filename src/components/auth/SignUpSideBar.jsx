import { Link } from "react-router-dom";

const SignUpSideBar = ({ currentStep, steps }) => {
  return (
    <div className="sidebar">
      <div className="logo">MultiVersity</div>
      <div className="steps">
        {steps.map((step, index) => (
          <div key={index} className={`step ${index === currentStep ? 'active' : ''}`}>
            <div className="step-indicator">
              {index < currentStep ? (
                <span className="completed">✓</span>
              ) : (
                <span className="number">{index + 1}</span>
              )}
            </div>
            <div className="step-content">
              <h4>{step.title}</h4>
              <p>
                {index === 0 && 'Provide your name and email'}
                {index === 1 && 'Enter your verification code'}
                {index === 2 && 'Choose a secure password'}
                {index === 3 && 'Provide university details'}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="navigation-links">
        <button className="link-btn" ><Link to={'/'}>Back to home</Link></button>
        <button className="link-btn"><Link to={'/login'}>Sign In</Link></button>
      </div>
      </div>
    </div>
  );
};

export default SignUpSideBar;