import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import CustomerLayout from "../layouts/CustomerLayout";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../pages/customer/Home/HomePage";
import ProfilePage from "../pages/customer/Profile/ProfilePage";

import LoginPage from "../pages/auth/Login/Login";
import RegisterPage from "../pages/auth/Register/Register";

const AppRouter = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
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
