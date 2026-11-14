import { Link } from "react-router-dom";
import { ShieldCheck, FileText, Phone, Mail, MapPin } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";

const WarrantySupport = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-charcoal mb-4">Warranty Support</h1>
      <h2 className="text-2xl font-bold text-blue mb-2">Your Battery. Our Support.</h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        At Auto Home Batteries, we understand that warranty support is an
        important part of purchasing a battery.
      </p>
    </div>

    <div className="mb-12">
      <p className="text-gray-600 leading-relaxed mb-6">
        Most battery products are covered by manufacturer-provided warranty
        terms, depending on the brand, model and product category.
      </p>
      <h3 className="text-xl font-bold text-charcoal mb-4">How to Claim Warranty Support</h3>
      <ol className="list-decimal pl-8 space-y-4 text-gray-600">
        <li>Keep your original purchase invoice or proof of purchase ready.</li>
        <li>Keep the battery warranty card, if provided.</li>
        <li>Contact our customer support team.</li>
        <li>Share the battery model, serial number and details of the issue.</li>
        <li>Follow the inspection and warranty procedure applicable to the manufacturer.</li>
      </ol>
    </div>

    <div className="mb-12">
      <h3 className="text-xl font-bold text-charcoal mb-4">Documents You May Need</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          "Original purchase invoice.",
          "Battery serial number.",
          "Warranty card, if applicable.",
          "Battery photographs, if requested.",
          "Vehicle or inverter details, where relevant.",
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex items-start gap-3">
            <FileText size={20} className="text-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{item}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-12">
      <h3 className="text-xl font-bold text-charcoal mb-4">Important Warranty Information</h3>
      <div className="space-y-4">
        {[
          "Warranty coverage is determined by the respective manufacturer.",
          "Warranty duration varies depending on the battery model and brand.",
          "Manufacturing defects and other eligible issues are assessed according to the manufacturer's warranty policy.",
          "Physical damage, incorrect installation, misuse, unauthorised repairs and improper maintenance may affect warranty eligibility.",
          "Warranty approval is subject to manufacturer inspection and verification.",
          "Warranty does not automatically mean a cash refund or immediate replacement.",
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-gray-100 bg-white flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{item}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-navy rounded-2xl p-8 md:p-12 text-white">
      <h3 className="text-2xl font-bold mb-4">Need Warranty Assistance?</h3>
      <p className="text-gray-300 mb-6">
        Contact Auto Home Batteries:
      </p>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Phone size={20} className="text-gold mt-0.5" />
          <span>
            <strong>Phone / WhatsApp:</strong>
            <span className="text-white">97896 88756 | 94434 37168</span>
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Mail size={20} className="text-gold mt-0.5" />
          <span className="text-white">autohomebatteries@gmail.com</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-6">
        We will help guide you through the applicable warranty support process.
      </p>
    </div>
  </div>
);

export default WarrantySupport;
