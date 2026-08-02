import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import CustomerLayout from "../layouts/CustomerLayout";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../pages/customer/Home/HomePage";
import ProfilePage from "../pages/customer/Profile/ProfilePage";
import CartPage from "../pages/customer/Cart/CartPage";

import LoginPage from "../pages/auth/Login/Login";
import RegisterPage from "../pages/auth/Register/Register";

const AppRouter = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      </Route>

      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
