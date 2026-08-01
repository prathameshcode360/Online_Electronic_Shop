import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchProfile, setAuthLoading } from "./features/auth/authSlice";
import AppRouter from "./routes/AppRouter";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchProfile());
    } else {
      // NEW: If no token, auth check is complete
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
