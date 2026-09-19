import { apiFetch } from "../utils/apiClient";

export const baseUrl = "https://localhost:5001/api/";

const authApi = {
  isEmailAlreadyExists: async (email) => {
    const { data } = await apiFetch(`${baseUrl}auth/check-email/${email}`);
    return data.exists;
  },

  sendVerificationCode: async (email) =>
    await apiFetch(`${baseUrl}auth/verify-email`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  isVerificationCodeValid: async (email, code) => {
    const { status } = await apiFetch(`${baseUrl}auth/confirm-verification`, {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    return status === 200;
  },

  registerUniversityAmin: async ({ firstName, lastName, password, email }) =>
    await apiFetch(`${baseUrl}auth/register/university-admin`, {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, password, email }),
    }),

login: async ({ email, password }) =>
  await apiFetch(`${baseUrl}auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuthRedirect: true,   // ← don't auto-redirect on wrong credentials
  }),

  forgotPassword: async (email) =>
    await apiFetch(`${baseUrl}auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: async ({ email, token, newPassword }) => {
    const { status } = await apiFetch(`${baseUrl}auth/reset-password`, {
      method: "POST",
      body: JSON.stringify({ email, token, newPassword }),
    });

    if (status === 400) {
      throw new Error(
        "Your password reset link is invalid or has expired. "
      );
    }
  },

  deactivateUser: async (userId) =>
    await apiFetch(`${baseUrl}auth/users/${userId}/deactivate`, {
      method: "PATCH",
    }),
};

export default authApi;