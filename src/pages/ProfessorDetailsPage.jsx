import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { ErrorState } from "../components/common/ErrorState";
import { useNavigate, useParams } from "react-router-dom";
import professorApi from "../api/professorApi";
import professorCourseApi from "../api/professorCourseApi";
import { toast, ToastContainer } from "react-toastify";

export function ProfessorDetailsPage() {
  const { professorId, universityId, facultyId } = useParams();
  const navigate = useNavigate();

  const [professor, setProfessor] = useState(null);
  const [professorCourses, setProfessorCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!professorId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const load = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const results = await Promise.allSettled([
          professorApi.getProfessor(professorId),
          facultyId
            ? professorCourseApi.getAllProfessorCourses(facultyId, professorId, null)
            : Promise.resolve({ status: 200, data: [] }),
        ]);

        const [professorRes, coursesRes] = results;

        // Professor is critical
        if (professorRes.status === "fulfilled" && professorRes.value.status === 200) {
          setProfessor(professorRes.value.data);
        } else {
          setNotFound(true);
        }

        // Courses are optional — populate what we have
        if (coursesRes.status === "fulfilled" && coursesRes.value.status === 200) {
          setProfessorCourses(coursesRes.value.data);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [professorId, facultyId]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <section className="section">
          <div className="container">
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading professor…</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ---------- Not found ----------
  if (notFound || !professor) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <ErrorState
          title="Professor not found"
          description="The professor you are looking for does not exist."
          onRetry={() =>
            navigate(
              universityId
                ? `/universities/${universityId}/faculties/${facultyId ?? ""}`
                : "/universities"
            )
          }
        />
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <PageHeader
        title={`${professor.firstName ?? ""} ${professor.lastName ?? ""}`.trim()}
        subtitle={professor.grade ?? "Professor"}
      />

      <section className="section">
        <div className="container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Professors
          </button>

          <div className="professor-profile">
            <div className="professor-avatar-wrapper">
              <div className="professor-avatar">👨‍🏫</div>
            </div>

            <div className="professor-info">
              <div className="professor-grade">{professor.grade ?? "—"}</div>

              <div className="professor-details">
                <div className="detail-row">
                  <div className="item">
                    <strong>Department</strong>
                    <span>{professor.departmentName ?? "Not assigned"}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="item">
                    <strong>Email</strong>
                    <span>
                      {professor.email ? (
                        <a href={`mailto:${professor.email}`}>{professor.email}</a>
                      ) : (
                        "Not available"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="professor-courses">
                <h4>📚 Courses Taught</h4>

                {professorCourses.length > 0 ? (
                  <ul>
                    {professorCourses.map((pc) => (
                      <li key={pc.id}>{pc.courseName ?? "—"}</li>
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