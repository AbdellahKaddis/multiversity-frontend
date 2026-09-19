import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const facultyApi = {
  createFaculty: async ({
    universityId,
    name,
    code,
    type,
    region,
    city,
    address,
    email,
    phoneNumber,
    establishedYear,
  }) =>
    await apiFetch(`${baseUrl}universities/${universityId}/faculties`, {
      method: "POST",
      body: JSON.stringify({
        name,
        code,
        type,
        region,
        city,
        address,
        email,
        phoneNumber,
        establishedYear,
      }),
    }),

  getFaculties: async (universityId) =>
    await apiFetch(`${baseUrl}universities/${universityId}/faculties`),

  getFaculty: async (universityId, facultyId) =>
    await apiFetch(
      `${baseUrl}universities/${universityId}/faculties/${facultyId}`
    ),

  endDeanAssignment: async (facultyId) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/dean/end`, {
      method: "PATCH",
    }),

  createAndAssignDean: async (facultyId, { firstName, lastName, email }) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/dean`, {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email }),
    }),

  updateFaculty: async ({
    universityId,
    facultyId,
    name,
    code,
    type,
    region,
    city,
    address,
    email,
    phoneNumber,
    establishedYear,
  }) =>
    await apiFetch(
      `${baseUrl}universities/${universityId}/faculties/${facultyId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
          code,
          type,
          region,
          city,
          address,
          email,
          phoneNumber,
          establishedYear,
        }),
      }
    ),

  deleteFaculty: async (universityId, facultyId) =>
    await apiFetch(
      `${baseUrl}universities/${universityId}/faculties/${facultyId}`,
      { method: "DELETE" }
    ),

  getFacultyByDeanId: async (deanId) =>
    await apiFetch(`${baseUrl}deans/${deanId}/faculty`),
};

export default facultyApi;