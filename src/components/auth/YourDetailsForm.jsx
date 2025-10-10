import { useState } from "react";
import authApi from "../../api/authApi";
const YourDetailsForm = ({ formData, handleChange, nextStep, isSubmit, setIsSubmit }) => {
  const isValid = formData.firstName && formData.lastName && 
                 formData.email && /^\S+@\S+\.\S+$/.test(formData.email);
  const [error,setError] = useState(null);
  const  handleClick=async()=>{
    setIsSubmit(true);
    if(isValid){
      try{
        const isEmailExists = await authApi.isEmailAlreadyExists(formData.email);
        setError(
          isEmailExists? 
          `${formData.email} is already in use.` : null
        );
        if(!isEmailExists)
        {
          nextStep();
          await authApi.sendVerificationCode(formData.email);
        }
      }catch(error)
      {
        setError(error.message)
      }
    }
    setIsSubmit(false);
  };
  return (
    <div className="form-card">
      <h2>Your details</h2>
      <p className="subtitle">Provide your name and email</p>
      
      <div className="input-group">
        <label>First name*</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
        />
      </div>
      
      <div className="input-group">
        <label>Last name*</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
        />
      </div>
      
      <div className="input-group">
        <label>Email*</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {error && <p className="error">{error}</p>}
      </div>

      <button
        disabled={isSubmit || !isValid}
        className={`btn-continue ${isValid ? 'active' : 'disabled'}`}
        onClick={handleClick}
      >
        Continue
      </button>
    </div>
  );
};

export default YourDetailsForm;