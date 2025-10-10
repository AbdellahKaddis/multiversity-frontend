// src/Login/LoginSideBar.jsx
const LoginSideBar = () => {
  return (
    <div className="sidebar">
      <div className="logo">Untitled UI</div>
      
      <div className="benefits">
        <div className="benefit-card">
          <div className="icon">
            <svg viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
          </div>
          <div className="content">
            <h4>Secure Access</h4>
            <p>Industry-standard encryption keeps your data safe</p>
          </div>
        </div>
        
        <div className="benefit-card">
          <div className="icon">
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div className="content">
            <h4>Single Sign-On</h4>
            <p>Connect with your institution credentials</p>
          </div>
        </div>
        
        <div className="benefit-card">
          <div className="icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
            </svg>
          </div>
          <div className="content">
            <h4>Seamless Experience</h4>
            <p>Continue right where you left off</p>
          </div>
        </div>
      </div>
      
      <div className="quote">
        <p>"The login experience was so smooth, I didn't even notice I was authenticating."</p>
        <div className="author">
          <div className="avatar">JD</div>
          <div>
            <strong>Jane Doe</strong>
            <span>University Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSideBar;