import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactCard = ({ icon, title, details }) => {
  return (
    <div className="bg-black/30 border border-gold/30 rounded-3xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 hover:border-gold/50">
      <div className="text-gold text-3xl mb-4">{icon}</div>
      <h3 className="text-text-primary text-xl font-bold mb-2">{title}</h3>
      <p className="text-text-secondary">{details}</p>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-48 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Get in Touch
            </h2>
            <h1 className="text-text-primary text-5xl lg:text-6xl font-bold mb-8">
              Contact Us
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed">
              Have questions about iWealthX? We're here to help! Reach out to us using any of the contact methods below.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ContactCard
              icon={<FaEnvelope />}
              title="Email"
              details="saifkhan@iwealthx.com"
            />
            <ContactCard
              icon={<FaPhone />}
              title="Phone"
              details="+60 12-352 4656"
            />
            <ContactCard
              icon={<FaMapMarkerAlt />}
              title="Location"
              details="Kuala Lumpur, Malaysia"
            />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-gold/30 h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127482.6891426587!2d101.61694180238526!3d3.138503939975948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701efeae7%3A0xf4d98e5b2f1c287d!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2sus!4v1697505342338!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="iWealthX Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 