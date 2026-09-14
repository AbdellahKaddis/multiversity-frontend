import React, { useEffect, useState } from "react";
import styles from "../Faculties/AddFacultyModal.module.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import academicProgramApi from "../../api/academicProgramApi";

const AddAndUpdateAdmissionModal = ({
  isOpen,
  onClose,
  admissionToBeUpdated,
  onSave,
})=>{
const [formData, setFormData] = useState({
      programId:"",
     title:"",
      academicYear:"",
       startDate:"",
        endDate:"",
         process:"",
        requirements:[],
});
  const [errors, setErrors] = useState({});
    const [programs, setPrograms] = useState([]);
  const faculty = useSelector((state) => state.faculty.faculty);
const getPrograms = async (facultyId = null, departmentId = null, universityId=null) => {
    try {
      const { data, status } = await academicProgramApi.getAcademicPrograms(
        facultyId,
        departmentId,
        universityId
      );
      if (status === 200) setPrograms(data);
      else toast.error("Something went wrong we could not load programs.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getPrograms(faculty.id)

    if (admissionToBeUpdated != null) {
      const {
  programId, title, academicYear, startDate, endDate, process, requirements
      } = admissionToBeUpdated;
      setFormData({
      programId, title, academicYear, startDate, endDate, process, requirements
      });
    }
  }, [admissionToBeUpdated, faculty]);
  useEffect(() => {
  const reqErrors = validateRequirements(formData.requirements);
  setErrors(prev => {
    const next = { ...prev };
    // clear previous requirement row errors
    Object.keys(next).forEach(k => {
      if (k === "requirements" || k.startsWith("req_")) delete next[k];
    });
    return { ...next, ...reqErrors };
  });
}, [formData.requirements]);
  const validateRequirements = (requirements) => {
  const errors = {};
  if (!requirements || requirements.length === 0) {
    errors.requirements = "At least one requirement is required.";
    return errors;
  }
  requirements.forEach((r, index) => {
    const rowErr = {};
    if (!r.name || !String(r.name).trim()) {
      rowErr.name = "Name is required.";
    }
    if (
      r.displayOrder === "" ||
      r.displayOrder === null ||
      r.displayOrder === undefined ||
      isNaN(Number(r.displayOrder)) ||
      Number(r.displayOrder) <= 0
    ) {
      rowErr.displayOrder = "Display order must be a positive number.";
    }
    if (Object.keys(rowErr).length > 0) {
      errors[`req_${index}`] = rowErr;
    }
  });
  return errors;
};
  const validateField = async (name, value) => {
    const newErrors = { ...errors };

    switch (name) {

      case "programId":
        if (!value.trim()) {
          newErrors.programId = "Program is required.";
        } else {
          delete newErrors.programId;
        }
        break;
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required.";
        } else {
          delete newErrors.title;
        }
        break;

      case "startDate":
        if (!value.trim()) {
          newErrors.startDate = "Start Date is required.";
        } else {
          delete newErrors.startDate;
        }
        break;
              case "endDate":
        if (!value.trim()) {
          newErrors.endDate = "End Date is required.";
        } else {
          delete newErrors.endDate;
        }
        break;
              case "process":
        if (!value.trim()) {
          newErrors.process = "Process is required.";
        } else {
          delete newErrors.process;
        }
        break;
      case "academicYear":
        
  if (!value.trim()) {
    newErrors.academicYear = "Academic Year is required.";
  } else if (!/^\d{4}\/\d{4}$/.test(value)) {
    newErrors.academicYear = "Format must be YYYY/YYYY (e.g., 2024/2025).";
  } else {
    const [start, end] = value.split("/").map(Number);
    if (end !== start + 1) {
      newErrors.academicYear = "Second year must follow the first (e.g., 2024/2025).";
    } else {
      delete newErrors.academicYear;
    }
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
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      validateField(name, value);
    }
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const toDateInputValue = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;  
};
  const handleClose = () => {
    setFormData({
 programId:"",
     title:"",
      academicYear:"",
       startDate:"",
        endDate:"",
         process:"",
        requirements:[],
    });
    setErrors({});
    onClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["programId", "title", "academicYear", "startDate", "endDate", "process"];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

     const reqErrors = validateRequirements(formData.requirements);
  Object.assign(newErrors, reqErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const submissionData = {
      ...formData
    }
    
    console.log(submissionData);
    
    await onSave(submissionData);
    handleClose();
  };
const isFormValid = () => {
  const requiredFields = ["programId", "title", "academicYear", "startDate", "endDate", "process"];
  const baseValid = requiredFields.every((field) => formData[field].trim());

  // Requirements: at least one, and each row valid
  const hasAtLeastOne = formData.requirements.length > 0;
  const requirementsValid =
    hasAtLeastOne &&
    formData.requirements.every(
      (r) =>
        r.name &&
        String(r.name).trim() &&
        r.displayOrder !== "" &&
        !isNaN(Number(r.displayOrder)) &&
        Number(r.displayOrder) > 0
    );

  return baseValid && requirementsValid && Object.keys(errors).length === 0;
};
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {!admissionToBeUpdated
              ? "Create New Admission"
              : "Update Admission"}
          </h2>
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
                  <label htmlFor="programId" className={styles.label}>
                    Program <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="programId"
                    name="programId"
                    value={formData.programId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Select Program
                    </option>
                    {programs.map((program) => (
                      <option value={program.id} key={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                  {errors.programId && (
                    <span className={styles.errorMessage}>
                      {errors.programId}
                    </span>
                  )}
                </div>

 <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>
                     Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.code ? styles.inputError : ""
                    }`}
                    
                  />
                  {errors.title && (
                    <span className={styles.errorMessage}>{errors.title}</span>
                  )}
                
                </div>
              </div>
    <div className={styles.formRow}>

    <div className={styles.formGroup}>
                  <label htmlFor="academicYear" className={styles.label}>
                    Academic Year <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="academicYear"
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.academicYear ? styles.inputError : ""
                    }`}
                   placeholder="YYYY/YYYY (e.g., 2024/2025)"
                  />
                  {errors.academicYear && (
                    <span className={styles.errorMessage}>{errors.academicYear}</span>
                  )}
         
                </div>

                 <div className={styles.formGroup}>
                <label htmlFor="process" className={styles.label}>
                Process <span className={styles.required}>*</span>
                </label>
                <textarea
                  type="text"
                  id="process"
                  name="process"
                  value={formData.process || ""}
                  rows={3}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${
                      errors.process ? styles.inputError : ""
                    }`}
                />
                 {errors.process && (
                    <span className={styles.errorMessage}>{errors.process}</span>
                  )}
              </div>

                </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                <label htmlFor="startDate" className={styles.label}>
                Start Date <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={toDateInputValue(formData.startDate)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${
                      errors.startDate ? styles.inputError : ""
                    }`}
                />
                 {errors.startDate && (
                    <span className={styles.errorMessage}>{errors.startDate}</span>
                  )}
              </div>

                 <div className={styles.formGroup}>
                <label htmlFor="endDate" className={styles.label}>
                End Date <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={toDateInputValue(formData.endDate)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${
                      errors.endDate ? styles.inputError : ""
                    }`}
                />
                 {errors.endDate && (
                    <span className={styles.errorMessage}>{errors.endDate}</span>
                  )}
              </div>




                </div>
                {/* Requirements */}
<div className={styles.requirementsSection}>
  <div className={styles.requirementsHeader}>
    <label className={styles.label}>Requirements</label>
    <button
      type="button"
      className={styles.addRequirementButton}
      onClick={() => {
        const nextOrder =
          formData.requirements.length > 0
            ? Math.max(...formData.requirements.map(r => Number(r.displayOrder) || 0)) + 1
            : 1;
        setFormData(prev => ({
          ...prev,
          requirements: [
            ...prev.requirements,
            { name: "", displayOrder: nextOrder },
          ],
        }));
      }}
    >
      ➕ Add Requirement
    </button>
  </div>
  {errors.requirements && (
  <span className={styles.errorMessage}>{errors.requirements}</span>
)}

  {formData.requirements.length === 0 && (
    <p className={styles.requirementsEmpty}>
      No requirements yet. Click "Add Requirement" to add one.
    </p>
  )}

  <div className={styles.requirementsList}>
    {formData.requirements.map((req, index) => (
      <div key={index} className={styles.requirementRow}>
        <div className={styles.formGroup}>
          <label className={styles.subLabel}>Order</label>
          <input
            type="number"
            min="1"
            className={`${styles.orderInput} ${
  errors[`req_${index}`]?.displayOrder ? styles.inputError : ""
}`}
            value={req.displayOrder}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                requirements: prev.requirements.map((r, i) =>
                  i === index ? { ...r, displayOrder: value } : r
                ),
              }));
            }}
          />
          <span className={styles.errorMessage}>
    {errors[`req_${index}`]?.displayOrder || ""}
  </span>
        </div>

        <div className={`${styles.formGroup} ${styles.grow}`}>
          <label className={styles.subLabel}>Name</label>
          <input
            type="text"
            className={`${styles.input} ${
  errors[`req_${index}`]?.name ? styles.inputError : ""
}`}
            placeholder="e.g., High School Diploma"
            value={req.name}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                requirements: prev.requirements.map((r, i) =>
                  i === index ? { ...r, name: value } : r
                ),
              }));
            }}
          />
         <span className={styles.errorMessage}>
    {errors[`req_${index}`]?.name || ""}
  </span>
        </div>

        <button
          type="button"
          className={styles.removeRequirementButton}
          title="Remove requirement"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              requirements: prev.requirements.filter((_, i) => i !== index),
            }));
          }}
        >
          🗑️
        </button>
      </div>
    ))}
  </div>
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
export default AddAndUpdateAdmissionModal;