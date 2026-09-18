
import React from "react";
import styles from "./ApplicationDetailsModal.module.css";
import { apiUrl } from "../../utils/apiUrl";


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
  Submitted:   { className: "statusSubmitted",   label: "Submitted" },
  UnderReview: { className: "statusUnderReview", label: "Under Review" },
  Waitlisted:  { className: "statusWaitlisted",  label: "Waitlisted" },
  Approved:    { className: "statusApproved",    label: "Approved" },
  Rejected:    { className: "statusRejected",    label: "Rejected" },
  Accepted:    { className: "statusAccepted",    label: "Accepted" },
  Declined:    { className: "statusDeclined",    label: "Declined" },
};

const ApplicationDetailsModal = ({
  isOpen,
  application,
  onClose,
  onChangeStatus,
}) => {
  
  if (!isOpen || !application) return null;

  const meta = STATUS_META[application.status] ?? {
    className: "statusSubmitted",
    label: application.status,
  };

  const applicant = application.applicant ?? {};

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Application Details</h2>
            <p className={styles.modalSubtitle}>
              Reference · {application.id ?? "—"}
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Photo + status */}
          <div className={styles.topRow}>
            <div className={styles.photoBox}>
              {applicant.photoUrl ? (
                <img
                  src={apiUrl(applicant.photoUrl)}
                  alt="Applicant"
                  className={styles.photo}
                />
              ) : (
                <div className={styles.photoPlaceholder}>📷</div>
              )}
            </div>

            <div className={styles.topInfo}>
              <h3 className={styles.applicantName}>
                {application.applicantFullName ?? "—"}
              </h3>
              <p className={styles.applicantProgram}>
                {application.programName ?? "—"} ·{" "}
                {application.facultyName ?? "—"}
              </p>
              <span className={styles[meta.className]}>{meta.label}</span>
            </div>
          </div>

          {/* Personal information */}
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Personal information</h4>
            <div className={styles.grid}>
              <Row label="Date of birth" value={formatDate(applicant.dob)} />
              <Row label="Place of birth" value={applicant.placeOfBirth} />
              <Row
                label="Gender"
                value={applicant.gender === "M" ? "Male" : applicant.gender === "F" ? "Female" : "—"}
              />
              <Row label="CIN" value={applicant.cin} />
              <Row label="Massar code" value={applicant.massarCode} />
              <Row label="Phone" value={applicant.phone} />
            </div>
          </section>

          {/* Academic information */}
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Academic information</h4>
            <div className={styles.grid}>
              <Row label="Bac serie" value={application.bacSerie} />
              <Row label="Bac year" value={application.bacYear} />
              <Row label="Mention" value={application.bacMention} />
              <Row
                label="Grade"
                value={application.grade != null ? `${application.grade} / 20` : "—"}
              />
              <Row label="Submitted on" value={formatDate(application.submittedAt)} />
            </div>
          </section>

          {/* Documents */}
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Documents</h4>

            {application.fileUrl ? (
              <div className={styles.pdfBox}>
                <div className={styles.pdfHeader}>
                  <span className={styles.pdfIcon}>📄</span>
                  <span className={styles.pdfName}>Application documents (PDF)</span>
                  <a
                    className={styles.pdfLink}
                    href={apiUrl(application.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in new tab ↗
                  </a>
                </div>

                <iframe
                  title="Application documents"
                  src={apiUrl(application.fileUrl)}
                  className={styles.pdfViewer}
                />
              </div>
            ) : (
              <p className={styles.emptyDocs}>No documents uploaded.</p>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.statusControl}>
            <label className={styles.statusLabel}>Change status</label>
            <select
              className={styles.statusSelect}
              value={application.status}
              onChange={(e) => {
                const next = e.target.value;
                if (next !== application.status) onChangeStatus(next);
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s]?.label ?? s}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.closeBtnFooter} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value ?? "—"}</span>
  </div>
);

export default ApplicationDetailsModal;