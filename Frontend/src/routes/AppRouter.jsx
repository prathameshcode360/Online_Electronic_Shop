import { Routes, Route } from "react-router-dom";

import CustomerLayout from "../layouts/CustomerLayout";
import HomePage from "../pages/customer/Home/HomePage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
