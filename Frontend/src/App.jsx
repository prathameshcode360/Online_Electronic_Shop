import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchProfile, setAuthLoading } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";
import AppRouter from "./routes/AppRouter";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchProfile())
        .unwrap()
        .then(() => {
          dispatch(fetchCart());
        })
        .catch(() => {
          // fetchProfile already handles invalid token
        });
    } else {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
