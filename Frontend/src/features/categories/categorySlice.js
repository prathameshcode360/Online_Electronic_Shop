import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getCategories } from "../../services/category.service";

// Initial State
const initialState = {
  categories: [],
  loading: false,
  error: null,
  fetched: false, // ✅ Track whether categories have been fetched
};

// Async Thunk
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, thunkAPI) => {
    try {
      return await getCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

// Slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Keep fetched as true if it was already fetched (prevents unnecessary refetch)
        // Or keep as false - either way, we'll set it to true on success
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.fetched = true; // ✅ Mark as fetched on success
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // fetched remains false if it failed
      });
  },
});

export default categorySlice.reducer;
