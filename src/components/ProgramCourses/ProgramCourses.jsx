import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import programCourseApi from "../../api/programCourseApi";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import styles2 from "./ProgramCourses.module.css";
import AddCourseToProgramModal from "./AddCourseToProgramModal";
import Swal from "sweetalert2";

const ProgramCourses = ({ program, currentFaculty, onBack }) => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const faculty =
    currentFaculty || useSelector((state) => state.faculty.faculty);

  const getAllAssignedCourses = async (facultyId, programId) => {
    setLoading(true);
    try {
      const { data, status } =
        await programCourseApi.getAllAssignedCoursesForProgram(
          facultyId,
          programId
        );
      if (status === 200) setAssignedCourses(data);
      else toast.error("Something went wrong we could not load assigned courses.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addCourseToProgram = async (data) => {
    try {
      const { status } = await programCourseApi.addCourseToProgram(data);
      if (status === 201) toast.success("Course added successfully!");
      else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (faculty?.id && program?.id) {
      getAllAssignedCourses(faculty.id, program.id);
    } else {
      setLoading(false);
    }
  }, [faculty?.id, program?.id]);

  const save = async (submissionData) => {
    submissionData.programId = program.id;

    await addCourseToProgram(submissionData);

    await getAllAssignedCourses(faculty.id, program.id);
  };

  const handleDelete = (e, programCourse) => {
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
          const { status } = await programCourseApi.deleteCourseFromProgram(
            programCourse.id
          );
          if (status === 204) {
            toast.success("Course has been deleted successfully from program!");
            await getAllAssignedCourses(faculty.id, program.id);
          } else {
            toast.error("Something went wrong!");
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  return (
    <div className={styles.page}>
      {isModalOpen && (
        <AddCourseToProgramModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          faculty={faculty}
          assignedCourses={assignedCourses}
          onSave={save}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Programs
        </button>
        <div className={styles.facultyHeader}>
          <div className={styles.facultyHeaderMain}>
            <div>
              <h1 className={styles.facultyDetailTitle}>
                {program.name} ({program.code})
              </h1>
              <p>Manage courses assigned to this program</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles2.card}>
        <div className={styles2.cardHeader}>
          <h1 className={styles.pageTitle}>Assigned Courses</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Add Course
          </button>
        </div>

        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading assigned courses…</p>
            </div>
          ) : assignedCourses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏛️</div>
              <h3>No courses found</h3>
              <p>Add a new course.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedCourses.map((programCourse) => (
                  <tr key={programCourse.id} className={styles.tableRow}>
                    <td className={styles.codeCell}>
                      <span className={styles.facultyCode}>
                        {programCourse.course?.code ?? "—"}
                      </span>
                    </td>
                    <td className={styles.nameCell}>
                      <div className={styles.facultyName}>
                        {programCourse.course?.title ?? "—"}
                      </div>
                    </td>
                    <td>{programCourse.semester ?? "—"}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(e, programCourse)}
                        title="Delete Course"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramCourses;