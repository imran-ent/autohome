import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, RefreshCw, ShoppingBag } from "lucide-react";
import api from "../../services/api.js";
import toast from "react-hot-toast";
import { Card } from "../../components/common/Card.jsx";
import { formatDateTime } from "../../utils/helpers.js";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.get("/orders/my-orders");
      const payload = response?.data?.data ?? response?.data ?? [];
      setOrders(Array.isArray(payload) ? payload : []);
      if (isManual) toast.success("Orders refreshed");
    } catch {
      try {
        const fallback = await api.get("/orders/my");
        const payload = fallback?.data?.data ?? fallback?.data ?? [];
        setOrders(Array.isArray(payload) ? payload : []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load your orders");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track your battery purchases and delivery status</p>
        </div>
        <button
          type="button"
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin text-blue-600" : "text-blue-600"} />
          <span>Refresh</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-16 px-4 border border-gray-100">
          <ShoppingBag size={36} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
          <p className="text-gray-500 text-sm mt-1 mb-5">
            Explore our inverter, car, and bike batteries to place your first order.
          </p>
          <Link
            to="/batteries"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
          >
            Browse Batteries
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="p-6 border border-gray-100 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      Order #{order.orderId || order._id?.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-gray-900">
                    ₹{Number(order.totalAmount || order.totalPrice || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {order.status || order.orderStatus || "Pending"}
                  </span>
                </div>
              </div>

              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className="mt-3 space-y-1.5 text-xs text-gray-700">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {item.name || item.product?.name || "Battery"} × {item.quantity || 1}
                      </span>
                      <span className="font-semibold">
                        ₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;