import React, { useEffect, useState } from 'react';
import { Tabs } from '../components/common/Tabs';
import { PageHeader } from '../components/common/PageHeader';
import { ProgramCard } from '../components/university/ProgramCard';
import { AdmissionCard } from '../components/university/AdmissionCard';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

import { Link, useNavigate, useParams } from 'react-router-dom';
import facultyApi from '../api/facultyApi';
import { toast } from 'react-toastify';
import academicProgramApi from '../api/academicProgramApi';
import departmentApi from '../api/departmentApi';
import professorApi from '../api/professorApi';
import admissionApi from '../api/admissionApi';

export function FacultyDetailsPage() {
  const { universityId, facultyId } = useParams();
const [faculty, setFaculty] = useState(null);
const [programs, setPrograms] = useState([]);
const [departments, setDepartments] = useState([]);
const [professors, setProfessors] = useState([]);
const [admissions,setAdmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const getFaculty = async (universityId, facultyId) => {
    try {
      const { data, status } = await facultyApi.getFaculty(universityId, facultyId);

      if (status === 200) {
        setFaculty(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
    const getDepartments = async (facultyId) => {
      try {
        const { data, status } = await departmentApi.getDepartments(facultyId);
        if (status === 200) setDepartments(data);
        else toast.error("Something went wrong we could not load departments.");
      } catch (error) {
        toast.error(error.message);
      }
    };
    const getPrograms = async (facultyId = null, departmentId = null) => {
    try {
      const { data, status } = await academicProgramApi.getAcademicPrograms(
        facultyId,
        departmentId
      );

      if (status === 200) setPrograms(data);
      else toast.error("Something went wrong we could not load programs.");
    } catch (error) {
      toast.error(error.message);
    }
  };
    const getAllProfessors = async (facultyId) => {
      try {
        const { data, status } = await professorApi.getAllProfessors(facultyId);
        if (status === 200) setProfessors(data);
        else toast.error("Something went wrong we could not load professors.");
      } catch (error) {
        toast.error(error.message);
      }
    };
     const getAdmissions = async(universityId, facultyId, programId)=>{
        try{
          const { data, status } = await admissionApi.getAdmissions(universityId, facultyId, programId);
          if(status === 200)
            setAdmissions(data);
          else
            toast.error("Something went wrong we could not load admissions.");
        }catch(error){
          toast.error(error.message);
        }
    };
  useEffect(()=>{
    getFaculty(universityId, facultyId)
    getDepartments(facultyId)
    getPrograms(facultyId)
    getAllProfessors(facultyId)
    getAdmissions(universityId, facultyId, null)
  },[universityId, facultyId])



  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'departments', label: 'Departments' },
    { id: 'programs', label: 'Programs' },
    { id: 'professors', label: 'Professors' },
     { id: 'admissions', label: 'Admissions' },
  ];
const navigate = useNavigate()
  if (!faculty) {
    return <ErrorState title="Faculty not found" description="The faculty you are looking for does not exist."onRetry={()=> navigate(`/universities/${universityId}/faculties`)} />;
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-loose)' }}>
              {faculty?.description}
            </p>
            <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
              <div><strong>Code: </strong><span>{faculty.code}</span></div>
              <div><strong>Departments: </strong><span>{faculty.departmentCount}</span></div>
              <div><strong>Contact: </strong><span>{faculty.email || 'Not available'}</span></div>
            </div>
          </div>
        );
      case 'departments':
        return  departments.length> 0 ? (
          <div className="dept-list">
            {departments.map((d) => (
              <div key={d.id} className="dept-item">
                <h5>{d.name}</h5>
                <p>{d.description}</p>
                <div className="dept-meta">
    <div>
      <strong>Department Head:</strong> {d.departmentHead || "Not assigned"}
    </div>

    <div>
      <strong>Email:</strong>{" "}
      {d.email ? (
        <a href={`mailto:${d.email}`}>{d.email}</a>
      ) : (
        "Not available"
      )}
    </div>
  </div>
              </div>
            ))}
          </div>
        ) :  <EmptyState title="No departments" description="No departments found for this faculty." />;;
      case 'programs':
        
        return programs.length > 0 ? (
          <div className="programs-grid">
            {programs.map(p => <ProgramCard key={p.id} program={p} />)}
          </div>
        ) : <EmptyState title="No programs" description="No programs found for this faculty." />;
      case 'professors':
        return professors.length > 0 ? (
          <div className="dept-list">
            {professors.map(p => (
              <div key={p.id} className="dept-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/universities/${universityId}/faculties/${facultyId}/professors/${p.id}`)}>
                <h5>{p.firstName + ' ' + p.lastName}</h5>
                <p>{p.grade}</p>
              </div>
            ))}
          </div>
        ) : <EmptyState title="No professors" description="No professors listed for this faculty." />;
        case 'admissions':
        
        return admissions.length > 0 ? (
          <div className="admissions-grid">
                {admissions.map(a => <AdmissionCard key={a.id} admission={a} />)}
              </div>
        ) : <EmptyState title="No admissions" description="No admissions found for this faculty." />;
      default:
        return null;
    }
  };

  return (
    <>
  <PageHeader
  title={faculty.name}
  subtitle={`${faculty.code} · ${faculty.departmentCount} Departments`}
/>

<section className="section">
  <div className="container">

    <button
      className="back-button"
      onClick={() => navigate(-1)}
    >
      ← Back to Faculties
    </button>

    <Tabs
      tabs={tabs}
      active={activeTab}
      onChange={setActiveTab}
    />

    <div className="detail-section">
      {renderContent()}
    </div>

  </div>
</section>
    </>
  );
}