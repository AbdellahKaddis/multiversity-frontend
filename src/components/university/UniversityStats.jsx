import { useSelector } from "react-redux";
import universityApi from "../../api/universityApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import styles from "./UniversityStats.module.css";

export function UniversityStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const university = useSelector((state) => state.university.university);

  const getStats = async (universityId) => {
    setLoading(true);
    try {
      const { data, status } = await universityApi.getUniversityStatistics(universityId);
      if (status === 200) {
        setStats([
          { number: data.numberOfFaculties ?? 0, label: "Faculties" },
          { number: data.numberOfPrograms ?? 0, label: "Programs" },
          { number: data.numberOfStudents ?? 0, label: "Students" },
          { number: data.numberOfProfessors ?? 0, label: "Professors" },
          {
            number: university?.yearEstablished
              ? new Date().getFullYear() - Number(university.yearEstablished)
              : 0,
            label: "Years of Excellence",
          },
        ]);
      } else {
        toast.error("Something went wrong we could not load statistics.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (university?.id) {
      getStats(university.id);
    } else {
      setLoading(false);
    }
  }, [university?.id]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className={styles.stats}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading statistics…</p>
            </div>
          ) : (
            <div className={styles.statsGrid}>
              {stats.map((s, i) => (
                <div key={i} className={styles.statItem}>
                  <div className={styles.statNumber}>{s.number}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}