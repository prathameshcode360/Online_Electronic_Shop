import { configureStore } from "@reduxjs/toolkit";

import categoryReducer from "../features/categories/categorySlice";
import productReducer from "../features/products/productSlice";

const store = configureStore({
  reducer: {
    categories: categoryReducer,
    products: productReducer,
  },
});

export default store;
