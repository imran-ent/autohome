import { useState, useEffect, useRef } from "react";
import {
  Battery,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Upload,
  ArrowRight,
  Car,
  Truck,
  Sparkles,
  X,
  ClipboardList,
} from "lucide-react";
import { maintenanceService } from "../../services/maintenanceService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button.jsx";
import { Input } from "../../components/common/Input.jsx";
import { Textarea } from "../../components/common/Textarea.jsx";
import { Card } from "../../components/common/Card.jsx";
import { useNavigate, Link } from "react-router-dom";

const Maintenance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerMobile: "",
    address: "",
    batteryCategory: "Home Inverter Battery",
    batteryBrand: "",
    batteryModel: "",
    problemDescription: "",
    preferredVisitTime: "",
  });

  // Sync auth user details automatically when loaded
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || user.fullName || "",
        customerMobile:
          prev.customerMobile || user.mobile || user.phone || user.phoneNumber || "",
      }));
    }
  }, [user]);

  // Revoke object URL on change or unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      e.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const CATEGORY_OPTIONS = [
    { value: "Home Inverter Battery", label: "Inverter", icon: Battery },
    { value: "Car Battery", label: "Car", icon: Car },
    { value: "Bike Battery", label: "Bike", icon: Battery },
    { value: "Commercial Battery", label: "Commercial", icon: Truck },
  ];

  const QUICK_ISSUES = [
    "Battery not charging",
    "Low backup time",
    "Vehicle not starting",
    "Battery dead / no power",
    "Acid leakage or swelling",
  ];

  const handleAddQuickIssue = (issue) => {
    const current = form.problemDescription.trim();
    if (current.toLowerCase().includes(issue.toLowerCase())) return;
    handleChange("problemDescription", current ? `${current}, ${issue}` : issue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.customerName.trim();
    const rawMobile = form.customerMobile.trim();
    const digitsOnly = rawMobile.replace(/\D/g, "");
    const normalizedMobile =
      digitsOnly.length === 12 && digitsOnly.startsWith("91")
        ? digitsOnly.slice(2)
        : digitsOnly.length === 11 && digitsOnly.startsWith("0")
        ? digitsOnly.slice(1)
        : digitsOnly;

    const address = form.address.trim();
    const category = form.batteryCategory;
    const problem = form.problemDescription.trim();

    if (!name || !rawMobile || !address || !category || !problem) {
      toast.error("Please fill in all required fields (*)");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("customerName", name);
      formData.append("customerMobile", normalizedMobile);
      formData.append(
        "address",
        JSON.stringify({ street: address, city: "", state: "", pincode: "" })
      );
      formData.append("batteryCategory", category);
      formData.append("batteryBrand", form.batteryBrand.trim());
      formData.append("batteryModel", form.batteryModel.trim());
      formData.append("problemDescription", problem);
      formData.append("preferredVisitTime", form.preferredVisitTime.trim());
      if (image) formData.append("image", image);

      await maintenanceService.create(formData);
      toast.success("Maintenance request submitted successfully!");
      navigate("/my-maintenance");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Book Maintenance Service
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Get an expert technician at your doorstep within 24 hours.
          </p>
        </div>

        <Link
          to="/my-maintenance"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-800 text-xs font-bold shadow-xs transition-colors self-center sm:self-auto"
        >
          <ClipboardList size={16} className="text-blue-600" />
          <span>My Maintenance Updates</span>
        </Link>
      </div>

      <div className="bg-blue-50/80 border border-blue-200/60 rounded-2xl p-5 mb-8 flex items-start gap-3.5 shadow-xs">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
          <Battery size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">
            24-Hour Express Visit Guarantee
          </h3>
          <p className="text-xs text-blue-800 leading-relaxed mt-0.5">
            Book your slot now and a certified battery technician will visit your
            location within 24 hours.
          </p>
        </div>
      </div>

      <Card className="p-6 sm:p-10 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer Name *"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                placeholder="Enter full name"
                leftIcon={<User size={16} className="text-gray-400" />}
              />
              <Input
                label="Mobile Number *"
                type="tel"
                value={form.customerMobile}
                onChange={(e) => handleChange("customerMobile", e.target.value)}
                placeholder="10-digit mobile number"
                leftIcon={<Phone size={16} className="text-gray-400" />}
              />
            </div>
          </div>

          {/* Service Address */}
          <Input
            label="Service Address *"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Door No, Street, Landmark, City, Pincode"
            leftIcon={<MapPin size={16} className="text-gray-400" />}
          />

          {/* Battery Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Battery Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = form.batteryCategory === cat.value;
                return (
                  <button
                    type="button"
                    key={cat.value}
                    onClick={() => handleChange("batteryCategory", cat.value)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 text-blue-600 shadow-xs font-bold"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isSelected ? "text-blue-600" : "text-gray-500"}
                    />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Battery Brand & Model (Optional)"
              value={form.batteryBrand}
              onChange={(e) => handleChange("batteryBrand", e.target.value)}
              placeholder="e.g. Exide IT500 / Amaron 35Ah"
              leftIcon={<Battery size={16} className="text-gray-400" />}
            />
            <Input
              label="Preferred Visit Time (Optional)"
              value={form.preferredVisitTime}
              onChange={(e) => handleChange("preferredVisitTime", e.target.value)}
              placeholder="e.g. Tomorrow 10 AM"
              leftIcon={<Clock size={16} className="text-gray-400" />}
            />
          </div>

          {/* Issue Description & Quick Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700">
                Problem Description *
              </label>
            </div>

            {/* Quick Issue Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {QUICK_ISSUES.map((issue) => (
                <button
                  type="button"
                  key={issue}
                  onClick={() => handleAddQuickIssue(issue)}
                  className="text-[11px] font-medium bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200/60 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={11} className="text-amber-500" />
                  {issue}
                </button>
              ))}
            </div>

            <Textarea
              value={form.problemDescription}
              onChange={(e) => handleChange("problemDescription", e.target.value)}
              rows={3}
              placeholder="Describe what issue you are facing with your battery..."
              leftIcon={<FileText size={16} className="text-gray-400" />}
            />
          </div>

          {/* Image Upload */}
          <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/60">
            <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Upload size={15} className="text-gray-500" /> Battery Photo (Optional)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Battery preview"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Remove uploaded photo"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Submitting Request..." : "Submit Maintenance Request"}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Maintenance;