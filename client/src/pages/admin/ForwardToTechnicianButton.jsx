import { useState } from "react";
import { Phone, X, CheckCircle2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { formatAddress, formatDateTime } from "../../utils/helpers.js";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`;

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.33-1.66a11.86 11.86 0 0 0 5.73 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.85 9.85 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.89-9.89 9.89Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);

const formatWaNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits;
};

const ForwardToTechnicianButton = ({ request }) => {
  const [open, setOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);

  const reqCode = request?.requestId || request?._id?.slice(-6) || "";
  const customerName = request?.customerName || "Customer";
  const customerPhone = request?.customerMobile || "Not provided";
  const batteryInfo = [request?.batteryCategory, request?.batteryBrand]
    .filter(Boolean)
    .join(" - ");
  const issueText = request?.problemDescription || "Battery / Inverter Service";
  const addressText =
    formatAddress(
      request?.address || request?.serviceAddress || request?.customer?.address
    ) || "Pernambut";

  const buildWhatsAppLink = (tech) => {
    const waNumber = formatWaNumber(tech.phone);
    const lines = [
      `Hello ${tech.name}, new service job from *AutoHome Batteries*:`,
      ``,
      reqCode ? `*Request ID:* #${reqCode}` : "",
      `*Customer:* ${customerName}`,
      `*Phone:* ${customerPhone}`,
      batteryInfo ? `*Battery:* ${batteryInfo}` : "",
      `*Problem:* ${issueText}`,
      `*Location:* ${addressText}`,
      request?.scheduledDate
        ? `*Scheduled:* ${formatDateTime(request.scheduledDate)}`
        : "",
      ``,
      `Please contact the customer and confirm visit time.`,
    ].filter(Boolean);

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  const handleOpenPicker = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/technicians`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setTechnicians(data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenPicker}
        title="Forward job details to technician on WhatsApp"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors cursor-pointer"
      >
        <WhatsAppIcon className="w-3.5 h-3.5 text-white shrink-0" />
        <span>WhatsApp</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-6 z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Forward Job via WhatsApp
                </h3>
                <p className="text-xs text-gray-500">
                  Tap a technician below to open WhatsApp with pre-filled details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-xs space-y-1 text-gray-700 mb-4">
              <div>
                <span className="font-semibold text-gray-900">Customer:</span>{" "}
                {customerName} ({customerPhone})
              </div>
              {batteryInfo && (
                <div>
                  <span className="font-semibold text-gray-900">Battery:</span>{" "}
                  {batteryInfo}
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-900">Problem:</span>{" "}
                {issueText}
              </div>
              <div>
                <span className="font-semibold text-gray-900">Location:</span>{" "}
                {addressText}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {loading ? (
                <p className="py-6 text-center text-xs text-gray-400">
                  Loading technicians...
                </p>
              ) : technicians.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-gray-500 mb-3">
                    No technicians saved yet.
                  </p>
                  <Link
                    to="/admin/technicians"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold"
                  >
                    <UserPlus size={14} /> Add Technician
                  </Link>
                </div>
              ) : (
                technicians.map((tech) => (
                  <div
                    key={tech._id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {tech.name}
                        </span>
                        {tech.isAvailable && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            <CheckCircle2 size={10} /> On Duty
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {tech.phone} • {tech.specialty}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${tech.phone}`}
                        title="Call technician"
                        className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        <Phone size={14} />
                      </a>
                      <a
                        href={buildWhatsAppLink(tech)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>Send</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForwardToTechnicianButton;