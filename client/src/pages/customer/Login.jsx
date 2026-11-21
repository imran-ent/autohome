import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Battery } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { authService } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal.jsx";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/auth/google`,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );
      const payload = response.data?.data || response.data;
      login(payload.user, payload.token);
      toast.success(`Welcome, ${payload.user?.name || "back"}!`);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed");
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
              <span className="text-[10px] font-medium text-blue uppercase tracking-wider mt-0.5">
                Est. 2026
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-charcoal mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <Card className="p-8 elevated">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              leftIcon={<Mail size={18} className="text-gray-400" />}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                leftIcon={<Lock size={18} className="text-gray-400" />}
                rightIcon={
                  showPassword ? (
                    <EyeOff
                      size={18}
                      className="cursor-pointer text-gray-400 hover:text-blue transition-colors"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="cursor-pointer text-gray-400 hover:text-blue transition-colors"
                      onClick={() => setShowPassword(true)}
                    />
                  )
                }
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-xs font-medium text-blue hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-4" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"} <ArrowRight size={18} />
            </Button>
          </form>

          {/* Continue with Google */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-gray-200" />
              <span className="shrink mx-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Or continue with
              </span>
              <div className="grow border-t border-gray-200" />
            </div>

            <div className="mt-3 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google sign-in was cancelled or failed")}
                text="continue_with"
                shape="rectangular"
                size="large"
                width="340"
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-center text-sm text-gray-600 mb-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue font-medium hover:underline">
                Create account
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600">
              Are you an admin?{" "}
              <Link to="/admin/login" className="text-blue font-medium hover:underline">
                Admin Login
              </Link>
            </p>
          </div>
        </Card>
      </div>

      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        initialEmail={form.email}
      />
    </div>
  );
};

export default Login;