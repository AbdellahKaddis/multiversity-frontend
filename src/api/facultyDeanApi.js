import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const facultyDeanApi = {
  getAllFacultyDeans: async (facultyId, deanId) => {
    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (deanId)    params.append("deanId", deanId);

    const query = params.toString();
    const url = `${baseUrl}facultyDeans${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  assignDeanForFaculty: async ({ facultyId, deanId }) =>
    await apiFetch(`${baseUrl}facultyDeans`, {
      method: "POST",
      body: JSON.stringify({ facultyId, deanId }),
    }),

  updateFacultyDean: async ({ id, facultyId, deanId }) =>
    await apiFetch(`${baseUrl}facultyDeans/${id}`, {
      method: "PUT",
      body: JSON.stringify({ facultyId, deanId }),
    }),

  getCurrentFacultyDean: async (facultyId) =>
    await apiFetch(`${baseUrl}facultyDeans/current/${facultyId}`),

  getFacultyDean: async (facultyDeanId) =>
    await apiFetch(`${baseUrl}facultyDeans/${facultyDeanId}`),

  deleteFacultyDean: async (facultyDeanId) =>
    await apiFetch(`${baseUrl}facultyDeans/${facultyDeanId}`, {
      method: "DELETE",
    }),
};

export default facultyDeanApi;