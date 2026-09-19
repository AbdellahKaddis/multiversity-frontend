import { useEffect, useState } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { FacultyCard } from "../components/university/FacultyCard";
import { EmptyState } from "../components/common/EmptyState";
import { toast, ToastContainer } from "react-toastify";
import facultyApi from "../api/facultyApi";
import { useParams } from "react-router-dom";

export function FacultiesPage() {
  const { universityId } = useParams();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFaculties = async (universityId) => {
    setLoading(true);
    try {
      const { data, status } = await facultyApi.getFaculties(universityId);
      if (status === 200) setFaculties(data);
      else toast.error("Something went wrong we could not load faculties.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (universityId) {
      getFaculties(universityId);
    } else {
      setLoading(false);
    }
  }, [universityId]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <PageHeader
        title="Our Faculties"
        subtitle="Explore our academic faculties and discover your passion."
      />

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading faculties…</p>
            </div>
          ) : faculties.length === 0 ? (
            <EmptyState
              title="No faculties"
              description="No faculties found for this university."
            />
          ) : (
            <div className="faculties-grid">
              {faculties.map((f) => (
                <FacultyCard key={f.id} faculty={f} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}