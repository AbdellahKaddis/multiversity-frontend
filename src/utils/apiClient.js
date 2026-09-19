import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";

/**
 * Wrapper around fetch that:
 *  - injects the Authorization header
 *  - parses JSON automatically
 *  - handles 401 globally (logout + redirect)
 *  - normalizes network errors
 */
export const apiFetch = async (url, options = {}) => {
  const { accessToken } = store.getState().auth;
    const { skipAuthRedirect = false, ...fetchOptions } = options;

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Only set Content-Type for JSON bodies — never for FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error(
        "Oops! We're having trouble connecting to the server. Please try again later."
      );
    }
    throw error;
  }

  if (response.status === 401 && !skipAuthRedirect) {
     store.dispatch(logout());

  const path = window.location.pathname;
  const isLoginPage = path.startsWith("/login");

  if (!isLoginPage) {
    toast.warn("Your session has expired. Please log in again.");
    setTimeout(() => {
      window.location.href = path.startsWith("/student")
        ? "/login/student"
        : "/login";
    }, 300);   
  }

  throw new Error("Session expired.");
  }

  // ── Parse response (JSON if possible) ──
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  return { data, status: response.status, ok: response.ok };
};