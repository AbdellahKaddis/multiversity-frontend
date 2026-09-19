import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const degreeApi = {
  getDegrees: async (universityId) =>
    await apiFetch(`${baseUrl}universities/${universityId}/degrees`),

  createDegree: async ({ universityId, name }) =>
    await apiFetch(`${baseUrl}universities/${universityId}/degrees`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  updateDegree: async ({ degreeId, universityId, name }) =>
    await apiFetch(`${baseUrl}degrees/${degreeId}`, {
      method: "PUT",
      body: JSON.stringify({ name, universityId }),
    }),

  deleteDegree: async (degreeId) =>
    await apiFetch(`${baseUrl}degrees/${degreeId}`, {
      method: "DELETE",
    }),
};

export default degreeApi;