import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const courseApi = {
  getAllCourses: async (facultyId) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/courses`),

  createCourse: async ({
    facultyId,
    title,
    code,
    description,
    coefficient,
    credits,
    hoursCM,
    hoursTD,
    hoursTP,
  }) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/courses`, {
      method: "POST",
      body: JSON.stringify({
        title,
        code,
        description,
        coefficient,
        credits,
        hoursCM,
        hoursTD,
        hoursTP,
      }),
    }),

  updateCourse: async ({
    courseId,
    title,
    code,
    description,
    coefficient,
    credits,
    hoursCM,
    hoursTD,
    hoursTP,
  }) =>
    await apiFetch(`${baseUrl}courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        code,
        description,
        coefficient,
        credits,
        hoursCM,
        hoursTD,
        hoursTP,
      }),
    }),

  deleteCourse: async (courseId) =>
    await apiFetch(`${baseUrl}courses/${courseId}`, {
      method: "DELETE",
    }),
};

export default courseApi;