import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const admissionApi = {
  getAdmissions: async (universityId, facultyId = null, programId = null) => {
    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (programId) params.append("programId", programId);

    const query = params.toString();
    const url = `${baseUrl}${universityId}/admissions${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  getAdmission: async (admissionId) =>
    await apiFetch(`${baseUrl}admissions/${admissionId}`),

  createAdmission: async ({
    programId,
    title,
    academicYear,
    startDate,
    endDate,
    process,
    requirements,
  }) =>
    await apiFetch(`${baseUrl}admissions`, {
      method: "POST",
      body: JSON.stringify({
        programId,
        title,
        academicYear,
        startDate,
        endDate,
        process,
        requirements,
      }),
    }),

  updateAdmission: async ({
    admissionId,
    programId,
    title,
    academicYear,
    startDate,
    endDate,
    process,
    requirements,
  }) =>
    await apiFetch(`${baseUrl}admissions/${admissionId}`, {
      method: "PUT",
      body: JSON.stringify({
        programId,
        title,
        academicYear,
        startDate,
        endDate,
        process,
        requirements,
      }),
    }),

  deleteAdmission: async (admissionId) =>
    await apiFetch(`${baseUrl}admissions/${admissionId}`, {
      method: "DELETE",
    }),
};

export default admissionApi;