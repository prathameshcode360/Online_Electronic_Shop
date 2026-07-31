import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getFeaturedProducts,
  getLatestProducts,
} from "../../services/product.service";

// Initial State
const initialState = {
  featuredProducts: [],
  latestProducts: [],

  featuredLoading: false,
  latestLoading: false,

  featuredError: null,
  latestError: null,

  featuredFetched: false, // ✅ Track whether featured products have been fetched
  latestFetched: false, // ✅ Track whether latest products have been fetched
};

// Async Thunk - Featured Products
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, thunkAPI) => {
    try {
      return await getFeaturedProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products",
      );
    }
  },
);

// Async Thunk - Latest Products
export const fetchLatestProducts = createAsyncThunk(
  "products/fetchLatestProducts",
  async (_, thunkAPI) => {
    try {
      return await getLatestProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch latest products",
      );
    }
  },
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })

      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = action.payload;
        state.featuredFetched = true; // ✅ Mark as fetched on success
      })

      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload;
        // featuredFetched remains false if it failed
      })

      // Latest Products
      .addCase(fetchLatestProducts.pending, (state) => {
        state.latestLoading = true;
        state.latestError = null;
      })

      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.latestLoading = false;
        state.latestProducts = action.payload;
        state.latestFetched = true; // ✅ Mark as fetched on success
      })

      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.latestLoading = false;
        state.latestError = action.payload;
        // latestFetched remains false if it failed
      });
  },
});

export default productSlice.reducer;
