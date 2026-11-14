import { useState, useEffect } from "react";
import {
  Search,
  Headset,
  X,
  Calendar,
  User,
  Wrench,
  IndianRupee,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { maintenanceService } from "../../services/maintenanceService.js";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Card from "../../components/common/Card.jsx";
import { formatAddress, formatDateTime } from "../../utils/helpers.js";

const STATUSES = [
  "Requested",
  "Accepted",
  "Technician Assigned",
  "Scheduled",
  "Technician On the Way",
  "In Progress",
  "Resolved",
  "Cancelled",
];

const getStatusColor = (status) => {
  switch (status) {
    case "Requested":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Accepted":
    case "Technician Assigned":
    case "Scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Technician On the Way":
    case "In Progress":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const AdminMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedReq, setSelectedReq] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    status: "",
    assignedTechnician: "",
    scheduledDate: "",
    technicianRemarks: "",
    serviceCharge: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [statusFilter, search]);

  const loadRequests = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await maintenanceService.getAll({
        status: statusFilter || undefined,
      });
      let data = response.data?.data || [];
      if (search.trim()) {
        const query = search.toLowerCase();
        data = data.filter(
          (r) =>
            (r.requestId && String(r.requestId).toLowerCase().includes(query)) ||
            (r.customerName && r.customerName.toLowerCase().includes(query)) ||
            (r.customerMobile && String(r.customerMobile).includes(query))
        );
      }
      setRequests(data);
      if (isManualRefresh) toast.success("Maintenance requests refreshed");
    } catch (e) {
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openUpdate = (req) => {
    setSelectedReq(req);
    setForm({
      status: req.status || "Requested",
      assignedTechnician: req.assignedTechnician || "",
      scheduledDate: req.scheduledDate
        ? new Date(req.scheduledDate).toISOString().slice(0, 16)
        : "",
      technicianRemarks: req.technicianRemarks || "",
      serviceCharge: req.serviceCharge ? String(req.serviceCharge) : "",
    });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedReq?._id) return;
    setUpdating(true);
    try {
      await maintenanceService.update(selectedReq._id, {
        status: form.status,
        assignedTechnician: form.assignedTechnician,
        scheduledDate: form.scheduledDate || null,
        technicianRemarks: form.technicianRemarks,
        serviceCharge: Number(form.serviceCharge) || 0,
      });
      toast.success("Maintenance request updated successfully");
      setModalOpen(false);
      loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update request");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Maintenance</h1>
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Maintenance Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track, schedule, and assign technician service visits with customer locations
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => loadRequests(true)}
          disabled={refreshing}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin text-blue-600" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-5 mb-8 border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              label="Search Requests"
              placeholder="Search by Request ID, Customer Name, or Mobile..."
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
              options={[
                { value: "", label: "All Statuses" },
                ...STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Table Container */}
      <Card className="overflow-hidden border border-gray-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service Location</th>
                <th className="py-3.5 px-4">Battery</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Problem</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400 text-sm">
                    No maintenance requests found matching your filter.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-gray-900">
                      #{r.requestId || r._id?.slice(-6)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{r.customerName}</div>
                      <div className="text-xs text-gray-500">{r.customerMobile}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600 max-w-xs">
                      <div className="flex items-start gap-1">
                        <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {formatAddress(r.address || r.serviceAddress || r.customer?.address)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">{r.batteryCategory}</span>
                      {r.batteryBrand && (
                        <span className="text-gray-400"> • {r.batteryBrand}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate">
                      {r.problemDescription}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openUpdate(r)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Headset size={15} className="mr-1" /> Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Request Modal */}
      {modalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Update Request #{selectedReq.requestId || selectedReq._id?.slice(-6)}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Request & Customer Location Context Box */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer Name:</span>
                <span className="font-bold text-gray-900">{selectedReq.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mobile:</span>
                <span className="font-semibold text-gray-800">{selectedReq.customerMobile}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 shrink-0">Service Address:</span>
                <span className="font-medium text-gray-900 text-right">
                  {formatAddress(
                    selectedReq.address || selectedReq.serviceAddress || selectedReq.customer?.address
                  )}
                </span>
              </div>
              {selectedReq.problemDescription && (
                <div className="flex justify-between gap-4 pt-1 border-t border-gray-200/60">
                  <span className="text-gray-500 shrink-0">Problem:</span>
                  <span className="font-medium text-gray-700 text-right">
                    {selectedReq.problemDescription}
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
              <Select
                label="Status *"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target?.value ?? e })}
                options={STATUSES.map((s) => ({ value: s, label: s }))}
              />

              <Input
                label="Assigned Technician"
                value={form.assignedTechnician}
                onChange={(e) => setForm({ ...form, assignedTechnician: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                leftIcon={<User size={16} className="text-gray-400" />}
              />

              <Input
                label="Scheduled Visit Date & Time"
                type="datetime-local"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                leftIcon={<Calendar size={16} className="text-gray-400" />}
              />

              <Input
                label="Service Charge (₹)"
                type="number"
                value={form.serviceCharge}
                onChange={(e) => setForm({ ...form, serviceCharge: e.target.value })}
                placeholder="e.g. 250"
                leftIcon={<IndianRupee size={16} className="text-gray-400" />}
              />

              <Input
                label="Technician Remarks"
                value={form.technicianRemarks}
                onChange={(e) => setForm({ ...form, technicianRemarks: e.target.value })}
                placeholder="Diagnostic findings or resolution notes..."
                leftIcon={<Wrench size={16} className="text-gray-400" />}
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
                  {updating ? "Updating..." : "Update Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMaintenance;