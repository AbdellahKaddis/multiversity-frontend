import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { ProgramCard } from "../components/university/ProgramCard";
import { EmptyState } from "../components/common/EmptyState";
import { useParams } from "react-router-dom";
import degreeApi from "../api/degreeApi";
import academicProgramApi from "../api/academicProgramApi";
import { toast, ToastContainer } from "react-toastify";

export function ProgramsPage() {
  const { universityId } = useParams();

  const [filter, setFilter] = useState("all");
  const [degrees, setDegrees] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!universityId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          degreeApi.getDegrees(universityId),
          academicProgramApi.getAcademicPrograms(null, null, universityId),
        ]);

        const [degreesRes, programsRes] = results;

        if (degreesRes.status === "fulfilled" && degreesRes.value.status === 200) {
          setDegrees([{ id: "all", name: "all" }, ...degreesRes.value.data]);
        } else {
          toast.error("Something went wrong we could not load degrees.");
        }

        if (programsRes.status === "fulfilled" && programsRes.value.status === 200) {
          setPrograms(programsRes.value.data);
        } else {
          toast.error("Something went wrong we could not load programs.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [universityId]);

  const filtered =
    filter === "all" ? programs : programs.filter((p) => p.degreeName === filter);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <PageHeader
        title="Academic Programs"
        subtitle="Browse our programs by degree level."
      />

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading programs…</p>
            </div>
          ) : (
            <>
              {degrees.length > 0 && (
                <div className="tabs">
                  {degrees.map((d) => (
                    <button
                      key={d.id ?? d.name}
                      className={`tab-btn ${filter === d.name ? "active" : ""}`}
                      onClick={() => setFilter(d.name)}
                    >
                      {d.name === "all" ? "All Programs" : d.name}
                    </button>
                  ))}
                </div>
              )}

              {filtered.length ? (
                <div className="programs-grid">
                  {filtered.map((p) => (
                    <ProgramCard key={p.id} program={p} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No programs found"
                  description="Try selecting a different degree level."
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}