// src/SignUp/SignUp.jsx
import { useState } from 'react';
import SignUpSideBar from './SignUpSideBar';
import YourDetailsForm from './YourDetailsForm';
import YourPasswordForm from './YourPasswordForm';
import VerifyYourEmailForm from './VerifyYourEmailForm';
import YourUniversityForm from './YourUniversityForm';
import './signup.css'
import { ToastContainer } from "react-toastify";
const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    universityName: '',
    universityType: 'public',
    universityEmail: '',
    adminId: null
  });
  const [isSubmit,setIsSubmit] = useState(false);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const steps = [
    { title: 'Your details', component: 
      <YourDetailsForm 
        formData={formData} 
        handleChange={handleChange} 
        nextStep={nextStep} 
        isSubmit={isSubmit}
        setIsSubmit={setIsSubmit}
      /> },
    { title: 'Verify your email', component: 
      <VerifyYourEmailForm 
        email={formData.email} 
        formData={formData} 
        handleChange={handleChange} 
        nextStep={nextStep} 
        prevStep={prevStep} 
        isSubmit={isSubmit}
        setIsSubmit={setIsSubmit}
      /> },
    { title: 'Create password', component: 
      <YourPasswordForm 
        formData={formData} 
        handleChange={handleChange} 
        nextStep={nextStep} 
        prevStep={prevStep} 
      /> },
    { title: 'University info', component: 
      <YourUniversityForm 
        formData={formData} 
        handleChange={handleChange} 
        prevStep={prevStep} 
        isSubmit={isSubmit}
        setIsSubmit={setIsSubmit}
      /> }
  ];

  return (
    <div className="signup-container">
      <SignUpSideBar currentStep={currentStep} steps={steps} />
      <div className="form-container">
        {steps[currentStep].component}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnHover
        closeOnClick
        draggable
      />
    </div>
  );
};

export default SignUp;