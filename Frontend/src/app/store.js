import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/categories/categorySlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
  },
});

export default store;
