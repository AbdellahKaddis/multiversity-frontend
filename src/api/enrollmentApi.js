import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const enrollmentApi = {
  getEnrollments: async ({
    applicantId,
    programId,
    universityId,
    facultyId,
    academicYear,
    studentNumber,
    status,
    yearLevel,
  } = {}) => {
    const params = new URLSearchParams();
    if (applicantId)   params.append("applicantId", applicantId);
    if (programId)     params.append("programId", programId);
    if (universityId)  params.append("universityId", universityId);
    if (facultyId)     params.append("facultyId", facultyId);
    if (academicYear)  params.append("academicYear", academicYear);
    if (studentNumber) params.append("studentNumber", studentNumber);
    if (status)        params.append("status", status);
    if (yearLevel)     params.append("yearLevel", yearLevel);

    const query = params.toString();
    const url = `${baseUrl}enrollments${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  createEnrollment: async ({
    applicantId,
    programId,
    facultyId,
    academicYear,
    yearLevel,
  }) =>
    await apiFetch(`${baseUrl}enrollments`, {
      method: "POST",
      body: JSON.stringify({
        applicantId,
        programId,
        facultyId,
        academicYear,
        yearLevel,
      }),
    }),

  updateEnrollment: async ({
    enrollmentId,
    applicantId,
    programId,
    facultyId,
    academicYear,
    yearLevel,
    status,
  }) =>
    await apiFetch(`${baseUrl}enrollments/${enrollmentId}`, {
      method: "PUT",
      body: JSON.stringify({
        applicantId,
        programId,
        facultyId,
        academicYear,
        yearLevel,
        status,
      }),
    }),

  deleteEnrollment: async (enrollmentId) =>
    await apiFetch(`${baseUrl}enrollments/${enrollmentId}`, {
      method: "DELETE",
    }),

  getEnrollmentsForCourse: async (courseId) =>
    await apiFetch(`${baseUrl}enrollments/course/${courseId}/students`),
};

export default enrollmentApi;