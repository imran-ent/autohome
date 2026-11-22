import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Battery, Headset, RefreshCw, Plus } from "lucide-react";
import { maintenanceService } from "../../services/maintenanceService.js";
import toast from "react-hot-toast";
import { Card } from "../../components/common/Card.jsx";
import { formatAddress, formatDateTime } from "../../utils/helpers.js";

const MyMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async (isManual = false) => {
    if (isManual && refreshing) return;

    if (isManual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await maintenanceService.myRequests();
      const payload = response?.data?.data ?? response?.data ?? [];
      setRequests(Array.isArray(payload) ? payload : []);
      if (isManual) toast.success("Requests updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load maintenance requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const statusColor = (status) => {
    const map = {
      Requested: "bg-amber-50 text-amber-700 border-amber-200",
      Accepted: "bg-blue-50 text-blue-700 border-blue-200",
      "Technician Assigned": "bg-indigo-50 text-indigo-700 border-indigo-200",
      Scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Technician On the Way": "bg-purple-50 text-purple-700 border-purple-200",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
      Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return map[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Maintenance Requests</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Maintenance Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track your battery service requests</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to="/maintenance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors"
          >
            <Plus size={15} /> Book Service
          </Link>
          <button
            type="button"
            onClick={() => fetchRequests(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin text-blue-600" : "text-blue-600"}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-16 px-4 border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <Headset size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No maintenance requests</h3>
          <p className="text-gray-500 text-sm mt-1 mb-5">
            You haven&apos;t submitted any maintenance requests yet.
          </p>
          <Link
            to="/maintenance"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
          >
            <Plus size={16} /> Book Maintenance Service
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req._id} className="p-6 border border-gray-100 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Battery size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      #{req.requestId || req._id?.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDateTime(req.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  {Number(req.serviceCharge) > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                      Charge: ₹{Number(req.serviceCharge).toLocaleString("en-IN")}
                    </span>
                  )}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Category</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">
                    {req.batteryCategory}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Battery</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">
                    {req.batteryBrand || "—"} {req.batteryModel || ""}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Problem</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">
                    {req.problemDescription}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">Service Address: </span>
                  <span className="text-gray-600">
                    {formatAddress(req.address) || "Not provided"}
                  </span>
                </div>

                {req.preferredVisitTime && (
                  <div className="text-xs text-gray-500">
                    Preferred Visit Time: <span className="font-medium text-gray-700">{req.preferredVisitTime}</span>
                  </div>
                )}

                {req.assignedTechnician && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
                    <span className="font-bold">Assigned Technician:</span>{" "}
                    {req.assignedTechnician}
                  </div>
                )}

                {req.scheduledDate && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-semibold">Scheduled Visit:</span>{" "}
                    {formatDateTime(req.scheduledDate)}
                  </div>
                )}

                {req.technicianRemarks && (
                  <div className="mt-2 p-3 rounded-xl bg-gray-100 text-sm text-gray-700">
                    <span className="font-bold">Technician Remarks:</span>{" "}
                    {req.technicianRemarks}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMaintenance;