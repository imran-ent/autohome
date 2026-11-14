import { ShieldCheck, Battery, Truck, Headset, ArrowRight } from "lucide-react";
import { Button } from "../../components/common/Button.jsx";

const AboutUs = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-charcoal mb-4">About Us</h1>
      <h2 className="text-2xl font-bold text-blue mb-2">Powering Your World!</h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        Welcome to <strong>AUTO HOME BATTERIES</strong>, your trusted destination for battery solutions.
      </p>
      <p className="text-gray-600 text-lg leading-relaxed mt-4">
        At Auto Home Batteries, we aim to make finding and purchasing the right battery simple, convenient and reliable.
        Whether you need a battery for your car, bike, commercial vehicle or home inverter, we help you find a
        suitable solution based on your requirements.
      </p>
    </div>

    <div className="mb-12">
      <h3 className="text-xl font-bold text-charcoal mb-4">What We Offer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Car Batteries",
            desc: "Reliable battery solutions for different car models.",
            icon: Battery,
          },
          {
            title: "Bike Batteries",
            desc: "Battery options for two-wheelers.",
            icon: Battery,
          },
          {
            title: "Inverter Batteries",
            desc: "Backup power solutions for homes and businesses.",
            icon: Battery,
          },
          {
            title: "Commercial Vehicle Batteries",
            desc: "Battery solutions for eligible commercial vehicles.",
            icon: Truck,
          },
          {
            title: "Battery Assistance",
            desc: "Product guidance, battery health checking and replacement support.",
            icon: Headset,
          },
        ].map((feat) => (
          <div key={feat.title} className="p-8 rounded-xl border border-gray-100 bg-gray-50 hover:elevated">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue mb-4">
              <feat.icon size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">{feat.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-12">
      <h3 className="text-xl font-bold text-charcoal mb-4">Why Choose Auto Home Batteries?</h3>
      <div className="space-y-4">
        {[
          "Multiple battery brands and product options.",
          "Assistance in selecting compatible batteries.",
          "Transparent product and pricing information.",
          "Old battery exchange options on eligible purchases.",
          "Customer support for product and warranty-related enquiries.",
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 bg-white">
            <ShieldCheck size={20} className="text-blue mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">{item}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-12">
      <h3 className="text-xl font-bold text-charcoal mb-4">Our Commitment</h3>
      <div className="p-8 rounded-xl border border-gray-100 bg-offwhite text-center">
        <p className="text-gray-600 text-lg leading-relaxed">
          Our goal is to provide customers with suitable battery solutions, clear
          information and dependable customer support.
        </p>
      </div>
    </div>

    <div className="bg-navy rounded-2xl p-8 md:p-12 text-white text-center">
      <h3 className="text-2xl font-bold mb-4">AUTO HOME BATTERIES</h3>
      <p className="text-gray-300 mb-4">
        Opp. SN Tea Stall, Maula Street, Pernambut, Tamil Nadu.
      </p>
      <p className="text-gray-300 mb-6">
        Phone / WhatsApp: <span className="text-gold font-bold">97896 88756 | 94434 37168</span>
      </p>
      <Button variant="gold" className="w-auto">
        Contact Us <ArrowRight size={20} className="ml-2 inline" />
      </Button>
    </div>
  </div>
);

export default AboutUs;