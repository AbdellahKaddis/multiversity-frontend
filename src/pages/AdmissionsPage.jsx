import { useState, useEffect } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { AdmissionCard } from "../components/university/AdmissionCard";
import { EmptyState } from "../components/common/EmptyState";
import { useSelector } from "react-redux";
import admissionApi from "../api/admissionApi.js";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export function AdmissionsPage() {
  const university = useSelector((state) => state.university.university);
  const { universityId } = useParams();

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAdmissions = async (universityId, facultyId, programId) => {
    setLoading(true);
    try {
      const { data, status } = await admissionApi.getAdmissions(
        universityId,
        facultyId,
        programId
      );
      if (status === 200) setAdmissions(data);
      else toast.error("Something went wrong we could not load admissions.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (universityId) {
      getAdmissions(universityId, null, null);
    } else {
      setLoading(false);
    }
  }, [universityId]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <PageHeader
        title="Admissions"
        subtitle={`Find your path to ${university?.name ?? "our university"}. Explore our programs and start your application.`}
      />

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading admissions…</p>
            </div>
          ) : admissions.length === 0 ? (
            <EmptyState
              title="No admissions"
              description="No admissions found for this university."
            />
          ) : (
            <div className="admissions-grid">
              {admissions.map((a) => (
                <AdmissionCard key={a.id} admission={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}