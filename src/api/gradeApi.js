import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const gradeApi = {
  getGrades: async ({
    enrollmentId,
    courseId,
    academicYear,
    semester,
    session,
    isPublished,
    validated,
  } = {}) => {
    const params = new URLSearchParams();
    if (enrollmentId)  params.append("enrollmentId", enrollmentId);
    if (courseId)      params.append("courseId", courseId);
    if (academicYear)  params.append("academicYear", academicYear);
    if (semester)      params.append("semester", semester);
    if (session)       params.append("session", session);
    if (isPublished !== undefined) params.append("isPublished", isPublished);
    if (validated !== undefined)   params.append("validated", validated);

    const query = params.toString();
    const url = `${baseUrl}grades${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  createGrade: async ({
    enrollmentId,
    courseId,
    academicYear,
    semester,
    session,
    score,
    ProfessorId,
  }) =>
    await apiFetch(`${baseUrl}grades`, {
      method: "POST",
      body: JSON.stringify({
        enrollmentId,
        courseId,
        academicYear,
        semester,
        session,
        score,
        ProfessorId,
      }),
    }),

  updateGrade: async ({
    gradeId,
    academicYear,
    semester,
    session,
    score,
    ProfessorId,
  }) =>
    await apiFetch(`${baseUrl}grades/${gradeId}`, {
      method: "PUT",
      body: JSON.stringify({
        academicYear,
        semester,
        session,
        score,
        ProfessorId,
      }),
    }),

  deleteGrade: async (gradeId) =>
    await apiFetch(`${baseUrl}grades/${gradeId}`, {
      method: "DELETE",
    }),

  publishGrades: async ({ courseId, academicYear, semester, session }) =>
    await apiFetch(`${baseUrl}grades/publish`, {
      method: "POST",
      body: JSON.stringify({ courseId, academicYear, semester, session }),
    }),

  getSemesterResult: async (enrollmentId, semester) => {
    const params = new URLSearchParams();
    params.append("semester", semester);

    const url = `${baseUrl}grades/semester/${enrollmentId}?${params.toString()}`;

    return await apiFetch(url);
  },
};

export default gradeApi;