import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createOrder as createOrderService,
  getMyOrders,
  getOrderById,
} from "../../services/order.service";

// Initial State
const initialState = {
  orders: [],
  currentOrder: null,
  pagination: null,

  isCreating: false,
  isFetching: false,
  isFetchingOrder: false,

  error: null,
};

// Create Order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (shippingAddress, thunkAPI) => {
    try {
      return await createOrderService(shippingAddress);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      return !getState().order.isCreating;
    },
  },
);

// Fetch My Orders
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, thunkAPI) => {
    try {
      return await getMyOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      return !getState().order.isFetching;
    },
  },
);

// Fetch Order By ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, thunkAPI) => {
    try {
      return await getOrderById(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      return !getState().order.isFetchingOrder;
    },
  },
);

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    resetOrderState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentOrder = action.payload;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isFetchingOrder = true;
        state.error = null;
        state.currentOrder = null; // Clear current order when starting a new fetch
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isFetchingOrder = false;
        state.currentOrder = action.payload;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isFetchingOrder = false;
        state.error = action.payload;
        state.currentOrder = null; // Clear current order on failure
      });
  },
});

export const { clearCurrentOrder, resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;
