import React, { useEffect, useState } from "react";
import styles from "../Faculties/AddFacultyModal.module.css";
const AddAndUpdateCourseModalOpen = ({
  isOpen,
  onClose,
  courseToBeUpdated,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    coefficient: "",
    credits: "",
    hoursCM: "",
    hoursTD: "",
    hoursTP: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (courseToBeUpdated != null) {
      const {
        title,
        code,
        description,
        coefficient,
        credits,
        hoursCM,
        hoursTD,
        hoursTP,
      } = courseToBeUpdated;
      setFormData({
        title,
        code,
        description,
        coefficient,
        credits,
        hoursCM,
        hoursTD,
        hoursTP,
      });
    }
  }, []);

  const validateField = async (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required.";
        } else {
          delete newErrors.title;
        }
        break;
      case "code":
        if (!value.trim()) {
          newErrors.code = "Code is required.";
        } else {
          delete newErrors.code;
        }
        break;
      case "coefficient":
        if (!value.trim()) {
          newErrors.coefficient = "Coefficient is required.";
        } else {
          delete newErrors.coefficient;
        }
        break;
      case "credits":
        if (!value.trim()) {
          newErrors.credits = "Credits is required.";
        } else {
          delete newErrors.credits;
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
  const handleClose = () => {
    setFormData({
      code: "",
      title: "",
      description: "",
      coefficient: "",
      credits: "",
      hoursCM: "",
      hoursTD: "",
      hoursTP: "",
    });
    setErrors({});
    onClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      coefficient: parseInt(formData.coefficient),
      credits: parseInt(formData.credits),
      description: formData.description?.trim() || null,
      hoursCM: parseInt(formData.hoursCM) || null,
      hoursTD: parseInt(formData.hoursTD) || null,
      hoursTP: parseInt(formData.hoursTP) || null,
    };
    await onSave(submissionData);
    handleClose();
  };
  const isFormValid = () => {
    const requiredFields = ["title", "code", "coefficient", "credits"];
    return (
      requiredFields.every((field) => {
        const value = formData[field];
        return (
          value !== undefined && value !== null && String(value).trim() !== ""
        );
      }) && Object.keys(errors).length === 0
    );
  };
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {!courseToBeUpdated ? "Create New Course" : "Update Course"}
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
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Course Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${
                    errors.title ? styles.inputError : ""
                  }`}
                  placeholder="e.g., Computer Science"
                  maxLength={150}
                />
                {errors.title && (
                  <span className={styles.errorMessage}>{errors.title}</span>
                )}
                <div className={styles.helperText}>
                  Official title of the course as it appears in documents
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="code" className={styles.label}>
                    Course Code <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.code ? styles.inputError : ""
                    }`}
                    placeholder="e.g., CS101"
                    maxLength="10"
                  />
                  {errors.code && (
                    <span className={styles.errorMessage}>{errors.code}</span>
                  )}
                  <div className={styles.helperText}>max 10 characters</div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="coefficient" className={styles.label}>
                    Coefficient <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="coefficient"
                    name="coefficient"
                    value={formData.coefficient}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.coefficient ? styles.inputError : ""
                    }`}
                    placeholder="1"
                    min={1}
                  />
                  {errors.coefficient && (
                    <span className={styles.errorMessage}>
                      {errors.coefficient}
                    </span>
                  )}
                  <div className={styles.helperText}>
                    Weight of the course in the semester average
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="credits" className={styles.label}>
                    Credits <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="credits"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.credits ? styles.inputError : ""
                    }`}
                    placeholder="1"
                    min={1}
                    max={10}
                  />
                  {errors.credits && (
                    <span className={styles.errorMessage}>
                      {errors.credits}
                    </span>
                  )}
                  <div className={styles.helperText}>
                    Credit points earned if the course is passed
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="hoursCM" className={styles.label}>
                    Hours CM
                  </label>
                  <input
                    type="number"
                    id="hoursCM"
                    name="hoursCM"
                    value={formData.hoursCM || ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder="1"
                    min={1}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="hoursTD" className={styles.label}>
                    Hours TD
                  </label>
                  <input
                    type="number"
                    id="hoursTD"
                    name="hoursTD"
                    value={formData.hoursTD || ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder="1"
                    min={1}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="hoursTP" className={styles.label}>
                    Hours TP
                  </label>
                  <input
                    type="number"
                    id="hoursTP"
                    name="hoursTP"
                    value={formData.hoursTP || ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder="1"
                    min={1}
                  />
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
                  value={formData.description || ""}
                  rows={3}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={styles.input}
                  placeholder="e.g. computer science fundamentals"
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
export default AddAndUpdateCourseModalOpen;
