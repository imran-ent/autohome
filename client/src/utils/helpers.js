// src/utils/helpers.js

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const stockStatusColor = (status) => {
  switch (status) {
    case "in_stock":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "low_stock":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "out_of_stock":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-gray-100 text-gray-700 border-gray-100";
  }
};

export const orderStatusColor = (status) => {
  const map = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    "Ready for Pickup": "bg-purple-50 text-purple-700 border-purple-200",
    "Out for Delivery": "bg-purple-50 text-purple-700 border-purple-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-gray-100 text-gray-700 border-gray-200";
};

export const maintenanceStatusColor = (status) => {
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

export const formatAddress = (address) => {
  if (!address) return "Location not specified";

  // If stored as a JSON string (e.g. from FormData)
  if (typeof address === "string") {
    try {
      const parsed = JSON.parse(address);
      if (typeof parsed === "object" && parsed !== null) {
        address = parsed;
      } else {
        return address; // Plain text address
      }
    } catch {
      return address; // Normal string address
    }
  }

  // If stored as an object { street, city, state, pincode }
  if (typeof address === "object") {
    const parts = [
      address.street || address.line1 || address.address,
      address.city,
      address.state,
      address.pincode || address.zipCode,
    ]
      .filter(Boolean)
      .map((item) => String(item).trim());

    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  }

  return String(address);
};