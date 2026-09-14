import { baseUrl } from "./authApi";
const courseApi = {
  getAllCourses: async (facultyId) => {
    try {
      const response = await fetch(`${baseUrl}faculties/${facultyId}/courses`);
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
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
  }) => {
    try {
      const response = await fetch(`${baseUrl}faculties/${facultyId}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      });

      const data = await response.json();

      return { data, status: response.status };
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
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
  }) => {
    try {
      const response = await fetch(`${baseUrl}courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      });

      return { status: response.status };
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
  deleteCourse: async (courseId) => {
    try {
      const response = await fetch(`${baseUrl}courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { status: response.status };
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
};
export default courseApi;
