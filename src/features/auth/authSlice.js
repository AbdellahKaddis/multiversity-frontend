import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const STORAGE_KEY = "mv_auth";


const loadAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null };

    const parsed = JSON.parse(raw);

    // Missing pieces → treat as logged out
    if (!parsed?.accessToken || !parsed?.user) {
      localStorage.removeItem(STORAGE_KEY);
      return { user: null, accessToken: null };
    }

    // Expired token → clean up
    const decoded = jwtDecode(parsed.accessToken);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return { user: null, accessToken: null };
    }

    return {
      user: parsed.user,
      accessToken: parsed.accessToken,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { user: null, accessToken: null };
  }
};

const initialState = loadAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;

      // Persist the whole slice in one key
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
        })
      );
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;


      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

// Derived selector — don't store this in state
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectUser = (state) => state.auth.user;

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;