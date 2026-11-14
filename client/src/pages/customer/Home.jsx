import { useState, useEffect } from "react";
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
  Car,
  Wrench,
  Droplets,
  Zap,
} from "lucide-react";
import { Button } from "../../components/common/Button.jsx";
import { Card } from "../../components/common/Card.jsx";
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

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await productService.getAll({ isActive: "true", limit: 6 });
        setFeatured(response.data?.data?.products || response.data?.data || []);
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

  const waLink = (p) => {
    return `https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(p.name)}%20${encodeURIComponent(p.brand)}%20${encodeURIComponent(p.sku || "")}.%20Please%20confirm%20availability,%20compatibility%20and%20final%20price.`;
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('../src/resource/homepageimg.png')] bg-cover bg-center opacity-100" />
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
              Discover the right battery for your home, vehicle or business with AI-powered recommendations, genuine brands and expert service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" onClick={() => navigate("/battery-finder")} className="w-full sm:w-auto justify-center">
                <Search size={20} /> Find My Battery
              </Button>
              <a
                href="https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20a%20battery.%20Please%20share%20availability%20and%20price."
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-navy text-base font-bold rounded-xl hover:bg-white/90 transition-colors"
              >
                <Phone size={20} className="text-blue-600" />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20 bg-offwhite">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal mb-2">Explore by Category</h2>
            <p className="text-gray-500">Find the perfect battery for your application</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.name} onClick={() => navigate(`/batteries?category=${encodeURIComponent(cat.name)}`)} className="card-premium cursor-pointer p-8 hover:elevated">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue mb-4">
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Recommendation Banner */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue text-xs font-semibold uppercase tracking-wider mb-4">
                AI-Powered
              </div>
              <h2 className="text-3xl font-bold text-charcoal mb-4">Smart Battery Recommendations</h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                Tell us about your vehicle or power needs and our AI engine will analyze your requirements to recommend the most suitable battery from our actual inventory - considering capacity, voltage, warranty, budget and available stock.
              </p>
              <Button variant="gold" size="lg" onClick={() => navigate("/battery-finder")} className="flex items-center gap-2">
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
                    <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white text-xs font-bold">{item.num}</div>
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

      {/* Featured Products */}
      <section className="py-20 bg-offwhite">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-charcoal">Featured Products</h2>
              <p className="text-gray-500">Our most trusted battery solutions</p>
            </div>
            <Link to="/batteries" className="text-sm font-medium text-blue hover:text-navy transition-colors flex items-center gap-1">
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
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Battery size={32} /></div>
                      )}
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-bold border ${statusColor(status)}`}>{statusLabel(status)}</span>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-medium text-blue mb-1 uppercase tracking-wider">{p.category}</p>
                      <h3 className="text-lg font-bold text-charcoal mb-1 group-hover:text-blue transition-colors">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{p.brand}</p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-charcoal">{p.sellingPrice ? `₹${new Intl.NumberFormat("en-IN").format(p.sellingPrice)}` : "₹--"} </span>
                        <span className="text-xs text-gray-500">/{p.ahCapacity}Ah</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/products/${p._id}`)} className="flex-1">View Details</Button>
                        <a
                          href={`https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(p.name)}%20${encodeURIComponent(p.brand)}%20${encodeURIComponent(p.sku || "")}.%20Please%20confirm%20availability,%20compatibility%20and%20final%20price.`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors"
                        >
                          <Phone size={16} className="text-white" /> WhatsApp
                        </a>
                        <a
                          href="tel:+919789688756"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Phone size={16} className="text-white" /> Call
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4"><Battery size={32} /></div>
                <p className="text-gray-500">No featured products available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Perks & Value Props */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="p-8 rounded-xl border border-gray-100 bg-gray-50 hover:elevated">
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
            <h2 className="text-3xl font-bold text-white mb-4">Battery Maintenance & Inverter Repair</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Is your battery not charging or giving low backup? Book a professional maintenance service and get a technician visit within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" onClick={() => navigate("/maintenance")}>
                <Phone size={20} /> Book Maintenance & Repair
              </Button>
              <a href="tel:+919789688756" className="px-8 py-3 bg-white text-navy text-sm font-semibold rounded-lg hover:bg-gray-100">Call Us Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Connect & Contact Section */}
      <section className="py-20 bg-offwhite">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal mb-2">Scan to Connect</h2>
            <p className="text-gray-500">Quickly reach us via WhatsApp, phone call, or find our shop on Google Maps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 rounded-2xl border border-green-100 bg-green-50 text-center flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-[40px]">📱</span>
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">WhatsApp Enquiry</h3>
                <p className="text-xs text-gray-600 mb-6">Chat with us directly for quotes & availability</p>
              </div>
              <a
                href="https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20a%20battery.%20Please%20share%20availability%20and%20price."
                className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
              >
                Open WhatsApp Chat
              </a>
            </Card>

            <Card className="p-6 rounded-2xl border border-gray-200 bg-white text-center flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-navy/5 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-navy">
                  <Phone size={28} />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">Call Us Directly</h3>
                <p className="text-xs text-gray-600 mb-4">Speak with our battery experts</p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+919789688756"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-white text-xs font-bold rounded-lg hover:bg-blue-900 transition-colors"
                >
                  <Phone size={14} /> +91 97896 88756
                </a>
                <a
                  href="tel:+919443437168"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-navy text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <Phone size={14} /> +91 94434 37168
                </a>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border border-blue-100 bg-blue-50 text-center flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-[40px]">📍</span>
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">Visit Our Shop</h3>
                <p className="text-xs text-gray-600 mb-6">Opp. SN Tea Stall, Maula Street, Pernambut</p>
              </div>
              <a
                href="https://maps.app.goo.gl/Eo7VaAAysAE992YH8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-grey text-xs font-bold rounded-lg hover:bg-grey-100 hover:text-black transition-colors"
              >
                Open Google Maps
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;