import { useState, useEffect, useRef } from "react";
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
  Home as HomeIcon,
  CheckCircle2,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { productService } from "../../services/productService.js";
import { Button } from "../../components/common/Button.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import toast from "react-hot-toast";

const FormattedDescription = ({ text }) => {
  if (!text) return null;

  const normalized = String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\t+/g, " ")
    .replace(/\s*•\s*/g, "\n• ")
    .trim();

  const rawLines = normalized
    .split(/\n+/)
    .map((line) => line.replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);

  if (rawLines.length === 0) return null;

  const bulletRegex = /^([•\-*✓✔►▪]|\d+[.)])\s*/;

  return (
    <div className="space-y-2.5 text-sm text-gray-700 leading-relaxed">
      {rawLines.map((line, index) => {
        const isBullet = bulletRegex.test(line);
        const cleanLine = line.replace(bulletRegex, "").trim();

        const colonIdx = cleanLine.indexOf(":");
        const hasKeyValue =
          colonIdx > 1 &&
          colonIdx <= 32 &&
          !cleanLine.startsWith("http") &&
          colonIdx < cleanLine.length - 1;

        if (isBullet) {
          return (
            <div key={index} className="flex items-start gap-2.5 pl-0.5">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-navy shrink-0" />
              <div className="flex-1">
                {hasKeyValue ? (
                  <>
                    <span className="font-semibold text-gray-900">
                      {cleanLine.slice(0, colonIdx + 1)}
                    </span>{" "}
                    <span>{cleanLine.slice(colonIdx + 1).trim()}</span>
                  </>
                ) : (
                  cleanLine
                )}
              </div>
            </div>
          );
        }

        if (hasKeyValue) {
          return (
            <div
              key={index}
              className="flex flex-wrap items-baseline gap-x-1.5 py-1 border-b border-gray-100 last:border-b-0"
            >
              <span className="font-semibold text-gray-900">
                {cleanLine.slice(0, colonIdx + 1)}
              </span>
              <span className="text-gray-700">
                {cleanLine.slice(colonIdx + 1).trim()}
              </span>
            </div>
          );
        }

        return (
          <p key={index} className="text-gray-700 leading-relaxed">
            {cleanLine}
          </p>
        );
      })}
    </div>
  );
};

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.33-1.66a11.86 11.86 0 0 0 5.73 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.85 9.85 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.89-9.89 9.89Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const availableStock = product.availableStock ?? product.currentStock ?? 0;
  const isOutOfStock = availableStock <= 0;

  const actualPrice = Number(product.sellingPrice || product.price || 0);
  const mrpPrice = Number(product.mrp || 0);
  const hasDiscount = mrpPrice > actualPrice && actualPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((mrpPrice - actualPrice) / mrpPrice) * 100)
    : 0;

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const waLink = `https://wa.me/916369115420?text=Hello%20Auto%20Home%20Batteries,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(
    product.name
  )}%20${encodeURIComponent(product.brand)}%20${encodeURIComponent(
    product.sku || ""
  )}.%20Please%20confirm%20availability,%20compatibility%20and%20final%20price.`;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://autohomebatteries.in/products/${product._id}`;

  const shareText = `Check out *${product.name}* (${product.brand}${
    product.ahCapacity > 0 ? ` • ${product.ahCapacity}Ah` : ""
  }) at AutoHome Batteries${
    actualPrice > 0 ? ` for ${formatCurrency(actualPrice)}` : ""
  }:`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${shareText}\n${shareUrl}`
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Product link copied!");
      setTimeout(() => {
        setCopied(false);
        setShareMenuOpen(false);
      }, 1200);
    } catch {
      const tempInput = document.createElement("input");
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      setCopied(true);
      toast.success("Product link copied!");
      setTimeout(() => {
        setCopied(false);
        setShareMenuOpen(false);
      }, 1200);
    }
  };

  const handleNativeShare = async () => {
    setShareMenuOpen(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | AutoHome Batteries`,
          text: `${product.name} (${product.brand}) - AutoHome Batteries Pernambut`,
          url: shareUrl,
        });
      } catch (err) {
        if (err?.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar: Back Button + Top-Right Share Corner Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue transition-colors group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Catalog</span>
          </button>

          <div ref={shareRef} className="relative">
            <button
              type="button"
              onClick={() => setShareMenuOpen((prev) => !prev)}
              aria-label="Share product"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-xs text-xs font-bold transition-all cursor-pointer"
            >
              <Share2 size={14} className="text-blue" />
              <span>Share</span>
            </button>

            {shareMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-30">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Share via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  {copied ? (
                    <>
                      <Check size={15} className="text-emerald-600 shrink-0" />
                      <span className="text-emerald-700">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} className="text-gray-500 shrink-0" />
                      <span>Copy Product Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left border-t border-gray-100"
                >
                  <Share2 size={15} className="text-blue shrink-0" />
                  <span>More Apps...</span>
                </button>
              </div>
            )}
          </div>
        </div>

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

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-extrabold rounded-full shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}

              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-extrabold border ${
                  isOutOfStock
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
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

            {images.length > 1 && (
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ImageIcon size={13} className="text-blue" />
                  <span>Select View Angle ({images.length} available)</span>
                </p>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-20 h-20 rounded-2xl border-2 bg-white overflow-hidden shrink-0 transition-all ${
                        activeImgIndex === idx
                          ? "border-navy ring-2 ring-navy/20 shadow-xs scale-105"
                          : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover p-1"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details & Contact */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-xs font-semibold text-gray-500"> • {product.brand}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-xs font-mono text-gray-400 mt-1">SKU: {product.sku}</p>
              )}

              {Array.isArray(product.suitableFor) && product.suitableFor.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 mr-1">
                    <HomeIcon size={13} className="text-blue" /> Suitable For:
                  </span>
                  {product.suitableFor.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price + Strikethrough MRP Card */}
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-baseline justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {formatCurrency(actualPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-gray-400 line-through">
                        {formatCurrency(mrpPrice)}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-md">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <span className="text-xs text-gray-500 block mt-1">
                  Contact us for final price &amp; old battery exchange offer
                </span>
              </div>
              {product.ahCapacity > 0 && (
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-blue">{product.ahCapacity} Ah</span>
                  <span className="text-xs text-gray-400 block">Battery Capacity</span>
                </div>
              )}
            </div>

            {/* Action Buttons (Placed Above Description & Specs) */}
            <div className="space-y-2.5">
              <div className="flex gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors shadow-xs"
                >
                  <Phone size={18} className="text-white" /> Send Enquiry
                </a>
                <a
                  href="tel:+919789688756"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-navy border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors shrink-0 shadow-xs"
                >
                  <Phone size={18} /> Call Us
                </a>
              </div>
              <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" /> 100% Genuine Manufacturer
                Guarantee &amp; Doorstep Support
              </p>
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
                <Droplets size={18} className="text-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950">
                    6 Months Free Distilled Water
                  </h4>
                  <p className="text-[11px] text-blue-800">Contact us for details</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Battery size={15} className="text-blue" /> Technical Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <span className="text-gray-400 block text-[10px]">Warranty</span>
                  <span className="font-bold text-gray-800">
                    {product.warranty || "36 Months"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <span className="text-gray-400 block text-[10px]">Voltage</span>
                  <span className="font-bold text-gray-800">
                    {product.voltage ? `${product.voltage}V` : "12V"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <span className="text-gray-400 block text-[10px]">Battery Type</span>
                  <span className="font-bold text-gray-800">
                    {product.batteryType || "Tubular"}
                  </span>
                </div>
              </div>
            </div>

            {Array.isArray(product.pros) && product.pros.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-2.5">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Key Highlights
                </h3>
                <ul className="space-y-1.5">
                  {product.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.description && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product Description &amp; Features
                </h3>
                <FormattedDescription text={product.description} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;