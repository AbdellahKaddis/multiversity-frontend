import React, { useEffect, useState } from 'react';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { PROGRAMS } from '../data/data';
import { useNavigate, useParams } from 'react-router-dom';
import academicProgramApi from '../api/academicProgramApi';
import { toast } from 'react-toastify';
import programCourseApi from '../api/programCourseApi';
import admissionApi from '../api/admissionApi';

export function ProgramDetailsPage() {
  const {programId, universityId, facultyId}= useParams()
  const [program, setProgram] = useState(null)
  const [programCourses, setProgramCourses] = useState([])
  const [currentAdmission, setCurrentAdmission] = useState(null)
    const getProgram = async (programId) => {
      try {
        const { data, status } = await academicProgramApi.getAcademicProgram(programId);
  
        if (status === 200) {
          setProgram(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    const getProgramCourses = async (facultyId, programId) => {
    try {
      const { data, status } =
        await programCourseApi.getAllAssignedCoursesForProgram(
          facultyId,
          programId
        );
      if (status === 200) setProgramCourses(data);
      else
        toast.error("Something went wrong we could not load assigned courses.");
    } catch (error) {
      toast.error(error.message);
    }
  };

const getAdmissions = async (universityId, facultyId, programId) => {
  try {
    const { data, status } = await admissionApi.getAdmissions(universityId, facultyId, programId);
    if (status === 200) {
      const active = data.find(a => new Date(a.endDate) > new Date()) ?? null;
      setCurrentAdmission(active);
    } else {
      toast.error("Something went wrong we could not load admissions.");
    }
  } catch (error) {
    toast.error(error.message);
  }
};
  
    useEffect(()=>{
getProgram(programId)
getProgramCourses(facultyId, programId)
getAdmissions(universityId, facultyId, programId)

},[universityId, programId, facultyId])

const navigate = useNavigate()
  if (!program) {
    return <ErrorState title="Program not found" description="The program you are looking for does not exist."  onRetry={()=> navigate(`/universities/${universityId}/programs`)}/>
  }

    const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

  return (
    <>

  <PageHeader
    title={program.name}
    subtitle={`${program.degreeName} · ${program.facultyName}`}
  />

  <section className="section">
    <div className="container">

      {/* Back navigation */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to Programs
      </button>

      {/* Program introduction */}
      <div className="program-detail-header">

        <div className="program-detail-info">
          <p className="program-description">
            {program.description || "description Not set"}
          </p>

          <div className="program-detail-meta">
            <div className="meta-item">
              <strong>Degree</strong>
              <span>{program.degreeName}</span>
            </div>

            <div className="meta-item">
              <strong>Faculty</strong>
              <span>{program.facultyName}</span>
            </div>

            <div className="meta-item">
              <strong>Duration</strong>
              <span>{program.durationInYears} Years</span>
            </div>
          </div>
        </div>

        <div className="program-detail-action">
          <Button
            variant="accent"
            size="lg"
            block
             isDisabled={!currentAdmission}
             onClick={()=> { currentAdmission ? navigate('/signup/student') : '' }}
          >
            {currentAdmission ? "Apply Now ": "Application Closed"}
          </Button>
        </div>

      </div>

      {/* Admission details — NEW */}
      {currentAdmission && (
        <div className="program-admission-details">

          <h3 className="program-section-title">
            Admission Details
          </h3>

          {/* Application period */}
          <div className="admission-meta">
            <div className="meta-item">
              <strong>Application Period</strong>
              <span>
                {formatDate(currentAdmission.startDate)} → {formatDate(currentAdmission.endDate)}
              </span>
            </div>
          </div>

          {/* Process */}
          {currentAdmission.process && (
            <div className="admission-process">
              <strong>Process</strong>
              <p>{currentAdmission.process}</p>
            </div>
          )}

          {/* Requirements */}
          {currentAdmission.requirements?.length > 0 && (
            <div className="admission-requirements">
              <strong>Requirements</strong>
              <ul>
                {currentAdmission.requirements.map(r => (
                  <li key={r.id}>
                    <span className="requirement-name">{r.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* Program structure */}
      <div className="program-structure">

        <h3 className="program-section-title">
          Program Structure
        </h3>

        {Object.entries(
          programCourses.reduce((acc, pc) => {
            const semester = pc.semester;

            if (!acc[semester]) {
              acc[semester] = [];
            }

            acc[semester].push(pc.course);

            return acc;
          }, {})
        ).map(([semester, courses]) => (
          <div key={semester} className="semester-block">

            <h4>Semester {semester}</h4>

            <ul>
              {courses.map(course => (
                <li key={course.id}>
                  <span className="course-code">
                    {course.code}
                  </span>

                  <span className="course-title">
                    {course.title}
                  </span>
                </li>
              ))}
            </ul>

          </div>
        ))}

      </div>

    </div>
  </section>
</>

  );
}