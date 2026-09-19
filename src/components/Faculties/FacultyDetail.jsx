import React, { useEffect, useState } from 'react';
import styles from './FacultiesList.module.css';
import { toast } from 'react-toastify';
import DepartmentsList from '../Departments/departmentsList';
import academicProgramApi from '../../api/academicProgramApi';
import ProgramsList from '../Programs/ProgramsList';
import applicantApi from '../../api/applicantApi';
import { useSelector } from 'react-redux';

const FacultyDetail = ({ faculty, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const university = useSelector(state => state.university.university);
  const [statistics, setStatistics] = useState({
    numberOfDepartments: 0,
    numberOfPrograms: 0,
    numberOfStudents: 0,
  });

  const getFacultyStatistics = async (universityId, facultyId) => {
    try {
      const [programsRes, studentsRes] = await Promise.all([
        academicProgramApi.getAcademicPrograms(facultyId),
        applicantApi.getApplicants({ universityId, facultyId, status: 'Enrolled' }),
      ]);

      setStatistics((prev) => ({
        ...prev,
        numberOfPrograms:
          programsRes.status === 200 ? programsRes.data.length : 0,
        numberOfStudents:
          studentsRes.status === 200 ? studentsRes.data.length : 0,
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (faculty?.id && university?.id) {
      getFacultyStatistics(university?.id, faculty.id);
    }
  }, [faculty?.id, university?.id]);

  return (
    <div className={styles.detailContainer}>
      {/* Header */}
      <div className={styles.detailHeader}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Faculties
        </button>
        <div className={styles.facultyHeader}>
          <div className={styles.facultyHeaderMain}>
            <span className={styles.facultyDetailLogo}>{faculty.logo}</span>
            <div>
              <h1 className={styles.facultyDetailTitle}>{faculty.name}</h1>
              <div className={styles.facultyMeta}>
                <span>{university.name}</span>
                <span>•</span>
                <span>{faculty.city}</span>
                <span>•</span>
                <span>Est. {faculty.established}</span>
              </div>
            </div>
          </div>
          <div className={styles.facultyContact}>
            <div>📧 {faculty.email}</div>
            <div>📞 {faculty.phone || "Not set"}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'departments' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('departments')}
        >
          Departments ({faculty.departmentCount})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'programs' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          Programs ({statistics.numberOfPrograms})
        </button>

      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <h3>Dean Information</h3>
              <div className={styles.deanInfo}>
                <div className={styles.deanAvatar}>👨‍🏫</div>
                <div>
                  <div className={styles.deanName}>{faculty.deanName}</div>
                  <div className={styles.deanTitle}>Dean of Faculty</div>
                </div>
              </div>
            </div>

            <div className={styles.overviewCard}>
              <h3>Quick Stats</h3>
              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{faculty.departmentCount}</span>
                  <span className={styles.statLabel}>Departments</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{statistics.numberOfPrograms}</span>
                  <span className={styles.statLabel}>Programs</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{statistics.numberOfStudents}</span>
                  <span className={styles.statLabel}>Students</span>
                </div>
              </div>
            </div>

            <div className={styles.overviewCard}>
              <h3>Contact Information</h3>
              <div className={styles.contactInfo}>
                <div>📧 {faculty.email}</div>
                <div>📞 {faculty.phone || "Not set"}</div>
                <div>📍 {faculty.city}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className={styles.sectionContent}>
            <DepartmentsList currentFaculty={faculty} setStatistics={setStatistics} />
          </div>
        )}

        {activeTab === 'programs' && (
          <div className={styles.sectionContent}>
            <ProgramsList currentFaculty={faculty} />
          </div>
        )}

      
      </div>
    </div>
  );
};

export default FacultyDetail;