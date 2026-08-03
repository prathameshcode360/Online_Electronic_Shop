import api from "./api";

// Create Order
export const createOrder = async (shippingAddress) => {
  try {
    const response = await api.post("/orders", {
      shippingAddress, // ✅ CORRECT - Creates { shippingAddress: {...} }
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get My Orders
export const getMyOrders = async () => {
  try {
    const response = await api.get("/orders");

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Order By ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
