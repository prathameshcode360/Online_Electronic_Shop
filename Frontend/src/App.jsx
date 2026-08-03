import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProfile, setAuthLoading } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";
import AppRouter from "./routes/AppRouter";

function App() {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);

  // Restore user session on app startup
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchProfile());
    } else {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  // Fetch cart whenever authentication succeeds
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  return <AppRouter />;
}

export default App;
