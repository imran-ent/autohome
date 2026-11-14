import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Battery,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Car,
  Truck,
  HelpCircle,
  Check,
  X as XMark,
  Sparkles,
  RotateCcw,
  Plus,
  Minus,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button.jsx";
import { Input } from "../../components/common/Input.jsx";
import { Card } from "../../components/common/Card.jsx";

const BatteryFinder = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    batteryType: "",
    inverterModel: "",
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

  const BatteryTypeOptions = [
    { value: "Home Inverter Battery", label: "Home Inverter", icon: Zap, desc: "For homes & offices" },
    { value: "Car Battery", label: "Car Battery", icon: Car, desc: "Hatchback, Sedan & SUV" },
    { value: "Bike Battery", label: "Bike / Scooter", icon: Battery, desc: "2-Wheelers & Scooters" },
    { value: "Truck / Commercial Battery", label: "Commercial Vehicle", icon: Truck, desc: "Trucks, Buses & Tractors" },
  ];

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
      [key]: Math.max(0, (parseInt(prev[key]) || 0) + delta),
    }));
  };

  const validateDetailsStep = () => {
    if (form.batteryType === "Home Inverter Battery") {
      return !!form.backupDuration;
    }
    return !!form.vehicleMake && !!form.vehicleModel;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDetailsStep()) {
      toast.error("Please fill in the required vehicle or backup details");
      return;
    }

    setLoading(true);

    try {
      if (!window.puter || !window.puter.ai) {
        toast.error("Puter AI library loading error. Check index.html script tag.");
        setLoading(false);
        return;
      }

      const prompt = `
      You are an expert battery technician for AutoHome Batteries in India.
      Recommend optimal battery models for the user based on these inputs:

      Application Type: ${form.batteryType}
      User Requirements: ${JSON.stringify(form, null, 2)}

      Respond strictly with a valid JSON object without markdown codeblocks or extra text.
      JSON Schema:
      {
        "budgetFriendly": [
          {
            "productName": "Product Name",
            "brand": "Brand",
            "modelCode": "Model Code",
            "capacity": "Capacity (e.g., 150Ah / 35Ah)",
            "voltage": "12V",
            "price": 6500,
            "warranty": "36 Months",
            "availabilityStatus": "In Stock",
            "reason": "Why this battery fits their budget",
            "advantages": ["Key Advantage"],
            "disadvantages": ["Minor Limitation"]
          }
        ],
        "bestValue": [ ...same schema... ],
        "premiumChoice": [ ...same schema... ],
        "disclaimer": "Helpful technical or installation tip."
      }
      `;

      const response = await window.puter.ai.chat(prompt, {
        model: "gpt-4o-mini",
      });

      const cleanJsonString = response
        .toString()
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsedData = JSON.parse(cleanJsonString);

      setRecommendations(parsedData);
      setStep(2);
      toast.success("AI Recommendations ready!");
    } catch (error) {
      console.error("Puter AI Error:", error);
      toast.error("Failed to generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(0);
    setRecommendations(null);
    setForm({
      batteryType: "",
      inverterModel: "",
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
          className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-bold text-gray-900">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  const RecommendationCard = ({ title, subtitle, items = [], badge }) => (
    <Card className="flex flex-col h-full border border-gray-100 shadow-xs hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider">
            {badge}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-0.5">{title}</h3>
        <p className="text-xs text-gray-500 mb-5">{subtitle}</p>

        {items.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">No matching products found</div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.modelCode || idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/60">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900 text-base">{item.productName}</h4>
                  <span
                    className={`text-[10px] font-semibold ${
                      item.availabilityStatus === "In Stock"
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-blue-700 bg-blue-50"
                    } px-2 py-0.5 rounded-md`}
                  >
                    {item.availabilityStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {item.brand} • {item.modelCode}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-white p-2.5 rounded-lg border border-gray-100">
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase font-medium">Capacity</span>
                    <span className="font-semibold text-gray-800">{item.capacity}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase font-medium">Voltage</span>
                    <span className="font-semibold text-gray-800">{item.voltage}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xl font-extrabold text-blue-900">
                    {item.price ? `₹${new Intl.NumberFormat("en-IN").format(item.price)}` : "₹--"}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{item.warranty}</span>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">{item.reason}</p>

                <div className="space-y-1 pt-2 border-t border-gray-200/60">
                  {item.advantages?.[0] && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Check size={10} /> Pro
                      </span>
                      <span className="text-xs text-gray-600 truncate">{item.advantages[0]}</span>
                    </div>
                  )}
                  {item.disadvantages?.[0] && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <XMark size={10} /> Con
                      </span>
                      <span className="text-xs text-gray-600 truncate">{item.disadvantages[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-2">
          <Sparkles size={14} /> AI Recommendation Engine
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Smart Battery Finder</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select your setup to discover perfectly compatible batteries in seconds.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 max-w-xl mx-auto sm:mx-0">
        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
          {STEPS.map((s, i) => (
            <span key={s.id} className={`flex items-center gap-1 ${i <= step ? "text-blue-600 font-bold" : ""}`}>
              {i > 0 && <ChevronRight size={12} />}
              {s.label}
            </span>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 0: Choose Type */}
      {step === 0 && (
        <Card className="p-6 sm:p-10 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Select your application</h2>
          <p className="text-xs text-gray-500 mb-6">What do you need a battery for?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BatteryTypeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = form.batteryType === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, batteryType: opt.value }));
                    nextStep();
                  }}
                  className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20"
                      : "bg-white border-gray-200 hover:border-blue-200 hover:bg-gray-50/50"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{opt.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Step 1: Input Requirements */}
      {step === 1 && (
        <Card className="p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{form.batteryType}</h2>
              <p className="text-xs text-gray-500">Provide basic details for accurate matching</p>
            </div>
            <button
              onClick={() => setStep(0)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Change Type
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {form.batteryType === "Home Inverter Battery" ? (
              <>
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
                    label="Required Backup Hours"
                    type="number"
                    value={form.backupDuration}
                    onChange={(e) => handleChange("backupDuration", e.target.value)}
                    placeholder="e.g. 4"
                    helperText="Required"
                  />
                  <Input
                    label="Preferred Brand (optional)"
                    value={form.preferredBrand}
                    onChange={(e) => handleChange("preferredBrand", e.target.value)}
                    placeholder="e.g. Exide, SF Sonic"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Vehicle Brand / Make"
                    value={form.vehicleMake}
                    onChange={(e) => handleChange("vehicleMake", e.target.value)}
                    placeholder="e.g. Maruti, Hero, Tata"
                    helperText="Required"
                  />
                  <Input
                    label="Vehicle Model"
                    value={form.vehicleModel}
                    onChange={(e) => handleChange("vehicleModel", e.target.value)}
                    placeholder="e.g. Swift, Splendor, LPT"
                    helperText="Required"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Manufacturing Year (optional)"
                    type="number"
                    value={form.vehicleYear}
                    onChange={(e) => handleChange("vehicleYear", e.target.value)}
                    placeholder="e.g. 2021"
                  />
                  <Input
                    label="Preferred Brand (optional)"
                    value={form.preferredBrand}
                    onChange={(e) => handleChange("preferredBrand", e.target.value)}
                    placeholder="e.g. Exide, SF Sonic"
                  />
                </div>
              </>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-1.5">
                <ArrowLeft size={16} /> Back
              </Button>
              <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2">
                {loading ? "Calculating..." : "Find Best Battery"}
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
              <h2 className="text-xl font-bold text-gray-900">Recommended Matches</h2>
              <p className="text-xs text-gray-500">Based on your requirements</p>
            </div>
            <Button variant="outline" onClick={restart} className="flex items-center gap-1.5 self-start sm:self-auto">
              <RotateCcw size={14} /> Start Over
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {recommendations.budgetFriendly && (
              <RecommendationCard
                title="Budget Friendly"
                subtitle="Most affordable choice"
                items={recommendations.budgetFriendly}
                badge="Best Price"
              />
            )}
            {recommendations.bestValue && (
              <RecommendationCard
                title="Best Value"
                subtitle="Optimal price & performance"
                items={recommendations.bestValue}
                badge="Most Popular"
              />
            )}
            {recommendations.premiumChoice && (
              <RecommendationCard
                title="Premium Choice"
                subtitle="Top power & highest warranty"
                items={recommendations.premiumChoice}
                badge="Top Tier"
              />
            )}
          </div>

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