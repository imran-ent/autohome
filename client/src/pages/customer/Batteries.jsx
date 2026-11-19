import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Battery,
  Search,
  X,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { productService } from "../../services/productService.js";
import { formatCurrency } from "../../utils/helpers.js";
import { smartSearchProducts } from "../../utils/smartSearch.js";

const STORE_CATEGORIES = [
  "ALL",
  "Home Inverter",
  "Inverter Batteries",
  "Combo Home Inverter & Batteries",
  "Lithium Batteries",
  "Two Wheeler",
  "Three Wheeler",
  "Car",
];

const QUICK_FILTER_CHIPS = [
  "Battery for 1 BHK",
  "Battery for 2 BHK",
  "Battery for 3 BHK",
  "150Ah",
  "Lithium",
  "Exide",
  "Amaron",
  "Microtek",
];

const CatalogProductCard = ({ p, navigate }) => {
  const [imgError, setImgError] = useState(false);

  const available = p.availableStock ?? p.currentStock ?? 0;
  const isOutOfStock = available <= 0;

  const actualPrice = Number(p.sellingPrice || p.price || 0);
  const mrpPrice = Number(p.mrp || 0);
  const hasDiscount = mrpPrice > actualPrice && actualPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((mrpPrice - actualPrice) / mrpPrice) * 100)
    : 0;

  const capabilityTags =
    Array.isArray(p.suitableFor) && p.suitableFor.length > 0
      ? p.suitableFor
      : p.ahCapacity >= 150
      ? ["1 BHK Home, 2 BHK Home, Shops"]
      : p.ahCapacity > 0
      ? [`${p.ahCapacity}Ah Capacity`, p.warranty || "Official Warranty"]
      : [p.warranty || "Genuine Product"];

  const waUrl = `https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(
    p.name
  )}%20(${encodeURIComponent(p.brand)}%20${encodeURIComponent(
    p.sku || ""
  )}).%20Please%20confirm%20availability%20and%20final%20price.`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xs hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden">
      <div>
        <div
          onClick={() => navigate(`/products/${p._id}`)}
          className="relative h-40 sm:h-52 bg-white border-b border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer p-3 sm:p-5"
        >
          {discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] sm:text-xs font-extrabold shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          <span
            className={`absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isOutOfStock
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </span>

          {p.images && p.images.length > 0 && !imgError ? (
            <img
              src={p.images[0]}
              alt={p.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50/70 rounded-xl">
              <Battery size={36} />
            </div>
          )}
        </div>

        <div className="p-3 sm:p-5 pb-2 sm:pb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-[11px] sm:text-xs font-extrabold text-blue uppercase tracking-wider truncate">
              {p.brand}
            </p>
            <span className="text-[10px] font-medium text-gray-400 truncate">
              {p.category}
            </span>
          </div>

          <Link to={`/products/${p._id}`}>
            <h3 className="text-sm sm:text-base font-bold text-charcoal mb-2 group-hover:text-blue transition-colors line-clamp-2 leading-snug">
              {p.name}
            </h3>
          </Link>

          <div className="flex flex-wrap gap-1 mb-3">
            <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] sm:text-[11px] font-medium leading-tight">
              {capabilityTags.join(", ")}
            </span>
            {p.ahCapacity > 0 && (
              <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue text-[10px] sm:text-[11px] font-semibold">
                {p.ahCapacity} Ah
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base sm:text-xl font-extrabold text-charcoal">
              {actualPrice ? formatCurrency(actualPrice) : "Enquire"}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatCurrency(mrpPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 sm:px-5 sm:pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate(`/products/${p._id}`)}
          style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
          className="w-full py-2.5 px-3 bg-navy hover:opacity-90 text-white text-xs font-bold rounded-xl transition-opacity inline-flex items-center justify-center shadow-xs cursor-pointer"
        >
          View Details
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 bg-white hover:bg-green-50 text-green-700 border border-green-600 text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center"
        >
          Send Enquiry
        </a>
      </div>
    </div>
  );
};

const Batteries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "ALL"
  );
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Sync state when URL query params change (e.g., coming from Home search bar)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "ALL";
    setSearchInput(urlSearch);
    setSelectedCategory(
      STORE_CATEGORIES.includes(urlCategory) ? urlCategory : "ALL"
    );
  }, [searchParams]);

  // Fetch active catalog once
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getAll({
          isActive: "true",
          limit: 250,
        });
        const items = res.data?.data?.products || res.data?.data || [];
        setAllProducts(Array.isArray(items) ? items : []);
      } catch (err) {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique brands from inventory
  const availableBrands = useMemo(() => {
    const brands = new Set();
    allProducts.forEach((p) => {
      if (p.brand && String(p.brand).trim()) {
        brands.add(String(p.brand).trim());
      }
    });
    return ["ALL", ...Array.from(brands).sort()];
  }, [allProducts]);

  // Apply smart search + category + brand + stock + sorting
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    if (selectedCategory !== "ALL") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand !== "ALL") {
      list = list.filter(
        (p) =>
          String(p.brand || "").trim().toLowerCase() ===
          selectedBrand.toLowerCase()
      );
    }

    if (inStockOnly) {
      list = list.filter(
        (p) => (p.availableStock ?? p.currentStock ?? 0) > 0
      );
    }

    if (searchInput.trim()) {
      list = smartSearchProducts(list, searchInput.trim());
    }

    if (sortBy === "price-asc") {
      list.sort(
        (a, b) =>
          (Number(a.sellingPrice) || 0) - (Number(b.sellingPrice) || 0)
      );
    } else if (sortBy === "price-desc") {
      list.sort(
        (a, b) =>
          (Number(b.sellingPrice) || 0) - (Number(a.sellingPrice) || 0)
      );
    } else if (sortBy === "capacity-desc") {
      list.sort(
        (a, b) => (Number(b.ahCapacity) || 0) - (Number(a.ahCapacity) || 0)
      );
    }

    return list;
  }, [
    allProducts,
    selectedCategory,
    selectedBrand,
    inStockOnly,
    searchInput,
    sortBy,
  ]);

  const updateUrlParams = (nextSearch, nextCategory) => {
    const params = {};
    if (nextSearch && nextSearch.trim()) params.search = nextSearch.trim();
    if (nextCategory && nextCategory !== "ALL") params.category = nextCategory;
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    updateUrlParams(value, selectedCategory);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    updateUrlParams(searchInput, cat);
  };

  const handleResetAll = () => {
    setSearchInput("");
    setSelectedCategory("ALL");
    setSelectedBrand("ALL");
    setInStockOnly(false);
    setSortBy("relevance");
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    Boolean(searchInput.trim()) ||
    selectedCategory !== "ALL" ||
    selectedBrand !== "ALL" ||
    inStockOnly;

  return (
    <div className="min-h-screen bg-offwhite pt-28 sm:pt-32 pb-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Battery &amp; Inverter Catalog
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Search by home size (1 BHK, 2 BHK, 3 BHK), brand, Ah capacity, or vehicle model
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/battery-finder")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-colors self-start md:self-auto cursor-pointer"
          >
            <Sparkles size={14} /> Try AI Battery Finder
          </button>
        </div>

        {/* Smart Search + Filter Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs mb-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Smart Search Input */}
            <div className="lg:col-span-6 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search 'Battery for 2 BHK', '150Ah', 'Exide', 'Lithium', 'Car'..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-charcoal placeholder-gray-400 focus:bg-white focus:border-navy focus:outline-none transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                aria-label="Filter by brand"
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50/70 text-xs sm:text-sm font-semibold text-gray-700 focus:bg-white focus:border-navy focus:outline-none"
              >
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === "ALL" ? "All Brands" : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="lg:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50/70 text-xs sm:text-sm font-semibold text-gray-700 focus:bg-white focus:border-navy focus:outline-none"
              >
                <option value="relevance">Sort: Best Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="capacity-desc">Capacity: Highest Ah</option>
              </select>
            </div>

            {/* In Stock Only Toggle */}
            <div className="lg:col-span-2 flex items-center">
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 w-full cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-gray-300 text-navy focus:ring-navy"
                />
                <span className="text-xs font-bold text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Quick Intent Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal size={12} /> Quick Search:
            </span>
            {QUICK_FILTER_CHIPS.map((chip) => {
              const isActive =
                searchInput.trim().toLowerCase() === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSearchChange(isActive ? "" : chip)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue border-blue-200"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin pt-1 border-t border-gray-100">
            {STORE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  style={
                    active
                      ? { backgroundColor: "#0f172a", color: "#ffffff" }
                      : undefined
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? "bg-navy text-white border-navy"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat === "ALL" ? "All Categories" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count + Active Filter Reset */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <p className="text-xs sm:text-sm font-semibold text-gray-600">
            {loading
              ? "Loading products..."
              : `Showing ${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "product" : "products"
                }${searchInput.trim() ? ` for "${searchInput.trim()}"` : ""}`}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:underline cursor-pointer"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="h-80 rounded-2xl bg-white border border-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((p) => (
              <CatalogProductCard key={p._id} p={p} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <Battery size={32} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">
              No matching batteries found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
              Try searching by brand (Exide, Amaron, Microtek), home size (1 BHK, 2 BHK), or reset your active filters.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
              className="px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Show All Batteries
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Batteries;