import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";

// Customer layouts & pages
import CustomerLayout from "./layouts/CustomerLayout.jsx";
import Home from "./pages/customer/Home.jsx";
import Login from "./pages/customer/Login.jsx";
import Register from "./pages/customer/Register.jsx";
import Batteries from "./pages/customer/Batteries.jsx";
import BatteryFinder from "./pages/customer/BatteryFinder.jsx";
import Compare from "./pages/customer/Compare.jsx";
import ProductDetail from "./pages/customer/ProductDetail.jsx";

import Maintenance from "./pages/customer/Maintenance.jsx";
import MyMaintenance from "./pages/customer/MyMaintenance.jsx";
import AboutUs from "./pages/customer/AboutUs.jsx";
import WarrantySupport from "./pages/customer/WarrantySupport.jsx";
import TermsConditions from "./pages/customer/TermsConditions.jsx";
import PrivacyPolicy from "./pages/customer/PrivacyPolicy.jsx";

// Admin layout & pages
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminMaintenance from "./pages/admin/AdminMaintenance.jsx";
import AdminSuppliers from "./pages/admin/AdminSuppliers.jsx";
import AdminInventory from "./pages/admin/AdminInventory.jsx";

// Protected customer route wrapper
const CustomerRoute = ({ element: Element }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <>{Element}</>;
};

// Protected admin route wrapper
const AdminRoute = ({ element: Element }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{Element}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Customer public & protected routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="batteries" element={<Batteries />} />
            <Route path="battery-finder" element={<BatteryFinder />} />
            <Route path="compare" element={<Compare />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="my-maintenance" element={<CustomerRoute element={<MyMaintenance />} />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="warranty-support" element={<WarrantySupport />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
            <Route path="products" element={<AdminRoute element={<AdminProducts />} />} />
            <Route path="orders" element={<AdminRoute element={<AdminOrders />} />} />
            <Route path="customers" element={<AdminRoute element={<AdminCustomers />} />} />
            <Route path="maintenance" element={<AdminRoute element={<AdminMaintenance />} />} />
            <Route path="suppliers" element={<AdminRoute element={<AdminSuppliers />} />} />
            <Route path="inventory" element={<AdminRoute element={<AdminInventory />} />} />
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;