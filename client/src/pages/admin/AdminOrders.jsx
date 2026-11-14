import { useState, useEffect } from "react";
import { Search, RefreshCw, PackageCheck, X, MapPin } from "lucide-react";
import { orderService } from "../../services/orderService.js";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Card from "../../components/common/Card.jsx";
import { formatCurrency, formatDateTime, formatAddress } from "../../utils/helpers.js";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Ready for Pickup",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Confirmed":
    case "Processing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Ready for Pickup":
    case "Out for Delivery":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const loadOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await orderService.getAll({
        status: statusFilter || undefined,
      });
      let data = response.data?.data?.orders || response.data?.data || [];

      if (search.trim()) {
        const query = search.toLowerCase();
        data = data.filter((o) => {
          const bookingId = String(o.bookingId || "").toLowerCase();
          const name = String(o.customer?.name || o.customerName || "").toLowerCase();
          const mobile = String(o.customer?.mobile || o.customerMobile || "");
          return bookingId.includes(query) || name.includes(query) || mobile.includes(query);
        });
      }
      setOrders(data);
      if (isManualRefresh) toast.success("Orders refreshed");
    } catch (e) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openManageModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Pending");
    setModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    setUpdating(true);
    try {
      await orderService.updateStatus(selectedOrder._id, newStatus);
      toast.success(`Order updated: ${newStatus}`);
      setModalOpen(false);
      loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Orders</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage battery customer bookings and fulfillment status</p>
        </div>
        <Button
          variant="outline"
          onClick={() => loadOrders(true)}
          disabled={refreshing}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin text-blue-600" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-5 mb-8 border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              label="Search Orders"
              placeholder="Search by Booking ID, Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} className="text-gray-400" />}
            />
          </div>
          <div className="w-full sm:w-64">
            <Select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target?.value ?? e)}
              options={[{ value: "", label: "All Statuses" }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6 mb-8 border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer & Location</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Fulfillment</th>
                <th className="py-3.5 px-4">Booking Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400 text-sm">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-gray-900">
                      #{o.bookingId || o._id?.slice(-6)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{o.customer?.name || o.customerName || "Walk-in Customer"}</div>
                      <div className="text-xs text-gray-500">{o.customer?.mobile || o.customerMobile || "—"}</div>
                      <div className="flex items-start gap-1 text-xs text-gray-500 mt-1 max-w-xs">
                        <MapPin size={13} className="text-rose-500 shrink-0 mt-0.5" />
                        <span className="truncate">
                          {formatAddress(o.deliveryAddress || o.address || o.customer?.address)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-gray-900">
                      {formatCurrency(o.totalAmount || 0)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500">
                      {formatDateTime(o.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openManageModal(o)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <PackageCheck size={15} className="mr-1" /> Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal for Order Status Update */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Update Order #{selectedOrder.bookingId || selectedOrder._id?.slice(-6)}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Change fulfillment status</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Order Preview Details */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-bold text-gray-900">
                  {selectedOrder.customer?.name || selectedOrder.customerName || "Walk-in Customer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mobile:</span>
                <span className="font-semibold text-gray-800">
                  {selectedOrder.customer?.mobile || selectedOrder.customerMobile || "N/A"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 shrink-0">Delivery Location:</span>
                <span className="font-medium text-gray-900 text-right">
                  {formatAddress(
                    selectedOrder.deliveryAddress || selectedOrder.address || selectedOrder.customer?.address
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200/60">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-extrabold text-blue-900">
                  {formatCurrency(selectedOrder.totalAmount || 0)}
                </span>
              </div>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <Select
                label="Fulfillment Status *"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target?.value ?? e)}
                options={STATUSES.map((s) => ({ value: s, label: s }))}
              />

              <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={updating}>
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;