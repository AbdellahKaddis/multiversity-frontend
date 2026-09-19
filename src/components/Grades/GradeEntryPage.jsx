// GradeEntryPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import styles from "./GradeEntryPage.module.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import gradeApi from "../../api/gradeApi";
import enrollmentApi from "../../api/enrollmentApi";
import { useSelector } from "react-redux";
import professorCourseApi from "../../api/professorCourseApi";

const SESSIONS = ["Normale", "Rattrapage"];

const GradeEntryPage = () => {
  const professor = useSelector((state) => state.professor.professor);
  const faculty = useSelector((state) => state.faculty.faculty);

  const [courseId, setCourseId] = useState("");
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [semester, setSemester] = useState("S1");
  const [session, setSession] = useState("Normale");

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});   
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
const uniqueCourses = useMemo(() => {
  const map = new Map();
  courses.forEach((c) => {
    if (!map.has(c.courseId)) map.set(c.courseId, c);
  });
  return Array.from(map.values());
}, [courses]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, status } = await professorCourseApi.getAllProfessorCourses(faculty.id, professor.id, null);
        if (status === 200) setCourses(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (professor?.id && faculty?.id) load();
  }, [professor?.id, faculty?.id]);

  // Load students + existing grades when course/year/semester/session change
  useEffect(() => {
    if (!courseId || !academicYear || !semester || !session) return;

    const load = async () => {
      setLoading(true);
      try {

        const { data: students, status: eStatus } = await enrollmentApi
  .getEnrollmentsForCourse(courseId, academicYear);


        const { data: existingGrades, status: gStatus } = await gradeApi.getGrades({
          courseId,
          academicYear,
          semester,
          session,
        });

        if (eStatus === 200 && gStatus === 200) {
          setStudents(students);

          const map = {};
          students.forEach((e) => {
            const existing = existingGrades.find(
              (g) => g.enrollmentId === e.id
            );
            map[e.id] = {
              id: existing?.id ?? null,
              score: existing?.score ?? "",
              saved: !!existing,
              dirty: false,
            };
          });
          setGrades(map);
        } else {
          toast.error("Something went wrong we could not load grades.");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId, academicYear, semester, session]);

  // Derived stats
  const stats = useMemo(() => {
    const total = students.length;
    const entered = Object.values(grades).filter((g) => g.saved).length;
    const scores = Object.values(grades)
      .map((g) => Number(g.score))
      .filter((n) => !isNaN(n) && n >= 0);
    const average = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : "—";
    const passing = scores.filter((s) => s >= 10).length;
    return { total, entered, average, passing };
  }, [students, grades]);

  // Handle grade input change
  const handleScoreChange = (enrollmentId, value) => {
    if (value === "") {
      setGrades((prev) => ({
        ...prev,
        [enrollmentId]: { ...prev[enrollmentId], score: "", dirty: true },
      }));
      return;
    }

    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 20) return;    // ignore invalid

    setGrades((prev) => ({
      ...prev,
      [enrollmentId]: { ...prev[enrollmentId], score: value, dirty: true },
    }));
  };

  // Save all dirty grades (create or update)
  const handleSave = async () => {
    const dirtyEntries = Object.entries(grades).filter(([, g]) => g.dirty);
    if (dirtyEntries.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setSaving(true);
    try {
      let created = 0, updated = 0;

      for (const [enrollmentId, g] of dirtyEntries) {
        if (g.id) {
          // Update existing
          const { status } = await gradeApi.updateGrade({
            gradeId: g.id,
            academicYear,
            semester,
            session,
            score: Number(g.score),
            ProfessorId: professor.id,
          });
          if (status === 204) updated++;
        } else {
          // Create new
          const { data, status } = await gradeApi.createGrade({
            enrollmentId,
            courseId,
            academicYear,
            semester,
            session,
            score: Number(g.score),
            ProfessorId: professor.id,
          });
          if (status === 201) {
            setGrades((prev) => ({
              ...prev,
              [enrollmentId]: { ...prev[enrollmentId], id: data.id, saved: true, dirty: false },
            }));
            created++;
          }
        }
      }

      // Mark updated rows as saved
      setGrades((prev) => {
        const next = { ...prev };
        dirtyEntries.forEach(([enrollmentId, g]) => {
          if (g.id) next[enrollmentId] = { ...g, saved: true, dirty: false };
        });
        return next;
      });

      toast.success(`Saved ${created + updated} grade(s).`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Publish (make visible to students)
  const handlePublish = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Publish grades?",
      html: `Students will be able to see their grades for <strong>${semester}</strong>.<br/>
             This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16A085",
      cancelButtonColor: "#95A5A6",
      confirmButtonText: "Yes, publish",
    });

    if (!isConfirmed) return;

    try {
      const { status } = await gradeApi.publishGrades({
        courseId,
        academicYear,
        semester,
        session,
      });
      if (status === 204) {
        toast.success("Grades published successfully.");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const dirtyCount = Object.values(grades).filter((g) => g.dirty).length;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Grade Entry</h1>
          {dirtyCount > 0 && (
            <span className={styles.unsavedBadge}>
              {dirtyCount} unsaved change{dirtyCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Course</label>
          <select
            className={styles.filterSelect}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Select a course…</option>
            {uniqueCourses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseCode} — {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Academic Year</label>
          <input
            className={styles.filterSelect}
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="2025/2026"
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Semester</label>
          <select
            className={styles.filterSelect}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option>S1</option>
            <option>S2</option>
            <option>S3</option>
            <option>S4</option>
            <option>S5</option>
            <option>S6</option>
            <option>M1</option>
            <option>M2</option>
            <option>M3</option>
            <option>M4</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Session</label>
          <select
            className={styles.filterSelect}
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            {SESSIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

     {/* Stats */}
{courseId && (
  <div className={styles.statsGrid}>
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>👥</span>
        <span className={styles.statTrend}>Cohort</span>
      </div>
      <span className={styles.statNumber}>{stats.total}</span>
      <span className={styles.statLabel}>Enrolled Students</span>
    </div>

    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>✏️</span>
        <span className={styles.statTrend}>
          {stats.total > 0
            ? `${Math.round((stats.entered / stats.total) * 100)}%`
            : "0%"}
        </span>
      </div>
      <span className={styles.statNumber}>
        {stats.entered}<span className={styles.statDivider}>/</span>{stats.total}
      </span>
      <span className={styles.statLabel}>Grades Entered</span>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{
            width: `${stats.total > 0 ? (stats.entered / stats.total) * 100 : 0}%`,
          }}
        />
      </div>
    </div>

    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>📊</span>
        <span className={styles.statTrend}>/ 20</span>
      </div>
      <span
        className={`${styles.statNumber} ${
          stats.average !== "—" && Number(stats.average) >= 10
            ? styles.statNumberSuccess
            : stats.average !== "—"
            ? styles.statNumberWarning
            : ""
        }`}
      >
        {stats.average}
      </span>
      <span className={styles.statLabel}>Class Average</span>
    </div>

    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>✅</span>
        <span className={styles.statTrend}>
          {stats.entered > 0
            ? `${Math.round((stats.passing / stats.entered) * 100)}%`
            : "0%"}
        </span>
      </div>
      <span className={styles.statNumber}>{stats.passing}</span>
      <span className={styles.statLabel}>Passing</span>
    </div>
  </div>
)}

{/* Table */}
<div className={styles.tableContainer}>
  {!courseId ? (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📚</div>
      <h3>Select a course to begin</h3>
      <p>Choose a course, semester, and session above to load students.</p>
    </div>
  ) : loading ? (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <div className={styles.spinner} />
      </div>
      <h3>Loading students…</h3>
      <p>Fetching enrolled students and existing grades.</p>
    </div>
  ) : (
    <table className={styles.table}>
      <thead className={styles.tableHeader}>
        <tr>
          <th className={styles.colStudent}>Student</th>
          <th className={styles.colGrade}>Grade (/20)</th>
          <th className={styles.colStatus}>Status</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => {
          const g = grades[s.id] ?? {};
          const num = Number(g.score);
          const invalid = g.score !== "" && (isNaN(num) || num < 0 || num > 20);
          const passed = !invalid && g.score !== "" && num >= 10;

          return (
            <tr
              key={s.id}
              className={`${styles.tableRow} ${
                g.dirty ? styles.tableRowDirty : ""
              }`}
            >
              <td className={styles.nameCell}>
                <div className={styles.studentCell}>
                  <span className={styles.studentAvatar}>
                    {(s.applicantFullName ?? "?").charAt(0).toUpperCase()}
                  </span>
                  <div className={styles.studentInfo}>
                    <span className={styles.studentName}>
                      {s.applicantFullName ?? "—"}
                    </span>
                    <span className={styles.studentNumber}>
                      {s.studentNumber ?? "—"}
                    </span>
                  </div>
                </div>
              </td>

              <td className={styles.colGrade}>
                <div className={styles.gradeWrapper}>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={20}
                    value={g.score ?? ""}
                    onChange={(e) => handleScoreChange(s.id, e.target.value)}
                    className={`${styles.gradeInput} ${
                      invalid ? styles.gradeInputError : ""
                    } ${passed ? styles.gradeInputPassed : ""}`}
                    placeholder="—"
                  />
                  {g.score !== "" && !invalid && (
                    <span
                      className={`${styles.gradeHint} ${
                        passed ? styles.gradeHintPassed : styles.gradeHintFailed
                      }`}
                    >
                      {passed ? "Pass" : "Fail"}
                    </span>
                  )}
                </div>
              </td>

              <td className={styles.colStatus}>
                {g.dirty ? (
                  <span className={styles.pillDirty}>● Unsaved</span>
                ) : g.saved ? (
                  <span className={styles.pillSaved}>✓ Saved</span>
                ) : (
                  <span className={styles.pillEmpty}>○ Not graded</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}

  {courseId && !loading && students.length === 0 && (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>🎓</div>
      <h3>No students enrolled</h3>
      <p>No active students match this course.</p>
    </div>
  )}
</div>

{/* Footer actions */}
{courseId && students.length > 0 && (
  <div className={styles.actionBar}>
    <button
      className={styles.secondaryButton}
      onClick={handlePublish}
      disabled={saving || stats.entered === 0}
      title={stats.entered === 0 ? "Enter grades before publishing" : "Publish grades to students"}
    >
      📢 Publish Grades
    </button>

    <div className={styles.actionRight}>
      {dirtyCount > 0 && (
        <span className={styles.dirtyHint}>
          {dirtyCount} unsaved change{dirtyCount > 1 ? "s" : ""}
        </span>
      )}
      <button
        className={styles.primaryButton}
        onClick={handleSave}
        disabled={saving || dirtyCount === 0}
      >
        {saving ? (
          <>
            <span className={styles.spinnerSmall} /> Saving…
          </>
        ) : (
          <>💾 Save Grades{dirtyCount > 0 ? ` (${dirtyCount})` : ""}</>
        )}
      </button>
    </div>
  </div>
)}
    </>
  );
};

export default GradeEntryPage;