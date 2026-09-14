import { baseUrl } from "./authApi";

const professorCourseApi = {
    getAllProfessorCourses: async (facultyId, professorId, courseId) => {
        try {
          const response = await fetch(
            `${baseUrl}professorCourses?facultyId=${facultyId}${professorId ? "&professorId="+professorId: ""}${courseId ? "&courseId="+courseId: ""}`
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
      assignProfessorToCourse: async ({ professorId, courseId, teachingType, academicYear }) => {
        try {
          const response = await fetch(`${baseUrl}professorCourses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              professorId,
              courseId,
              teachingType,
              academicYear
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
     updateProfessorCourse: async ({ professorCourseId, professorId, courseId, teachingType, academicYear }) => {
        try {
          const response = await fetch(`${baseUrl}professorCourses/${professorCourseId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              professorId,
              courseId,
              teachingType,
              academicYear
            }),
          });
    
          if(response.status === 204)
            return { data:null, status: response.status };
          const data = response.json();
          return { data, status: response.status };
    

        } catch (error) {
          if (error.message === "Failed to fetch")
            throw new Error(
              "Oops! We're having trouble connecting to the server. Please try again later."
            );
          else throw new Error(error.message);
        }
      },
     
      deleteProfessorCourse: async (professorCourseId) => {
        try {
          const response = await fetch(
            `${baseUrl}professorCourses/${professorCourseId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if(response.status === 204)
            return { data:null, status: response.status };
          const data = response.json();
          return { data, status: response.status };
        } catch (error) {
          if (error.message === "Failed to fetch")
            throw new Error(
              "Oops! We're having trouble connecting to the server. Please try again later."
            );
          else throw new Error(error.message);
        }
      },
};
export default professorCourseApi;