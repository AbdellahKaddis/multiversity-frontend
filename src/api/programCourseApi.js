import { baseUrl } from "./authApi";
const programCourseApi = {
  getAllAssignedCoursesForProgram: async (facultyId, programId) => {
    try {
      const response = await fetch(
        `${baseUrl}programCourses?facultyId=${facultyId}&programId=${programId}`
      );
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
  addCourseToProgram: async ({ programId, courseId, semester }) => {
    try {
      const response = await fetch(`${baseUrl}programCourses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId,
          courseId,
          semester,
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
  addCoursesToProgram: async (programCourseCollection) => {
    try {
      const response = await fetch(`${baseUrl}programCourses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programCourseCollection),
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
  deleteCourseFromProgram: async (programCourseId) => {
    try {
      const response = await fetch(
        `${baseUrl}programCourses/${programCourseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
export default programCourseApi;
