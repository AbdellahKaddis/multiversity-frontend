import { baseUrl } from "./authApi";

const professorApi = {
  getAllProfessors: async (facultyId) => {
    try {
      const response = await fetch(
        `${baseUrl}professors?facultyId=${facultyId}`
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
  getProfessor: async (professorId) => {
    try {
      const response = await fetch(
        `${baseUrl}professors/${professorId}`
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
  createProfessor: async ({
    firstName,
    lastName,
    email,
    cin,
    grade,
    isDepartmentHead,
    departmentId,
    facultyId,
  }) => {
    try {
      const response = await fetch(`${baseUrl}professors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          cin,
          grade,
          isDepartmentHead,
          departmentId,
          facultyId,
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
  updateProfessor: async ({
    professorId,
    firstName,
    lastName,
    cin,
    grade,
    isDepartmentHead,
    departmentId,
    facultyId,
  }) => {
    try {
      const response = await fetch(`${baseUrl}professors/${professorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          cin,
          grade,
          isDepartmentHead,
          departmentId,
          facultyId,
        }),
      });

      if(response.status === 204)
        return { data : null, status: response.status };

        const data = await response.json();
        return { data , status: response.status };
 
      
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
  deleteProfessor: async (professorId) => {
    try {
      const response = await fetch(`${baseUrl}professors/${professorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

        if(response.status === 204)
          return { data : null, status: response.status };

        const data = await response.json();
        return { data , status: response.status };
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
};
export default professorApi;
