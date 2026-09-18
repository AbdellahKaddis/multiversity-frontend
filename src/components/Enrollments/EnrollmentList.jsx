import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import enrollmentApi from "../../api/enrollmentApi";
import AddAndUpdateEnrollmentModalOpen from "./AddAndUpdateEnrollmentModalOpen";
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

const ENROLLMENT_STATUS = {
  Active:    { className: "statusApproved",   label: "Active" },
  Suspended: { className: "statusUnderReview", label: "Suspended" },
  Graduated: { className: "statusAccepted",   label: "Graduated" },
  Withdrawn: { className: "statusDeclined",   label: "Withdrawn" },
};

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("enrolledAt");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddAndUpdateEnrollmentModalOpen, setIsAddAndUpdateEnrollmentModalOpen] = useState(false);
  const [enrollmentToBeUpdated, setEnrollmentToBeUpdated] = useState(null);

  const faculty = useSelector((state) => state.faculty.faculty);

  const getAllEnrollments = async (facultyId) => {
    try {
      const { data, status } = await enrollmentApi.getEnrollments({ facultyId });
      if (status === 200) setEnrollments(data);
      else toast.error("Something went wrong we could not load enrollments.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createEnrollment = async (data) => {
    try {
      const { status } = await enrollmentApi.createEnrollment(data);
      if (status === 201) toast.success("Enrollment created successfully!");
      else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateEnrollment = async (data) => {
    data.enrollmentId = enrollmentToBeUpdated.id;

    try {
      const { status } = await enrollmentApi.updateEnrollment(data);
      if (status === 204) {
        toast.success("Enrollment updated successfully!");
        setEnrollmentToBeUpdated(null);
      } else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredEnrollments = enrollments.filter((e) => {
    const matchesSearch =
      e.applicantFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.programName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    switch (sortBy) {
      case "studentNumber":
        return (a.studentNumber ?? "").localeCompare(b.studentNumber ?? "");
      case "name":
        return (a.applicantFullName ?? "").localeCompare(b.applicantFullName ?? "");
      case "program":
        return (a.programName ?? "").localeCompare(b.programName ?? "");
      case "enrolledAt":
      default:
        return new Date(b.enrolledAt ?? 0) - new Date(a.enrolledAt ?? 0);
    }
  });

  const handleEdit = (enrollment, e) => {
    e.stopPropagation();
    setEnrollmentToBeUpdated(enrollment);
    setIsAddAndUpdateEnrollmentModalOpen(true);
  };

  const handleDelete = (enrollment, e) => {
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
          const { status } = await enrollmentApi.deleteEnrollment(enrollment.id);
          if (status === 204) {
            toast.success("Enrollment has been deleted successfully!");
            await getAllEnrollments(faculty.id);
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
    if (enrollmentToBeUpdated === null) await createEnrollment(submissionData);
    else await updateEnrollment(submissionData);

    await getAllEnrollments(faculty.id);
  };

  useEffect(() => {
    getAllEnrollments(faculty.id);
  }, [faculty?.id]);

  return (
    <>
      {isAddAndUpdateEnrollmentModalOpen && (
        <AddAndUpdateEnrollmentModalOpen
          isOpen={isAddAndUpdateEnrollmentModalOpen}
          onClose={() => {
            setIsAddAndUpdateEnrollmentModalOpen(false);
            setEnrollmentToBeUpdated(null);
          }}
          enrollmentToBeUpdated={enrollmentToBeUpdated}
          onSave={save}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Enrollments</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsAddAndUpdateEnrollmentModalOpen(true)}
          >
            ➕ Add Enrollment
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by student, number, or program"
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
              {Object.keys(ENROLLMENT_STATUS).map((s) => (
                <option key={s} value={s}>
                  {ENROLLMENT_STATUS[s].label}
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
              <option value="enrolledAt">Newest first</option>
              <option value="studentNumber">Student number</option>
              <option value="name">Applicant name</option>
              <option value="program">Program</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Student Number</th>
              <th>Applicant</th>
              <th>Program</th>
              <th>Academic Year</th>
              <th>Year Level</th>
              <th>Enrolled On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEnrollments.map((enrollment) => {
              const meta = ENROLLMENT_STATUS[enrollment.status] ?? {
                className: "statusSubmitted",
                label: enrollment.status,
              };

              return (
                <tr key={enrollment.id} className={styles.tableRow}>
                  <td className={styles.codeCell}>
                    <span className={styles.facultyCode}>
                      {enrollment.studentNumber ?? "—"}
                    </span>
                  </td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {enrollment.applicantFullName ?? "—"}
                    </div>
                  </td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {enrollment.programName ?? "—"}
                    </div>
                  </td>

                  <td>{enrollment.academicYear ?? "—"}</td>

                  <td>{enrollment.yearLevel ?? "—"}</td>

                  <td>{formatDate(enrollment.enrolledAt)}</td>

                  <td>
                    <span className={styles[meta.className]}>{meta.label}</span>
                  </td>

                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={(e) => handleEdit(enrollment, e)}
                        title="Edit Enrollment"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(enrollment, e)}
                        title="Delete Enrollment"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedEnrollments.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎓</div>
            <h3>No enrollments found</h3>
            <p>Try adjusting your search or add a new enrollment.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default EnrollmentList;