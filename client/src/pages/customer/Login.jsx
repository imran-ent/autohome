import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Battery } from "lucide-react";
import { authService } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(form);
      login(response.data.data.user, response.data.data.token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-navy to-blue rounded-2xl flex items-center justify-center shadow-lg shadow-blue/20">
              <Battery size={24} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-charcoal tracking-tight leading-none">
                AutoHome <span className="text-blue">Batteries</span>
              </span>
              <span className="text-[10px] font-medium text-blue uppercase tracking-wider mt-0.5">Est. 2026</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-charcoal mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        <Card className="p-8 elevated">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email Address" type="email" placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} leftIcon={<Mail size={18} className="text-gray-400" />} />
            <Input label="Password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} leftIcon={<Lock size={18} className="text-gray-400" />} rightIcon={<Eye size={18} className={`cursor-pointer hover:text-blue transition-colors ${showPassword ? "text-gray-400" : "text-gray-400"}`} onClick={() => setShowPassword(!showPassword)} />} />
            <Button type="submit" variant="primary" className="w-full py-4" disabled={loading}>{loading ? "Signing in..." : "Sign In"} <ArrowRight size={18} /></Button>
          </form>
          <div className="mt-8">
            <p className="text-center text-sm text-gray-600 mb-4">Don't have an account? <Link to="/register" className="text-blue font-medium hover:underline">Create account</Link></p>
            <p className="text-center text-sm text-gray-600">Are you an admin? <Link to="/admin/login" className="text-blue font-medium hover:underline">Admin Login</Link></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;

