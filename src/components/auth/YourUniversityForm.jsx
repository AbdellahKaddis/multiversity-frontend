import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import universityApi from "../../api/universityApi";

import { toast } from 'react-toastify';
import { useState } from "react";

const YourUniversityForm = ({ formData, handleChange, prevStep, isSubmit, setIsSubmit }) => {
  const [errors,setErrors] = useState({});
  const isValid = formData.universityName && formData.universityEmail && formData.universityType ;
  const navigate = useNavigate();
  const handleClick = async()=>{
    setIsSubmit(true);
    try{
      if(isValid)
        {
          const {data, status} = await universityApi.checkForDuplicateValues({name:formData.universityName, email:formData.universityEmail});
          if(status === 400)
          {
            setErrors({})
            const newErrors = {};
            if(data.Message.includes("Name"))
              newErrors.name = "This name is already taken.";
            if(data.Message.includes("Email"))
              newErrors.email = "This email is already in use.";
            setErrors(newErrors);
          }
          else if(status === 200)
          {
            const {firstName,lastName,password,email} = formData;
            const {data, status} = await authApi.registerUniversityAmin({firstName,lastName,password,email});
            
            if(status === 201)
            {
              setErrors({})
              formData.adminId = data.adminId;
              
              if(data.adminId)
              {
                const {universityName, universityType, universityEmail, adminId} = formData;
                const {data,status} = await universityApi.createUniversity({universityName, universityType, universityEmail, adminId});
                
                if(status === 201)
                {
                  toast.success("🎉 Account created successfully. Redirecting...", {
                    onClose: () => {
                      navigate('/login');
                    }
                  });
                }
              }
            }
          }
        }
  }catch(error)
  {
    setErrors(prev=>({...prev,netErr:error.message}));
  }
  setIsSubmit(false);
};

  return (
    <div className="form-card">
      <h2>University information</h2>
      <p className="subtitle">Provide university details</p>
      
      <div className="input-group">
        <label>University Name*</label>
        <input
          type="text"
          name="universityName"
          value={formData.universityName}
          onChange={handleChange}
          placeholder="Enter university name"
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      
      <div className="input-group">
        <label>University Type*</label>
        <select 
          name="universityType" 
          value={formData.universityType}
          onChange={handleChange}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="input-group">
        <label>University Email*</label>
        <input
          type="email"
          name="universityEmail"
          value={formData.universityEmail}
          onChange={handleChange}
          placeholder="Enter university email"
        />
        {errors.email && <p className="error">{errors.email}</p>}
        
      </div>
      {errors.netErr && <p className="error">{errors.netErr}</p>}

      <button 
        disabled={isSubmit || !isValid}
        className={`btn-continue ${isValid ? 'active' : 'disabled'}`}
        onClick={handleClick}
      >
        Complete Registration
      </button>
      
      <div className="navigation-links">
        <button className="link-btn" onClick={prevStep}>Back</button>
      </div>
    </div>
  );
};

export default YourUniversityForm;