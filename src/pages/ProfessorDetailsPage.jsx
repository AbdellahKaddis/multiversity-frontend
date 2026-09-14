import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { PROFESSORS } from '../data/data';
import { useNavigate, useParams } from 'react-router-dom';
import professorApi from '../api/professorApi';
import { toast } from 'react-toastify';
import professorCourseApi from '../api/professorCourseApi';

export function ProfessorDetailsPage() {
  const {professorId, universityId, facultyId} = useParams()
  const [professor, setProfessor] = useState(null)
const [professorCourses, setProfessorCourses] = useState([]);
  const getProfessor = async (professorId) => {
      try {
        const { data, status } = await professorApi.getProfessor(professorId);
  
        if (status === 200) {
          setProfessor(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
        const getAllProfessorCourses = async (facultyId,professorId) => {
      try {
        const { data, status } =
          await professorCourseApi.getAllProfessorCourses(facultyId,professorId,null);
        if (status === 200) setProfessorCourses(data);
        else
          toast.error("Something went wrong we could not load professor courses.");
      } catch (error) {
        toast.error(error.message);
      }
    };
    useEffect(()=>{
        getProfessor(professorId)
        getAllProfessorCourses(facultyId, professorId)
    })
    const navigate = useNavigate()
  if (!professor) {
    return <ErrorState title="Professor not found" description="The professor you are looking for does not exist." onRetry={() => navigate(`/universities/${universityId}/faculties/`)} />;
  }

  return (
  <>
  <PageHeader
    title={`${professor.firstName} ${professor.lastName}`}
    subtitle={professor.grade}
  />

  <section className="section">
    <div className="container">

      {/* Back navigation */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to Professors
      </button>

      {/* Professor profile */}
      <div className="professor-profile">

        <div className="professor-avatar-wrapper">
          <div className="professor-avatar">
            👨‍🏫
          </div>
        </div>

        <div className="professor-info">

          <div className="professor-grade">
            {professor.grade}
          </div>

          <div className="professor-details">

            <div className="detail-row">
              <div className="item">
                <strong>Department</strong>
                <span>{professor.departmentName}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="item">
                <strong>Email</strong>
                <span>
                  {professor.email ? (
                    <a href={`mailto:${professor.email}`}>
                      {professor.email}
                    </a>
                  ) : (
                    'Not available'
                  )}
                </span>
              </div>
            </div>

          </div>

          {/* Courses */}
          <div className="professor-courses">
            <h4>📚 Courses Taught</h4>

            {professorCourses.length > 0 ? (
              <ul>
                {professorCourses.map((pc) => (
                  <li key={pc.id}>
                    {pc.courseName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No courses currently assigned.</p>
            )}
          </div>

        </div>
      </div>

    </div>
  </section>
</>
  
  );
}