import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Battery,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  PackageCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

const PROTECTED_PATHS = ["/battery-finder", "/maintenance", "/my-orders", "/my-maintenance"];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const { logout, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, path, label) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);

    if (!isAuthenticated && PROTECTED_PATHS.includes(path)) {
      e.preventDefault();
      toast.error(`Please login or register first to access ${label}`);
      navigate("/login", { state: { from: { pathname: path } } });
    }
  };

  const primaryNavLinks = [
    { name: "Home", path: "/" },
    { name: "Batteries", path: "/batteries" },
    { name: "AI Finder", path: "/battery-finder", isFeatured: true },
    { name: "Maintenance", path: "/maintenance" },
  ];

  const secondaryNavLinks = [
    { name: "Compare", path: "/compare" },
    { name: "About Us", path: "/about-us" },
    { name: "Warranty Support", path: "/warranty-support" },
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isProductRoute =
    location.pathname.includes("/product") || location.pathname.includes("/batteries");

  if (loading) return null;

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300">
      {/* Dynamic Frosted Glass Capsule */}
      <div
        className={`rounded-2xl border transition-all duration-300 px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-2 ${
          scrolled || isProductRoute
            ? "bg-white/85 backdrop-blur-2xl border-gray-200/80 shadow-md shadow-gray-900/5 ring-1 ring-black/5"
            : "bg-white/75 backdrop-blur-xl border-white/60 shadow-sm"
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group focus:outline-none min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 bg-gradient-to-tr from-slate-900 via-blue-900 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Battery size={19} strokeWidth={2.5} />
          </div>
          <span className="text-sm sm:text-lg font-bold text-gray-900 tracking-tight leading-tight truncate">
            AutoHome <span className="text-blue-600">Batteries</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-gray-100/70 backdrop-blur-md p-1 rounded-xl border border-gray-200/50">
          {primaryNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path, link.name)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {link.isFeatured && (
                  <Sparkles size={13} className={isActive ? "text-blue-600" : "text-amber-500"} />
                )}
                {link.name}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                secondaryNavLinks.some((l) => l.path === location.pathname)
                  ? "bg-white text-blue-600 font-bold shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <span>More</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  moreDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-2xl border border-gray-200/80 rounded-xl shadow-lg py-1.5 z-50">
                {secondaryNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMoreDropdownOpen(false)}
                    className={`block px-3.5 py-2 text-xs font-semibold transition-colors ${
                      location.pathname === link.path
                        ? "text-blue-600 bg-blue-50/70 font-bold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isAdminRoute && (
            <Link
              to="/my-orders"
              onClick={(e) => handleNavClick(e, "/my-orders", "My Orders")}
              className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all items-center gap-1 ${
                location.pathname === "/my-orders"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-gray-50/80 text-gray-700 border-gray-200/60 hover:bg-gray-100"
              }`}
            >
              <PackageCheck size={14} />
              <span>Orders</span>
            </Link>
          )}

          {isAuthenticated && !isAdminRoute && (
            <button
              onClick={logout}
              title="Logout"
              className="hidden sm:inline-flex text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/80 px-2.5 py-1.5 rounded-xl border border-rose-200/50 transition-all items-center gap-1"
            >
              <LogOut size={13} />
            </button>
          )}

          {!isAuthenticated && !isAdminRoute && (
            <Link
              to="/login"
              className="inline-flex text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 sm:px-3.5 py-1.5 rounded-xl transition-all items-center gap-1.5 shadow-xs"
            >
              <UserCheck size={13} />
              <span>Login</span>
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Admin</span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden p-1.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-3 top-20 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white/95 backdrop-blur-2xl border border-gray-200/80 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {[...primaryNavLinks, ...secondaryNavLinks].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path, link.name)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  location.pathname === link.path
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.isFeatured && <Sparkles size={13} className="text-amber-500" />}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/my-orders"
              onClick={(e) => handleNavClick(e, "/my-orders", "My Orders")}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl"
            >
              <PackageCheck size={15} /> My Orders
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl"
                  >
                    <ShieldCheck size={15} className="text-amber-400" /> Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/my-maintenance"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 rounded-xl"
                >
                  <Wrench size={15} /> My Maintenance Visits
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  <LogOut size={15} /> Logout Account
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                <UserCheck size={15} /> Login / Register Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;