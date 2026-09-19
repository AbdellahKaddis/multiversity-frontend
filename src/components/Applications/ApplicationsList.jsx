import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import applicationApi from "../../api/applicationApi";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";

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

const STATUS_STYLES = {
  Submitted:   { className: "statusSubmitted",   label: "Submitted" },
  UnderReview: { className: "statusUnderReview", label: "Under Review" },
  Approved:    { className: "statusApproved",    label: "Approved" },
  Accepted:    { className: "statusAccepted",    label: "Accepted" },
  Rejected:    { className: "statusRejected",    label: "Rejected" },
  Declined:    { className: "statusDeclined",    label: "Declined" },
  Waitlisted:  { className: "statusWaitlisted",  label: "Waitlisted" },
};

const ApplicationsList = () => {
  const applicant = useSelector((state) => state.applicant.applicant);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getApplicantApplications = async (applicantId) => {
    setLoading(true);
    try {
      const { data, status } = await applicationApi.getApplications({ applicantId });
      if (status === 200) setApplications(data);
      else toast.error("Something went wrong we could not load applications.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicant?.id) getApplicantApplications(applicant.id);
    else setLoading(false);
  }, [applicant?.id]);

  const handleAccept = async (applicationId) => {
    try {
      await applicationApi.updateApplicationStatus(applicationId, "Accepted");
      toast.success("Application accepted.");
      getApplicantApplications(applicant.id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDecline = async (applicationId) => {
    try {
      await applicationApi.updateApplicationStatus(applicationId, "Declined");
      toast.success("Application declined.");
      getApplicantApplications(applicant.id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownloadReceipt = (application) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(22, 160, 133);
    doc.rect(0, 0, pageWidth, 90, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("APPLICATION RECEIPT", 40, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("MultiVersity — Official Document", 40, 68);

    doc.setTextColor(44, 62, 80);
    doc.setFontSize(12);

    let y = 140;
    const left = 40;
    const right = pageWidth - 40;
    const lineHeight = 24;

    const row = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, left, y);

      doc.setFont("helvetica", "normal");
      doc.text(String(value ?? "—"), left + 160, y);

      y += lineHeight;
    };

    row("Application ID", application.id);
    row("Program",        application.programName);
    row("Faculty",        application.facultyName);
    row("Submitted on",   formatDate(application.submittedAt));
    row("Status",         application.status);

    y += 10;
    doc.setDrawColor(224, 224, 224);
    doc.line(left, y, right, y);
    y += 30;

    doc.setFontSize(11);
    doc.setTextColor(127, 140, 141);
    doc.text(
      "Keep this receipt for your records. Present it if you contact the admissions office.",
      left,
      y,
      { maxWidth: right - left }
    );

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleString("en-GB")}`,
      left,
      doc.internal.pageSize.getHeight() - 30
    );

    doc.save(`application-receipt-${application.id}.pdf`);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Applications</h1>
          <Link to={"/student/applications/apply"}>
            <button className={styles.primaryButton}>➕ Apply</button>
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading your applications…</p>
          </div>
        ) : applications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No applications found</h3>
            <p>Apply for a program.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Program Name</th>
                <th>Faculty Name</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const statusStyle =
                  STATUS_STYLES[application.status] ?? {
                    className: "statusSubmitted",
                    label: application.status,
                  };
                const canRespond = application.status === "Approved";

                return (
                  <tr key={application.id} className={styles.tableRow}>
                    <td className={styles.nameCell}>
                      <div className={styles.facultyName}>
                        {application.programName}
                      </div>
                    </td>
                    <td className={styles.nameCell}>
                      <div className={styles.facultyName}>
                        {application.facultyName}
                      </div>
                    </td>
                    <td>{formatDate(application.submittedAt)}</td>

                    <td>
                      <span className={styles[statusStyle.className]}>
                        {statusStyle.label}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleDownloadReceipt(application)}
                          title="Download receipt"
                        >
                          ⬇️ Receipt
                        </button>

                        {canRespond && (
                          <>
                            <button
                              className={styles.acceptButton}
                              onClick={() => handleAccept(application.id)}
                              title="Accept offer"
                            >
                              ✔ Accept
                            </button>
                            <button
                              className={styles.declineButton}
                              onClick={() => handleDecline(application.id)}
                              title="Decline offer"
                            >
                              ✖ Decline
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ApplicationsList;