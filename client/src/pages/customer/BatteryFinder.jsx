import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Battery,
  ArrowLeft,
  ChevronRight,
  Car,
  Truck,
  HelpCircle,
  Check,
  Sparkles,
  RotateCcw,
  Plus,
  Minus,
  Zap,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button.jsx";
import { Input } from "../../components/common/Input.jsx";
import { Card } from "../../components/common/Card.jsx";
import { productService } from "../../services/productService.js";
import { formatCurrency } from "../../utils/helpers.js";

const APPLICATION_OPTIONS = [
  {
    value: "Home Inverter Battery",
    label: "Home Inverter & Lithium",
    icon: Zap,
    desc: "Tubular, Lithium (LiFePO4) & Combos",
    categories: [
      "Inverter Batteries",
      "Lithium Batteries",
      "Combo Home Inverter & Batteries",
      "Home Inverter",
      "Home Inverter Batteries",
      "Lithium Battery",
      "Inverters",
    ],
  },
  {
    value: "Car Battery",
    label: "Car Battery",
    icon: Car,
    desc: "Hatchback, Sedan & SUV",
    categories: ["Car", "Car Batteries"],
  },
  {
    value: "Bike Battery",
    label: "Bike / Scooter",
    icon: Battery,
    desc: "2-Wheelers & Scooters",
    categories: ["Two Wheeler", "Bike Batteries"],
  },
  {
    value: "Three Wheeler / Commercial",
    label: "Three Wheeler / Commercial",
    icon: Truck,
    desc: "Auto Rickshaw, Trucks & Tractors",
    categories: ["Three Wheeler", "Truck / Commercial Batteries"],
  },
];

const HOME_PREFERENCE_OPTIONS = [
  { value: "ALL", label: "All Home Backup Options" },
  { value: "Inverter Batteries", label: "Tubular Inverter Battery" },
  { value: "Lithium Batteries", label: "Lithium (LiFePO4) Battery" },
  { value: "Combo Home Inverter & Batteries", label: "Inverter + Battery Combo" },
];

const BatteryFinder = () => {
  const [step, setStep] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  const [form, setForm] = useState({
    batteryType: "",
    homePreference: "ALL",
    fans: 2,
    lights: 4,
    televisions: 1,
    backupDuration: "4",
    preferredBrand: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const STEPS = [
    { id: "type", label: "Battery Type" },
    { id: "details", label: "Your Needs" },
    { id: "result", label: "Recommendations" },
  ];

  useEffect(() => {
    const fetchCatalog = async () => {
      setInventoryLoading(true);
      try {
        const res = await productService.getAll({ isActive: "true", limit: 200 });
        const list = res.data?.data?.products || res.data?.data || [];
        setInventory(Array.isArray(list) ? list : []);
      } catch (err) {
        toast.error("Unable to load store inventory");
        setInventory([]);
      } finally {
        setInventoryLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCounter = (key, delta) => {
    setForm((prev) => ({
      ...prev,
      [key]: Math.max(0, (parseInt(prev[key], 10) || 0) + delta),
    }));
  };

  const validateDetailsStep = () => {
    if (form.batteryType === "Home Inverter Battery") {
      return Number(form.backupDuration) > 0;
    }
    return Boolean(form.vehicleMake.trim() && form.vehicleModel.trim());
  };

  // Estimate required Ah for home load: Fan ~75W, LED Light ~15W, TV/Laptop ~100W
  const estimateRequiredAh = () => {
    const totalWatts =
      (Number(form.fans) || 0) * 75 +
      (Number(form.lights) || 0) * 15 +
      (Number(form.televisions) || 0) * 100;
    const hours = Math.max(1, Number(form.backupDuration) || 4);
    const effectiveWatts = Math.max(150, totalWatts);
    // 12V battery with ~80% usable efficiency
    return Math.ceil((effectiveWatts * hours) / (12 * 0.8));
  };

  // Filter store products matching the chosen application
  const getMatchingCatalog = () => {
    const selectedApp = APPLICATION_OPTIONS.find(
      (opt) => opt.value === form.batteryType
    );
    if (!selectedApp) return [];

    let pool = inventory.filter((p) =>
      selectedApp.categories.includes(p.category)
    );

    if (
      form.batteryType === "Home Inverter Battery" &&
      form.homePreference &&
      form.homePreference !== "ALL"
    ) {
      const subPool = pool.filter((p) => p.category === form.homePreference);
      if (subPool.length > 0) pool = subPool;
    }

    // Prefer in-stock items first, keep supplier-available items as secondary
    const inStockPool = pool.filter(
      (p) => (p.availableStock ?? p.currentStock ?? 0) > 0
    );
    return inStockPool.length > 0 ? inStockPool : pool;
  };

  // Score and rank real database products deterministically (used for fallback & sorting)
  const buildDeterministicTiers = (pool) => {
    if (!pool.length) {
      return {
        budgetFriendly: [],
        bestValue: [],
        premiumChoice: [],
        disclaimer: "No matching products found in current stock.",
      };
    }

    const brandQuery = form.preferredBrand.trim().toLowerCase();
    const makeQuery = form.vehicleMake.trim().toLowerCase();
    const modelQuery = form.vehicleModel.trim().toLowerCase();
    const requiredAh = estimateRequiredAh();

    const scored = pool.map((p) => {
      let score = 0;
      const available = p.availableStock ?? p.currentStock ?? 0;
      if (available > 0) score += 20;

      if (brandQuery && String(p.brand || "").toLowerCase().includes(brandQuery)) {
        score += 35;
      }

      const searchableText = [
        p.name,
        p.brand,
        p.subCategory,
        p.description,
        ...(Array.isArray(p.suitableFor) ? p.suitableFor : []),
        ...(Array.isArray(p.compatibleVehicles)
          ? p.compatibleVehicles.map((v) => `${v.make || ""} ${v.model || ""}`)
          : []),
      ]
        .join(" ")
        .toLowerCase();

      if (form.batteryType === "Home Inverter Battery") {
        const cap = Number(p.ahCapacity) || 150;
        const diff = Math.abs(cap - requiredAh);
        score += Math.max(0, 40 - Math.round(diff / 5));
        if (cap >= requiredAh) score += 10;
      } else {
        if (makeQuery && searchableText.includes(makeQuery)) score += 25;
        if (modelQuery && searchableText.includes(modelQuery)) score += 35;
      }

      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, Math.min(9, scored.length)).map((s) => s.product);

    // Sort top candidates by selling price ascending to form Budget / Best Value / Premium tiers
    const byPrice = [...topCandidates].sort(
      (a, b) => (Number(a.sellingPrice) || 0) - (Number(b.sellingPrice) || 0)
    );

    const budget = byPrice[0];
    const premium = byPrice[byPrice.length - 1];
    const midIndex = Math.floor(byPrice.length / 2);
    const best = byPrice[midIndex] || budget;

    const formatFallbackItem = (p, tierReason) => ({
      product: p,
      reason: tierReason,
    });

    const uniqueUsed = new Set();
    const pickUnique = (candidate, reason) => {
      if (!candidate) return [];
      if (uniqueUsed.has(candidate._id) && byPrice.length > uniqueUsed.size) {
        const alt = byPrice.find((x) => !uniqueUsed.has(x._id));
        if (alt) {
          uniqueUsed.add(alt._id);
          return [formatFallbackItem(alt, reason)];
        }
      }
      uniqueUsed.add(candidate._id);
      return [formatFallbackItem(candidate, reason)];
    };

    const budgetList = pickUnique(
      budget,
      form.batteryType === "Home Inverter Battery"
        ? `Most affordable in-stock match for ~${requiredAh}Ah requirement.`
        : `Most budget-friendly ${form.batteryType.toLowerCase()} in our store.`
    );
    const bestList = pickUnique(
      best,
      form.batteryType === "Home Inverter Battery"
        ? `Balanced price, warranty & backup for ${form.backupDuration} hrs usage.`
        : `Ideal fit and warranty balance for ${form.vehicleMake} ${form.vehicleModel}.`
    );
    const premiumList = pickUnique(
      premium,
      `Maximum capacity & longest warranty available in our current stock.`
    );

    return {
      budgetFriendly: budgetList,
      bestValue: bestList,
      premiumChoice: premiumList,
      disclaimer:
        form.batteryType === "Home Inverter Battery"
          ? `Estimated requirement: ~${requiredAh}Ah for ${form.fans} fan(s), ${form.lights} light(s), and ${form.televisions} TV/laptop(s) over ${form.backupDuration} hours. Free installation & 6 months free distilled water included.`
          : `Showing genuine in-stock batteries from AutoHome Batteries Pernambut. Contact us for old battery exchange discount.`,
    };
  };

  // Map AI-selected productIds back to actual MongoDB product documents
  const hydrateAiRecommendations = (aiData, pool) => {
    const byId = new Map(pool.map((p) => [String(p._id), p]));
    const bySku = new Map(
      pool.map((p) => [String(p.sku || "").trim().toUpperCase(), p])
    );

    const resolveList = (arr) => {
      if (!Array.isArray(arr)) return [];
      const resolved = [];
      for (const entry of arr) {
        const matched =
          byId.get(String(entry.productId || "").trim()) ||
          bySku.get(String(entry.sku || entry.modelCode || "").trim().toUpperCase());
        if (matched) {
          resolved.push({
            product: matched,
            reason:
              entry.reason ||
              `Recommended ${matched.brand} ${matched.category} from our live stock.`,
          });
        }
      }
      return resolved.slice(0, 2);
    };

    const budgetFriendly = resolveList(aiData?.budgetFriendly);
    const bestValue = resolveList(aiData?.bestValue);
    const premiumChoice = resolveList(aiData?.premiumChoice);

    if (!budgetFriendly.length && !bestValue.length && !premiumChoice.length) {
      return null;
    }

    return {
      budgetFriendly,
      bestValue,
      premiumChoice,
      disclaimer:
        aiData?.disclaimer ||
        "All recommended batteries are currently available in our AutoHome Batteries Pernambut inventory.",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDetailsStep()) {
      toast.error("Please fill in the required vehicle or backup details");
      return;
    }

    const matchingCatalog = getMatchingCatalog();
    if (matchingCatalog.length === 0) {
      toast.error("No active products found in this category yet.");
      return;
    }

    setLoading(true);

    // Compact representation of real store inventory for the AI prompt
    const compactCatalog = matchingCatalog.slice(0, 40).map((p) => ({
      productId: p._id,
      name: p.name,
      brand: p.brand,
      sku: p.sku,
      category: p.category,
      ahCapacity: p.ahCapacity,
      voltage: p.voltage,
      batteryType: p.batteryType,
      warranty: p.warranty,
      sellingPrice: p.sellingPrice,
      mrp: p.mrp,
      availableStock: p.availableStock ?? p.currentStock ?? 0,
      suitableFor: p.suitableFor || [],
    }));

    try {
      if (window.puter && window.puter.ai) {
        const prompt = `
You are an expert battery technician for AutoHome Batteries in Pernambut, India.
Select the best matching batteries STRICTLY from the "STORE INVENTORY" list below.
NEVER invent products, SKUs, or prices. You MUST return valid "productId" values copied verbatim from STORE INVENTORY.

Customer Requirements:
- Application: ${form.batteryType}
${
  form.batteryType === "Home Inverter Battery"
    ? `- Preferred Type: ${form.homePreference}
- Load: ${form.fans} Fans, ${form.lights} Lights, ${form.televisions} TV/Laptops
- Required Backup: ${form.backupDuration} Hours (Estimated ~${estimateRequiredAh()}Ah)`
    : `- Vehicle Make: ${form.vehicleMake}
- Vehicle Model: ${form.vehicleModel}
- Year: ${form.vehicleYear || "Not specified"}`
}
- Preferred Brand: ${form.preferredBrand || "Any"}

STORE INVENTORY (JSON):
${JSON.stringify(compactCatalog)}

Respond strictly with valid JSON (no markdown codeblocks):
{
  "budgetFriendly": [
    { "productId": "exact _id from STORE INVENTORY", "reason": "1 concise sentence explaining why it fits" }
  ],
  "bestValue": [
    { "productId": "exact _id from STORE INVENTORY", "reason": "1 concise sentence explaining why it fits" }
  ],
  "premiumChoice": [
    { "productId": "exact _id from STORE INVENTORY", "reason": "1 concise sentence explaining why it fits" }
  ],
  "disclaimer": "1 concise installation or sizing tip."
}
`;

        const response = await window.puter.ai.chat(prompt, {
          model: "gpt-4o-mini",
        });

        const rawText =
          typeof response === "string"
            ? response
            : response?.message?.content || response?.toString() || "";

        const cleanJsonString = rawText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        const parsedData = JSON.parse(cleanJsonString);
        const hydrated = hydrateAiRecommendations(parsedData, matchingCatalog);

        if (hydrated) {
          setRecommendations(hydrated);
          setStep(2);
          toast.success("Matched with our live store stock!");
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Puter AI fallback triggered:", error);
    }

    // Guaranteed real-stock fallback if Puter AI is unavailable or returns unmatched IDs
    const fallbackResult = buildDeterministicTiers(matchingCatalog);
    setRecommendations(fallbackResult);
    setStep(2);
    toast.success("Matched with our available store stock!");
    setLoading(false);
  };

  const restart = () => {
    setStep(0);
    setRecommendations(null);
    setForm({
      batteryType: "",
      homePreference: "ALL",
      fans: 2,
      lights: 4,
      televisions: 1,
      backupDuration: "4",
      preferredBrand: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
    });
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  const CounterItem = ({ label, value, onIncrement, onDecrement }) => (
    <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200/70 rounded-xl">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-bold text-gray-900">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  const RecommendationCard = ({ title, subtitle, items = [], badge }) => (
    <Card className="flex flex-col h-full border border-gray-200 shadow-xs hover:shadow-md transition-all">
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue uppercase tracking-wider">
              {badge}
            </span>
          </div>
          <h3 className="text-lg font-bold text-charcoal mb-0.5">{title}</h3>
          <p className="text-xs text-gray-500 mb-4">{subtitle}</p>

          {items.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              No matching product in this tier
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product: p, reason }) => {
                const available = p.availableStock ?? p.currentStock ?? 0;
                const isInStock = available > 0;
                const hasDiscount =
                  Number(p.mrp) > Number(p.sellingPrice) && Number(p.sellingPrice) > 0;

                const waUrl = `https://wa.me/916369115420?text=Hello%20Auto%20Home%20Batteries,%20AI%20Battery%20Finder%20recommended%20${encodeURIComponent(
                  p.name
                )}%20(${encodeURIComponent(p.brand)}%20${encodeURIComponent(
                  p.sku || ""
                )}).%20Please%20confirm%20availability%20and%20final%20price.`;

                return (
                  <div
                    key={p._id}
                    className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/70 space-y-3"
                  >
                    {/* Product Thumbnail + Stock Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-blue uppercase tracking-wider">
                        {p.brand}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isInStock
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : "text-amber-700 bg-amber-50 border-amber-200"
                        }`}
                      >
                        {isInStock ? `In Stock (${available})` : "On Order"}
                      </span>
                    </div>

                    {Array.isArray(p.images) && p.images.length > 0 && (
                      <div
                        onClick={() => navigate(`/products/${p._id}`)}
                        className="h-28 w-full bg-white rounded-lg border border-gray-100 p-2 flex items-center justify-center cursor-pointer"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div>
                      <h4
                        onClick={() => navigate(`/products/${p._id}`)}
                        className="font-bold text-charcoal text-sm leading-snug hover:text-blue cursor-pointer"
                      >
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {p.category} {p.sku ? `• ${p.sku}` : ""}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                      <div>
                        <span className="block text-gray-400 text-[10px] uppercase font-medium">
                          Capacity
                        </span>
                        <span className="font-bold text-gray-800">
                          {p.ahCapacity > 0 ? `${p.ahCapacity} Ah` : p.batteryType || "Standard"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-[10px] uppercase font-medium">
                          Warranty
                        </span>
                        <span className="font-bold text-gray-800">
                          {p.warranty || "Official"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-charcoal">
                        {p.sellingPrice ? formatCurrency(p.sellingPrice) : "Contact us"}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(p.mrp)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">{reason}</p>

                    {Array.isArray(p.pros) && p.pros[0] && (
                      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-200/70">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                          <Check size={10} /> Highlight
                        </span>
                        <span className="text-xs text-gray-600 truncate">{p.pros[0]}</span>
                      </div>
                    )}

                    {/* Direct Store Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${p._id}`)}
                        style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
                        className="w-full py-2 px-2.5 bg-navy hover:opacity-90 text-white text-[11px] font-bold rounded-xl transition-opacity inline-flex items-center justify-center cursor-pointer"
                      >
                        View Details
                      </button>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-2.5 bg-white hover:bg-green-50 text-green-700 border border-green-600 text-[11px] font-bold rounded-xl transition-colors inline-flex items-center justify-center"
                      >
                        Send Enquiry
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue rounded-full text-xs font-semibold mb-2">
          <Sparkles size={14} /> AI Stock Matcher
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal tracking-tight">
          Smart Battery Finder
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Matches your power or vehicle setup directly against our live Pernambut store inventory.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 max-w-xl mx-auto sm:mx-0">
        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`flex items-center gap-1 ${i <= step ? "text-navy font-bold" : ""}`}
            >
              {i > 0 && <ChevronRight size={12} />}
              {s.label}
            </span>
          ))}
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-navy rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: "#0f172a" }}
          />
        </div>
      </div>

      {/* Step 0: Choose Type */}
      {step === 0 && (
        <Card className="p-6 sm:p-10 border border-gray-200 shadow-xs">
          <h2 className="text-xl font-bold text-charcoal mb-1">Select your application</h2>
          <p className="text-xs text-gray-500 mb-6">
            {inventoryLoading
              ? "Loading live store catalog..."
              : `Choose what you need a battery for (${inventory.length} products available in catalog)`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {APPLICATION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = form.batteryType === opt.value;
              const categoryCount = inventory.filter((p) =>
                opt.categories.includes(p.category)
              ).length;

              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, batteryType: opt.value }));
                    nextStep();
                  }}
                  className={`flex items-start justify-between gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/70 border-navy ring-2 ring-navy/20"
                      : "bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50/60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      style={
                        isSelected
                          ? { backgroundColor: "#0f172a", color: "#ffffff" }
                          : undefined
                      }
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-navy text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-charcoal">{opt.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                  {!inventoryLoading && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">
                      {categoryCount} items
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Step 1: Input Requirements */}
      {step === 1 && (
        <Card className="p-6 sm:p-10 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">{form.batteryType}</h2>
              <p className="text-xs text-gray-500">
                Provide basic details to match against our current stock
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-xs font-bold text-blue hover:underline cursor-pointer"
            >
              Change Type
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {form.batteryType === "Home Inverter Battery" ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Preferred Battery / System Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {HOME_PREFERENCE_OPTIONS.map((pref) => {
                      const active = form.homePreference === pref.value;
                      return (
                        <button
                          key={pref.value}
                          type="button"
                          onClick={() => handleChange("homePreference", pref.value)}
                          style={
                            active
                              ? { backgroundColor: "#0f172a", color: "#ffffff" }
                              : undefined
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                            active
                              ? "bg-navy text-white border-navy"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {pref.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <CounterItem
                    label="Fans"
                    value={form.fans}
                    onIncrement={() => updateCounter("fans", 1)}
                    onDecrement={() => updateCounter("fans", -1)}
                  />
                  <CounterItem
                    label="Lights"
                    value={form.lights}
                    onIncrement={() => updateCounter("lights", 1)}
                    onDecrement={() => updateCounter("lights", -1)}
                  />
                  <CounterItem
                    label="TV / Laptops"
                    value={form.televisions}
                    onIncrement={() => updateCounter("televisions", 1)}
                    onDecrement={() => updateCounter("televisions", -1)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Required Backup Hours *"
                    type="number"
                    min="1"
                    max="24"
                    value={form.backupDuration}
                    onChange={(e) => handleChange("backupDuration", e.target.value)}
                    placeholder="e.g. 4"
                    helperText={`Estimated capacity needed: ~${estimateRequiredAh()} Ah`}
                  />
                  <Input
                    label="Preferred Brand (optional)"
                    value={form.preferredBrand}
                    onChange={(e) => handleChange("preferredBrand", e.target.value)}
                    placeholder="e.g. Exide, SF Sonic, Microtek, Amaron"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Vehicle Brand / Make *"
                    value={form.vehicleMake}
                    onChange={(e) => handleChange("vehicleMake", e.target.value)}
                    placeholder="e.g. Maruti, Hero, Honda, Tata"
                  />
                  <Input
                    label="Vehicle Model *"
                    value={form.vehicleModel}
                    onChange={(e) => handleChange("vehicleModel", e.target.value)}
                    placeholder="e.g. Swift, Splendor, Activa, Ape"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Manufacturing Year (optional)"
                    type="number"
                    value={form.vehicleYear}
                    onChange={(e) => handleChange("vehicleYear", e.target.value)}
                    placeholder="e.g. 2022"
                  />
                  <Input
                    label="Preferred Brand (optional)"
                    value={form.preferredBrand}
                    onChange={(e) => handleChange("preferredBrand", e.target.value)}
                    placeholder="e.g. Exide, Amaron, SF Sonic"
                  />
                </div>
              </>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft size={16} /> Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || inventoryLoading}
                className="flex items-center gap-2"
              >
                {loading ? "Matching Our Stock..." : "Find Best Battery"}
                {!loading && <Sparkles size={16} />}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Step 2: Recommendations Result */}
      {step === 2 && recommendations && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                Recommended From Our Store Stock
              </h2>
              <p className="text-xs text-gray-500">
                Real inventory items matched to your requirements
              </p>
            </div>
            <Button
              variant="outline"
              onClick={restart}
              className="flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw size={14} /> Start Over
            </Button>
          </div>

          {recommendations.budgetFriendly?.length === 0 &&
          recommendations.bestValue?.length === 0 &&
          recommendations.premiumChoice?.length === 0 ? (
            <Card className="p-10 text-center border border-gray-200">
              <AlertCircle size={36} className="text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-charcoal mb-1">
                No exact match in this category
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Browse our full catalog or message us on WhatsApp for instant compatibility help.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="primary" onClick={() => navigate("/batteries")}>
                  Browse Full Catalog
                </Button>
                <Button variant="outline" onClick={restart}>
                  Try Another Search
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <RecommendationCard
                title="Budget Friendly"
                subtitle="Most affordable in-stock choice"
                items={recommendations.budgetFriendly}
                badge="Best Price"
              />
              <RecommendationCard
                title="Best Value"
                subtitle="Optimal price & backup balance"
                items={recommendations.bestValue}
                badge="Most Popular"
              />
              <RecommendationCard
                title="Premium Choice"
                subtitle="Highest capacity & warranty"
                items={recommendations.premiumChoice}
                badge="Top Tier"
              />
            </div>
          )}

          {recommendations.disclaimer && (
            <div className="mt-6 p-4 rounded-xl border border-gray-200/80 bg-gray-50/80 text-xs text-gray-600 flex items-start gap-2">
              <HelpCircle size={15} className="text-gray-400 shrink-0 mt-0.5" />
              <span>{recommendations.disclaimer}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatteryFinder;