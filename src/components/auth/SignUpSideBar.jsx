import { Link, useLocation } from "react-router-dom";
import styles from "./signup.module.css";

const SignUpSideBar = ({ currentStep, steps }) => {
  const location = useLocation();
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>MultiVersity</div>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${index === currentStep ? styles.active : ""}`}
          >
            <div className={styles.stepIndicator}>
              {index < currentStep ? (
                <span className={styles.completed}>✓</span>
              ) : (
                <span className={styles.number}>{index + 1}</span>
              )}
            </div>
            <div className={styles.stepContent}>
              <h4>{step.title}</h4>
              <p>
                
                {index === 0 && 'Provide your name and email'}
                {index === 1 && 'Enter your verification code'}
                {index === 2 && 'Choose a secure password'}
                { location.pathname === '/signup' ? (index === 3 && 'Provide university details') : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.navigationLinks}>
          <button className={styles.linkBtn}><Link to={'/'}>Back to home</Link></button>
          <button className={styles.linkBtn}><Link to={location.pathname === '/signup' ? '/login' : '/login/student'}>Sign In</Link></button>
        </div>
      </div>
    </div>
  );
};

export default SignUpSideBar;