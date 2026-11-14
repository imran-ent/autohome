import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Phone,
  Home,
  ArrowRight,
  Battery,
  User,
  Mail,
  Check,
} from "lucide-react";
import { orderService } from "../../services/orderService.js";
import { productService } from "../../services/productService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button.jsx";
import { Input } from "../../components/common/Input.jsx";
import { Select } from "../../components/common/Select.jsx";
import { Card } from "../../components/common/Card.jsx";
import { formatCurrency } from "../../utils/helpers.js";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
    quantity: Number(searchParams.get("qty")) || 1,
    deliveryPreference: "pickup",
    street: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      const productId = searchParams.get("product");
      if (!productId) {
        navigate("/batteries");
        return;
      }
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      try {
        const response = await productService.getById(productId);
        setProduct(response.data.data);
      } catch (e) {
        toast.error("Product not found");
        navigate("/batteries");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [searchParams, isAuthenticated, navigate]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    if (form.deliveryPreference === "delivery" && (!form.street || !form.city || !form.pincode)) {
      toast.error("Please enter delivery address");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await orderService.create({
        items: [
          {
            product: product._id,
            quantity: Number(form.quantity),
          },
        ],
        deliveryPreference: form.deliveryPreference,
        deliveryAddress:
          form.deliveryPreference === "delivery"
            ? {
                street: form.street,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
              }
            : undefined,
        notes: form.notes,
      });
      setBookingId(response.data.data.bookingId || "");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const total = product ? product.sellingPrice * Number(form.quantity) : 0;
  const available = product ? product.availableStock || product.currentStock : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-blue border-t-transparent rounded-full" />
      </div>
    );

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="p-8 elevated text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6"><Check size={32} /></div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-8">Your battery booking has been received. We will contact you shortly for delivery or pickup scheduling.</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm font-bold text-charcoal mb-1">Booking ID</p>
            <p className="text-xl font-mono text-navy">{bookingId || "—"}</p>
            <p className="text-sm text-gray-500 mt-2">Status: <span className="font-medium text-blue">Pending</span></p>
          </div>
          <Button variant="primary" onClick={() => navigate("/my-orders")} className="w-full py-4">
            View My Orders <ArrowRight size={18} />
          </Button>
          <Button variant="outline" onClick={() => navigate("/")} className="w-full mt-3 py-3">Continue Shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Book Battery</h1>
        <p className="text-gray-500 mt-1">Complete your battery booking</p>
      </div>

      {!product && (
        <div className="text-center py-20 text-gray-500"><Battery size={48} className="mx-auto mb-4 opacity-20" /><p>Product not found.</p></div>
      )}

      {product && (
        <Card className="p-8 elevated">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-medium text-blue uppercase tracking-wider">Step 1 of 2</p>
              <h2 className="text-2xl font-bold text-charcoal">Booking Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-bold ${available > 0 ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>{available > 0 ? `${available} Available` : "Out of Stock"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase">Product</p>
              <p className="font-bold text-charcoal">{product.name}</p>
              <p className="text-sm text-gray-500">{product.brand} • {product.ahCapacity}Ah • {product.voltage}V</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase">Quantity</p>
              <p className="font-bold text-charcoal">{form.quantity}</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase">Total</p>
              <p className="font-bold text-navy">{formatCurrency(total)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} leftIcon={<User size={18} className="text-gray-400" />} />
              <Input label="Mobile Number" type="tel" value={form.mobile} onChange={(e) => handleChange("mobile", e.target.value)} leftIcon={<Phone size={18} className="text-gray-400" />} />
              <Input label="Email Address" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} leftIcon={<Mail size={18} className="text-gray-400" />} />
              <Select label="Quantity" value={form.quantity} onChange={(e) => handleChange("quantity", e.target.value)} options={[1, 2, 3, 4, 5].map((q) => ({ value: String(q), label: String(q) }))} />
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-sm font-bold text-charcoal mb-3 flex items-center gap-2"><Home size={18} className="text-navy" /> Delivery Preference</p>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:border-blue hover:bg-blue-50 transition-colors">
                  <input type="radio" name="deliveryPreference" value="pickup" checked={form.deliveryPreference === "pickup"} onChange={() => handleChange("deliveryPreference", "pickup")} className="text-blue" />
                  <span className="text-sm font-medium text-charcoal">Pickup from Store</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border hover:border-blue hover:bg-blue-50 transition-colors">
                  <input type="radio" name="deliveryPreference" value="delivery" checked={form.deliveryPreference === "delivery"} onChange={() => handleChange("deliveryPreference", "delivery")} className="text-blue" />
                  <span className="text-sm font-medium text-charcoal">Home Delivery</span>
                </label>
              </div>
              {form.deliveryPreference === "delivery" && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Street Address" value={form.street} onChange={(e) => handleChange("street", e.target.value)} />
                  <Input label="City" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                  <Input label="State" value={form.state} onChange={(e) => handleChange("state", e.target.value)} />
                  <Input label="Pincode" value={form.pincode} onChange={(e) => handleChange("pincode", e.target.value)} />
                </div>
              )}
            </div>

            <Input label="Special Instructions (optional)" value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="e.g. Call before delivery, ground floor..." />

            <Button type="submit" variant="primary" className="w-full py-4" disabled={bookingLoading || !available}>
              {bookingLoading ? "Processing..." : "Confirm Booking"} <ArrowRight size={20} />
            </Button>
            {!available && <p className="text-center text-sm text-red-600 mt-2">This product is currently out of stock.</p>}
          </form>
        </Card>
      )}
    </div>
  );
};

export default Booking;

