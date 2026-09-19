import styles from './style.module.css';
import {
  FaUserGraduate,
  FaGraduationCap,
  FaBook,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import facultyApi from '../../api/facultyApi';
import academicProgramApi from '../../api/academicProgramApi';
import applicantApi from '../../api/applicantApi';
import applicationApi from '../../api/applicationApi';

const STATUS_META = {
  Submitted:   { label: 'Submitted',    className: 'badgeSubmitted' },
  UnderReview: { label: 'Under Review', className: 'badgeReview' },
  Approved:    { label: 'Approved',     className: 'badgeApproved' },
  Rejected:    { label: 'Rejected',     className: 'badgeRejected' },
  Waitlisted:  { label: 'Waitlisted',   className: 'badgeReview' },
  Accepted:    { label: 'Accepted',     className: 'badgeApproved' },
  Declined:    { label: 'Declined',     className: 'badgeRejected' },
};

const formatRelative = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const UniversityAdminDashboard = () => {
  const university = useSelector((state) => state.university.university);

  const [stats, setStats] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!university?.id) return;

    const load = async () => {
      setLoading(true);
      try {
        const [facultiesRes, programsRes, applicationsRes, studentsRes] =
          await Promise.all([
            facultyApi.getFaculties(university.id),
            academicProgramApi.getAcademicPrograms(null, null, university.id),
            applicationApi.getApplications({ universityId: university.id }),
            applicantApi.getApplicants({
              universityId: university.id,
              status: 'Enrolled',
            }),
          ]);

        const faculties = facultiesRes.status === 200 ? facultiesRes.data : [];
        const programs = programsRes.status === 200 ? programsRes.data : [];
        const applications =
          applicationsRes.status === 200 ? applicationsRes.data : [];
        const students = studentsRes.status === 200 ? studentsRes.data : [];

        const activeApplications = applications.filter(
          (a) => a.status === 'Submitted' || a.status === 'UnderReview'
        ).length;

        setStats([
          {
            title: 'Total Students',
            value: students.length.toLocaleString(),
            icon: <FaUserGraduate />,
          },
          {
            title: 'Faculties',
            value: faculties.length.toLocaleString(),
            icon: <FaGraduationCap />,
          },
          {
            title: 'Academic Programs',
            value: programs.length.toLocaleString(),
            icon: <FaBook />,
          },
          {
            title: 'Active Applications',
            value: activeApplications.toLocaleString(),
            icon: <FaClipboardList />,
          },
        ]);

        const recent = applications
          .slice()
          .sort(
            (a, b) =>
              new Date(b.submittedAt ?? 0) - new Date(a.submittedAt ?? 0)
          )
          .slice(0, 5)
          .map((a) => ({
            id: a.id,
            applicant: a.applicantFullName ?? '—',
            program: a.programName ?? '—',
            submitted: a.submittedAt,
            status: a.status,
          }));

        setRecentApplications(recent);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [university?.id]);

  return (
    <>
      <h1 className={styles['dashboard-title']}>Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className={styles['stats-grid']}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                className={`${styles['stat-card']} ${styles.skeletonCard}`}
                key={i}
              >
                <div className={styles.skeletonLine} style={{ width: '60%' }} />
                <div
                  className={styles.skeletonLine}
                  style={{ width: '40%', height: '28px', marginTop: '16px' }}
                />
                <div
                  className={styles.skeletonLine}
                  style={{ width: '50%', marginTop: '12px' }}
                />
              </div>
            ))
          : stats.map((stat, index) => (
              <div className={styles['stat-card']} key={index}>
                <div className={styles['stat-header']}>
                  <div className={styles['stat-title']}>{stat.title}</div>
                  <div className={styles['stat-icon']}>{stat.icon}</div>
                </div>
                <div className={styles['stat-value']}>{stat.value}</div>
              </div>
            ))}
      </div>

      {/* Recent Applications */}
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>Recent Applications</h2>
      </div>

      <div className={styles['card']}>
        {loading ? (
          <div className={styles.tableEmpty}>
            <div className={styles.spinner} />
            <p>Loading applications…</p>
          </div>
        ) : recentApplications.length === 0 ? (
          <div className={styles.tableEmpty}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>No applications yet</h3>
            <p>Applications from applicants will appear here.</p>
          </div>
        ) : (
          <table className={styles['activity-table']}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Program</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => {
                const meta = STATUS_META[app.status] ?? {
                  label: app.status,
                  className: 'badgeSubmitted',
                };
                return (
                  <tr key={app.id}>
                    <td>
                      <div className={styles['activity-user']}>
                        <div className={styles['user-avatar-sm']}>
                          {(app.applicant ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <span className={styles['activity-detail']}>
                          {app.applicant}
                        </span>
                      </div>
                    </td>
                    <td>{app.program}</td>
                    <td>
                      <span className={styles['activity-time']}>
                        {formatRelative(app.submitted)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles['status-badge']} ${
                          styles[meta.className] || ''
                        }`}
                      >
                        {meta.label}
                      </span>
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

export default UniversityAdminDashboard;