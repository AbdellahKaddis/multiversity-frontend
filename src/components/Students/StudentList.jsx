import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { toast, ToastContainer } from "react-toastify";
import applicantApi from "../../api/applicantApi";
import { useSelector } from "react-redux";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const STUDENT_STATUS = {
  Enrolled:  { className: "statusApproved",   label: "Enrolled" },
  Graduated: { className: "statusAccepted",   label: "Graduated" },
  Withdrawn: { className: "statusDeclined",   label: "Withdrawn" },
  Suspended: { className: "statusUnderReview", label: "Suspended" },
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("all");

  const faculty = useSelector((state) => state.faculty.faculty);

  const getStudents = async (facultyId) => {
    try {
      const { data, status } = await applicantApi.getApplicants({
        universityId: faculty.universityId,
        facultyId,
        status: "Enrolled",
      });
      if (status === 200) setStudents(data);
      else toast.error("Something went wrong we could not load students.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.massarCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "cin":
        return (a.cin ?? "").localeCompare(b.cin ?? "");
      case "massar":
        return (a.massarCode ?? "").localeCompare(b.massarCode ?? "");
      case "studentNumber":
        return (a.studentNumber ?? "").localeCompare(b.studentNumber ?? "");
      case "enrolledAt":
        return new Date(b.enrolledAt ?? 0) - new Date(a.enrolledAt ?? 0);
      case "name":
      default:
        return (a.fullName ?? "").localeCompare(b.fullName ?? "");
    }
  });

  useEffect(() => {
    if (faculty?.id) getStudents(faculty.id);
  }, [faculty?.id]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Students</h1>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, CIN, Massar, or student number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterDropdown}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All statuses</option>
              {Object.keys(STUDENT_STATUS).map((s) => (
                <option key={s} value={s}>
                  {STUDENT_STATUS[s].label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterDropdown}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="name">Name (A-Z)</option>
              <option value="cin">CIN</option>
              <option value="massar">Massar code</option>
              <option value="studentNumber">Student number</option>
              <option value="enrolledAt">Newest first</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Student Number</th>
              <th>Full Name</th>
              <th>CIN</th>
              <th>Massar Code</th>
              <th>Phone</th>
              <th>Enrolled On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => {
              const meta = STUDENT_STATUS[student.status] ?? {
                className: "statusSubmitted",
                label: student.status,
              };

              return (
                <tr key={student.id} className={styles.tableRow}>
                  <td className={styles.codeCell}>
                    <span className={styles.facultyCode}>
                      {student.studentNumber ?? "—"}
                    </span>
                  </td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {student.fullName ?? "—"}
                    </div>
                  </td>

                  <td>{student.cin ?? "—"}</td>

                  <td>
                    <span className={styles.facultyCode}>
                      {student.massarCode ?? "—"}
                    </span>
                  </td>

                  <td>{student.phone ?? "—"}</td>

                  <td>{formatDate(student.enrolledAt)}</td>

                  <td>
                    <span className={styles[meta.className]}>{meta.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedStudents.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎓</div>
            <h3>No students found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentList;