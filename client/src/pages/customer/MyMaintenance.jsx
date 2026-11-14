import { useState, useEffect } from "react";
import { Battery, Headset, Clock, RefreshCw, Check, X } from "lucide-react";
import { maintenanceService } from "../../services/maintenanceService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Card } from "../../components/common/Card.jsx";
import { formatDateTime } from "../../utils/helpers.js";

const MyMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await maintenanceService.myRequests();
      setRequests(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refresh]);

  const statusColor = (s) => {
    const map = {
      Requested: "bg-yellow-100 text-yellow-700 border-yellow-100",
      Accepted: "bg-blue-100 text-blue-700 border-blue-100",
      "Technician Assigned": "bg-indigo-100 text-indigo-700 border-indigo-100",
      Scheduled: "bg-indigo-100 text-indigo-700 border-indigo-100",
      "Technician On the Way": "bg-indigo-100 text-indigo-700 border-indigo-100",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-100",
      Resolved: "bg-green-100 text-green-700 border-green-100",
      Cancelled: "bg-red-100 text-red-700 border-red-100",
    };
    return map[s] || "bg-gray-100 text-gray-700 border-gray-100";
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold text-charcoal mb-8">My Maintenance Requests</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">My Maintenance Requests</h1>
          <p className="text-gray-500 mt-1">Track your battery service requests</p>
        </div>
        <button
          onClick={() => setRefresh((r) => r + 1)}
          className="flex items-center gap-2 text-sm font-medium text-blue hover:text-navy transition-colors"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>
      {requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4"><Headset size={32} /></div>
          <h3 className="text-lg font-bold text-charcoal">No maintenance requests</h3>
          <p className="text-gray-500">You haven't submitted any maintenance requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req._id} className="p-6 elevated">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue"><Battery size={20} /></div>
                  <div>
                    <p className="font-bold text-charcoal">#{req.requestId}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(req.createdAt)}</p>
                  </div>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColor(req.status)}`}>{req.status}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Category</p>
                  <p className="text-charcoal font-medium">{req.batteryCategory}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Battery</p>
                  <p className="text-charcoal font-medium">{req.batteryBrand || "—"} {req.batteryModel || ""}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Problem</p>
                  <p className="text-charcoal font-medium line-clamp-1">{req.problemDescription}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-charcoal mb-1">Address:</p>
                <p className="text-sm text-gray-600">{req.address?.street || "Not provided"}</p>
                {req.assignedTechnician && (
                  <div className="mt-3 p-3 rounded bg-blue-50 text-sm text-blue-700">
                    <span className="font-bold">Assigned Technician:</span> {req.assignedTechnician}
                  </div>
                )}
                {req.scheduledDate && (
                  <div className="mt-2 text-xs text-gray-500">Scheduled: {formatDateTime(req.scheduledDate)}</div>
                )}
                {req.technicianRemarks && (
                  <div className="mt-2 p-2 rounded bg-gray-100 text-sm text-gray-700">
                    <span className="font-bold">Technician Remarks:</span> {req.technicianRemarks}
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

