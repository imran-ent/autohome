import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Download,
  RefreshCw,
  Copy,
  Check,
  Edit2,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Card } from "../common/Card.jsx";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`;

const CustomerUsersSection = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mobileDraft, setMobileDraft] = useState("");
  const [savingMobile, setSavingMobile] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/auth/customers`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setCustomers(data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load logged-in customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((user) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.mobile?.toLowerCase().includes(q)
    );
  });

  const handleCopyEmail = async (id, email) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      toast.success("Email copied!");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Could not copy email");
    }
  };

  const handleSaveMobile = async (id) => {
    setSavingMobile(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${API_BASE}/auth/customers/${id}/mobile`,
        { mobile: mobileDraft },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? data.data : c))
      );
      setEditingId(null);
      toast.success("Phone number updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update phone number");
    } finally {
      setSavingMobile(false);
    }
  };

  const handleExportCsv = () => {
    if (filteredCustomers.length === 0) {
      toast.error("No customer records to export");
      return;
    }

    const headers = ["Name", "Phone Number", "Email ID", "Sign-In Method", "Last Active"];
    const rows = filteredCustomers.map((u) => [
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${(u.mobile || "Not provided").replace(/"/g, '""')}"`,
      `"${(u.email || "").replace(/"/g, '""')}"`,
      u.googleId ? "Google" : "Email",
      new Date(u.lastLoginAt || u.createdAt).toLocaleDateString("en-IN"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `autohome-customers-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const googleUsersCount = customers.filter((c) => !!c.googleId).length;
  const withPhoneCount = customers.filter((c) => !!c.mobile?.trim()).length;

  return (
    <Card className="border border-gray-100 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Logged-In Customers ({customers.length})
              </h3>
              <p className="text-xs text-gray-500">
                Customer names, phone numbers &amp; email IDs registered on the website.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              Total: {customers.length}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              With Phone: {withPhoneCount}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              Google Sign-In: {googleUsersCount}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, email..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={fetchCustomers}
            title="Refresh customer list"
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : ""} />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-sm text-gray-400">
          Loading logged-in customer details...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          {search
            ? "No customers match your search."
            : "No customers have logged in yet."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 px-5">Name</th>
                <th className="py-3.5 px-5">Phone Number</th>
                <th className="py-3.5 px-5">Email ID</th>
                <th className="py-3.5 px-5">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCustomers.map((user) => {
                const cleanPhone = (user.mobile || "").replace(/\D/g, "");
                const waPhone =
                  cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                            {(user.name || "U").slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user.name || "Unnamed Customer"}
                          </div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                              user.googleId
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.googleId ? "Google Login" : "Email Login"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="py-3.5 px-5">
                      {editingId === user._id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="tel"
                            value={mobileDraft}
                            onChange={(e) => setMobileDraft(e.target.value)}
                            placeholder="10-digit mobile"
                            className="w-36 px-2.5 py-1 text-xs border border-blue-600 rounded-lg focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={savingMobile}
                            onClick={() => handleSaveMobile(user._id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                            title="Save phone"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded cursor-pointer"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : user.mobile ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${user.mobile}`}
                            className="inline-flex items-center gap-1.5 font-medium text-gray-900 hover:text-blue-600"
                          >
                            <Phone size={13} className="text-emerald-600" />
                            <span>{user.mobile}</span>
                          </a>
                          {waPhone.length >= 10 && (
                            <a
                              href={`https://wa.me/${waPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold"
                            >
                              WhatsApp
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(user._id);
                              setMobileDraft(user.mobile || "");
                            }}
                            className="text-gray-400 hover:text-blue-600 p-1 cursor-pointer"
                            title="Edit phone number"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs italic text-gray-400">
                            Not provided (Google)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(user._id);
                              setMobileDraft("");
                            }}
                            className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Email ID */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${user.email}`}
                          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-blue-600 text-xs sm:text-sm"
                        >
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <span>{user.email}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(user._id, user.email)}
                          title="Copy email"
                          className="text-gray-400 hover:text-gray-800 p-1 cursor-pointer"
                        >
                          {copiedId === user._id ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(
                        user.lastLoginAt || user.createdAt
                      ).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default CustomerUsersSection;