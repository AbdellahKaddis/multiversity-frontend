import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const professorApi = {
  getAllProfessors: async (facultyId) => {
    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);

    const query = params.toString();
    const url = `${baseUrl}professors${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  getProfessor: async (professorId) =>
    await apiFetch(`${baseUrl}professors/${professorId}`),

  createProfessor: async ({
    firstName,
    lastName,
    email,
    cin,
    grade,
    isDepartmentHead,
    departmentId,
    facultyId,
  }) =>
    await apiFetch(`${baseUrl}professors`, {
      method: "POST",
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
    }),

  updateProfessor: async ({
    professorId,
    firstName,
    lastName,
    cin,
    grade,
    isDepartmentHead,
    departmentId,
    facultyId,
  }) =>
    await apiFetch(`${baseUrl}professors/${professorId}`, {
      method: "PUT",
      body: JSON.stringify({
        firstName,
        lastName,
        cin,
        grade,
        isDepartmentHead,
        departmentId,
        facultyId,
      }),
    }),

  deleteProfessor: async (professorId) =>
    await apiFetch(`${baseUrl}professors/${professorId}`, {
      method: "DELETE",
    }),
};

export default professorApi;