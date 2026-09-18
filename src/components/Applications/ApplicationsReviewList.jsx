import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import applicationApi from "../../api/applicationApi";
import { useSelector } from "react-redux";
import ApplicationDetailsModal from "./ApplicationDetailsModal";

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

const STATUS_OPTIONS = [
  "Submitted",
  "UnderReview",
  "Waitlisted",
  "Approved",
  "Rejected",
 "Accepted" ,
  "Declined" 
];

const STATUS_META = {
  Submitted:   { className: "statusSubmitted",   label: "Submitted",    selectClass: "selectSubmitted"   },
  UnderReview: { className: "statusUnderReview", label: "Under Review", selectClass: "selectUnderReview" },
  Waitlisted:  { className: "statusWaitlisted",  label: "Waitlisted",   selectClass: "selectWaitlisted"  },
  Approved:    { className: "statusApproved",    label: "Approved",     selectClass: "selectApproved"    },
  Rejected:    { className: "statusRejected",    label: "Rejected",     selectClass: "selectRejected"    },
  Accepted:    { className: "statusAccepted",    label: "Accepted",     selectClass: "selectAccepted"    },
  Declined:    { className: "statusDeclined",    label: "Declined",     selectClass: "selectDeclined"    },
};

const ApplicationsReviewList = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const faculty = useSelector((state) => state.faculty.faculty);
   const auth = useSelector((state) => state.auth);

  const getAllApplications = async (facultyId) => {
    try {
      const { data, status } = await applicationApi.getApplications({
        facultyId,
      });
      if (status === 200) setApplications(data);
      else toast.error("Something went wrong — we could not load applications.");
    } catch (error) {
      toast.error(error.message);
    }
  };


 const handleChangeStatus = async (application, newStatus) => {
  if (newStatus === application.status) return;

  const { isConfirmed } = await Swal.fire({
    title: "Confirm status change",
    html: `Change status from <strong>${STATUS_META[application.status]?.label ?? application.status}</strong>
           to <strong>${STATUS_META[newStatus]?.label ?? newStatus}</strong>?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#16A085",
    cancelButtonColor: "#95A5A6",
    confirmButtonText: "Yes, update",
  });

  if (!isConfirmed) return;

  try {
    await applicationApi.updateApplicationStatus(application.id, newStatus, auth.user.id);
    toast.success(`Status updated to ${STATUS_META[newStatus]?.label ?? newStatus}.`);
    await getAllApplications(faculty.id);
    setIsDetailsOpen(false);
  } catch (error) {
    toast.error(error.message);
  }
};

  const handleDelete = (application, e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Delete this application?",
      text: "Are you sure. This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C0392B",
      cancelButtonColor: "#95A5A6",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { status } = await applicationApi.deleteApplication(
            application.id
          );
          if (status === 204) {
            toast.success("Application deleted successfully.");
            await getAllApplications(faculty.id);
          } else {
            toast.error("Something went wrong!");
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  const handleRowClick = (application) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.programName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.applicantFullName ?? "").localeCompare(
          b.applicantFullName ?? ""
        );
      case "program":
        return (a.programName ?? "").localeCompare(b.programName ?? "");
      case "status":
        return (a.status ?? "").localeCompare(b.status ?? "");
      case "grade":
        return (b.grade ?? 0) - (a.grade ?? 0); // descending — highest first
      case "submittedAt":
      default:
        return new Date(b.submittedAt ?? 0) - new Date(a.submittedAt ?? 0);
    }
  });

  useEffect(() => {
    if (faculty?.id) getAllApplications(faculty.id);
  }, [faculty?.id]);

  return (
    <>
      {isDetailsOpen && selectedApplication && (
        <ApplicationDetailsModal
          isOpen={isDetailsOpen}
          application={selectedApplication}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedApplication(null);
          }}
          onChangeStatus={(newStatus) =>
            handleChangeStatus(selectedApplication, newStatus)
          }
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Applications Review</h1>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by applicant, program"
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
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s]?.label ?? s}
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
              <option value="submittedAt">Newest first</option>
              <option value="grade">Highest grade</option>
              <option value="name">Applicant name</option>
              <option value="program">Program</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Applicant</th>
              <th>Program</th>
              <th>Grade</th>
              <th>Bac</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedApplications.map((application) => {
              const meta = STATUS_META[application.status] ?? {
                className: "statusSubmitted",
                label: application.status,
              };

              return (
                <tr
                  key={application.id}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(application)}
                >

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {application.applicantFullName ?? "—"}
                    </div>
                  </td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {application.programName ?? "—"}
                    </div>
                  </td>

                  <td>{application.grade ?? "—"}</td>

                  <td>
                    {application.bacSerie
                      ? `${application.bacSerie} · ${application.bacYear ?? ""}`
                      : "—"}
                  </td>

                  <td>{formatDate(application.submittedAt)}</td>

                  <td>
                    <span className={styles[meta.className]}>
                      {meta.label}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actionButtons}>
                    <select
      className={`${styles.statusSelect} ${styles[meta.selectClass]}`}
      value={application.status}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => handleChangeStatus(application, e.target.value)}
      title="Change status"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {STATUS_META[s]?.label ?? s}
        </option>
      ))}
    </select>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(application, e)}
                        title="Delete application"
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

        {sortedApplications.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No applications found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationsReviewList;