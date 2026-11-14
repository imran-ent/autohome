import Navbar from "../components/layout/Navbar.jsx";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <Navbar />

      {/* Top padding guarantees content starts below floating header */}
      <main className="flex-1 pt-24 sm:pt-28 pb-12">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;