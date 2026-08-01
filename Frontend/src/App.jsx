import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchProfile } from "./features/auth/authSlice";
import AppRouter from "./routes/AppRouter";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
