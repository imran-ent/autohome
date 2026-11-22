import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Battery,
  Package,
  Truck,
  Clock,
  ChevronRight,
  RefreshCw,
  Wrench,
  Headset,
  ShoppingBag,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService.js";
import toast from "react-hot-toast";
import { Card } from "../../components/common/Card.jsx";
import CustomerUsersSection from "../../components/admin/CustomerUsersSection.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = async (isRefresh = false) => {
    if (isRefresh && refreshing) return;

    if (isRefresh) {
      setRefreshing(true);
      setRefreshKey((prev) => prev + 1);
    } else {
      setLoading(true);
    }

    try {
      const statsRes = await dashboardService.getStats();
      const payload = statsRes?.data?.data ?? statsRes?.data ?? {};
      setStats(payload);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders != null ? Number(stats.totalOrders).toLocaleString("en-IN") : "0",
      icon: ShoppingBag,
      color: "text-slate-700",
      bg: "bg-slate-100",
      border: "border-slate-200",
      subtitle: "All customer bookings",
    },
    {
      title: "Available Products",
      value:
        stats?.availableProducts != null
          ? Number(stats.availableProducts).toLocaleString("en-IN")
          : "0",
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      subtitle: "Active catalog items",
    },
    {
      title: "Total Stock",
      value:
        stats?.totalStockQuantity != null
          ? Number(stats.totalStockQuantity).toLocaleString("en-IN")
          : "0",
      icon: Truck,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      subtitle: "Units in warehouse",
    },
    {
      title: "Low Stock Alert",
      value:
        stats?.lowStockProducts != null
          ? Number(stats.lowStockProducts).toLocaleString("en-IN")
          : "0",
      icon: Battery,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
      subtitle: "Needs replenishment",
    },
    {
      title: "Pending Bookings",
      value:
        stats?.pendingBookings != null
          ? Number(stats.pendingBookings).toLocaleString("en-IN")
          : "0",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      subtitle: "Awaiting confirmation",
    },
    {
      title: "Maintenance Requests",
      value:
        stats?.maintenanceRequests != null
          ? Number(stats.maintenanceRequests).toLocaleString("en-IN")
          : "0",
      icon: Headset,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      subtitle: "Active service tickets",
    },
  ];

  const quickActions = [
    {
      label: "Manage Products",
      desc: "Add or update battery inventory",
      path: "/admin/products",
      icon: Package,
      badge: "Catalog",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Manage Orders",
      desc: "Process and update order statuses",
      path: "/admin/orders",
      icon: ShoppingBag,
      badge: "Orders",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Maintenance Requests",
      desc: "Assign technicians to site visits",
      path: "/admin/maintenance",
      icon: Wrench,
      badge: "Service",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Real-time overview of inventory, orders, and maintenance operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-600" : ""} />
          <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.bg} border ${card.border}`}
                >
                  <Icon size={20} className={card.color} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100/80 font-medium">
                {card.subtitle}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <Card className="p-6 sm:p-8 lg:col-span-12 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Quick Operations
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Direct access to primary administrative controls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.path}
                    className="group flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-gray-50/80 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${action.color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.label}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-gray-100 text-gray-600">
                            {action.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">{action.desc}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Logged-In Customers Section (Name, Phone Number, Email ID) */}
        <div className="lg:col-span-12">
          <CustomerUsersSection key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;