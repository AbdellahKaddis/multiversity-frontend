import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const applicationApi = {
  getApplications: async ({
    universityId,
    facultyId,
    programId,
    applicantId,
  } = {}) => {
    const params = new URLSearchParams();
    if (universityId) params.append("universityId", universityId);
    if (facultyId)    params.append("facultyId", facultyId);
    if (programId)    params.append("programId", programId);
    if (applicantId)  params.append("applicantId", applicantId);

    const query = params.toString();
    const url = `${baseUrl}applications${query ? `?${query}` : ""}`;

    return await apiFetch(url);
  },

  getApplication: async (applicantId) =>
    await apiFetch(`${baseUrl}applications/${applicantId}`),

  createApplication: async ({
    applicantId,
    programId,
    grade,
    bacSerie,
    bacYear,
    bacMention,
    fileUrl,
    applicant,
  }) =>
    await apiFetch(`${baseUrl}applications`, {
      method: "POST",
      body: JSON.stringify({
        applicantId,
        programId,
        grade,
        bacSerie,
        bacYear,
        bacMention,
        fileUrl,
        applicant,
      }),
    }),

  updateApplicationStatus: async (applicationId, status, reviewerId = null) =>
    await apiFetch(`${baseUrl}applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reviewerId }),
    }),

  deleteApplication: async (applicationId) =>
    await apiFetch(`${baseUrl}applications/${applicationId}`, {
      method: "DELETE",
    }),
};

export default applicationApi;