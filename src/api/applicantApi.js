import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const applicantApi = {
  createApplicant: async ({ firstName, lastName, password, email }) =>
    await apiFetch(`${baseUrl}applicants`, {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, password, email }),
    }),

  getApplicant: async (applicantId) =>
    await apiFetch(`${baseUrl}applicants/${applicantId}`),

  getApplicants: async ({ universityId, facultyId, status } = {}) => {
    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (status)    params.append("status", status);

    const query = params.toString();
    const url = `${baseUrl}${universityId}/applicants${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },
};

export default applicantApi;