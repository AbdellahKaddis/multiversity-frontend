import React, { useEffect, useState } from "react";
import styles from "../Faculties/AddFacultyModal.module.css";
import courseApi from "../../api/courseApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import professorApi from "../../api/professorApi";

const AddAndUpdateProfessorCourseModalOpen = ({
  isOpen,
  onClose,
  professorCourseToBeUpdated,
  onSave,
  professor,
  course
})=>{
const [formData, setFormData] = useState({
    professorId: "",
    courseId: "",
    teachingType: "",
    academicYear: "",
  });
  const [errors, setErrors] = useState({});
  const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);
  const faculty = useSelector((state) => state.faculty.faculty);
  const getProfessors = async (facultyId) => {
    try {
      const { data, status } = await professorApi.getAllProfessors(facultyId);
      if (status === 200) setProfessors(data);
      else toast.error("Something went wrong we could not load professors.");
    } catch (error) {
      toast.error(error.message);
    }
  };
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
    if(!professor)
      getProfessors(faculty.id);

    setFormData({...formData, professorId: professor ? professor.id : ""})
    if(!course)
          getAllCourses(faculty.id)

     setFormData({...formData, courseId: course ? course.id : ""})
    if (professorCourseToBeUpdated != null) {
      const {
    professorId,
    courseId,
    teachingType,
    academicYear,
      } = professorCourseToBeUpdated;
      setFormData({
       professorId,
    courseId,
    teachingType,
    academicYear,
      });
    }
  }, []);
  const teachingTypes = ["CM", "TD", "TP"];
  const currentYear = new Date().getFullYear();
  const recentAcademicYears = [`${currentYear}/${currentYear+1}`,`${currentYear-1}/${currentYear}`]
  const validateField = async (name, value) => {
    const newErrors = { ...errors };

    if(name ==="professorId" && professor)
      return;

        if(name ==="courseId" && course)
          return;
    switch (name) {

      case "professorId":
        if (!value.trim()) {
          newErrors.professorId = "Professor is required.";
        } else {
          delete newErrors.professorId;
        }
        break;
      case "courseId":
        if (!value.trim()) {
          newErrors.courseId = "Course is required.";
        } else {
          delete newErrors.courseId;
        }
        break;

      case "teachingType":
        if (!value.trim()) {
          newErrors.teachingType = "Teaching Type is required.";
        } else {
          delete newErrors.teachingType;
        }
        break;
      case "academicYear":
        if (!value.trim()) {
          newErrors.academicYear = "Academic Year is required.";
        } else {
          delete newErrors.academicYear;
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
professorId: "",
    courseId: "",
    teachingType: "",
    academicYear: "",
    });
    setErrors({});
    onClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["professorId",
      "courseId",
      "teachingType",
      "academicYear",];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submissionData = {
      ...formData
    };
    
    await onSave(submissionData);
    handleClose();
  };
  const isFormValid = () => {
    const requiredFields = [
     "professorId",
      "courseId",
      "teachingType",
      "academicYear",
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
            {!professorCourseToBeUpdated
              ? "Assign Course To Professor"
              : "Update Professor Course Assignment"}
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
               {!professor && 
                <div className={styles.formGroup}>
                  <label htmlFor="professorId" className={styles.label}>
                    Professor <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="professorId"
                    name="professorId"
                    value={formData.professorId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Select Professor
                    </option>
                    {professors.map((professor) => (
                      <option value={professor.id} key={professor.id}>
                        {professor.firstName +" " +professor.lastName}
                      </option>
                    ))}
                  </select>
                  {errors.professorId && (
                    <span className={styles.errorMessage}>
                      {errors.professorId}
                    </span>
                  )}
                </div>
               }

                               {!course &&<div className={styles.formGroup}>
                  <label htmlFor="courseId" className={styles.label}>
                    Course <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Select Course
                    </option>
                    {courses.map((course) => (
                      <option value={course.id} key={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <span className={styles.errorMessage}>
                      {errors.courseId}
                    </span>
                  )}
                </div>}


              </div>
    <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="teachingType" className={styles.label}>
                    Teaching Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="teachingType"
                    name="teachingType"
                    value={formData.teachingType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Select Teaching Type
                    </option>
                    {teachingTypes.map((type, index) => (
                      <option value={type} key={index}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.teachingType && (
                    <span className={styles.errorMessage}>{errors.teachingType}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="academicYear" className={styles.label}>
                    Academic Year <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Select Academic Year
                    </option>
                    {recentAcademicYears.map((ay, index) => (
                      <option value={ay} key={index}>
                        {ay}
                      </option>
                    ))}
                  </select>
                  {errors.academicYear && (
                    <span className={styles.errorMessage}>{errors.academicYear}</span>
                  )}
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
export default AddAndUpdateProfessorCourseModalOpen;