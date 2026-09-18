import React, { useEffect, useState } from "react";
import styles from "../Faculties/AddFacultyModal.module.css";
import applicantApi from "../../api/applicantApi";
import academicProgramApi from "../../api/academicProgramApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ENROLLMENT_STATUS = [
  { value: "Active",    label: "Active" },
  { value: "Suspended", label: "Suspended" },
  { value: "Graduated", label: "Graduated" },
  { value: "Withdrawn", label: "Withdrawn" },
];

const AddAndUpdateEnrollmentModalOpen = ({
  isOpen,
  onClose,
  enrollmentToBeUpdated,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    applicantId: "",
    programId: "",
    academicYear: "",
    yearLevel: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);

  const faculty = useSelector((state) => state.faculty.faculty);
  const isUpdateMode = enrollmentToBeUpdated != null;

  useEffect(() => {
    if (enrollmentToBeUpdated != null) {
      const { applicantId, programId, academicYear, yearLevel, status } =
        enrollmentToBeUpdated;
      setFormData({
        applicantId,
        programId,
        academicYear,
        yearLevel,
        status: status ?? "Active",
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        const [a, p] = await Promise.all([
          applicantApi.getApplicants({
            universityId: faculty.universityId,
            facultyId: faculty.id,
            status: null,
          }),
          academicProgramApi.getAcademicPrograms(faculty.id),
        ]);
        if (a.status === 200) setApplicants(a.data);
        if (p.status === 200) setPrograms(p.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    load();
  }, [isOpen]);

  const validateField = async (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "applicantId":
        if (!value.trim()) newErrors.applicantId = "Applicant is required.";
        else delete newErrors.applicantId;
        break;

      case "programId":
        if (!value.trim()) newErrors.programId = "Program is required.";
        else delete newErrors.programId;
        break;

      case "academicYear":
        if (!value.trim()) {
          newErrors.academicYear = "Academic Year is required.";
        } else if (!/^\d{4}\/\d{4}$/.test(value.trim())) {
          newErrors.academicYear = "Format must be YYYY/YYYY (e.g., 2024/2025).";
        } else {
          const [start, end] = value.split("/").map(Number);
          if (end !== start + 1) {
            newErrors.academicYear =
              "Second year must follow the first (e.g., 2024/2025).";
          } else {
            delete newErrors.academicYear;
          }
        }
        break;

      case "yearLevel":
        if (!String(value).trim()) {
          newErrors.yearLevel = "Year level is required.";
        } else if (Number(value) < 1) {
          newErrors.yearLevel = "Year level must be at least 1.";
        } else {
          delete newErrors.yearLevel;
        }
        break;

      case "status":
        if (!value.trim()) newErrors.status = "Status is required.";
        else delete newErrors.status;
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleClose = () => {
    setFormData({
      applicantId: "",
      programId: "",
      academicYear: "",
      yearLevel: "",
      status: "Active",
    });
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      applicantId: formData.applicantId,
      programId: formData.programId,
      facultyId: faculty.id,
      academicYear: formData.academicYear,
      yearLevel: parseInt(formData.yearLevel),
    };

    if (isUpdateMode) submissionData.status = formData.status;

    await onSave(submissionData);
    handleClose();
  };

  const isFormValid = () => {
    const requiredFields = [
      "applicantId",
      "programId",
      "academicYear",
      "yearLevel",
    ];

    if (isUpdateMode) requiredFields.push("status");

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
            {!isUpdateMode ? "Create New Enrollment" : "Update Enrollment"}
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
                <label htmlFor="applicantId" className={styles.label}>
                  Applicant <span className={styles.required}>*</span>
                </label>
                <select
                  id="applicantId"
                  name="applicantId"
                  value={formData.applicantId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isUpdateMode}
                  className={`${styles.input} ${
                    errors.applicantId ? styles.inputError : ""
                  }`}
                >
                  <option value="">Select an applicant…</option>
                  {applicants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName} — {a.cin}
                    </option>
                  ))}
                </select>
                {errors.applicantId && (
                  <span className={styles.errorMessage}>
                    {errors.applicantId}
                  </span>
                )}
                <div className={styles.helperText}>
                  The applicant must have an accepted application
                </div>
              </div>

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
                  disabled={isUpdateMode}
                  className={`${styles.input} ${
                    errors.programId ? styles.inputError : ""
                  }`}
                >
                  <option value="">Select a program…</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.programId && (
                  <span className={styles.errorMessage}>
                    {errors.programId}
                  </span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="academicYear" className={styles.label}>
                    Academic Year <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={isUpdateMode}
                    className={`${styles.input} ${
                      errors.academicYear ? styles.inputError : ""
                    }`}
                    placeholder="2024/2025"
                    maxLength={9}
                  />
                  {errors.academicYear && (
                    <span className={styles.errorMessage}>
                      {errors.academicYear}
                    </span>
                  )}
                  <div className={styles.helperText}>
                    Format: YYYY/YYYY (e.g., 2024/2025)
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="yearLevel" className={styles.label}>
                    Year Level <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="yearLevel"
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.yearLevel ? styles.inputError : ""
                    }`}
                    placeholder="1"
                    min={1}
                    max={7}
                  />
                  {errors.yearLevel && (
                    <span className={styles.errorMessage}>
                      {errors.yearLevel}
                    </span>
                  )}
                  <div className={styles.helperText}>
                    e.g., 1 for L1, 4 for M1
                  </div>
                </div>
              </div>

              {isUpdateMode && (
                <div className={styles.formGroup}>
                  <label htmlFor="status" className={styles.label}>
                    Status <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${
                      errors.status ? styles.inputError : ""
                    }`}
                  >
                    {ENROLLMENT_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <span className={styles.errorMessage}>{errors.status}</span>
                  )}
                  <div className={styles.helperText}>
                    Active counts toward the one-enrollment rule
                  </div>
                </div>
              )}
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

export default AddAndUpdateEnrollmentModalOpen;