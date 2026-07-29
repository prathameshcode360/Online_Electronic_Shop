import Header from "../components/layout/Header/Header";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <>
      <Header />
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default CustomerLayout;
