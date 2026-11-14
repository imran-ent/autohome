import { useState, useEffect } from "react";
import {
  Search,
  Battery,
  Package,
  Truck,
  RefreshCw,
  X,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { inventoryService } from "../../services/inventoryService.js";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Card from "../../components/common/Card.jsx";
import { formatCurrency } from "../../utils/helpers.js";

const CATEGORIES = [
  "Home Inverter Batteries",
  "Bike Batteries",
  "Car Batteries",
  "Truck / Commercial Batteries",
  "Inverters",
  "Accessories",
];

const getStockStatus = (p) => {
  const current = Number(p.currentStock) || 0;
  const reserved = Number(p.reservedStock) || 0;
  const available = p.availableStock ?? Math.max(0, current - reserved);
  const minLevel = Number(p.minStockLevel) || 5;

  if (available <= 0) {
    return {
      key: "out_of_stock",
      label: "Out of Stock",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }
  if (available <= minLevel) {
    return {
      key: "low_stock",
      label: "Low Stock",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  return {
    key: "in_stock",
    label: "In Stock",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
};

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Edit Stock Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    currentStock: "0",
    minStockLevel: "5",
    supplierAvailable: false,
    supplierLeadTime: "",
  });

  useEffect(() => {
    loadInventory();
  }, [categoryFilter, lowStockOnly]);

  const loadInventory = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await inventoryService.getAll({
        category: categoryFilter || undefined,
        lowStock: lowStockOnly ? "true" : undefined,
      });

      // Safely extract array regardless of backend payload wrapping
      const data =
        response.data?.data?.inventory ||
        response.data?.data?.products ||
        response.data?.data ||
        [];

      setProducts(Array.isArray(data) ? data : []);
      if (isManualRefresh) toast.success("Inventory refreshed");
    } catch (e) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openEditModal = (p) => {
    setSelectedProduct(p);
    setEditForm({
      currentStock: String(p.currentStock ?? 0),
      minStockLevel: String(p.minStockLevel ?? 5),
      supplierAvailable: !!p.supplierAvailable,
      supplierLeadTime: p.supplierLeadTime || "",
    });
    setModalOpen(true);
  };

  const handleStockUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedProduct?._id) return;

    setSubmitting(true);
    try {
      await inventoryService.update(selectedProduct._id, {
        currentStock: Number(editForm.currentStock) || 0,
        minStockLevel: Number(editForm.minStockLevel) || 5,
        supplierAvailable: editForm.supplierAvailable === true,
        supplierLeadTime: editForm.supplierLeadTime.trim(),
      });

      toast.success("Stock updated successfully");
      setModalOpen(false);
      loadInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update stock");
    } finally {
      setSubmitting(false);
    }
  };

  // Safe client-side search filtering
  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const name = String(p.name || "").toLowerCase();
    const brand = String(p.brand || "").toLowerCase();
    const sku = String(p.sku || "").toLowerCase();
    return name.includes(query) || brand.includes(query) || sku.includes(query);
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Inventory</h1>
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
            Inventory Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track warehouse stock, reserved units, and threshold alerts
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => loadInventory(true)}
          disabled={refreshing}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin text-blue-600" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-5 mb-8 border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <Input
              label="Search Inventory"
              placeholder="Search by SKU, product name, or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} className="text-gray-400" />}
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target?.value ?? e)}
              options={[
                { value: "", label: "All Categories" },
                ...CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
            />
          </div>

          <div className="flex items-center gap-2 self-end pb-1.5 cursor-pointer">
            <input
              type="checkbox"
              id="lowStockToggle"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="lowStockToggle" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
              Low Stock Alerts Only
            </label>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="p-6 mb-8 border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4 text-center">Current</th>
                <th className="py-3.5 px-4 text-center">Reserved</th>
                <th className="py-3.5 px-4 text-center">Available</th>
                <th className="py-3.5 px-4 text-center">Min Level</th>
                <th className="py-3.5 px-4 text-right">Stock Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-gray-400 text-sm">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const status = getStockStatus(p);
                  const currentStock = Number(p.currentStock) || 0;
                  const reservedStock = Number(p.reservedStock) || 0;
                  const availableStock = p.availableStock ?? Math.max(0, currentStock - reservedStock);
                  const unitPrice = Number(p.purchasePrice || p.price || 0);
                  const stockValue = currentStock * unitPrice;

                  return (
                    <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs font-bold text-gray-900">
                        {p.sku || "—"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.brand}</div>
                      </td>
                      <td className="py-4 px-4 text-center text-xs font-semibold text-gray-800">
                        {currentStock}
                      </td>
                      <td className="py-4 px-4 text-center text-xs text-gray-500">
                        {reservedStock}
                      </td>
                      <td className="py-4 px-4 text-center text-xs font-extrabold text-blue-900">
                        {availableStock}
                      </td>
                      <td className="py-4 px-4 text-center text-xs text-gray-500">
                        {p.minStockLevel ?? 5}
                      </td>
                      <td className="py-4 px-4 text-right text-xs font-bold text-gray-900">
                        {formatCurrency(stockValue)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(p)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Battery size={15} className="mr-1" /> Adjust
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Adjust Stock Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Adjust Inventory
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedProduct.name} ({selectedProduct.sku || "N/A"})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStockUpdate} className="space-y-4">
              <Input
                label="Current Stock Quantity *"
                type="number"
                value={editForm.currentStock}
                onChange={(e) => setEditForm({ ...editForm, currentStock: e.target.value })}
                placeholder="0"
              />

              <Input
                label="Minimum Alert Level *"
                type="number"
                value={editForm.minStockLevel}
                onChange={(e) => setEditForm({ ...editForm, minStockLevel: e.target.value })}
                placeholder="5"
              />

              <Input
                label="Supplier Lead Time"
                value={editForm.supplierLeadTime}
                onChange={(e) => setEditForm({ ...editForm, supplierLeadTime: e.target.value })}
                placeholder="e.g. 2-3 business days"
              />

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editForm.supplierAvailable}
                  onChange={(e) => setEditForm({ ...editForm, supplierAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Available on-demand from supplier
                </span>
              </label>

              <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Stock"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;