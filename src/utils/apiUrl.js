const API_BASE = import.meta.env.VITE_API_URL || "https://localhost:5001";
export const apiUrl = (path) => (path ? `${API_BASE}${path}` : "");