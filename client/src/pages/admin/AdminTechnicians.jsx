import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Plus,
  Phone,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MapPin,
  X,
} from "lucide-react";
import { technicianService } from "../../services/technicianService.js";
import toast from "react-hot-toast";
import { Card } from "../../components/common/Card.jsx";

const INITIAL_FORM = {
  name: "",
  phone: "",
  specialty: "Inverter & Battery Service",
  area: "Pernambut & Surroundings",
  isAvailable: true,
  notes: "",
};

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.33-1.66a11.86 11.86 0 0 0 5.73 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.85 9.85 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.89-9.89 9.89Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);

const AdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const { data } = await technicianService.getAll();
      setTechnicians(data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const openAddModal = () => {
    setEditingTech(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEditModal = (tech) => {
    setEditingTech(tech);
    setForm({
      name: tech.name || "",
      phone: tech.phone || "",
      specialty: tech.specialty || "Inverter & Battery Service",
      area: tech.area || "Pernambut & Surroundings",
      isAvailable: tech.isAvailable ?? true,
      notes: tech.notes || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone number are required");
      return;
    }

    setSaving(true);
    try {
      if (editingTech) {
        const { data } = await technicianService.update(editingTech._id, form);
        setTechnicians((prev) =>
          prev.map((t) => (t._id === editingTech._id ? data.data : t))
        );
        toast.success("Technician updated");
      } else {
        const { data } = await technicianService.create(form);
        setTechnicians((prev) => [data.data, ...prev]);
        toast.success("Technician added");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save technician");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDuty = async (tech) => {
    try {
      const nextStatus = !tech.isAvailable;
      const { data } = await technicianService.update(tech._id, {
        isAvailable: nextStatus,
      });
      setTechnicians((prev) =>
        prev.map((t) => (t._id === tech._id ? data.data : t))
      );
      toast.success(
        nextStatus ? `${tech.name} marked On Duty` : `${tech.name} marked Off Duty`
      );
    } catch {
      toast.error("Failed to update duty status");
    }
  };

  const handleDelete = async (tech) => {
    if (!window.confirm(`Remove technician "${tech.name}"?`)) return;
    try {
      await technicianService.remove(tech._id);
      setTechnicians((prev) => prev.filter((t) => t._id !== tech._id));
      toast.success("Technician deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete technician");
    }
  };

  const filtered = technicians.filter((t) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name?.toLowerCase().includes(q) ||
      t.phone?.toLowerCase().includes(q) ||
      t.specialty?.toLowerCase().includes(q) ||
      t.area?.toLowerCase().includes(q)
    );
  });

  const onDutyCount = technicians.filter((t) => t.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 mb-2"
          >
            <ArrowLeft size={14} /> Back to Admin Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Service Technicians
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Maintain technician phone numbers, duty availability, and one-tap call or WhatsApp contact.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={17} />
          <span>Add Technician</span>
        </button>
      </div>

      <Card className="p-4 sm:p-5 border border-gray-100 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            Total Technicians: {technicians.length}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
            On Duty: {onDutyCount}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, skill, area..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
          />
        </div>
      </Card>

      {loading ? (
        <div className="p-10 text-center text-sm text-gray-400">
          Loading technicians...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center border border-gray-100">
          <Wrench size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            {search ? "No technicians match your search." : "No technicians added yet."}
          </p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Add your technicians so you can call them or forward maintenance jobs on WhatsApp in one tap.
          </p>
          {!search && (
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold cursor-pointer"
            >
              <Plus size={15} /> Add First Technician
            </button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tech) => {
            const digits = (tech.phone || "").replace(/\D/g, "");
            const waNumber = digits.length === 10 ? `91${digits}` : digits;

            return (
              <Card
                key={tech._id}
                className="p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {tech.name}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">
                        {tech.specialty}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleDuty(tech)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                        tech.isAvailable
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {tech.isAvailable ? (
                        <>
                          <CheckCircle2 size={12} /> On Duty
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Off Duty
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <Phone size={14} className="text-emerald-600 shrink-0" />
                      <span>{tech.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span>{tech.area}</span>
                    </div>
                    {tech.notes && (
                      <p className="text-[11px] text-gray-400 pt-1">
                        {tech.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${tech.phone}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors"
                    >
                      <Phone size={14} /> Call Now
                    </a>
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(tech)}
                      title="Edit technician"
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tech)}
                      title="Delete technician"
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-6 relative">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-900">
              {editingTech ? "Edit Technician" : "Add Service Technician"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Save technician contact details for one-tap calls and WhatsApp job forwarding.
            </p>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Technician Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Karthik"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., 9876543210"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  placeholder="Inverter Board Repair / Battery Installation"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Service Area
                </label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="Pernambut & Surroundings"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Shift timings or extra details"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) =>
                    setForm({ ...form, isAvailable: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                Currently On Duty
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gray-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 cursor-pointer mt-2"
              >
                {saving
                  ? "Saving..."
                  : editingTech
                  ? "Update Technician"
                  : "Save Technician"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTechnicians;