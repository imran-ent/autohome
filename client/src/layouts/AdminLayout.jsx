import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Battery,
  Layout,
  ShoppingCart,
  Users,
  Headset,
  Truck,
  Package,
  User,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "layout" },
    { name: "Products", path: "/admin/products", icon: "battery" },
    { name: "Orders", path: "/admin/orders", icon: "shopping-cart" },
    { name: "Customers", path: "/admin/customers", icon: "users" },
    { name: "Maintenance", path: "/admin/maintenance", icon: "headset" },
    { name: "Suppliers", path: "/admin/suppliers", icon: "truck" },
    { name: "Inventory", path: "/admin/inventory", icon: "package" },
  ];

  const iconMap = {
    layout: Layout,
    battery: Battery,
    "shopping-cart": ShoppingCart,
    users: Users,
    headset: Headset,
    truck: Truck,
    package: Package,
  };

  const pageTitle = location.pathname
    .replace("/admin/", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const SidebarContent = ({ onNavigate }) => (
    <>
      <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <Link
          to="/admin/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <Battery size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            AutoHome <span className="text-gold">Batteries</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10"
          aria-label="Close Sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-grow overflow-y-auto p-4 space-y-1">
        {adminLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = iconMap[link.icon] || Layout;
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue text-white shadow-sm font-semibold"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{link.name}</span>
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-white/10">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <Home size={18} />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </nav>

      <div className="p-5 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="w-9 h-9 bg-blue/20 rounded-full flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(false);
            logout();
          }}
          className="w-full mt-3 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-navy text-white hidden lg:flex flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-navy text-white flex flex-col h-full shadow-2xl">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-navy hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Open Admin Menu"
            >
              <Menu size={22} />
            </button>
            <span className="text-sm sm:text-base font-bold text-gray-800 capitalize">
              {pageTitle || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <User size={14} className="text-blue" />
              <span>{user?.name || "Admin"}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;