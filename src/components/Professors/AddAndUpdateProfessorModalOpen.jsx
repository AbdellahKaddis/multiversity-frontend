import React, { useEffect, useState } from "react";
import styles from "../Faculties/AddFacultyModal.module.css";
import departmentApi from "../../api/departmentApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import authApi from "../../api/authApi";

const AddAndUpdateProfessorModalOpen = ({
  isOpen,
  onClose,
  professorToBeUpdated,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cin: "",
    grade: "",
    isDepartmentHead: false,
    departmentId: "",
  });
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const faculty = useSelector((state) => state.faculty.faculty);
  const getDepartments = async (facultyId) => {
    try {
      const { data, status } = await departmentApi.getDepartments(facultyId);
      if (status === 200) setDepartments(data);
      else toast.error("Something went wrong we could not load departments.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getDepartments(faculty.id);
    if (professorToBeUpdated != null) {
      const {
        firstName,
        lastName,
        email,
        cin,
        grade,
        isDepartmentHead,
        departmentId,
      } = professorToBeUpdated;
      setFormData({
        firstName,
        lastName,
        email,
        cin,
        grade,
        isDepartmentHead,
        departmentId,
      });
    }
  }, []);
  const grades = ["AssistantProfessor", "AssociateProfessor", "FullProfessor"];
  const validateField = async (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "FirstName is required.";
        } else {
          delete newErrors.firstName;
        }
        break;
      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "LastName is required.";
        } else {
          delete newErrors.lastName;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (
          value &&
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;
      case "grade":
        if (!value.trim()) {
          newErrors.grade = "Grade is required.";
        } else {
          delete newErrors.grade;
        }
        break;
      case "departmentId":
        if (!value.trim()) {
          newErrors.departmentId = "Department is required.";
        } else {
          delete newErrors.departmentId;
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
      [name]: name === 'isDepartmentHead' ? e.target.checked: value,
    }));

    if (errors[name]) {
      validateField(name, value);
    }
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      cin: "",
      grade: "",
      isDepartmentHead: false,
      departmentId: "",
    });
    setErrors({});
    onClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["firstName",
      "lastName",
      "email",
      "grade",
      "departmentId",];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if(!professorToBeUpdated){
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
    }
    

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    const submissionData = {
      ...formData,
      cin: formData.cin?.trim() || null,
      isDepartmentHead: Boolean(formData.isDepartmentHead),
    };
    
    await onSave(submissionData);
    handleClose();
  };
  const isFormValid = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "grade",
      "departmentId",
    ];
    return (
      requiredFields.every((field) => formData[field].trim()) &&
      Object.keys(errors).length === 0
    );
  };
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {!professorToBeUpdated
              ? "Create New Professor"
              : "Update Professor"}
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
                  <label htmlFor="firstName" className={styles.label}>
                    First Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.title ? styles.inputError : ""
                    }`}
                    placeholder="e.g., John"
                    maxLength={50}
                  />
                  {errors.firstName && (
                    <span className={styles.errorMessage}>
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.coefficient ? styles.inputError : ""
                    }`}
                    placeholder="e.g., Doe"
                    maxLength={50}
                  />
                  {errors.lastName && (
                    <span className={styles.errorMessage}>
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="cin" className={styles.label}>
                    Cin
                  </label>
                  <input
                    type="text"
                    id="cin"
                    name="cin"
                    value={formData.cin || ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input}`}
                    placeholder="e.g., BH110022"
                    maxLength="10"
                  />
                  <div className={styles.helperText}>max 10 characters</div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.email ? styles.inputError : ""
                    }`}
                    placeholder="example@example.com"
                     readOnly={professorToBeUpdated}
                  />
                  {errors.email && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="departmentId" className={styles.label}>
                    Department <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {departments.map((department) => (
                      <option value={department.id} key={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <span className={styles.errorMessage}>
                      {errors.departmentId}
                    </span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="grade" className={styles.label}>
                    Grade <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Select Grade
                    </option>
                    {grades.map((grade, index) => (
                      <option value={grade} key={index}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <span className={styles.errorMessage}>{errors.grade}</span>
                  )}
                </div>
              </div>

              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="isDepartmentHead"
                  name="isDepartmentHead"
                  checked={formData.isDepartmentHead}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={styles.checkbox}
                />

                <label htmlFor="isDepartmentHead" className={styles.label}>
                  Is Department Head
                </label>
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
export default AddAndUpdateProfessorModalOpen;
