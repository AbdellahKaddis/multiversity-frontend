import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const programCourseApi = {
  getAllAssignedCoursesForProgram: async (facultyId, programId) => {
    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (programId) params.append("programId", programId);

    const query = params.toString();
    const url = `${baseUrl}programCourses${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  addCourseToProgram: async ({ programId, courseId, semester }) =>
    await apiFetch(`${baseUrl}programCourses`, {
      method: "POST",
      body: JSON.stringify({ programId, courseId, semester }),
    }),

  addCoursesToProgram: async (programCourseCollection) =>
    await apiFetch(`${baseUrl}programCourses`, {
      method: "POST",
      body: JSON.stringify(programCourseCollection),
    }),

  deleteCourseFromProgram: async (programCourseId) =>
    await apiFetch(`${baseUrl}programCourses/${programCourseId}`, {
      method: "DELETE",
    }),
};

export default programCourseApi;