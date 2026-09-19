import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const professorCourseApi = {
  getAllProfessorCourses: async (facultyId, professorId, courseId) => {
    const params = new URLSearchParams();
    if (facultyId)   params.append("facultyId", facultyId);
    if (professorId) params.append("professorId", professorId);
    if (courseId)    params.append("courseId", courseId);

    const query = params.toString();
    const url = `${baseUrl}professorCourses${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  assignProfessorToCourse: async ({
    professorId,
    courseId,
    teachingType,
    academicYear,
  }) =>
    await apiFetch(`${baseUrl}professorCourses`, {
      method: "POST",
      body: JSON.stringify({
        professorId,
        courseId,
        teachingType,
        academicYear,
      }),
    }),

  updateProfessorCourse: async ({
    professorCourseId,
    professorId,
    courseId,
    teachingType,
    academicYear,
  }) =>
    await apiFetch(`${baseUrl}professorCourses/${professorCourseId}`, {
      method: "PUT",
      body: JSON.stringify({
        professorId,
        courseId,
        teachingType,
        academicYear,
      }),
    }),

  deleteProfessorCourse: async (professorCourseId) =>
    await apiFetch(`${baseUrl}professorCourses/${professorCourseId}`, {
      method: "DELETE",
    }),
};

export default professorCourseApi;