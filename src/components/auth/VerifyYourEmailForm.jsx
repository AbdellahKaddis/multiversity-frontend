import { useState } from "react";
import authApi from "../../api/authApi";
useState
const VerifyYourEmailForm = ({ email, formData, handleChange, nextStep, prevStep, isSubmit, setIsSubmit  }) => {
  const isComplete = formData.verificationCode.length === 6;
    const [error,setError] = useState(null);
  const handleClick = async()=>{
    setIsSubmit(true);
    let isCodeValid;

    try{
      if(isComplete){
      isCodeValid = await authApi.isVerificationCodeValid(formData.email,formData.verificationCode);
      setError(
        !isCodeValid? 
        `Code expired or not found.` : null
      );
      isCodeValid ? nextStep():undefined;
    }
    }catch(error)
      {
        setError(error.message)
      }
    setIsSubmit(false);
  }
  const sendVerificationCode = async()=>{
    try{
    await authApi.sendVerificationCode(formData.email);
    }catch(error)
      {
        setError(error.message)
      }
  }
  return (
    <div className="form-card">
      <h2>Verify your email</h2>
      <p className="subtitle">We sent a code to {email || 'your email'}</p>
      
      <div className="verification-input">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="number"
            maxLength={1}
            name="verificationCode"
            value={formData.verificationCode[i] || ''}
            onChange={(e) => {
              const newCode = formData.verificationCode.split('');
              newCode[i] = e.target.value;
              handleChange({
                target: { name: 'verificationCode', value: newCode.join('') }
              });
            }}
          />
        ))}
      </div>
      
      <p className="resend-link">
        Didn't get a code? <button onClick={sendVerificationCode}>Click to resend</button>
      </p>
      {error && <p className="error">{error}</p>}
      <button 
        disabled={isSubmit || !isComplete}
        className={`btn-continue ${isComplete ? 'active' : 'disabled'}`}
        onClick={handleClick}
      >
        Continue
      </button>
      
      <div className="navigation-links">
        <button className="link-btn" onClick={prevStep}>Back</button>
      </div>
    </div>
  );
};

export default VerifyYourEmailForm;