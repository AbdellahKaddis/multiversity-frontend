import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { toast, ToastContainer } from "react-toastify";
import professorCourseApi from "../../api/professorCourseApi";
import { useSelector } from "react-redux";

const ProfessorCourses = () => {
  const professor = useSelector((state) => state.professor.professor);
  const faculty = useSelector((state) => state.faculty.faculty);

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const getProfessorCourses = async (professorId) => {
    setLoading(true);
    try {
      const { data, status } = await professorCourseApi.getAllProfessorCourses(
        faculty?.id,
        professorId,
        null
      );
      if (status === 200) setCourses(data);
      else toast.error("Something went wrong we could not load your courses.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (professor?.id && faculty?.id) {
      getProfessorCourses(professor.id);
    } else {
      setLoading(false);
    }
  }, [professor?.id, faculty?.id]);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.programName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester =
      semesterFilter === "all" || c.semester === Number(semesterFilter);

    return matchesSearch && matchesSemester;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "code":
        return (a.courseCode ?? "").localeCompare(b.courseCode ?? "");
      case "program":
        return (a.programName ?? "").localeCompare(b.programName ?? "");
      case "students":
        return (b.studentCount ?? 0) - (a.studentCount ?? 0);
      case "title":
      default:
        return (a.courseTitle ?? "").localeCompare(b.courseTitle ?? "");
    }
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>My Courses</h1>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by course, code, or program"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterDropdown}>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All semesters</option>
              <option value="1">S1</option>
              <option value="2">S2</option>
              <option value="3">S3</option>
              <option value="4">S4</option>
              <option value="5">S5</option>
              <option value="6">S6</option>
              <option value="7">M1</option>
              <option value="8">M2</option>
              <option value="9">M3</option>
              <option value="10">M4</option>
            </select>
          </div>

          <div className={styles.filterDropdown}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="title">Sort by Title</option>
              <option value="code">Sort by Code</option>
              <option value="program">Sort by Program</option>
              <option value="students">Most students</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading your courses…</p>
          </div>
        ) : sortedCourses.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <h3>No courses assigned</h3>
            <p>
              You haven't been assigned any courses yet. Contact your faculty
              admin.
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Program</th>
                <th>Semester</th>
                <th>Hours</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map((course) => (
                <tr key={course.id} className={styles.tableRow}>
                  <td className={styles.codeCell}>
                    <span className={styles.facultyCode}>
                      {course.courseCode ?? "—"}
                    </span>
                  </td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {course.courseName ?? "—"}
                    </div>
                    {course.coefficient != null && (
                      <span className={styles.courseMeta}>
                        Coef {course.coefficient} · {course.credits ?? 0} ECTS
                      </span>
                    )}
                  </td>

                  <td className={styles.nameCell}>
                    {course.programName ?? "—"}
                  </td>

                  <td>
                    <span className={styles.semesterBadge}>
                      {course.semester ?? "—"}
                    </span>
                  </td>

                  <td>
                    <div className={styles.hoursRow}>
                      {course.hoursCM > 0 && (
                        <span className={styles.hoursPill}>
                          CM {course.hoursCM}
                        </span>
                      )}
                      {course.hoursTD > 0 && (
                        <span className={styles.hoursPill}>
                          TD {course.hoursTD}
                        </span>
                      )}
                      {course.hoursTP > 0 && (
                        <span className={styles.hoursPill}>
                          TP {course.hoursTP}
                        </span>
                      )}
                      {!course.hoursCM && !course.hoursTD && !course.hoursTP && (
                        <span className={styles.notAssigned}>—</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <span className={styles.countBadge}>
                      {course.studentCount ?? 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ProfessorCourses;