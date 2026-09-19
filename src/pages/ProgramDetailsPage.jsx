import React, { useEffect, useState } from "react";
import { Button } from "../components/common/Button";
import { PageHeader } from "../components/common/PageHeader";
import { ErrorState } from "../components/common/ErrorState";
import { useNavigate, useParams } from "react-router-dom";
import academicProgramApi from "../api/academicProgramApi";
import programCourseApi from "../api/programCourseApi";
import admissionApi from "../api/admissionApi";
import { toast, ToastContainer } from "react-toastify";

export function ProgramDetailsPage() {
  const { programId, universityId, facultyId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [programCourses, setProgramCourses] = useState([]);
  const [currentAdmission, setCurrentAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!programId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const load = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const results = await Promise.allSettled([
          academicProgramApi.getAcademicProgram(programId),
          facultyId
            ? programCourseApi.getAllAssignedCoursesForProgram(facultyId, programId)
            : Promise.resolve({ status: 200, data: [] }),
          universityId && facultyId
            ? admissionApi.getAdmissions(universityId, facultyId, programId)
            : Promise.resolve({ status: 200, data: [] }),
        ]);

        const [programRes, coursesRes, admissionsRes] = results;

        // Program is critical
        if (programRes.status === "fulfilled" && programRes.value.status === 200) {
          setProgram(programRes.value.data);
        } else {
          setNotFound(true);
        }

        // Courses and admission are optional
        if (coursesRes.status === "fulfilled" && coursesRes.value.status === 200) {
          setProgramCourses(coursesRes.value.data);
        }

        if (admissionsRes.status === "fulfilled" && admissionsRes.value.status === 200) {
          const active =
            admissionsRes.value.data.find((a) => new Date(a.endDate) > new Date()) ?? null;
          setCurrentAdmission(active);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [programId, universityId, facultyId]);

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

  // ---------- Loading ----------
  if (loading) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <section className="section">
          <div className="container">
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading program…</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ---------- Not found ----------
  if (notFound || !program) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <ErrorState
          title="Program not found"
          description="The program you are looking for does not exist."
          onRetry={() =>
            navigate(
              universityId ? `/universities/${universityId}/programs` : "/universities"
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
        title={program.name}
        subtitle={`${program.degreeName ?? ""} · ${program.facultyName ?? ""}`}
      />

      <section className="section">
        <div className="container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Programs
          </button>

          {/* Program introduction */}
          <div className="program-detail-header">
            <div className="program-detail-info">
              <p className="program-description">
                {program.description || "No description available."}
              </p>

              <div className="program-detail-meta">
                <div className="meta-item">
                  <strong>Degree</strong>
                  <span>{program.degreeName ?? "—"}</span>
                </div>

                <div className="meta-item">
                  <strong>Faculty</strong>
                  <span>{program.facultyName ?? "—"}</span>
                </div>

                <div className="meta-item">
                  <strong>Duration</strong>
                  <span>{program.durationInYears ?? "—"} Years</span>
                </div>
              </div>
            </div>

            <div className="program-detail-action">
              <Button
                variant="accent"
                size="lg"
                block
                isDisabled={!currentAdmission}
                onClick={() => {
                  if (currentAdmission) navigate("/signup/student");
                }}
              >
                {currentAdmission ? "Apply Now" : "Application Closed"}
              </Button>
            </div>
          </div>

          {/* Admission details */}
          {currentAdmission && (
            <div className="program-admission-details">
              <h3 className="program-section-title">Admission Details</h3>

              <div className="admission-meta">
                <div className="meta-item">
                  <strong>Application Period</strong>
                  <span>
                    {formatDate(currentAdmission.startDate)} →{" "}
                    {formatDate(currentAdmission.endDate)}
                  </span>
                </div>
              </div>

              {currentAdmission.process && (
                <div className="admission-process">
                  <strong>Process</strong>
                  <p>{currentAdmission.process}</p>
                </div>
              )}

              {currentAdmission.requirements?.length > 0 && (
                <div className="admission-requirements">
                  <strong>Requirements</strong>
                  <ul>
                    {currentAdmission.requirements.map((r) => (
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
            <h3 className="program-section-title">Program Structure</h3>

            {programCourses.length === 0 ? (
              <p className="program-description">
                No courses assigned to this program yet.
              </p>
            ) : (
              Object.entries(
                programCourses.reduce((acc, pc) => {
                  const semester = pc.semester ?? "—";
                  if (!acc[semester]) acc[semester] = [];
                  if (pc.course) acc[semester].push(pc.course);
                  return acc;
                }, {})
              ).map(([semester, courses]) => (
                <div key={semester} className="semester-block">
                  <h4>Semester {semester}</h4>

                  <ul>
                    {courses.map((course) => (
                      <li key={course.id}>
                        <span className="course-code">
                          {course.code ?? "—"}
                        </span>
                        <span className="course-title">
                          {course.title ?? "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}