import React, { useEffect, useState } from "react";
import styles from "../Faculties/AddFacultyModal.module.css";
import { toast } from "react-toastify";
import courseApi from "../../api/courseApi";

const AddCourseToProgramModal = ({
  isOpen,
  onClose,
  faculty,
  assignedCourses,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    courseId: "",
    semester: "",
  });
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const getAllCourses = async (facultyId) => {
    try {
      const { data, status } = await courseApi.getAllCourses(facultyId);
      if (status === 200) setCourses(data);
      else toast.error("Something went wrong we could not load courses.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getAllCourses(faculty.id);
  }, []);

  //show only courses that are not assigned to this program

  const unAssignedCourses = courses.filter(
    (course) => !assignedCourses.map((ac) => ac.courseId).includes(course.id)
  );
  const validateField = async (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "courseId":
        if (!value.trim()) {
          newErrors.courseId = "Course is required.";
        } else {
          delete newErrors.courseId;
        }
        break;
      case "semester":
        if (!value.trim()) {
          newErrors.semester = "Semester is required.";
        } else {
          delete newErrors.semester;
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
      courseId: "",
      semester: "",
    });
    setErrors({});
    onClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      courseId: formData.courseId,
      semester: parseInt(formData.semester),
    };
    await onSave(submissionData);
    handleClose();
  };
  const isFormValid = () => {
    const requiredFields = ["courseId", "semester"];
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
          <h2 className={styles.modalTitle}>Add Courses to Program</h2>
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
                <label htmlFor="courseId" className={styles.label}>
                  Course <span className={styles.required}>*</span>
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.select} ${
                    errors.courseId ? styles.inputError : ""
                  }`}
                >
                  <option value="" disabled>Select Course</option>
                  {unAssignedCourses.map((course) => (
          
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.title}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <span className={styles.errorMessage}>{errors.courseId}</span>
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="semester" className={styles.label}>
                  Semester <span className={styles.required}>*</span>
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.select} ${
                    errors.semester ? styles.inputError : ""
                  }`}
                >
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <span className={styles.errorMessage}>{errors.semester}</span>
                )}
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
export default AddCourseToProgramModal;
