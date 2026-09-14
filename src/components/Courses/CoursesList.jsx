import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import courseApi from "../../api/courseApi";
import AddAndUpdateCourseModalOpen from "./AddAndUpdateCourseModalOpen";
import { useSelector } from "react-redux";
import ProfessorCourseList from "../ProfessorCourses/ProfessorCourseList";
const CoursesList = ({ currentFaculty }) => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
       const [selectedCourse, setSelectedCourse] = useState(null)
  const [sortBy, setSortBy] = useState("title");
  const [isAddAndUpdateCourseModalOpen, setIsAddAndUpdateCourseModalOpen] =
    useState(false);
  const [courseToBeUpdated, setCourseToBeUpdated] = useState(null);
  const faculty =
    currentFaculty || useSelector((state) => state.faculty.faculty);
  const getAllCourses = async (facultyId) => {
    try {
      const { data, status } = await courseApi.getAllCourses(facultyId);
      if (status === 200) setCourses(data);
      else toast.error("Something went wrong we could not load courses.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const createCourse = async (data) => {
    data.facultyId = faculty.id;
    try {
      const { status } = await courseApi.createCourse(data);
      if (status === 201) toast.success("Course created successfully!");
      else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const updateCourse = async (data) => {
    data.courseId = courseToBeUpdated.id;
    try {
      const { status } = await courseApi.updateCourse(data);
      if (status === 204) {
        toast.success("Course updated successfully!");
        setCourseToBeUpdated(null);
      } else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "code":
        return a.code.localeCompare(b.code);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const handleEdit = (course, e) => {
    e.stopPropagation();
    setCourseToBeUpdated(course);
    setIsAddAndUpdateCourseModalOpen(true);
  };

  const handleDelete = (course, e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { status } = await courseApi.deleteCourse(course.id);
          if (status === 204) {
            toast.success("Course has been deleted successfully!");
            await getAllCourses(faculty.id);
          } else {
            toast.error("Something went wrong!");
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };
  const save = async (submissionData) => {
    if (courseToBeUpdated === null) await createCourse(submissionData);
    else await updateCourse(submissionData);

    await getAllCourses(faculty.id);
  };
  useEffect(() => {
    getAllCourses(faculty.id);
  }, []);
  const formatDescription = (description) => {
    if (description.length > 25) return description.slice(0, 25) + "...";
    else return description;
  };

    if (selectedCourse) {
      return (
        <ProfessorCourseList
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
        />
      );}
  return (
    <>
      {isAddAndUpdateCourseModalOpen && (
        <AddAndUpdateCourseModalOpen
          isOpen={isAddAndUpdateCourseModalOpen}
          onClose={() => {
            setIsAddAndUpdateCourseModalOpen(false);
            setCourseToBeUpdated(null);
          }}
          courseToBeUpdated={courseToBeUpdated}
          onSave={save}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.header}>
        
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Courses</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsAddAndUpdateCourseModalOpen(true)}
          >
            ➕ Add Course
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search courses by title, code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterDropdown}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="title">Sort by Title</option>
              <option value="code">Sort by Code</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Code</th>
              <th>Course Title</th>
              <th>Description</th>
              <th>Coefficient</th>
              <th>Credits (ECTS)</th>
              <th>Hours CM</th>
              <th>Hours TD</th>
              <th>Hours TP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCourses.map((course) => (
              <tr key={course.id} className={styles.tableRow} onClick={() => setSelectedCourse(course)}>
                <td className={styles.codeCell}>
                  <span className={styles.facultyCode}>{course.code}</span>
                </td>

                <td className={styles.nameCell}>
                  <div className={styles.facultyName}>{course.title}</div>
                </td>
                <td className={!course.description ? styles.notAssigned : ""}>
                  {course.description === null
                    ? "No description"
                    : formatDescription(course.description)}
                </td>
                <td>{course.coefficient}</td>
                <td>{course.credits}</td>
                <td className={!course.hoursCM ? styles.notAssigned : ""}>
                  {course.hoursCM === null ? "Not set" : course.hoursCM}
                </td>
                <td className={!course.hoursTD ? styles.notAssigned : ""}>
                  {course.hoursTD === null ? "Not set" : course.hoursTD}
                </td>
                <td className={!course.hoursTP ? styles.notAssigned : ""}>
                  {course.hoursTP === null ? "Not set" : course.hoursTP}
                </td>

                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => handleEdit(course, e)}
                      title="Edit Course"
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(course, e)}
                      title="Delete Course"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedCourses.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or add a new course.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CoursesList;
