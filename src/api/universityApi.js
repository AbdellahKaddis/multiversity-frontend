import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const universityApi = {
  createUniversity: async ({
    universityName,
    universityType,
    universityEmail,
    adminId,
  }) =>
    await apiFetch(`${baseUrl}universities`, {
      method: "POST",
      body: JSON.stringify({
        name: universityName,
        email: universityEmail,
        type: universityType,
        adminId,
      }),
    }),

  getUniversity: async (universityId) =>
    await apiFetch(`${baseUrl}universities/${universityId}`),

  checkForDuplicateValues: async ({ name, email }) =>
    await apiFetch(
      `${baseUrl}universities/${encodeURIComponent(email)}/${encodeURIComponent(name)}`
    ),

  getUniversityByAdminId: async (adminId) =>
    await apiFetch(`${baseUrl}admins/${adminId}/university`),

  getUniversities: async () =>
    await apiFetch(`${baseUrl}universities`),

  updateUniversity: async (id, data) =>
    await apiFetch(`${baseUrl}universities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getUniversityStatistics: async (universityId) =>
    await apiFetch(`${baseUrl}universities/${universityId}/statistics`),
};

export default universityApi;