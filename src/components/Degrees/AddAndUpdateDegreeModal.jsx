import React, { useEffect, useState } from 'react'
import styles from '../Faculties/AddFacultyModal.module.css';
const AddAndUpdateDegreeModal = ({isOpen, onClose, degreeToBeUpdated, onSave})=> {
    const [formData, setFormData] = useState({
        name : ''
    });
    const [errors, setErrors] = useState({});
    useEffect(()=>{
      if(degreeToBeUpdated != null){
        const { name } = degreeToBeUpdated;
        setFormData({ name });
        }
      },[]);

    const validateField = async(name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Degree name is required.'
        }else {
          delete newErrors.name;
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
        });
        setErrors({});
        onClose();
    };
    const handleSubmit =async(e)=>{
        e.preventDefault();

        const submissionData = { ...formData };
        await onSave(submissionData);
        handleClose();
    };
    const isFormValid = () => {
        const requiredFields = ['name'];
        return requiredFields.every(field => formData[field].trim()) && 
        Object.keys(errors).length === 0;
    };
    if (!isOpen) return null;
    
    return (
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{!degreeToBeUpdated ? "Create New Degree" : "Update Degree"}</h2>
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
                        Degree Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        placeholder="e.g., Master"
                      />
                      {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                      <div className={styles.helperText}>
                        Official name of the degree as it appears in documents
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
                  </div>
            </form>
        </div>
        </div>
    );
};

export default AddAndUpdateDegreeModal;