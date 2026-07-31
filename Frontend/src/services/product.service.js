import api from "./api";

export const getProducts = async () => {
  try {
    const response = await api.get("/products");

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/products/featured");

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getLatestProducts = async () => {
  try {
    const response = await api.get("/products/latest");

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
