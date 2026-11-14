import { Link } from "react-router-dom";
import { FileText, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";

const TermsConditions = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-charcoal mb-4">Terms &amp; Conditions</h1>
      <h2 className="text-2xl font-bold text-blue mb-2">Terms of Service</h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        Welcome to Auto Home Batteries. By accessing or purchasing products
        through our website, you agree to the following terms and conditions.
      </p>
      <p className="text-gray-600 text-lg leading-relaxed mt-2">
        Please read them carefully before placing an order.
      </p>
    </div>

    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">1. Products and Information</h3>
        <p className="text-gray-600 leading-relaxed">
          We make reasonable efforts to display accurate product descriptions,
          specifications, images and prices.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Product availability, specifications and prices may change without
          prior notice. Customers should verify product compatibility before
          placing an order.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">2. Product Compatibility</h3>
        <p className="text-gray-600 leading-relaxed">
          Battery compatibility depends on factors such as vehicle model,
          manufacturing year, engine type, battery dimensions, voltage and
          terminal configuration.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Customers should provide accurate vehicle or inverter details when
          requesting product recommendations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          An order may require compatibility confirmation before dispatch.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">3. Pricing and Payment</h3>
        <p className="text-gray-600 leading-relaxed">
          All product prices will be displayed on the website where available.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Applicable taxes, delivery charges and other fees will be
          communicated during checkout or before order confirmation.
        </p>
        <p className="text-gray-600 leading-relaxed">
          An order is considered confirmed only after successful order
          acceptance and payment verification, where applicable.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">4. Orders and Availability</h3>
        <p className="text-gray-600 leading-relaxed">
          All orders are subject to product availability and verification.
        </p>
        <p className="text-gray-600 leading-relaxed">
          If a product becomes unavailable after an order is placed, we will
          contact the customer regarding the available options, including
          cancellation and applicable refund.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">5. Delivery and Installation</h3>
        <p className="text-gray-600 leading-relaxed">
          Delivery availability, charges and estimated timelines depend on the
          delivery location and product.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Installation services, where offered, are subject to service
          availability, product eligibility and location.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Any applicable installation charges or conditions will be
          communicated before order confirmation.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">6. Old Battery Exchange</h3>
        <p className="text-gray-600 leading-relaxed">
          Old battery exchange may be available on selected products and
          locations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Exchange value depends on the old battery's type, condition, capacity
          and applicable exchange terms.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The exchange value will be confirmed before the transaction.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">7. Warranty</h3>
        <p className="text-gray-600 leading-relaxed">
          Products are covered by manufacturer warranty where applicable.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Warranty claims are subject to the respective manufacturer's
          policies, eligibility requirements and inspection procedures.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Please refer to our Warranty Support page for further information.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">8. Cancellation, Returns and Refunds</h3>
        <p className="text-gray-600 leading-relaxed">
          Customers should contact us as soon as possible if they wish to
          cancel an order.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Cancellation, return and refund eligibility will depend on the order
          status, product condition, applicable manufacturer policies and
          relevant consumer protection laws.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Products damaged after delivery, incorrectly installed or used
          contrary to manufacturer instructions may be subject to additional
          assessment.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Any approved refund will be processed through the applicable payment
          method or agreed process.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">9. Customer Responsibilities</h3>
        <p className="text-gray-600 leading-relaxed">
          Customers are responsible for:
        </p>
        <ul className="list-disc pl-8 text-gray-600 space-y-2">
          <li>Providing accurate contact and delivery information.</li>
          <li>Providing correct vehicle or inverter details.</li>
          <li>Following manufacturer installation and maintenance instructions.</li>
          <li>Using products for their intended purpose.</li>
          <li>Keeping purchase invoices and warranty documents.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">10. Changes to Terms</h3>
        <p className="text-gray-600 leading-relaxed">
          Auto Home Batteries reserves the right to update these terms when
          necessary. Updated terms will be published on this website.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">11. Contact Information</h3>
        <p className="text-gray-600 leading-relaxed">
          For questions regarding these terms, contact:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 mt-4">
          <p className="font-bold text-charcoal">AUTO HOME BATTERIES</p>
          <p className="text-gray-600">
            Opp. SN Tea Stall, Maula Street, Pernambut, Tamil Nadu.
          </p>
          <p className="text-gray-600">
            Phone / WhatsApp:
            <span className="text-blue font-bold">97896 88756 | 94434 37168</span>
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default TermsConditions;
