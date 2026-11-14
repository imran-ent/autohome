const fs = require("fs");

// Read the Register.jsx file as a template
const content = fs.readFileSync("D:\\Default Project\\client\\src\\pages\\customer\\Register.jsx", "utf8");

// Replace the content with Home.jsx content
const homeContent = `import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Battery,
  ArrowRight,
  Search,
  ShieldCheck,
  Truck,
  User,
  Clock,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Car,
} from "lucide-react";
import { Button } from "../../components/common/Button.jsx";
import { productService } from "../../services/productService.js";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    {
      name: "Home Inverter Batteries",
      icon: Battery,
      desc: "Power backup for homes and offices",
    },
    {
      name: "Car Batteries",
      icon: Car,
      desc: "Reliable starting power for vehicles",
    },
    {
      name: "Bike Batteries",
      icon: Car,
      desc: "Lightweight and durable two-wheeler batteries",
    },
    {
      name: "Truck / Commercial Batteries",
      icon: Truck,
      desc: "Heavy-duty power for commercial vehicles",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Genuine Brands",
      desc: "Exide, SF, Microtek and other trusted brands with official warranty.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Quick delivery and professional installation across the city.",
    },
    {
      icon: User,
      title: "Expert Support",
      desc: "Our battery specialists help you choose the right power solution.",
    },
    {
      icon: Clock,
      title: "24-Hour Service",
      desc: "Book maintenance and get a technician visit within 24 hours.",
    },
  ];

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await productService.getAll({
          isActive: "true",
          limit: 6,
        });
        setFeatured(response.data.data.products || []);
      } catch (e) {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

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

  return (
    <div className="animate-fade-in">
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60" />
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
            <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              Discover the right battery for your home, vehicle or business with
              AI-powered recommendations, genuine brands and expert service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/battery-finder")}
                className="w-full sm:w-auto"
              >
                <Search size={20} /> Find My Battery
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate("/batteries")}
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                <ArrowRight size={20} /> Explore Batteries
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-offwhite">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal mb-2">Explore by Category</h2>
            <p className="text-gray-500">Find the perfect battery for your application</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate("/batteries?category=" + encodeURIComponent(cat.name))}
                className="card-premium cursor-pointer p-8 hover:elevated"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue mb-4">
                  <cat.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue text-xs font-semibold uppercase tracking-wider mb-4">
                AI-Powered
              </div>
              <h2 className="text-3xl font-bold text-charcoal mb-4">Smart Battery Recommendations</h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                Tell us about your vehicle or power needs and our AI engine will
                analyze your requirements to recommend the most suitable battery
                from our actual inventory - considering capacity, voltage,
                warranty, budget and available stock.
              </p>
              <Button
                variant="gold"
                onClick={() => navigate("/battery-finder")}
                className="flex items-center gap-2"
              >
                Get AI Recommendation <ArrowRight size={20} />
              </Button>
            </div>
            <div className="lg:w-1/2 bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-charcoal mb-6 flex items-center gap-2">
                <Battery size={20} className="text-blue" /> How It Works
              </h3>
              <div className="space-y-6">
                {[
                  { num: "1", title: "Share requirements", desc: "Vehicle type, usage, budget" },
                  { num: "2", title: "AI analysis", desc: "Compatibility & stock check" },
                  { num: "3", title: "Get recommendations", desc: "Budget, Value & Premium picks" },
                ].map((item, idx) => (
                  <div key={item.num} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white text-xs font-bold">
                      {item.num}
                    </div>
                    <div>
                      <p className="font-bold text-charcoal">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-offwhite">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-charcoal">Featured Products</h2>
              <p className="text-gray-500">Our most trusted battery solutions</p>
            </div>
            <Link
              to="/batteries"
              className="text-sm font-medium text-blue hover:text-navy transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.length > 0 ? (
              featured.map((p) => {
                const available = p.availableStock || p.currentStock;
                const status = available <= 0 ? "out_of_stock" : available <= (p.minStockLevel || 5) ? "low_stock" : "in_stock";
                return (
                  <div key={p._id} className="card-premium group">
                    <div className="h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-xl">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Battery size={32} />
                        </div>
                      )}
                      <span className={\`absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-bold border \${statusColor(status)}\`}>
                        {statusLabel(status)}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-medium text-blue mb-1 uppercase tracking-wider">{p.category}</p>
                      <h3 className="text-lg font-bold text-charcoal mb-1 group-hover:text-blue transition-colors">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{p.brand}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-charcoal">{p.sellingPrice ? new Intl.NumberFormat("en-IN").format(p.sellingPrice) : "₹--"} </span>
                        <span className="text-xs text-gray-500">/{p.ahCapacity}Ah</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/products/" + p._id)}>Details</Button>
                        <Button variant="primary" size="sm" className="flex-1" disabled={status === "out_of_stock"}>
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                  <Battery size={32} />
                </div>
                <p className="text-gray-500">No featured products available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat) => (
              <div key={feat.title} className="p-8 rounded-xl border border-gray-100 bg-gray-50 hover:elevated">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue mb-4">
                  <feat.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy">
        <div className="container-premium">
          <div className="bg-white/5 rounded-2xl p-10 md:p-16 border border-white/10 backdrop-blur-sm text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Battery Maintenance Service</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Is your battery not charging or giving low backup? Book a
              professional maintenance service and get a technician visit within
              24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" onClick={() => navigate("/maintenance")}>
                <Phone size={20} /> Book Maintenance
              </Button>
              <a href="tel:+919789688756" className="px-8 py-3 bg-white text-navy text-sm font-semibold rounded-lg hover:bg-gray-100">
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
`;
fs.writeFileSync("D:\\Default Project\\client\\src\\pages\\customer\\Home.jsx", content, "utf8");
console.log("Home.jsx written successfully");