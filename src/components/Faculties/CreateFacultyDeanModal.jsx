import React, { useEffect, useState } from 'react';
import styles from './AddFacultyModal.module.css';
import authApi from '../../api/authApi';
const CreateFacultyDeanModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  useEffect(()=>{
    // if(facultyToBeUpdated != null){
    //   const {name, code, type, region, city, address, email, phoneNumber, establishedYear} = facultyToBeUpdated;
    //   setFormData({name, code, type, region, city, address, email, phoneNumber, establishedYear});
    // }
  },[]);
  const validateField = async(name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required.'
        }else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last name is required';
        }  else {
          delete newErrors.lastName;
        }
        break;
    
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        }
        else if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
              delete newErrors.email;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }else {
      try{
            const isEmailExists = await authApi.isEmailAlreadyExists(formData.email);
            if(isEmailExists){
              newErrors.email = `${formData.email} is already in use.`;
            }
          }catch(error)
          {
            newErrors.email = `${error.message}`;
          }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const submissionData = { ...formData };

    await onSave(submissionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
    });
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    const requiredFields = ['firstName', 'lastName', 'email'];
    return requiredFields.every(field => formData[field].trim()) && 
    Object.keys(errors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create and Assign Dean to faculty</h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formContent}>
    
              <div className={styles.section}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>
                      First name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
                      placeholder="e.g., John"
                      maxLength="50"
                    />
                    {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>
                      Last name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
                      placeholder="e.g., Doe"
                      maxLength="50"
                    />
                    {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                  </div>

                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      📧 Email <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      placeholder="e.g., example@gmail.com"
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>
              </div>
           
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!isFormValid()}
              >
                ✅ Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFacultyDeanModal;