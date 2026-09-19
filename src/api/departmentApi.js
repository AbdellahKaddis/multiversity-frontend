import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const departmentApi = {
  getDepartments: async (facultyId) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/departments`),

  createDepartment: async ({ facultyId, name, code, email, description }) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/departments`, {
      method: "POST",
      body: JSON.stringify({ name, code, email, description }),
    }),

  updateDepartment: async ({
    facultyId,
    departmentId,
    name,
    code,
    email,
    description,
  }) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/departments/${departmentId}`, {
      method: "PUT",
      body: JSON.stringify({ name, code, email, description }),
    }),

  deleteDepartment: async (facultyId, departmentId) =>
    await apiFetch(`${baseUrl}faculties/${facultyId}/departments/${departmentId}`, {
      method: "DELETE",
    }),
};

export default departmentApi;