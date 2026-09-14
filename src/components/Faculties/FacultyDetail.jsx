import React, { useEffect, useState } from 'react';
import styles from './FacultiesList.module.css';
import { toast } from 'react-toastify';
import departmentApi from '../../api/departmentApi';
import DepartmentsList from '../Departments/departmentsList';
import academicProgramApi from '../../api/academicProgramApi';
import ProgramsList from '../Programs/ProgramsList';

const FacultyDetail = ({ faculty, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [statistics, setStatistics] = useState({
    numberOfDepartments : 0,
    numberOfPrograms : 0
  });
  // const [departments, setDepartments] = useState([]);
  // const [programs, setPrograms] = useState([]);
  // const getDepartments = async(facultyId)=>{
  //   try{
  //     const { data, status } = await departmentApi.getDepartments(facultyId);
  //     if(status === 200)
  //       setDepartments(data);
  //     else
  //       toast.error("Something went wrong we could not load departments.");
  //     }catch(error){
  //       toast.error(error.message);
  //     }
  //   };
  // const getPrograms = async(facultyId=null, departmentId=null)=>{
  //   try{
  //     const { data, status } = await academicProgramApi.getAcademicPrograms(facultyId, departmentId);
  //     if(status === 200)
  //       setPrograms(data);
  //     else
  //       toast.error("Something went wrong we could not load programs.");
  //     }catch(error){
  //       toast.error(error.message);
  //     }
  //   };
  useEffect(()=>{
    // getDepartments(faculty.id);
    // getPrograms(faculty.id);
  },[]);
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
                <span>{faculty.university}</span>
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
          Departments ({statistics.numberOfDepartments})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'programs' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          Programs ({statistics.numberOfPrograms})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'staff' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff & Students
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
                  <div className={styles.deanName}>{faculty.dean}</div>
                  <div className={styles.deanTitle}>Dean of Faculty</div>
                </div>
              </div>
            </div>
            
            <div className={styles.overviewCard}>
              <h3>Quick Stats</h3>
              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{statistics.numberOfDepartments}</span>
                  <span className={styles.statLabel}>Departments</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{statistics.numberOfPrograms}</span>
                  <span className={styles.statLabel}>Programs</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{faculty.students}</span>
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
            {/* <div className={styles.sectionHeader}>
              <h3>Departments</h3>
              <button className={styles.primaryButton}>+ Add Department</button>
            </div>
            <p>Department management interface would go here...</p> */}
            <DepartmentsList currentFaculty={faculty} setStatistics={setStatistics}/>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className={styles.sectionContent}>
            {/* <div className={styles.sectionHeader}>
              <h3>Academic Programs</h3>
              <button className={styles.primaryButton}>+ Add Program</button>
            </div>
            <p>Program management interface would go here...</p> */}
            <ProgramsList currentFaculty={faculty}/>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className={styles.sectionContent}>
            <h3>Staff & Students Overview</h3>
            <div className={styles.staffStats}>
              <div className={styles.staffStat}>
                <div className={styles.staffNumber}>{faculty.students}</div>
                <div className={styles.staffLabel}>Total Students</div>
              </div>
              <div className={styles.staffStat}>
                <div className={styles.staffNumber}>45</div>
                <div className={styles.staffLabel}>Faculty Members</div>
              </div>
              <div className={styles.staffStat}>
                <div className={styles.staffNumber}>23</div>
                <div className={styles.staffLabel}>Staff Members</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FacultyDetail;