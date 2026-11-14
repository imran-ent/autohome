import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Package } from "lucide-react";
import { supplierService } from "../../services/supplierService.js";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Card from "../../components/common/Card.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    products: "",
    wholesalePrice: "",
    available: true,
    leadTime: "",
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierService.getAll();
      setSuppliers(response.data.data || []);
    } catch (e) {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditMode(false);
    setEditingId(null);
    setForm({
      name: "",
      contact: "",
      products: "",
      wholesalePrice: "",
      available: true,
      leadTime: "",
    });
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditMode(true);
    setEditingId(s._id);
    const firstProduct = s.products?.[0];
    setForm({
      name: s.name || "",
      contact: s.contact || "",
      products: (s.products || []).map((p) => p.sku).filter(Boolean).join(", "),
      wholesalePrice: firstProduct?.wholesalePrice ? String(firstProduct.wholesalePrice) : "",
      available: firstProduct ? !!firstProduct.available : true,
      leadTime: firstProduct?.leadTime || "",
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    setSubmitting(true);
    try {
      const formattedProducts = form.products
        .split(",")
        .map((sku) => sku.trim())
        .filter(Boolean)
        .map((sku) => ({
          sku,
          wholesalePrice: Number(form.wholesalePrice) || 0,
          available: form.available === true,
          leadTime: form.leadTime.trim(),
        }));

      const payload = {
        name: form.name.trim(),
        contact: form.contact.trim(),
        products: formattedProducts,
      };

      if (editMode) {
        await supplierService.update(editingId, payload);
        toast.success("Supplier updated successfully");
      } else {
        await supplierService.create(payload);
        toast.success("Supplier created successfully");
      }
      setOpen(false);
      loadSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await supplierService.remove(deleteId);
      toast.success("Supplier deleted successfully");
      setDeleteConfirm(false);
      loadSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Supplier Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage battery suppliers, SKUs, and wholesale catalog details
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openCreate}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={18} /> Add Supplier
        </Button>
      </div>

      {/* Supplier List Card */}
      <Card className="p-6 mb-8 border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Products (SKU)</th>
                <th className="py-3.5 px-4 text-center">Available</th>
                <th className="py-3.5 px-4">Lead Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-400 text-sm">
                    No suppliers found. Click "Add Supplier" to create one.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">{s.name}</td>
                    <td className="py-4 px-4 text-xs text-gray-600">{s.contact || "—"}</td>
                    <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate">
                      {(s.products || [])
                        .map((p) => p.sku)
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          s.products?.[0]?.available
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {s.products?.[0]?.available ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">
                      {s.products?.[0]?.leadTime || "—"}
                    </td>
                    <td className="py-4 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(s)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={15} className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteId(s._id);
                          setDeleteConfirm(true);
                        }}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <Trash2 size={15} className="mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editMode ? "Edit Supplier" : "Add Supplier"}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Supplier Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Exide Industries Ltd"
              />
              <Input
                label="Contact Person / Phone"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="e.g. +91 9876543210"
              />
              <Input
                label="Product SKUs (comma separated)"
                value={form.products}
                onChange={(e) => setForm({ ...form, products: e.target.value })}
                placeholder="e.g. EX-100, SF-200, MX-500"
              />
              <Input
                label="Wholesale Price (₹)"
                type="number"
                value={form.wholesalePrice}
                onChange={(e) => setForm({ ...form, wholesalePrice: e.target.value })}
                placeholder="e.g. 4500"
              />
              <Input
                label="Lead Time"
                value={form.leadTime}
                onChange={(e) => setForm({ ...form, leadTime: e.target.value })}
                placeholder="e.g. 3-5 business days"
              />

              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Products currently available from supplier
                </span>
              </label>

              <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editMode
                    ? "Update Supplier"
                    : "Create Supplier"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone."
        confirmLabel="Delete Supplier"
        destructive
      />
    </div>
  );
};

export default AdminSuppliers;