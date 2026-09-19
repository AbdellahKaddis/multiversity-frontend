import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const academicProgramApi = {
  getAcademicPrograms: async (
    facultyId = null,
    departmentId = null,
    universityId = null
  ) => {
    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (departmentId) params.append("departmentId", departmentId);
    if (universityId) params.append("universityId", universityId);

    const query = params.toString();
    const url = `${baseUrl}programs${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  createAcademicProgram: async ({
    departmentId,
    name,
    code,
    durationInYears,
    description,
    degreeId,
  }) =>
    await apiFetch(`${baseUrl}departments/${departmentId}/programs`, {
      method: "POST",
      body: JSON.stringify({
        name,
        code,
        durationInYears,
        description,
        degreeId,
      }),
    }),

  updateAcademicProgram: async ({
    departmentId,
    programId,
    name,
    code,
    durationInYears,
    description,
    degreeId,
  }) =>
    await apiFetch(`${baseUrl}programs/${programId}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        code,
        durationInYears,
        description,
        degreeId,
        departmentId,
      }),
    }),

  deleteAcademicProgram: async (programId) =>
    await apiFetch(`${baseUrl}programs/${programId}`, {
      method: "DELETE",
    }),

  getAcademicProgram: async (programId) =>
    await apiFetch(`${baseUrl}programs/${programId}`),
};

export default academicProgramApi;