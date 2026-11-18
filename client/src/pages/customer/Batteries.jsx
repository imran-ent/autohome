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
    suitableFor: searchParams.get("suitableFor") || "",
    search: searchParams.get("search") || "",
  });

  const categories = [
    "Home Inverter",
    "Inverter Batteries",
    "Combo Home Inverter & Batteries",
    "Lithium Batteries",
    "Two Wheeler",
    "Three Wheeler",
    "Car",
  ];

  const brands = ["Exide", "SF Sonic", "Microtek", "Amaron", "Luminous"];

  const suitableOptions = [
    "1 BHK Home",
    "2 BHK Home",
    "3 BHK Home",
    "Shops & Small Office",
    "Lithium / LiFePO4",
    "Bike / Scooty",
    "Auto Rickshaw",
    "Car",
  ];

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      suitableFor: searchParams.get("suitableFor") || "",
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
        if (filters.suitableFor) params.suitableFor = filters.suitableFor;
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
    if (next.suitableFor) params.set("suitableFor", next.suitableFor);
    if (next.search.trim()) params.set("search", next.search.trim());
    setSearchParams(params, { replace: true });
  };

  const resetFilters = () => {
    setFilters({ category: "", brand: "", suitableFor: "", search: "" });
    setSearchParams({}, { replace: true });
  };

  const waLink = (p) => {
    return `https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(
      p.name
    )}%20(${encodeURIComponent(p.brand)}%20${encodeURIComponent(
      p.sku || ""
    )}).%20Please%20confirm%20availability,%20compatibility%20and%20final%20price.`;
  };

  const hasActiveFilters = Boolean(
    filters.category || filters.brand || filters.suitableFor || filters.search.trim()
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-3 sm:px-6 lg:px-8">
      <div className="mb-8 px-1">
        <h1 className="text-3xl font-bold text-charcoal tracking-tight">
          {filters.category || "All Products"}
        </h1>
        <p className="text-gray-500 mt-1">
          Genuine inverters, batteries & combos with free installation and warranty support
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-6 mb-8 elevated">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <Input
              label="Search"
              placeholder="Search model, brand or SKU..."
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
          <div className="md:col-span-2">
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
          <div className="md:col-span-2">
            <Select
              label="Suitable For"
              value={filters.suitableFor}
              onChange={(e) => updateFilter("suitableFor", e.target?.value ?? e)}
              options={[
                { value: "", label: "Any Usage" },
                ...suitableOptions.map((s) => ({ value: s, label: s })),
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

      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-xs sm:text-sm text-gray-600">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </span>
        <Link
          to="/battery-finder"
          className="text-xs sm:text-sm font-medium text-blue flex items-center gap-1"
        >
          Need help choosing? <ArrowRight size={15} />
        </Link>
      </div>

      {/* Product Grid: 2 per row on mobile, 3 per row on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
            const available = p.availableStock ?? p.currentStock ?? 0;
            const isOutOfStock = available <= 0;
            const hasDiscount =
              Number(p.mrp) > Number(p.sellingPrice) && Number(p.sellingPrice) > 0;
            const discountPercent = hasDiscount
              ? Math.round(((Number(p.mrp) - Number(p.sellingPrice)) / Number(p.mrp)) * 100)
              : 0;

            const capabilityTags =
              Array.isArray(p.suitableFor) && p.suitableFor.length > 0
                ? p.suitableFor
                : p.ahCapacity >= 150
                ? ["1 BHK Home, 2 BHK Home, Shops"]
                : p.ahCapacity > 0
                ? [`${p.ahCapacity}Ah Capacity`, p.warranty || "Official Warranty"]
                : [p.warranty || "Genuine Product"];

            return (
              <div
                key={p._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-xs hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Image + Top-Left Discount Pill */}
                  <div
                    onClick={() => navigate(`/products/${p._id}`)}
                    className="relative h-40 sm:h-56 bg-white border-b border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer p-3 sm:p-5"
                  >
                    {discountPercent > 0 && (
                      <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] sm:text-xs font-extrabold shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {isOutOfStock && (
                      <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                        Out of Stock
                      </span>
                    )}

                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Battery size={36} />
                      </div>
                    )}
                  </div>

                  {/* Brand, Title, Capability Pills & Price */}
                  <div className="p-3 sm:p-5 pb-2 sm:pb-3">
                    <p className="text-[11px] sm:text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
                      {p.brand}
                    </p>

                    <Link to={`/products/${p._id}`}>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {p.name}
                      </h3>
                    </Link>

                    {/* Capability / Suitable For Pills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] sm:text-[11px] font-medium leading-tight">
                        {capabilityTags.join(", ")}
                      </span>
                      {p.batteryType && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] sm:text-[11px] font-medium">
                          {p.batteryType}
                        </span>
                      )}
                    </div>

                    {/* Actual Price + Strikethrough MRP */}
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-base sm:text-xl font-extrabold text-gray-900">
                        {p.sellingPrice ? formatCurrency(p.sellingPrice) : "Contact for price"}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          {formatCurrency(p.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Buttons */}
                <div className="px-3 pb-3 sm:px-5 sm:pb-5 pt-2 flex flex-col sm:flex-row gap-1.5 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${p._id}`)}
                    className="w-full sm:flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    View Details
                  </button>
                  <a
                    href={waLink(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2 px-3 bg-white hover:bg-green-50 text-green-700 border border-green-600 text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    Send Enquiry
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