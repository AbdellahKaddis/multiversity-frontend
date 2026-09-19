import React, { useEffect, useState } from "react";
import styles from "./StudentGradesPage.module.css";
import { toast, ToastContainer } from "react-toastify";
import gradeApi from "../../api/gradeApi";
import enrollmentApi from "../../api/enrollmentApi";
import { useSelector } from "react-redux";

const StudentGradesPage = () => {
  const applicant = useSelector((state) => state.applicant.applicant);

  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesterResult, setSemesterResult] = useState(null);

  const [loading, setLoading] = useState(true);

  // ---------- Load student's active enrollments ----------
  useEffect(() => {
    if (!applicant?.id) return;

    const load = async () => {
      try {
        const { data, status } = await enrollmentApi.getEnrollments({
          applicantId: applicant.id,
          status: "Active",
        });
        if (status === 200) {
          setEnrollments(data);
          if (data.length > 0) setSelectedEnrollmentId(data[0].id);
        } else {
          toast.error("Something went wrong we could not load your enrollments.");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [applicant?.id]);

  // ---------- Load available semesters for the selected enrollment ----------
  useEffect(() => {
    if (!selectedEnrollmentId) return;

    const load = async () => {
      try {
        const { data, status } = await gradeApi.getGrades({
          enrollmentId: selectedEnrollmentId,
          isPublished: true,
        });
        if (status === 200) {
          const uniq = [...new Set(data.map((g) => g.semester))].sort();
          setSemesters(uniq);
          if (uniq.length > 0) {
            setSelectedSemester(uniq[uniq.length - 1]);
          } else {
            setSelectedSemester(null);
            setSemesterResult(null);
          }
        } else {
          toast.error("Something went wrong we could not load your grades.");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    load();
  }, [selectedEnrollmentId]);

  // ---------- Load semester result (computed by backend) ----------
  useEffect(() => {
    if (!selectedEnrollmentId || !selectedSemester) return;

    const load = async () => {
      setLoading(true);
      try {
        const { data, status } = await gradeApi.getSemesterResult(
          selectedEnrollmentId,
          selectedSemester
        );
        if (status === 200) {
          setSemesterResult(data);
        } else {
          toast.error("Something went wrong we could not load your grades.");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedEnrollmentId, selectedSemester]);

  const currentEnrollment = enrollments.find(
    (e) => e.id === selectedEnrollmentId
  );

  // ---------- Rattrapage count (courses needing an exam not yet taken) ----------
  const rattrapageCount =
    semesterResult?.courses?.filter(
      (c) => c.needsRattrapage && !c.hasRattrapage
    ).length ?? 0;

  // ---------- Render: not enrolled ----------
  if (!loading && enrollments.length === 0) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>My Grades</h1>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎓</div>
          <h3>Not enrolled yet</h3>
          <p>You'll see your grades here once you're enrolled in a program.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>My Grades</h1>
          {currentEnrollment && (
            <span className={styles.enrollmentBadge}>
              {currentEnrollment.programName} · {currentEnrollment.academicYear}
            </span>
          )}
        </div>
      </div>

      {/* Semester tabs */}
      {semesters.length > 0 && (
        <div className={styles.tabs}>
          {semesters.map((sem) => (
            <button
              key={sem}
              className={`${styles.tab} ${
                sem === selectedSemester ? styles.tabActive : ""
              }`}
              onClick={() => setSelectedSemester(sem)}
            >
              {sem}
            </button>
          ))}
        </div>
      )}

      {/* Rattrapage alert */}
      {rattrapageCount > 0 && (
        <div className={styles.rattrapageAlert}>
          <span className={styles.rattrapageIcon}>⚠️</span>
          <div>
            <strong>Rattrapage required</strong>
            <p>
              You need to sit for the rattrapage exam in {rattrapageCount} course
              {rattrapageCount > 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      )}

      {/* Summary card */}
      {semesterResult && semesterResult.courses.length > 0 && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Semester Average</span>
            <span
              className={`${styles.summaryValue} ${
                semesterResult.average !== null && semesterResult.average >= 10
                  ? styles.valueSuccess
                  : semesterResult.average !== null
                  ? styles.valueWarning
                  : ""
              }`}
            >
              {semesterResult.average !== null
                ? `${semesterResult.average.toFixed(2)} / 20`
                : "—"}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Credits Earned</span>
            <span className={styles.summaryValue}>
              {semesterResult.creditsEarned}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Courses Passed</span>
            <span className={styles.summaryValue}>
              {semesterResult.coursesPassed} / {semesterResult.totalCourses}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Decision</span>
            <span
              className={`${styles.decisionBadge} ${
                semesterResult.decision === "Passed"
                  ? styles.decisionValidated
                  : semesterResult.decision === "Failed"
                  ? styles.decisionAjourne
                  : ""
              }`}
            >
              {semesterResult.decision}
            </span>
          </div>
        </div>
      )}

      {/* Grades table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.spinner} />
            <h3>Loading your grades…</h3>
          </div>
        ) : !semesterResult || semesterResult.courses.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>No published grades yet</h3>
            <p>Your grades for this semester will appear here once published.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Coef</th>
                <th>Credits</th>
                <th>Normale</th>
                <th>Rattrapage</th>
                <th>Final</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {semesterResult.courses.map((course) => (
                <tr key={course.courseId} className={styles.tableRow}>
                  <td className={styles.codeCell}>
                    <span className={styles.facultyCode}>
                      {course.courseCode ?? "—"}
                    </span>
                  </td>

                  <td className={styles.nameCell}>
                    {course.courseName ?? "—"}
                  </td>

                  <td>{course.coefficient}</td>
                  <td>{course.credits}</td>

                  {/* Normale */}
                  <td>
                    <span
                      className={`${styles.scoreValue} ${
                        !course.hasNormal
                          ? styles.scoreEmpty
                          : course.normalScore >= 10
                          ? styles.scorePassed
                          : styles.scoreFailed
                      }`}
                    >
                      {course.hasNormal ? course.normalScore.toFixed(2) : "—"}
                    </span>
                  </td>

                  {/* Rattrapage */}
                  <td>
                    <span
                      className={`${styles.scoreValue} ${
                        !course.hasRattrapage
                          ? styles.scoreEmpty
                          : course.rattrapageScore >= 10
                          ? styles.scorePassed
                          : styles.scoreFailed
                      }`}
                    >
                      {course.hasRattrapage
                        ? course.rattrapageScore.toFixed(2)
                        : "—"}
                    </span>
                  </td>

                  {/* Final */}
                  <td>
                    {course.hasFinal ? (
                      <span
                        className={`${styles.scoreValue} ${styles.scoreFinal} ${
                          course.validated
                            ? styles.scorePassed
                            : styles.scoreFailed
                        }`}
                      >
                        {course.effectiveScore.toFixed(2)}
                      </span>
                    ) : (
                      <span className={styles.scorePending}>—</span>
                    )}
                  </td>

                  {/* Result — driven by validatedBy from backend */}
                  <td>
                    {course.validatedBy === "Normale" ? (
                      <span className={styles.pillPassed}>✓ Validated</span>
                    ) : course.validatedBy === "Rattrapage" ? (
                      <span className={styles.pillValidatedRattrapage}>
                        ✓ Validated après rattrapage
                      </span>
                    ) : course.validatedBy === "Compensation" ? (
                      <span className={styles.pillCompensated}>
                        ✓ Validated par compensation
                      </span>
                    ) : course.needsRattrapage && !course.hasRattrapage ? (
                      <span className={styles.pillRattrapageRequired}>
                        ⚠ Rattrapage required
                      </span>
                    ) : course.hasFinal ? (
                      <span className={styles.pillFailed}>✖ Failed</span>
                    ) : (
                      <span className={styles.pillPending}>⏳ Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info note */}
      {semesterResult && semesterResult.courses.length > 0 && (
        <p className={styles.infoNote}>
          ℹ️ <strong>Final</strong> is the highest score between Normale and
          Rattrapage. Courses below 10 are validated by compensation when the
          semester average is 10 or above.
        </p>
      )}
    </>
  );
};

export default StudentGradesPage;