import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Battery,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Phone,
  Zap,
  Droplets,
  Image as ImageIcon,
} from "lucide-react";
import { productService } from "../../services/productService.js";
import { Card } from "../../components/common/Card.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    setLoading(true);
    try {
      const response = await productService.getById(id);
      const data = response.data?.data?.product || response.data?.data || response.data;
      setProduct(data);
    } catch (error) {
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pt-32 sm:pt-36 pb-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="h-[420px] bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto pt-32 sm:pt-36 pb-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Button variant="primary" onClick={() => navigate("/batteries")}>
          Back to Battery Catalog
        </Button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const availableStock = product.availableStock ?? product.currentStock ?? 0;
  const isOutOfStock = availableStock <= 0;

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const waLink = `https://wa.me/919789688756?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(product.name)}%20${encodeURIComponent(product.brand)}%20${encodeURIComponent(product.sku || "")}.%20Please%20confirm%20availability,%20compatibility%20and%20final%20price.`;

  return (
    <div className="min-h-screen bg-gray-50/60 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Catalog</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Multi-Angle Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative h-[380px] sm:h-[460px] bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex items-center justify-center group">
              {images.length > 0 ? (
                <img
                  src={images[activeImgIndex]}
                  alt={`${product.name} - Angle ${activeImgIndex + 1}`}
                  className="w-full h-full object-contain p-6 transition-all duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Battery size={64} strokeWidth={1.5} />
                  <span className="text-xs font-semibold mt-2">No product image available</span>
                </div>
              )}

              {images.length > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-white/20">
                  Angle {activeImgIndex + 1} of {images.length}
                </span>
              )}

              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-extrabold border ${isOutOfStock ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center opacity-80 hover:opacity-100 transition-all hover:scale-105"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center opacity-80 hover:opacity-100 transition-all hover:scale-105"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Clickable Angle Thumbnails */}
            {images.length > 1 && (
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ImageIcon size={13} className="text-blue-600" />
                  <span>Select View Angle ({images.length} available)</span>
                </p>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 bg-white overflow-hidden shrink-0 transition-all ${activeImgIndex === idx ? "border-blue-600 ring-2 ring-blue-600/20 shadow-xs scale-105" : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300"}`}
                    >
                      <img src={imgSrc} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover p-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details & Contact */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-xs font-semibold text-gray-500"> • {product.brand}</span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
                {product.sku && (
                  <p className="text-xs font-mono text-gray-400 mt-1">SKU: {product.sku}</p>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-gray-900">{formatCurrency(product.sellingPrice || product.price)}</span>
                  <span className="text-xs text-gray-500 block mt-0.5">Contact us for final price</span>
                </div>
                {product.ahCapacity && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">{product.ahCapacity} Ah</span>
                    <span className="text-xs text-gray-400 block">Battery Capacity</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                  <Zap size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">Free Installation</h4>
                    <p className="text-[11px] text-amber-800">Contact us for installation details</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <Droplets size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950">6 Months Free Distilled Water</h4>
                    <p className="text-[11px] text-blue-800">Contact us for details</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Battery size={15} className="text-blue-600" /> Technical Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-gray-50">
                    <span className="text-gray-400 block text-[10px]">Warranty</span>
                    <span className="font-bold text-gray-800">{product.warranty || "36 Months"}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50">
                    <span className="text-gray-400 block text-[10px]">Voltage</span>
                    <span className="font-bold text-gray-800">{product.voltage ? `${product.voltage}V` : "12V"}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50">
                    <span className="text-gray-400 block text-[10px]">Battery Type</span>
                    <span className="font-bold text-gray-800">{product.batteryType || "Tubular"}</span>
                  </div>
                </div>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Product Description</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200 mt-6 space-y-3">
              <div className="flex gap-3">
                <a
                  href={waLink}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Phone size={18} className="text-white" /> WhatsApp Enquiry
                </a>
                <a href="tel:+919789688756" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-navy text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors shrink-0">
                  <Phone size={18} /> Call Us
                </a>
              </div>
              <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" /> 100% Genuine Manufacturer Guarantee & Doorstep Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;