import api from "./api";

// Get User Cart
export const getCart = async () => {
  try {
    const response = await api.get("/cart");

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Add Product to Cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart", {
      productId,
      quantity,
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await api.put(`/cart/${productId}`, {
      quantity,
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Remove Cart Item
export const removeCartItem = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Clear Cart
export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
