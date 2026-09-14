import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import professorCourseApi from "../../api/professorCourseApi.js";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import AddAndUpdateProfessorCourseModalOpen from "./AddAndUpdateProfessorCourseModalOpen";
import Swal from "sweetalert2";

const ProfessorCourseList =({ professor=null ,course=null, onBack})=> {
  const [professorCourses, setProfessorCourses] = useState([]);
    const faculty = useSelector((state) => state.faculty.faculty);
      const [searchTerm, setSearchTerm] = useState("");
        const [sortBy, setSortBy] = useState(course? "professorName":"courseName");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [professorCourseToBeUpdated, setProfessorCourseToBeUpdated] = useState(null);
    const getAllProfessorCourses = async (facultyId,professorId,courseId) => {
      try {
        const { data, status } =
          await professorCourseApi.getAllProfessorCourses(facultyId,professorId,courseId);
        if (status === 200) setProfessorCourses(data);
        else
          toast.error("Something went wrong we could not load professor courses.");
      } catch (error) {
        toast.error(error.message);
      }
    };
  
    const assignProfessorToCourse = async (data) => {
      try {
        const { datapc, status } = await professorCourseApi.assignProfessorToCourse(data);
        if (status === 201) toast.success("Course assigned to Professor successfully!");
        else toast.error(datapc.Message);
      } catch (error) {
        toast.error(error.message);
      }
    };
      const updateProfessorCourse = async (data) => {
    data.professorCourseId = professorCourseToBeUpdated.id;
    try {
      const { datapc , status } = await professorCourseApi.updateProfessorCourse(data);
      if (status === 204) {
        toast.success("Professor Course updated successfully!");
        setProfessorCourseToBeUpdated(null);
      } else toast.error(datapc.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
    useEffect(() => {
      
      if(professor)
        getAllProfessorCourses(faculty.id,professor.id, null);
      else if (course)
        getAllProfessorCourses(faculty.id, null, course.id);
      else getAllProfessorCourses(faculty.id);
    }, []);
    const save = async (submissionData) => {

     if (professorCourseToBeUpdated === null) await assignProfessorToCourse(submissionData);
    else await updateProfessorCourse(submissionData);
  
      if(professor)
        getAllProfessorCourses(faculty.id,professor.id, null);
      else if (course)
        getAllProfessorCourses(faculty.id, null, course.id);
      else getAllProfessorCourses(faculty.id);
    };

      const filteredProfessorCourses = professorCourses.filter(
    (professorCourse) =>
      professorCourse.professorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professorCourse.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professorCourse.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) 
     );

  const sortedProfessorCourses = [...filteredProfessorCourses].sort((a, b) => {
    switch (sortBy) {
      case "professorName":
        return a.professorName.localeCompare(b.professorName);
        case "academicYear":
        return a.academicYear.localeCompare(b.academicYear);
      default:
        return a.courseName.localeCompare(b.courseName);
    }
  });

  const handleEdit = ( e,professorCourse) => {
    e.stopPropagation();
    setProfessorCourseToBeUpdated(professorCourse);
    setIsModalOpen(true);
  };
    const handleDelete = (e, professorCourse) => {

      
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
            const { data, status } = await professorCourseApi.deleteProfessorCourse(
              professorCourse.id
            );
            if (status === 204) {
              toast.success("Professor Course assignment has been deleted successfully!");
              await getAllProfessorCourses(faculty.id);
            } else {
              toast.error(data.Message);
            }
          } catch (error) {
            toast.error(error.message);
          }
        }
      });
    };
    return (
<>
{isModalOpen && (
        <AddAndUpdateProfessorCourseModalOpen
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setProfessorCourseToBeUpdated(null);
          }}
          professorCourseToBeUpdated={professorCourseToBeUpdated}
          onSave={save}
          professor={professor}
          course={course}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.header}>
        {professor &&  <button className={styles.backButton} onClick={onBack}>
                  ← Back to Professors
                </button>}
                        {course &&  <button className={styles.backButton} onClick={onBack}>
                  ← Back to Courses
                </button>}
        <div className={styles.headerMain}>
           
                        {course && <div><h1 className={styles.facultyDetailTitle}>
                          {course.title} ({course.code})
                        </h1>
                        <p>Manage professors assigned to this course</p>
                      </div>}

                       {professor && <div><h1 className={styles.facultyDetailTitle}>
                          {"Pr. "+professor.firstName+" " + professor.lastName} 
                        </h1>
                        <p>Manage courses assigned to this professor</p>
                      </div>}
          {(!professor && !course) && <h1 className={styles.pageTitle}>Professor Course Assignments</h1>}
          <button
            className={styles.primaryButton}
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Add Course To Professor
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder={`Search professors by ${!professor ?"Professor,":""} ${!course ? "Course,":""} Academic Year`}
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
               {!professor && <option value="professorName">Sort by Professor</option>}
              {!course && <option value="courseName">Sort by Course</option>}
               <option value="academicYear">Sort by Academic Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              {!professor &&<th>Professor</th>}
              {!course&&<th>Course</th>}
             {(!professor && !course) &&  <th>Code</th>}
              <th>Academic Year</th>
              <th>Teaching Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProfessorCourses.map((professorCourse) => (
              <tr key={professorCourse.id} className={styles.tableRow}>
                 {!professor && 
                <td className={styles.nameCell}>
                  <div className={styles.facultyName}>
                    {professorCourse.professorName}
                  </div>
                </td>}
                               {!course&&<td className={styles.nameCell}>
                  <div className={styles.facultyName}>{professorCourse.courseName}</div>
                </td>}

                {(!professor && !course) && 
                <td className={styles.codeCell}>
                  <span className={styles.facultyCode}>{professorCourse.courseCode}</span>
                </td>
                }

                
    
                <td>{professorCourse.academicYear}</td>
                 <td>{professorCourse.teachingType}</td>

                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => handleEdit(e, professorCourse)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(e, professorCourse)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedProfessorCourses.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No course assigned to professors </h3>
            <p>Try adjusting your search or assign course to professor.</p>
          </div>
        )}
      </div>
</>
    );
}

export default ProfessorCourseList