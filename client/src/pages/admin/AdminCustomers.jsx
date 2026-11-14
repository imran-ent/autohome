import { useState, useEffect } from "react";
import { Search, User, Battery, Headset, Clock } from "lucide-react";
import { orderService } from "../../services/orderService.js";
import toast from "react-hot-toast";
import Input from "../../components/common/Input.jsx";
import Card from "../../components/common/Card.jsx";
import { formatCurrency, formatDateTime } from "../../utils/helpers.js";
import Button from "../../components/common/Button.jsx";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const ordersRes = await orderService.getAll({ limit: 1000 });
      const sales = ordersRes.data.data.orders || [];

      const map = new Map();
      sales.forEach((s) => {
        const key = s.customerMobile || s.customerName || "walk-in";
        if (!map.has(key)) {
          map.set(key, {
            name: s.customerName,
            mobile: s.customerMobile,
            totalPurchases: 0,
            totalSpent: 0,
            lastPurchase: s.saleDate || s.createdAt,
            purchases: [],
          });
        }
        const c = map.get(key);
        c.totalPurchases += 1;
        c.totalSpent += s.totalAmount || 0;
        c.purchases.push({
          invoice: s.invoiceNumber,
          date: s.saleDate || s.createdAt,
          total: s.totalAmount,
        });
      });

      let list = Array.from(map.values());
      if (search) {
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.mobile.includes(search)
        );
      }
      list.sort((a, b) => new Date(b.lastPurchase) - new Date(a.lastPurchase));
      setCustomers(list);
    } catch (e) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Customers</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Customer Management</h1>
        <p className="text-gray-500 mt-1">View customer purchase history</p>
      </div>

      <Card className="p-6 mb-8 elevated">
        <Input
          label="Search customers"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={18} className="text-gray-400" />}
        />
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 font-medium text-charcoal">Customer</th>
              <th className="py-4 font-medium text-charcoal">Mobile</th>
              <th className="py-4 font-medium text-charcoal text-center">Purchases</th>
              <th className="py-4 font-medium text-charcoal text-right">Spent</th>
              <th className="py-4 font-medium text-charcoal">Last Purchase</th>
              <th className="py-4 font-medium text-charcoal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-20 text-center text-gray-500">
                  No customer records found
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.mobile || c.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue">
                        <User size={16} />
                      </div>
                      <div className="font-bold text-charcoal">{c.name || "Walk-in Customer"}</div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{c.mobile || "—"}</td>
                  <td className="py-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue text-xs font-bold">
                      {c.totalPurchases}
                    </span>
                  </td>
                  <td className="py-4 text-right text-sm">
                    <span className="font-bold text-charcoal">{formatCurrency(c.totalSpent)}</span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {formatDateTime(c.lastPurchase)}
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Headset size={16} /> History
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 elevated">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Customers</p>
          <p className="text-2xl font-bold text-charcoal">{customers.length}</p>
        </Card>
        <Card className="p-6 elevated">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Revenue from Customers</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </Card>
        <Card className="p-6 elevated">
          <p className="text-sm font-medium text-gray-500 uppercase">Avg. Spent per Customer</p>
          <p className="text-2xl font-bold text-charcoal">
            {customers.length > 0 ? formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length) : "₹0"}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminCustomers;
