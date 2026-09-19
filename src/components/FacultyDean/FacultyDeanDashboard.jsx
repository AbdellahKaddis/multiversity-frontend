import styles from '../UniversityAdmin/style.module.css';
import {
  FaBuilding,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaClipboardList,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import departmentApi from '../../api/departmentApi';
import professorApi from '../../api/professorApi';
import academicProgramApi from '../../api/academicProgramApi';
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

const FacultyDeanDashboard = () => {
  const faculty = useSelector((state) => state.faculty.faculty);

  const [stats, setStats] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!faculty?.id) return;

    const load = async () => {
      setLoading(true);
      try {
        const [
          departmentsRes,
          professorsRes,
          programsRes,
          applicationsRes,
        ] = await Promise.all([
          departmentApi.getDepartments(faculty.id),
          professorApi.getAllProfessors(faculty.id),
          academicProgramApi.getAcademicPrograms(faculty.id),
          applicationApi.getApplications({ facultyId: faculty.id }),
        ]);

        const departments =
          departmentsRes.status === 200 ? departmentsRes.data : [];
        const professors =
          professorsRes.status === 200 ? professorsRes.data : [];
        const programs =
          programsRes.status === 200 ? programsRes.data : [];
        const applications =
          applicationsRes.status === 200 ? applicationsRes.data : [];

        const activeApplications = applications.filter(
          (a) => a.status === 'Submitted' || a.status === 'UnderReview'
        ).length;

        setStats([
          {
            title: 'Departments',
            value: departments.length.toLocaleString(),
            icon: <FaBuilding />,
          },
          {
            title: 'Professors',
            value: professors.length.toLocaleString(),
            icon: <FaChalkboardTeacher />,
          },
          {
            title: 'Academic Programs',
            value: programs.length.toLocaleString(),
            icon: <FaGraduationCap />,
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
  }, [faculty?.id]);

  return (
    <>
      <h1 className={styles['dashboard-title']}>
        {faculty?.name ? `${faculty.name} — Overview` : 'Dashboard Overview'}
      </h1>

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
            <p>Applications to your faculty will appear here.</p>
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

export default FacultyDeanDashboard;