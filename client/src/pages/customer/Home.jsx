import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Battery,
  ArrowRight,
  Search,
  ShieldCheck,
  Phone,
  Wrench,
  Droplets,
  Zap,
  MapPin,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button.jsx";
import { Card } from "../../components/common/Card.jsx";
import { productService } from "../../services/productService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { smartSearchProducts } from "../../utils/smartSearch.js";

const FEATURED_CATEGORIES = [
  "Inverter Batteries",
  "Lithium Batteries",
  "Combo Home Inverter & Batteries",
];

const QUICK_SEARCH_TAGS = [
  "Battery for 2 BHK",
  "150Ah Inverter",
  "Lithium Battery",
  "Exide",
  "Car Battery",
  "Two Wheeler",
];

const CategoryIllustration = ({ type }) => {
  switch (type) {
    case "home-inverter":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-full p-2">
          <rect x="22" y="26" width="136" height="60" rx="8" fill="#1e293b" />
          <rect x="30" y="34" width="120" height="44" rx="4" fill="#0f172a" />
          <rect x="42" y="46" width="44" height="18" rx="3" fill="#2563eb" opacity="0.85" />
          <circle cx="105" cy="55" r="4" fill="#22c55e" />
          <circle cx="118" cy="55" r="4" fill="#f59e0b" />
          <circle cx="131" cy="55" r="4" fill="#94a3b8" />
          <path d="M58 55h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "inverter-batteries":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-full p-2">
          <rect x="48" y="14" width="16" height="8" rx="2" fill="#dc2626" />
          <rect x="116" y="14" width="16" height="8" rx="2" fill="#1e293b" />
          <rect x="36" y="22" width="108" height="74" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="36" y="22" width="108" height="18" rx="6" fill="#1d4ed8" />
          <rect x="52" y="50" width="76" height="28" rx="4" fill="#eff6ff" />
          <path d="M92 54l-6 10h6l-2 10 8-11h-6l2-9z" fill="#2563eb" />
        </svg>
      );
    case "combo":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-full p-2">
          <rect x="14" y="44" width="76" height="48" rx="6" fill="#1e293b" />
          <rect x="22" y="54" width="28" height="12" rx="2" fill="#3b82f6" />
          <circle cx="62" cy="60" r="3.5" fill="#22c55e" />
          <circle cx="74" cy="60" r="3.5" fill="#f59e0b" />
          <circle cx="96" cy="68" r="9" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
          <path d="M96 64v8M92 68h8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          <rect x="114" y="20" width="10" height="6" rx="1.5" fill="#dc2626" />
          <rect x="146" y="20" width="10" height="6" rx="1.5" fill="#1e293b" />
          <rect x="108" y="26" width="56" height="66" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="108" y="26" width="56" height="14" rx="5" fill="#dc2626" />
          <rect x="116" y="48" width="40" height="24" rx="3" fill="#fef2f2" />
        </svg>
      );
    case "lithium-batteries":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-full p-2">
          <rect x="50" y="14" width="14" height="8" rx="2" fill="#ef4444" />
          <rect x="116" y="14" width="14" height="8" rx="2" fill="#0f172a" />
          <rect x="38" y="22" width="104" height="74" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
          <rect x="38" y="22" width="104" height="16" rx="8" fill="#059669" />
          <rect x="54" y="46" width="72" height="36" rx="6" fill="#1e293b" />
          <rect x="64" y="54" width="10" height="20" rx="2" fill="#10b981" />
          <rect x="78" y="54" width="10" height="20" rx="2" fill="#10b981" />
          <rect x="92" y="54" width="10" height="20" rx="2" fill="#34d399" />
          <path d="M114 53l-5 9h5l-2 9 7-10h-5l2-8z" fill="#fbbf24" />
        </svg>
      );
    case "two-wheeler":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-full p-2">
          <circle cx="46" cy="78" r="18" fill="none" stroke="#1e293b" strokeWidth="5" />
          <circle cx="46" cy="78" r="6" fill="#64748b" />
          <circle cx="134" cy="78" r="18" fill="none" stroke="#1e293b" strokeWidth="5" />
          <circle cx="134" cy="78" r="6" fill="#64748b" />
          <path
            d="M46 78L72 52h34l18 26M72 52l-8-14h16M106 52l14-20h12"
            stroke="#2563eb"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M66 44h36l10 12H62z" fill="#1e3a8a" />
          <circle cx="135" cy="36" r="5" fill="#f59e0b" />
        </svg>
      );
    case "three-wheeler":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-full p-2">
          <path
            d="M44 24h64c12 0 20 8 22 20l8 28H36V34c0-6 4-10 8-10z"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="2"
          />
          <path d="M44 24h64c8 0 14 4 17 10H38c1-6 3-10 6-10z" fill="#1e293b" />
          <rect x="44" y="38" width="32" height="22" rx="3" fill="#1e293b" />
          <path d="M98 36h24l6 22H98z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="36" y="60" width="104" height="16" rx="4" fill="#1e293b" />
          <circle cx="54" cy="82" r="13" fill="#0f172a" />
          <circle cx="54" cy="82" r="5" fill="#94a3b8" />
          <circle cx="128" cy="82" r="13" fill="#0f172a" />
          <circle cx="128" cy="82" r="5" fill="#94a3b8" />
        </svg>
      );
    case "car":
    default:
      return (
        <svg viewBox="0 0 180 110" className="w-full h-full p-2">
          <path
            d="M34 56l16-22h64l20 22h14c6 0 10 4 10 10v12H22V66c0-6 5-10 12-10z"
            fill="#2563eb"
          />
          <path d="M54 38h54l14 18H42z" fill="#dbeafe" />
          <line x1="82" y1="38" x2="82" y2="56" stroke="#2563eb" strokeWidth="3" />
          <circle cx="50" cy="80" r="13" fill="#0f172a" />
          <circle cx="50" cy="80" r="5" fill="#cbd5e1" />
          <circle cx="130" cy="80" r="13" fill="#0f172a" />
          <circle cx="130" cy="80" r="5" fill="#cbd5e1" />
          <rect x="148" y="62" width="8" height="5" rx="2" fill="#fef08a" />
        </svg>
      );
  }
};

const CategoryCard = ({ item, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-4 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col items-center text-center"
    >
      <div className="w-full h-24 sm:h-28 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center mb-3 group-hover:scale-[1.03] transition-transform">
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <CategoryIllustration type={item.slug} />
        )}
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-blue transition-colors leading-snug">
        {item.name}
      </h3>
    </div>
  );
};

const FeaturedProductCard = ({ p, navigate }) => {
  const [imgError, setImgError] = useState(false);

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
          <p className="text-[11px] sm:text-xs font-extrabold text-blue uppercase tracking-wider mb-1">
            {p.brand}
          </p>

          <Link to={`/products/${p._id}`}>
            <h3 className="text-sm sm:text-base font-bold text-charcoal mb-2 group-hover:text-blue transition-colors line-clamp-2 leading-snug">
              {p.name}
            </h3>
          </Link>

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

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base sm:text-xl font-extrabold text-charcoal">
              {p.sellingPrice
                ? `₹${new Intl.NumberFormat("en-IN").format(p.sellingPrice)}`
                : "₹--"}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{new Intl.NumberFormat("en-IN").format(p.mrp)}
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

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Instant smart search states
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProtectedNav = (path, featureName) => {
    if (!isAuthenticated) {
      toast.error(`Please login or register first to access ${featureName}`);
      navigate("/login", { state: { from: { pathname: path } } });
      return;
    }
    navigate(path);
  };

  // Close instant search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load full active catalog once for instant smart search + featured showcase
  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      try {
        const res = await productService.getAll({
          isActive: "true",
          limit: 250,
        });
        const items = res.data?.data?.products || res.data?.data || [];
        setAllProducts(Array.isArray(items) ? items : []);
      } catch (e) {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadCatalog();
  }, []);

  // Real-time intent-aware search results
  const smartMatches = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return [];
    return smartSearchProducts(allProducts, trimmed);
  }, [allProducts, searchQuery]);

  const dropdownResults = smartMatches.slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setShowDropdown(false);
    if (!trimmed) {
      navigate("/batteries");
      return;
    }
    navigate(`/batteries?search=${encodeURIComponent(trimmed)}`);
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    setShowDropdown(true);
  };

  const categories = [
    {
      name: "Home Inverter",
      slug: "home-inverter",
      image: "/categories/home-inverter.png",
    },
    {
      name: "Inverter Batteries",
      slug: "inverter-batteries",
      image: "/categories/inverter-batteries.png",
    },
    {
      name: "Combo Home Inverter & Batteries",
      slug: "combo",
      image: "/categories/combo.png",
    },
    {
      name: "Lithium Batteries",
      slug: "lithium-batteries",
      image: "/categories/lithium-batteries.png",
    },
    {
      name: "Two Wheeler",
      slug: "two-wheeler",
      image: "/categories/two-wheeler.png",
    },
    {
      name: "Three Wheeler",
      slug: "three-wheeler",
      image: "/categories/three-wheeler.png",
    },
    {
      name: "Car",
      slug: "car",
      image: "/categories/car.png",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Genuine Brands",
      desc: "Exide, SF, Microtek and other trusted brands with official warranty.",
    },
    {
      icon: Zap,
      title: "Free Installation",
      desc: "Complimentary professional installation on all Home Inverter Batteries.",
    },
    {
      icon: Droplets,
      title: "6 Months Free Distilled Water",
      desc: "Get 6 months of free doorstep battery distilled water service & top-ups.",
    },
    {
      icon: Wrench,
      title: "Inverter Hardware Repair",
      desc: "Chip-level inverter board repair, transformer fix & 24-hour technician visit.",
    },
  ];

  // Build balanced featured list from Inverter Batteries, Lithium Batteries & Combos
  const displayedFeatured = useMemo(() => {
    if (activeTab !== "ALL") {
      return allProducts.filter((p) => p.category === activeTab).slice(0, 6);
    }

    const inv = allProducts.filter((p) => p.category === "Inverter Batteries");
    const lith = allProducts.filter((p) => p.category === "Lithium Batteries");
    const combo = allProducts.filter(
      (p) => p.category === "Combo Home Inverter & Batteries"
    );

    const combined = [];
    const maxLen = Math.max(inv.length, lith.length, combo.length);
    for (let i = 0; i < maxLen && combined.length < 6; i++) {
      if (inv[i] && combined.length < 6) combined.push(inv[i]);
      if (lith[i] && combined.length < 6) combined.push(lith[i]);
      if (combo[i] && combined.length < 6) combined.push(combo[i]);
    }
    return combined.length > 0 ? combined : allProducts.slice(0, 6);
  }, [allProducts, activeTab]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-navy">
        <div className="absolute inset-0 bg-[url('../src/resource/homepageimg.png')] bg-cover bg-center opacity-100 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60 pointer-events-none" />
        <div className="container-premium relative z-10 pt-24 pb-24 px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider border border-gold/40 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Established 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white text-balance mb-6 leading-tight">
              Premium Power for <br />
              <span className="text-blue">Every Journey</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Discover the right battery for your home, vehicle or business with AI-powered recommendations, genuine brands and expert service.
            </p>

            {/* Instant Smart Store Search Bar */}
            <div ref={searchContainerRef} className="relative max-w-2xl mb-8">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-white rounded-2xl p-1.5 shadow-xl border border-white/20 focus-within:ring-2 focus-within:ring-blue"
              >
                <div className="pl-3 pr-2 text-gray-400 shrink-0">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim().length >= 2) setShowDropdown(true);
                  }}
                  placeholder="Try 'Battery for 2 BHK', 'Exide 150Ah', 'Lithium', 'Car'..."
                  className="w-full py-2.5 px-1 text-sm sm:text-base text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    aria-label="Clear search"
                    className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-navy hover:opacity-90 text-white text-xs sm:text-sm font-bold rounded-xl transition-opacity shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-gray-300 font-medium">Popular:</span>
                {QUICK_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Instant Smart Search Results Dropdown */}
              {showDropdown && searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {loading ? (
                    <div className="p-5 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                      Loading store inventory...
                    </div>
                  ) : dropdownResults.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500">
                          {smartMatches.length} matching{" "}
                          {smartMatches.length === 1 ? "product" : "products"} found
                        </span>
                        <span className="text-[10px] font-semibold text-blue">
                          Click to view specs
                        </span>
                      </div>
                      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {dropdownResults.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              setShowDropdown(false);
                              navigate(`/products/${item._id}`);
                            }}
                            className="flex items-center justify-between gap-3 p-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-1">
                                {item.images?.[0] ? (
                                  <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <Battery size={20} className="text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-blue uppercase">
                                  {item.brand} • {item.category}
                                </p>
                                <p className="text-sm font-bold text-charcoal truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate">
                                  {item.ahCapacity > 0 ? `${item.ahCapacity} Ah` : ""}
                                  {item.ahCapacity > 0 && item.warranty ? " • " : ""}
                                  {item.warranty || ""}
                                  {Array.isArray(item.suitableFor) &&
                                  item.suitableFor.length > 0
                                    ? ` • ${item.suitableFor.join(", ")}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-extrabold text-charcoal block">
                                {item.sellingPrice
                                  ? `₹${new Intl.NumberFormat("en-IN").format(item.sellingPrice)}`
                                  : "Enquire"}
                              </span>
                              <span className="text-[10px] font-semibold text-blue">
                                View →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-navy border-t border-gray-200 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        View all {smartMatches.length} matching batteries{" "}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 text-center">
                      <p className="text-xs text-gray-500 mb-2">
                        No exact match found for "{searchQuery.trim()}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/batteries");
                        }}
                        className="text-xs font-bold text-blue hover:underline cursor-pointer"
                      >
                        Browse full battery catalog →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleProtectedNav("/battery-finder", "AI Battery Finder")}
                className="w-full sm:w-auto justify-center"
              >
                <Zap size={20} /> AI Battery Finder
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/batteries")}
                className="w-full sm:w-auto justify-center bg-white text-navy border-white hover:bg-gray-100"
              >
                Browse All Batteries <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 sm:py-20 bg-offwhite">
        <div className="container-premium px-3 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-10 sm:mb-12">
            <div className="h-px bg-gray-300 flex-1 max-w-[120px]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal text-center">
              Shop by Category
            </h2>
            <div className="h-px bg-gray-300 flex-1 max-w-[120px]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.name}
                item={cat}
                onClick={() => navigate(`/batteries?category=${encodeURIComponent(cat.name)}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-premium px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">Featured Products</h2>
              <p className="text-xs sm:text-base text-gray-500">
                Top Inverter Batteries, Lithium Batteries &amp; Home Combos
              </p>
            </div>
            <Link
              to="/batteries"
              className="text-xs sm:text-sm font-semibold text-blue hover:text-navy transition-colors flex items-center gap-1 shrink-0"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {/* Category Tabs for Featured Section */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              style={
                activeTab === "ALL"
                  ? { backgroundColor: "#0f172a", color: "#ffffff" }
                  : undefined
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-navy text-white border-navy"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              All Featured
            </button>
            {FEATURED_CATEGORIES.map((catName) => (
              <button
                key={catName}
                type="button"
                onClick={() => setActiveTab(catName)}
                style={
                  activeTab === catName
                    ? { backgroundColor: "#0f172a", color: "#ffffff" }
                    : undefined
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  activeTab === catName
                    ? "bg-navy text-white border-navy"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {catName}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {loading ? (
              <div className="col-span-full py-16 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
              </div>
            ) : displayedFeatured.length > 0 ? (
              displayedFeatured.map((p) => (
                <FeaturedProductCard key={p._id} p={p} navigate={navigate} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                  <Battery size={32} />
                </div>
                <p className="text-gray-500">
                  No featured products found in this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Perks & Value Props */}
      <section className="py-20 bg-offwhite">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-8 rounded-xl border border-gray-100 bg-white hover:elevated"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue mb-4">
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Maintenance & Repair CTA Section */}
      <section className="py-20 bg-navy">
        <div className="container-premium">
          <div className="bg-white/5 rounded-2xl p-10 md:p-16 border border-white/10 backdrop-blur-sm text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Battery Maintenance & Inverter Repair
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Is your battery not charging or giving low backup? Book a professional maintenance service and get a technician visit within 24 hours.
            </p>
            <div className="flex justify-center">
              <Button
                variant="gold"
                size="lg"
                onClick={() => handleProtectedNav("/maintenance", "Maintenance & Repair")}
              >
                <Wrench size={20} /> Book Maintenance & Repair
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Call & Shop Location Section */}
      <section className="py-20 bg-offwhite">
        <div className="container-premium">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-2">Contact & Store Location</h2>
            <p className="text-gray-500">Speak with our battery experts or visit our shop in Pernambut</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 rounded-2xl border border-gray-200 bg-white text-center flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-navy/5 rounded-xl flex items-center justify-center mx-auto mb-4 text-navy">
                  <Phone size={26} />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">Call Us Directly</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Instant assistance for pricing, compatibility & doorstep service
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+919789688756"
                  style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-navy text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Phone size={15} /> +91 97896 88756
                </a>
                <a
                  href="tel:+919443437168"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-navy text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <Phone size={15} /> +91 94434 37168
                </a>
              </div>
            </Card>

            <Card className="p-8 rounded-2xl border border-gray-200 bg-white text-center flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue">
                  <MapPin size={26} />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">Visit Our Shop</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Opp. SN Tea Stall, Maula Street, Pernambut
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/Eo7VaAAysAE992YH8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                <MapPin size={15} /> Open Google Maps
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;