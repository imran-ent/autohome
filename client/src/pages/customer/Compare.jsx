import { useState, useEffect } from "react";
import { Battery, X, ArrowRight, Check, ChevronRight } from "lucide-react";
import { productService } from "../../services/productService.js";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import { useNavigate } from "react-router-dom";

const Compare = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const MAX_COMPARE = 4;

  useEffect(() => {
    const load = async () => {
      try {
        const response = await productService.getAll({
          isActive: "true",
          limit: 100,
        });
        setProducts(response.data.data.products || []);
      } catch (e) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= MAX_COMPARE) {
        toast.error(`Compare up to ${MAX_COMPARE} batteries`);
        return;
      }
      setSelected([...selected, id]);
    }
  };

  const removeSelect = (id) => {
    setSelected(selected.filter((s) => s !== id));
  };

  const selectedProducts = products.filter((p) => selected.includes(p._id));

  const fields = [
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "ahCapacity", label: "Capacity (Ah)", render: (v) => `${v} Ah` },
    { key: "voltage", label: "Voltage (V)", render: (v) => `${v} V` },
    { key: "batteryType", label: "Battery Type" },
    { key: "warranty", label: "Warranty" },
    { key: "sellingPrice", label: "Price", render: (v) => formatCurrency(v) },
    { key: "stockStatus", label: "Availability" },
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Battery Comparison</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Battery Comparison</h1>
        <p className="text-gray-500 mt-1">
          Compare up to {MAX_COMPARE} batteries side by side to make the right
          choice
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-charcoal mb-4">Select Batteries</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose up to {MAX_COMPARE} batteries to compare
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const isSelected = selected.includes(p._id);
            const available = p.availableStock || p.currentStock;
            const status = available <= 0 ? "out_of_stock" : available <= (p.minStockLevel || 5) ? "low_stock" : "in_stock";
            const statusColor = status === "in_stock" ? "bg-green-50 text-green-700" : status === "low_stock" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700";
            return (
              <div
                key={p._id}
                className={`card-premium p-4 cursor-pointer transition-all ${
                  isSelected ? "ring-2 ring-blue bg-blue-50" : "hover:border-gray-300"
                }`}
                onClick={() => toggleSelect(p._id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-charcoal line-clamp-1">{p.name}</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(p._id)}
                      className={`w-5 h-5 rounded text-blue border-gray-300 ${
                        isSelected ? "bg-blue border-blue" : ""
                      }`}
                    />
                    <span className="text-xs font-medium">
                      {isSelected ? "Selected" : "Add"}
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mb-2">{p.brand}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-charcoal">{p.sellingPrice ? formatCurrency(p.sellingPrice) : "₹--"} </span>
                  <span className="text-xs text-gray-400">/{p.ahCapacity}Ah</span>
                </div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase ${statusColor}`}>
                  {status.replace("_", " ")}
                </span>
              </div>
            );
          })}
        </div>
        {selected.length > 0 && (
          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => setSelected([])}>
              Clear All
            </Button>
            <Button variant="primary" disabled={selected.length < 2}>
              Compare {selected.length} Batteries <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      {selected.length >= 2 && (
        <Card className="p-8 overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-4 text-left font-bold text-charcoal w-24">Feature</th>
                  {selectedProducts.map((p) => (
                    <th key={p._id} className="pb-4 text-left font-bold text-charcoal w-64">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeSelect(p._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                        <span className="font-semibold text-charcoal">{p.brand}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{p.sku}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-charcoal">{field.label}</td>
                    {selectedProducts.map((p) => {
                      const value = field.render ? field.render(p[field.key]) : p[field.key];
                      return (
                        <td key={p._id} className="py-4 text-gray-600">
                          {field.key === "stockStatus" ? (
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              value === "in_stock" ? "bg-green-50 text-green-700 border border-green-100" :
                              value === "low_stock" ? "bg-yellow-50 text-yellow-700 border border-yellow-100" :
                              "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                              {value.replace("_", " ")}
                            </span>
                          ) : (
                            value || "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-b border-gray-100 bg-blue-50">
                  <td className="py-4 font-medium text-charcoal">Action</td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/products/${p._id}`)}
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selected.length > 0 && selected.length < 2 && (
        <div className="text-center py-20 text-gray-500">
          <Battery size={48} className="mx-auto mb-4 opacity-20" />
          <p>Select at least 2 batteries to compare</p>
        </div>
      )}
    </div>
  );
};

export default Compare;
