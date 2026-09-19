import React, { useEffect, useState } from "react";
import { Tabs } from "../components/common/Tabs";
import { PageHeader } from "../components/common/PageHeader";
import { ProgramCard } from "../components/university/ProgramCard";
import { AdmissionCard } from "../components/university/AdmissionCard";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { toast, ToastContainer } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";
import facultyApi from "../api/facultyApi";
import academicProgramApi from "../api/academicProgramApi";
import departmentApi from "../api/departmentApi";
import professorApi from "../api/professorApi";
import admissionApi from "../api/admissionApi";

export function FacultyDetailsPage() {
  const { universityId, facultyId } = useParams();
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!universityId || !facultyId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const load = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const results = await Promise.allSettled([
          facultyApi.getFaculty(universityId, facultyId),
          departmentApi.getDepartments(facultyId),
          academicProgramApi.getAcademicPrograms(facultyId),
          professorApi.getAllProfessors(facultyId),
          admissionApi.getAdmissions(universityId, facultyId, null),
        ]);

        const [
          facultyRes,
          departmentsRes,
          programsRes,
          professorsRes,
          admissionsRes,
        ] = results;

        // Faculty is critical — if it fails, show "not found"
        if (facultyRes.status === "fulfilled" && facultyRes.value.status === 200) {
          setFaculty(facultyRes.value.data);
        } else {
          setNotFound(true);
        }

        // The other four are independent — populate what we have
        if (departmentsRes.status === "fulfilled" && departmentsRes.value.status === 200)
          setDepartments(departmentsRes.value.data);
        if (programsRes.status === "fulfilled" && programsRes.value.status === 200)
          setPrograms(programsRes.value.data);
        if (professorsRes.status === "fulfilled" && professorsRes.value.status === 200)
          setProfessors(professorsRes.value.data);
        if (admissionsRes.status === "fulfilled" && admissionsRes.value.status === 200)
          setAdmissions(admissionsRes.value.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [universityId, facultyId]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "departments", label: "Departments" },
    { id: "programs", label: "Programs" },
    { id: "professors", label: "Professors" },
    { id: "admissions", label: "Admissions" },
  ];

  // ---------- Loading ----------
  if (loading) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <section className="section">
          <div className="container">
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading faculty…</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ---------- Not found / error ----------
  if (notFound || !faculty) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <ErrorState
          title="Faculty not found"
          description="The faculty you are looking for does not exist."
          onRetry={() => navigate(`/universities/${universityId}/faculties`)}
        />
      </>
    );
  }

  // ---------- Content per tab ----------
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <p
              style={{
                fontSize: "var(--font-size-md)",
                color: "var(--color-text-muted)",
                lineHeight: "var(--line-height-loose)",
              }}
            >
              {faculty.description || "No description available."}
            </p>

            <div
              style={{
                marginTop: "var(--spacing-lg)",
                display: "flex",
                gap: "var(--spacing-xl)",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong>Code: </strong>
                <span>{faculty.code ?? "—"}</span>
              </div>
              <div>
                <strong>Departments: </strong>
                <span>{faculty.departmentCount ?? 0}</span>
              </div>
              <div>
                <strong>Contact: </strong>
                <span>{faculty.email || "Not available"}</span>
              </div>
            </div>
          </div>
        );

      case "departments":
        return departments.length > 0 ? (
          <div className="dept-list">
            {departments.map((d) => (
              <div key={d.id} className="dept-item">
                <h5>{d.name}</h5>
                <p>{d.description ?? "No description available."}</p>
                <div className="dept-meta">
                  <div>
                    <strong>Department Head:</strong>{" "}
                    {d.departmentHead || "Not assigned"}
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    {d.email ? <a href={`mailto:${d.email}`}>{d.email}</a> : "Not available"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No departments"
            description="No departments found for this faculty."
          />
        );

      case "programs":
        return programs.length > 0 ? (
          <div className="programs-grid">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No programs"
            description="No programs found for this faculty."
          />
        );

      case "professors":
        return professors.length > 0 ? (
          <div className="dept-list">
            {professors.map((p) => (
              <div
                key={p.id}
                className="dept-item"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/universities/${universityId}/faculties/${facultyId}/professors/${p.id}`
                  )
                }
              >
                <h5>{`${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()}</h5>
                <p>{p.grade ?? "—"}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No professors"
            description="No professors listed for this faculty."
          />
        );

      case "admissions":
        return admissions.length > 0 ? (
          <div className="admissions-grid">
            {admissions.map((a) => (
              <AdmissionCard key={a.id} admission={a} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No admissions"
            description="No admissions found for this faculty."
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <PageHeader
        title={faculty.name}
        subtitle={`${faculty.code ?? ""} · ${faculty.departmentCount ?? 0} Departments`}
      />

      <section className="section">
        <div className="container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Faculties
          </button>

          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

          <div className="detail-section">{renderContent()}</div>
        </div>
      </section>
    </>
  );
}