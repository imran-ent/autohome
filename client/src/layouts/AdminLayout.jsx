import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Battery,
  Layout,
  ShoppingCart,
  CreditCard,
  Users,
  Headset,
  Truck,
  Package,
  User,
  LogOut,
  Menu,
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "layout" },
    { name: "Products", path: "/admin/products", icon: "battery" },
    { name: "Orders", path: "/admin/orders", icon: "shopping-cart" },
    { name: "Sales", path: "/admin/sales", icon: "credit-card" },
    { name: "Customers", path: "/admin/customers", icon: "users" },
    { name: "Maintenance", path: "/admin/maintenance", icon: "headset" },
    { name: "Suppliers", path: "/admin/suppliers", icon: "truck" },
    { name: "Inventory", path: "/admin/inventory", icon: "package" },
  ];

  const iconMap = {
    layout: Layout,
    battery: Battery,
    "shopping-cart": ShoppingCart,
    "credit-card": CreditCard,
    users: Users,
    headset: Headset,
    truck: Truck,
    package: Package,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-72 bg-navy text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-navy-light flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <Battery size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              AutoHome <span className="text-gold">Batteries</span>
            </span>
          </div>
        </div>
        <nav className="flex-grow overflow-y-auto p-4 space-y-1">
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.name}
                href={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-blue text-white"
                    : "text-gray-300 hover:bg-navy-light hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>
        <div className="p-6 border-t border-navy-light">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-navy-light cursor-pointer transition-colors group">
            <div className="w-8 h-8 bg-blue/20 rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-4 px-4 py-2 text-sm font-medium text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 shrink-0 lg:ml-0">
          <div className="lg:hidden flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-navy">
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 hidden sm:block">
              {location.pathname.replace("/admin/", "").replace(/-/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue/10 rounded-full flex items-center justify-center text-blue">
              <User size={16} />
            </div>
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-600 hover:text-navy transition-colors hidden sm:block"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-grow overflow-y-auto p-6 lg:pl-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

