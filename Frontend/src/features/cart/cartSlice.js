import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../services/cart.service";

// Initial State
const initialState = {
  items: [],
  updatingItems: {}, // Track which items are being updated by productId
  removingItems: {}, // Track which items are being removed by productId

  isFetching: false,
  isAdding: false,
  isClearing: false,

  error: null,

  fetched: false,
};

// Fetch Cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      return await getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      return !getState().cart.isFetching;
    },
  },
);

// Add Item To Cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await addToCart(productId, quantity);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      return !getState().cart.isAdding;
    },
  },
);

// Update Item Quantity - Per-item locking
export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      return await updateCartItem(productId, quantity);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update cart item",
      );
    }
  },
  {
    condition: ({ productId }, { getState }) => {
      const state = getState().cart;
      // Only prevent updates to the same item that's already updating
      return !state.updatingItems[productId];
    },
  },
);

// Remove Item From Cart - Per-item locking
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (productId, thunkAPI) => {
    try {
      return await removeCartItem(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart",
      );
    }
  },
  {
    condition: (productId, { getState }) => {
      const state = getState().cart;
      // Only prevent removal of the same item that's already being removed
      return !state.removingItems[productId];
    },
  },
);

// Clear Cart
export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (_, thunkAPI) => {
    try {
      return await clearCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      return !getState().cart.isClearing;
    },
  },
);

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    resetCart: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isFetching = false;
        state.items = action.payload.items;
        state.fetched = true;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // Add Item To Cart
      .addCase(addItemToCart.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })

      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isAdding = false;
        state.items = action.payload.items;
      })

      .addCase(addItemToCart.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload;
      })

      // Update Item Quantity - Per-item tracking
      .addCase(updateItemQuantity.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.updatingItems[productId] = true;
        state.error = null;
      })

      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const { productId } = action.meta.arg;
        delete state.updatingItems[productId];
        state.items = action.payload.items;
      })

      .addCase(updateItemQuantity.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        delete state.updatingItems[productId];
        state.error = action.payload;
      })

      // Remove Item From Cart - Per-item tracking
      .addCase(removeItemFromCart.pending, (state, action) => {
        const productId = action.meta.arg;
        state.removingItems[productId] = true;
        state.error = null;
      })

      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        delete state.removingItems[productId];
        state.items = action.payload.items;
      })

      .addCase(removeItemFromCart.rejected, (state, action) => {
        const productId = action.meta.arg;
        delete state.removingItems[productId];
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearUserCart.pending, (state) => {
        state.isClearing = true;
        state.error = null;
      })

      .addCase(clearUserCart.fulfilled, (state, action) => {
        state.isClearing = false;
        state.items = action.payload.items;
      })

      .addCase(clearUserCart.rejected, (state, action) => {
        state.isClearing = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
