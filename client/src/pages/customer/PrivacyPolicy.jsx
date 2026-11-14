import { Link } from "react-router-dom";
import { ShieldCheck, FileText, Phone, Mail, MapPin } from "lucide-react";
import { Card } from "../../components/common/Card.jsx";

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-charcoal mb-4">Privacy Policy</h1>
      <h2 className="text-2xl font-bold text-blue mb-2">Your Privacy Matters to Us</h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        At Auto Home Batteries, we respect your privacy and are committed to
        protecting the personal information you share with us through our
        website.
      </p>
      <p className="text-gray-600 text-lg leading-relaxed mt-2">
        This Privacy Policy explains what information we may collect, how we
        use it and how we protect it.
      </p>
    </div>

    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">1. Information We Collect</h3>
        <p className="text-gray-600 leading-relaxed">
          Depending on how you use our website, we may collect:
        </p>
        <ul className="list-disc pl-8 text-gray-600 space-y-2">
          <li>Full name.</li>
          <li>Mobile number.</li>
          <li>Email address.</li>
          <li>Billing and delivery address.</li>
          <li>Order and purchase details.</li>
          <li>Vehicle or inverter information provided for compatibility checks.</li>
          <li>Payment transaction references and status.</li>
          <li>Website usage and technical information.</li>
        </ul>
        <p className="text-gray-600 leading-relaxed">
          We do not intend to collect unnecessary personal information.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">2. How We Use Your Information</h3>
        <p className="text-gray-600 leading-relaxed">
          We may use your information to:
        </p>
        <ul className="list-disc pl-8 text-gray-600 space-y-2">
          <li>Process and manage customer orders.</li>
          <li>Confirm product availability.</li>
          <li>Verify battery compatibility.</li>
          <li>Arrange delivery and eligible installation services.</li>
          <li>Provide customer support.</li>
          <li>Assist with warranty-related enquiries.</li>
          <li>Process applicable refunds.</li>
          <li>Improve our website and customer experience.</li>
          <li>Communicate important order updates.</li>
        </ul>
        <p className="text-gray-600 leading-relaxed">
          Promotional communications will be sent where permitted and subject to
          applicable consent requirements.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">3. Payment Information</h3>
        <p className="text-gray-600 leading-relaxed">
          Online payments may be processed through third-party payment service
          providers.
        </p>
        <p className="text-gray-600 leading-relaxed">
          We do not intend to store customers' complete card details, UPI PINs
          or banking passwords on our website.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Customers should use only trusted payment methods and never share
          confidential payment credentials.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">4. Sharing of Information</h3>
        <p className="text-gray-600 leading-relaxed">
          We may share relevant customer information with trusted service
          providers when necessary to operate our business, including:
        </p>
        <ul className="list-disc pl-8 text-gray-600 space-y-2">
          <li>Delivery and logistics partners.</li>
          <li>Payment processing providers.</li>
          <li>Installation service partners.</li>
          <li>Technical and website service providers.</li>
          <li>Manufacturers or authorised warranty service centres, where necessary.</li>
        </ul>
        <p className="text-gray-600 leading-relaxed">
          We do not sell customers' personal information as a business practice.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">5. Cookies and Website Data</h3>
        <p className="text-gray-600 leading-relaxed">
          Our website may use cookies or similar technologies to improve
          functionality, understand website usage and remember customer
          preferences.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Customers may manage cookie permissions through their browser
          settings, where available.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">6. Data Security</h3>
        <p className="text-gray-600 leading-relaxed">
          We take reasonable technical and organisational measures to protect
          customer information against unauthorised access, misuse, loss or
          disclosure.
        </p>
        <p className="text-gray-600 leading-relaxed">
          However, no internet-based system can guarantee absolute security.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">7. Data Retention</h3>
        <p className="text-gray-600 leading-relaxed">
          We retain customer information only for as long as reasonably
          necessary for business operations, order management, warranty
          assistance, legal obligations and dispute resolution.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">8. Your Privacy Rights</h3>
        <p className="text-gray-600 leading-relaxed">
          Subject to applicable laws, customers may request access to,
          correction of or deletion of their personal information.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Customers may also request assistance regarding their communication
          preferences.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">9. Third-Party Websites</h3>
        <p className="text-gray-600 leading-relaxed">
          Our website may contain links to third-party websites or payment
          services.
        </p>
        <p className="text-gray-600 leading-relaxed">
          We are not responsible for the privacy practices or content of
          external websites. Customers should review their respective privacy
          policies.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">10. Changes to This Policy</h3>
        <p className="text-gray-600 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will
          be published on this page.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-charcoal mb-3">11. Contact Us</h3>
        <p className="text-gray-600 leading-relaxed">
          For privacy-related questions or requests, contact:
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
          <p className="text-gray-600">
            Email:
            <span className="text-blue font-bold">autohomebatteries@gmail.com</span>
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default PrivacyPolicy;
