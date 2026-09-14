import React, { useEffect, useState } from "react";
import styles from "../Faculties/AddFacultyModal.module.css";
import { toast } from "react-toastify";
import degreeApi from "../../api/degreeApi";
import departmentApi from "../../api/departmentApi";

const AddAndUpdateProgramModal = ({
  isOpen,
  onClose,
  onSave,
  programToBeUpdated,
  faculty,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    durationInYears: "",
    description: "",
    degreeId: "",
    departmentId: "",
  });
  const [errors, setErrors] = useState({});
  const [degrees, setDegrees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const getDegrees = async (universityId) => {
    try {
      const { data, status } = await degreeApi.getDegrees(universityId);
      if (status === 200) setDegrees(data);
      else toast.error("Something went wrong we could not load degrees.");
    } catch (error) {
      toast.error(error.message);
    }
  };
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
    if (programToBeUpdated != null) {
      const {
        name,
        code,
        durationInYears,
        description,
        degreeId,
        departmentId,
      } = programToBeUpdated;
      setFormData({
        name,
        code,
        durationInYears,
        description,
        degreeId,
        departmentId,
      });
    }

    getDegrees(faculty.universityId);
    getDepartments(faculty.id);
  }, []);
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Program name is required";
        } else {
          delete newErrors.name;
        }
        break;

      case "code":
        if (!value.trim()) {
          newErrors.code = "Program code is required";
        } else {
          delete newErrors.code;
        }
        break;

      case "durationInYears":
        if (!value.trim()) {
          newErrors.type = "Duration is required";
        } else {
          delete newErrors.type;
        }
        break;

      case "degreeId":
        if (!value.trim()) {
          newErrors.degreeId = "Degree is required";
        } else {
          delete newErrors.degreeId;
        }
        break;

      case "departmentId":
        if (!value.trim()) {
          newErrors.departmentId = "Department  is required";
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
      [name]: value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = [
      "name",
      "code",
      "durationInYears",
      "degreeId",
      "departmentId",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (
        !(value !== undefined && value !== null && String(value).trim() !== "")
      ) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submissionData = {
      ...formData,
      description: formData.description?.trim() || null,
      durationInYears: parseInt(formData.durationInYears),
    };

    await onSave(submissionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      code: "",
      durationInYears: "",
      description: "",
      degreeId: "",
      departmentId: "",
    });
    setErrors({});
    onClose();
  };

  const isFormValid = () => {
    const requiredFields = [
      "name",
      "code",
      "durationInYears",
      "degreeId",
      "departmentId",
    ];
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
            {programToBeUpdated === null
              ? "Create New Program"
              : "Update Program"}
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
                <label htmlFor="name" className={styles.label}>
                  Program Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ""
                  }`}
                  placeholder="e.g., Web FullStack"
                />
                {errors.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
                <div className={styles.helperText}>
                  Official name of the Program as it appears in documents
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="code" className={styles.label}>
                    Program Code <span className={styles.required}>*</span>
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
                    placeholder="e.g., WFS"
                    maxLength="10"
                  />
                  {errors.code && (
                    <span className={styles.errorMessage}>{errors.code}</span>
                  )}
                  <div className={styles.helperText}>
                    Unique identifier, max 10 characters
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="degreeId" className={styles.label}>
                    Degree <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="degreeId"
                    name="degreeId"
                    value={formData.degreeId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.select} ${
                      errors.type ? styles.inputError : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select Degree
                    </option>
                    {degrees.map((degree) => (
                      <option value={degree.id} key={degree.id}>
                        {degree.name}
                      </option>
                    ))}
                  </select>
                  {errors.degreeId && (
                    <span className={styles.errorMessage}>
                      {errors.degreeId}
                    </span>
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
                  <label htmlFor="durationInYears" className={styles.label}>
                    Duration (Years)<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="durationInYears"
                    name="durationInYears"
                    value={formData.durationInYears}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.durationInYears ? styles.inputError : ""
                    }`}
                    placeholder="e.g., 3"
                    min={1}
                  />
                  {errors.durationInYears && (
                    <span className={styles.errorMessage}>
                      {errors.durationInYears}
                    </span>
                  )}
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
                  placeholder="e.g. Focused on Web FullStack Development"
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

export default AddAndUpdateProgramModal;
