import { Link } from "react-router-dom";
import {
  Battery,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
} from "lucide-react";

const Footer = () => (
  <footer className="bg-navy border-t border-navy-light mt-auto">
    <div className="container-premium py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-gold rounded flex items-center justify-center">
              <Battery size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              AutoHome <span className="text-gold">Batteries</span>
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
            Premium automotive battery solutions with AI-powered recommendations.
            Your trusted partner for battery sales, service and maintenance.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Services</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <Link to="/batteries" className="hover:text-gold transition-colors">
                Battery Sales
              </Link>
            </li>
            <li>
              <Link
                to="/battery-finder"
                className="hover:text-gold transition-colors"
              >
                AI Battery Finder
              </Link>
            </li>
            <li>
              <Link to="/compare" className="hover:text-gold transition-colors">
                Battery Comparison
              </Link>
            </li>
            <li>
              <Link to="/maintenance" className="hover:text-gold transition-colors">
                Maintenance Booking
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <Link
                to="/about-us"
                className="hover:text-gold transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/warranty-support"
                className="hover:text-gold transition-colors"
              >
                Warranty Support
              </Link>
            </li>
            <li>
              <Link
                to="/terms-conditions"
                className="hover:text-gold transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-gold transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-gold mt-0.5" />
              <span>+91 9789688756 / +91 6369115420</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-gold mt-0.5" />
              <span className="max-w-xs leading-relaxed">
                autohomebatteries@gmail.com
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-gold mt-0.5" />
              <span className="max-w-xs leading-relaxed">
                Maula Street, Opp of SN Tea Stall, Pernambut 635810, Tamil
                Nadu
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-gold" />
              <span>Mon - Sun: 6:00 AM to 10:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-light pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} AutoHome Batteries. All rights
          reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <ShieldCheck size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Truck size={20} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
