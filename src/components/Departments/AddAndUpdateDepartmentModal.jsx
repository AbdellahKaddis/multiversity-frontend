import React, { useEffect, useState } from 'react'
import styles from '../Faculties/AddFacultyModal.module.css';
const AddAndUpdateDepartmentModal = ({isOpen, onClose, departmentToBeUpdated, onSave})=> {
    const [formData, setFormData] = useState({
        name : '',
        code : '',
        email : '',
        description : ''
    });
    const [errors, setErrors] = useState({});
    useEffect(()=>{
      if(departmentToBeUpdated != null){
        const {name, code, email, description} = departmentToBeUpdated;
        setFormData({name, code, email : email || "", description : description || ""});
        }
      },[]);

    const validateField = async(name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required.'
        }else {
          delete newErrors.name;
        }
        break;

      case 'code':
        if (!value.trim()) {
          newErrors.code = 'Code is required';
        }  else {
          delete newErrors.code;
        }
        break;
    
      case 'email':
        if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
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
    const handleInputChange =(e)=>{
        const { name, value } = e.target;
        setFormData(prev => (
            {
                ...prev,
                [name] : value
            }
        ));

        if (errors[name]) {
            validateField(name, value);
        }
    };
    const handleBlur =(e)=>{
        const { name, value } = e.target;
        validateField(name, value);
    };
    const handleClose =()=>{
        setFormData({
            name : '',
            code : '',
            email : '',
            description : ''
        });
        setErrors({});
        onClose();
    };
    const handleSubmit =async(e)=>{
        e.preventDefault();

        const submissionData = { 
            ...formData,
            email : formData.email || null,
            description : formData.description || null};
        await onSave(submissionData);
        handleClose();
    };
    const isFormValid = () => {
        const requiredFields = ['name', 'code'];
        return requiredFields.every(field => formData[field].trim()) && 
        Object.keys(errors).length === 0;
    };
    if (!isOpen) return null;
    
    return (
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{!departmentToBeUpdated ? "Create New Department" : "Update Department"}</h2>
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
    
                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.label}>
                        Department Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        placeholder="e.g., Department of Physics"
                      />
                      {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                      <div className={styles.helperText}>
                        Official name of the department as it appears in documents
                      </div>
                    </div>
    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="code" className={styles.label}>
                          Department Code <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          id="code"
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
                          placeholder="e.g., PH"
                          maxLength="10"
                        />
                        {errors.code && <span className={styles.errorMessage}>{errors.code}</span>}
                        <div className={styles.helperText}>
                        max 10 characters
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                          📧 Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={styles.input}
                          placeholder="e.g., ph@gmail.com"
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                      </div>
                    </div>
    
                    <div className={styles.formGroup}>
                      <label htmlFor="description" className={styles.label}>
                        📍 Description
                      </label>
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        rows={3}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        placeholder="e.g. Focused on biological and environmental studies"
                      />
                    </div>
                    
                  </div>
             
              </div>
    
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

export default AddAndUpdateDepartmentModal;