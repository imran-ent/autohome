import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { Toaster } from "react-hot-toast";
import { Battery } from "lucide-react";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          icon: <Battery size={20} strokeWidth={2} />,
          style: {
            background: "#101C2C",
            color: "#fff",
            border: "1px solid #1769AA",
          },
        }}
      />
      <Navbar />
      <main className="flex-grow">{<Outlet />}</main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
