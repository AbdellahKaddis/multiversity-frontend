

// src/SignUp/YourPasswordForm.jsx
const YourPasswordForm = ({ formData, handleChange, nextStep, prevStep }) => {
  const isPasswordMatch = formData.password === formData.confirmPassword;
    const rules = [
    {
      test: (p) => p.length >= 8,
      message: 'At least 8 characters',
    },
    {
      test: (p) => /[A-Z]/.test(p),
      message: 'At least one uppercase letter (A-Z)',
    },
    {
      test: (p) => /[a-z]/.test(p),
      message: 'At least one lowercase letter (a-z)',
    },
    {
      test: (p) => /\d/.test(p),
      message: 'At least one digit (0-9)',
    },
    {
      test: (p) => /\W/.test(p),
      message: 'At least one special character (e.g. !@#$%)',
    },
  ];
const isPasswordValid = (password)=> {

  if (password.length < 8)
    return false;

  if (!/[A-Z]/.test(password))
    return false;

  if (!/[a-z]/.test(password))
    return false;

  if (!/\d/.test(password))
    return false;

  if (!/\W/.test(password))
    return false;

  return true;
}

  return (
    <div className="form-card">
      <h2>Create password</h2>
      <p className="subtitle">Choose a secure password</p>
      
      <div className="input-group">
        <label>Password*</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Choose a password"
        />
      </div>
      <ul style={{ paddingLeft: 0 }}>
        {rules.map((rule, index) => {
          const isValid = rule.test(formData.password);
          return (
            <li
              key={index}
              style={{
                color: isValid ? 'green' : '#C0392B',
                listStyle: 'none',
              }}
            >
              {isValid ? '✔' : '✖'} {rule.message}
            </li>
          );
        })}
      </ul>
      <div className="input-group">
        <label>Confirm Password*</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
      </div>
      {!isPasswordMatch && formData.confirmPassword  ? <p className="error">Password does not match.</p>:""}
      <button 
        className={`btn-continue ${isPasswordMatch && isPasswordValid(formData.password) ? 'active' : 'disabled'}`}
        onClick={isPasswordMatch && isPasswordValid(formData.password) ? nextStep : undefined}
      >
        Continue
      </button>
      
      <div className="navigation-links">
        <button className="link-btn" onClick={prevStep}>Back</button>
      </div>
    </div>
  );
};

export default YourPasswordForm;