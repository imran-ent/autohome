import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Battery, ArrowRight, RotateCcw } from "lucide-react";
import { productService } from "../../services/productService.js";
import { Button } from "../../components/common/Button.jsx";
import { Card } from "../../components/common/Card.jsx";
import { Select } from "../../components/common/Select.jsx";
import { Input } from "../../components/common/Input.jsx";
import { formatCurrency } from "../../utils/helpers.js";

const Batteries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    search: searchParams.get("search") || "",
  });

  const categories = [
    "Home Inverter Batteries",
    "Bike Batteries",
    "Car Batteries",
    "Truck / Commercial Batteries",
    "Inverters",
    "Accessories",
  ];

  const brands = ["Exide", "SF Sonic", "Microtek", "Amaron", "Luminous"];

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      search: searchParams.get("search") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {
          isActive: "true",
          limit: 100,
        };
        if (filters.category) params.category = filters.category;
        if (filters.brand) params.brand = filters.brand;
        if (filters.search.trim()) params.search = filters.search.trim();

        const response = await productService.getAll(params);
        setProducts(response.data?.data?.products || response.data?.data || []);
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);

    const params = new URLSearchParams();
    if (next.category) params.set("category", next.category);
    if (next.brand) params.set("brand", next.brand);
    if (next.search.trim()) params.set("search", next.search.trim());
    setSearchParams(params, { replace: true });
  };

  const resetFilters = () => {
    setFilters({ category: "", brand: "", search: "" });
    setSearchParams({}, { replace: true });
  };

  const getStockStatus = (p) => {
    const a = p.availableStock ?? p.currentStock ?? 0;
    if (a <= 0) return "out_of_stock";
    if (a <= (p.minStockLevel || 5)) return "low_stock";
    return "in_stock";
  };

  const statusLabel = (s) => {
    if (s === "in_stock") return "In Stock";
    if (s === "low_stock") return "Low Stock";
    return "Out of Stock";
  };

  const statusColor = (s) => {
    if (s === "in_stock") return "bg-green-50 text-green-700 border-green-100";
    if (s === "low_stock") return "bg-yellow-50 text-yellow-700 border-yellow-100";
    return "bg-red-50 text-red-700 border-red-100";
  };

  const waLink = (p) => {
    return `https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(
      p.name
    )}%20(${encodeURIComponent(p.brand)}%20${encodeURIComponent(
      p.sku || ""
    )}).%20Please%20confirm%20availability,%20compatibility%20and%20final%20price.`;
  };

  const hasActiveFilters = Boolean(filters.category || filters.brand || filters.search.trim());

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal tracking-tight">Battery Catalogue</h1>
        <p className="text-gray-500 mt-1">
          Browse our complete range of genuine batteries and contact us to book
        </p>
      </div>

      {/* Simplified Filter Bar */}
      <Card className="p-6 mb-8 elevated">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <Input
              label="Search Batteries"
              placeholder="Search by brand, model or SKU..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              leftIcon={<Search size={18} className="text-gray-400" />}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              label="Category"
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target?.value ?? e)}
              options={[
                { value: "", label: "All Categories" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              label="Brand"
              value={filters.brand}
              onChange={(e) => updateFilter("brand", e.target?.value ?? e)}
              options={[
                { value: "", label: "All Brands" },
                ...brands.map((b) => ({ value: b, label: b })),
              ]}
            />
          </div>
          <div className="md:col-span-1">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              title="Reset Filters"
              className="w-full justify-center"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-600">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </span>
        <Link to="/battery-finder" className="text-sm font-medium text-blue flex items-center gap-1">
          Need help choosing? <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <Battery size={32} />
            </div>
            <h3 className="text-lg font-bold text-charcoal">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          products.map((p) => {
            const status = getStockStatus(p);
            return (
              <div key={p._id} className="card-premium group flex flex-col justify-between">
                <div>
                  <div className="h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-xl">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Battery size={32} />
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-bold border ${statusColor(
                        status
                      )}`}
                    >
                      {statusLabel(status)}
                    </span>
                  </div>

                  <div className="p-5 pb-3">
                    <p className="text-xs font-medium text-blue mb-1 uppercase tracking-wider">
                      {p.category}
                    </p>
                    <Link
                      to={`/products/${p._id}`}
                      className="group-hover:text-blue transition-colors"
                    >
                      <h3 className="text-lg font-bold text-charcoal mb-1">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-3">
                      {p.brand} {p.sku ? `• ${p.sku}` : ""}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-charcoal">
                        {p.sellingPrice ? formatCurrency(p.sellingPrice) : "Contact for price"}
                      </span>
                      {p.ahCapacity > 0 && (
                        <span className="text-xs text-gray-500">/ {p.ahCapacity}Ah</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/products/${p._id}`)}
                    className="flex-1"
                  >
                    Details
                  </Button>
                  <a
                    href={waLink(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Batteries;