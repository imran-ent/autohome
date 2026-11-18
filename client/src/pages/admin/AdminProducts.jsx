import { useState, useEffect } from "react";
import {
  Battery,
  Search,
  PlusCircle,
  RefreshCw,
  Edit,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { productService } from "../../services/productService.js";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Card from "../../components/common/Card.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { formatCurrency } from "../../utils/helpers.js";

const CATEGORIES = [
  "Home Inverter",
  "Inverter Batteries",
  "Combo Home Inverter & Batteries",
  "Lithium Batteries",
  "Two Wheeler",
  "Three Wheeler",
  "Car",
];

const SUITABLE_PRESETS = [
  "1 BHK Home",
  "2 BHK Home",
  "3 BHK Home",
  "Shops & Small Office",
  "Lithium / LiFePO4",
  "Bike / Scooty",
  "Auto Rickshaw",
  "Car",
];

const getStockBadge = (stock, minLevel = 5) => {
  const current = Number(stock) || 0;
  if (current <= 0) {
    return {
      label: "Out of Stock",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }
  if (current <= Number(minLevel)) {
    return {
      label: "Low Stock",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  return {
    label: "In Stock",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
};

const cleanPastedDescription = (raw) => {
  if (!raw) return "";
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\t+/g, " ")
    .replace(/\s*•\s*/g, "\n• ")
    .split(/\n+/)
    .map((line) => line.replace(/\s{2,}/g, " ").trim())
    .filter(Boolean)
    .join("\n");
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "Inverter Batteries",
    subCategory: "",
    ahCapacity: "",
    voltage: "",
    batteryType: "",
    warranty: "",
    mrp: "",
    purchasePrice: "",
    sellingPrice: "",
    gstRate: "18",
    currentStock: "0",
    minStockLevel: "5",
    supplierAvailable: false,
    supplierLeadTime: "",
    description: "",
    suitableFor: "",
    pros: "",
    cons: "",
    images: [],
    isActive: true,
  });

  useEffect(() => {
    loadProducts();
  }, [categoryFilter]);

  const loadProducts = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await productService.getAll({
        search: search.trim() || undefined,
        category: categoryFilter || undefined,
        isActive: "true",
        limit: 100,
      });
      const data = response.data?.data?.products || response.data?.data || [];
      setProducts(data);
      if (isManualRefresh) toast.success("Products refreshed");
    } catch (e) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openCreate = () => {
    setEditMode(false);
    setEditingId(null);
    setImageUrlInput("");
    setForm({
      name: "",
      brand: "",
      sku: "",
      category: "Inverter Batteries",
      subCategory: "",
      ahCapacity: "",
      voltage: "",
      batteryType: "",
      warranty: "",
      mrp: "",
      purchasePrice: "",
      sellingPrice: "",
      gstRate: "18",
      currentStock: "0",
      minStockLevel: "5",
      supplierAvailable: false,
      supplierLeadTime: "",
      description: "",
      suitableFor: "",
      pros: "",
      cons: "",
      images: [],
      isActive: true,
    });
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditMode(true);
    setEditingId(p._id);
    setImageUrlInput("");
    setForm({
      name: p.name || "",
      brand: p.brand || "",
      sku: p.sku || "",
      category: CATEGORIES.includes(p.category) ? p.category : "Inverter Batteries",
      subCategory: p.subCategory || "",
      ahCapacity: p.ahCapacity != null ? String(p.ahCapacity) : "",
      voltage: p.voltage != null ? String(p.voltage) : "",
      batteryType: p.batteryType || "",
      warranty: p.warranty || "",
      mrp: p.mrp != null ? String(p.mrp) : "",
      purchasePrice: p.purchasePrice != null ? String(p.purchasePrice) : "",
      sellingPrice: p.sellingPrice != null ? String(p.sellingPrice) : "",
      gstRate: p.gstRate != null ? String(p.gstRate) : "18",
      currentStock: p.currentStock != null ? String(p.currentStock) : "0",
      minStockLevel: p.minStockLevel != null ? String(p.minStockLevel) : "5",
      supplierAvailable: !!p.supplierAvailable,
      supplierLeadTime: p.supplierLeadTime || "",
      description: p.description || "",
      suitableFor: Array.isArray(p.suitableFor) ? p.suitableFor.join(", ") : "",
      pros: Array.isArray(p.pros) ? p.pros.join(", ") : "",
      cons: Array.isArray(p.cons) ? p.cons.join(", ") : "",
      images: Array.isArray(p.images) ? p.images : p.images ? [p.images] : [],
      isActive: p.isActive !== false,
    });
    setOpen(true);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSuitableTag = (tag) => {
    const current = form.suitableFor
      ? form.suitableFor.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const exists = current.some((item) => item.toLowerCase() === tag.toLowerCase());
    const next = exists
      ? current.filter((item) => item.toLowerCase() !== tag.toLowerCase())
      : [...current, tag];
    handleChange("suitableFor", next.join(", "));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB limit`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.sku.trim() || !form.brand.trim()) {
      toast.error("Please fill in Product Name, Brand, and SKU");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        sku: form.sku.trim(),
        category: form.category,
        subCategory: form.subCategory.trim(),
        ahCapacity: Number(form.ahCapacity) || 0,
        voltage: Number(form.voltage) || 0,
        batteryType: form.batteryType.trim(),
        warranty: form.warranty.trim(),
        mrp: Number(form.mrp) || 0,
        purchasePrice: Number(form.purchasePrice) || 0,
        sellingPrice: Number(form.sellingPrice) || 0,
        gstRate: Number(form.gstRate) || 18,
        currentStock: Number(form.currentStock) || 0,
        minStockLevel: Number(form.minStockLevel) || 5,
        supplierAvailable: form.supplierAvailable === true,
        supplierLeadTime: form.supplierLeadTime.trim(),
        description: cleanPastedDescription(form.description),
        suitableFor: form.suitableFor
          ? form.suitableFor.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        pros: form.pros
          ? form.pros.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        cons: form.cons
          ? form.cons.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        images: form.images,
        isActive: form.isActive === true,
      };

      if (editMode) {
        await productService.update(editingId, payload);
        toast.success("Product updated successfully");
      } else {
        await productService.create(payload);
        toast.success("Product created successfully");
      }
      setOpen(false);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productService.remove(deleteId);
      toast.success("Product deleted successfully");
      setDeleteConfirm(false);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = String(p.name || "").toLowerCase();
    const brand = String(p.brand || "").toLowerCase();
    const sku = String(p.sku || "").toLowerCase();
    return name.includes(q) || brand.includes(q) || sku.includes(q);
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Products</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
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
            Product Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Add, edit, upload images, and monitor battery inventory &amp; specs
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openCreate}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle size={18} /> Add Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-5 mb-8 border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              label="Search Products"
              placeholder="Search by product name, brand, or SKU..."
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
          <Button
            variant="outline"
            onClick={() => loadProducts(true)}
            disabled={refreshing}
            className="w-full md:w-auto flex items-center justify-center gap-1.5 self-end"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin text-blue" : ""} />
            <span>Refresh</span>
          </Button>
        </div>
      </Card>

      {/* Product Table */}
      <Card className="p-6 mb-8 border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">SKU Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Our Price / MRP</th>
                <th className="py-3.5 px-4 text-center">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400 text-sm">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stockQty = p.availableStock ?? p.currentStock ?? 0;
                  const badge = getStockBadge(stockQty, p.minStockLevel);
                  const firstImg = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;

                  return (
                    <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {firstImg ? (
                            <img src={firstImg} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">
                          {p.brand} {p.ahCapacity ? `• ${p.ahCapacity}Ah` : ""}
                        </div>
                        {Array.isArray(p.suitableFor) && p.suitableFor.length > 0 && (
                          <div className="text-[11px] text-blue mt-0.5">
                            {p.suitableFor.join(", ")}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-gray-700">
                        {p.sku || "—"}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600">
                        {p.category}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        <div>{formatCurrency(p.sellingPrice || 0)}</div>
                        {Number(p.mrp) > Number(p.sellingPrice) && (
                          <div className="text-xs font-normal text-gray-400 line-through">
                            {formatCurrency(p.mrp)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {stockQty} units
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(p)}
                          className="text-blue hover:bg-blue-50"
                        >
                          <Edit size={15} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeleteId(p._id);
                            setDeleteConfirm(true);
                          }}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          <Trash2 size={15} className="mr-1" /> Delete
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

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editMode ? "Edit Product" : "Add New Product"}
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
              {/* Product Images Upload Section */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon size={15} className="text-blue" /> Product Images
                  </span>
                  <span className="text-[11px] font-normal text-gray-500 lowercase">
                    ({form.images.length} added)
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 cursor-pointer transition-colors text-navy font-semibold text-xs">
                    <Upload size={16} />
                    <span>Upload Image Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste image URL (e.g., https://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                    className="text-xs"
                  >
                    Add URL
                  </Button>
                </div>

                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    {form.images.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-white group shadow-xs"
                      >
                        <img
                          src={imgSrc}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition-transform transform active:scale-90"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Product Name *"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Exide Invamaster 150Ah"
                />
                <Input
                  label="Brand *"
                  value={form.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="e.g. Exide, SF Sonic, Microtek"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="SKU / Product Code *"
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="e.g. IMST1500"
                />
                <Select
                  label="Category *"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target?.value ?? e)}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              </div>

              {/* Capability / Suitable For */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2.5">
                <Input
                  label="Capability / Suitable For (shown below product title)"
                  value={form.suitableFor}
                  onChange={(e) => handleChange("suitableFor", e.target.value)}
                  placeholder="e.g. 1 BHK Home, 2 BHK Home, Shops & Small Office"
                />
                <div className="flex flex-wrap gap-1.5">
                  {SUITABLE_PRESETS.map((preset) => {
                    const active = form.suitableFor
                      .toLowerCase()
                      .includes(preset.toLowerCase());
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => toggleSuitableTag(preset)}
                        style={
                          active
                            ? { backgroundColor: "#0f172a", color: "#ffffff" }
                            : undefined
                        }
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                          active
                            ? "bg-navy text-white border-navy"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {active ? "✓ " : "+ "}
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specs */}
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Battery size={15} className="text-blue" /> Technical Specifications
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <Input
                    label="Capacity (Ah)"
                    type="number"
                    value={form.ahCapacity}
                    onChange={(e) => handleChange("ahCapacity", e.target.value)}
                    placeholder="150"
                  />
                  <Input
                    label="Voltage (V)"
                    type="number"
                    value={form.voltage}
                    onChange={(e) => handleChange("voltage", e.target.value)}
                    placeholder="12"
                  />
                  <Input
                    label="Battery Type"
                    value={form.batteryType}
                    onChange={(e) => handleChange("batteryType", e.target.value)}
                    placeholder="Pure Sine Wave / Tubular"
                  />
                  <Input
                    label="Warranty"
                    value={form.warranty}
                    onChange={(e) => handleChange("warranty", e.target.value)}
                    placeholder="36 Months"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Input
                  label="MRP (₹)"
                  type="number"
                  value={form.mrp}
                  onChange={(e) => handleChange("mrp", e.target.value)}
                  placeholder="23857"
                />
                <Input
                  label="Purchase Price (₹)"
                  type="number"
                  value={form.purchasePrice}
                  onChange={(e) => handleChange("purchasePrice", e.target.value)}
                  placeholder="12500"
                />
                <Input
                  label="Our Price (₹) *"
                  type="number"
                  value={form.sellingPrice}
                  onChange={(e) => handleChange("sellingPrice", e.target.value)}
                  placeholder="15299"
                />
                <Input
                  label="Current Stock *"
                  type="number"
                  value={form.currentStock}
                  onChange={(e) => handleChange("currentStock", e.target.value)}
                  placeholder="10"
                />
                <Input
                  label="Min Stock"
                  type="number"
                  value={form.minStockLevel}
                  onChange={(e) => handleChange("minStockLevel", e.target.value)}
                  placeholder="5"
                />
              </div>

              {/* Multi-line Product Description with Auto-Clean */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700">
                    Product Description &amp; Features (paste bullet points or specs)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange("description", cleanPastedDescription(form.description));
                      toast.success("Description formatting cleaned");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-navy hover:underline cursor-pointer"
                  >
                    <Sparkles size={12} /> Clean &amp; Format Text
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder={
                    "Paste features or specifications here, one per line:\n- Pure Sine Wave Output for silent operation\n- Backup Time: Up to 4 Hours on 1 BHK load\n- Warranty: 36 Months On-Site"
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Pros (comma separated)"
                  value={form.pros}
                  onChange={(e) => handleChange("pros", e.target.value)}
                  placeholder="Long backup, Low maintenance"
                />
                <Input
                  label="Cons (comma separated)"
                  value={form.cons}
                  onChange={(e) => handleChange("cons", e.target.value)}
                  placeholder="Heavyweight"
                />
              </div>

              {/* Checkbox Controls */}
              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy border-gray-300"
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    Active Product (Visible on customer store)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.supplierAvailable}
                    onChange={(e) => handleChange("supplierAvailable", e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy border-gray-300"
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    Available from Supplier (On-demand order fallback)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
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
                    ? "Update Product"
                    : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action will remove it from inventory."
        confirmLabel="Delete Product"
        destructive
      />
    </div>
  );
};

export default AdminProducts;