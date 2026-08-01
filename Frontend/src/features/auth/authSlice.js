import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  getProfile,
} from "../../services/auth.service";

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,

  loading: false,
  error: null,

  isAuthenticated: false,
  isLoading: true,

  registerSuccess: false,
};

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

// Fetch Profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.registerSuccess = false;

      localStorage.removeItem("token");
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },

    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isLoading = false;
        state.error = action.payload;

        // Clear any stale authentication state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        localStorage.removeItem("token");
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isLoading = true; // FIXED: Added this line
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        // token remains from initialState (loaded from localStorage)
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.isLoading = false;
        state.error = action.payload;

        // Clear invalid authentication state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        // Remove expired/invalid token from localStorage
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearAuthError, resetRegisterSuccess, setAuthLoading } =
  authSlice.actions;

export default authSlice.reducer;
