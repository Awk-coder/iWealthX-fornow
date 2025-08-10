import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { websiteService } from "../../lib/supabase";
import logo from "../../assets/logo-name.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");

    try {
      await websiteService.subscribeNewsletter(email);
      setSubmitStatus("success");
      setSubmitMessage("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubmitStatus("error");
      if (error.message?.includes("duplicate")) {
        setSubmitMessage("You are already subscribed to our newsletter.");
      } else {
        setSubmitMessage("Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Investor", href: "/investor" },
    { name: "Asset Owner", href: "/asset-owner" },
    {
      name: "Academy",
      href: "https://www.youtube.com/@iWealthX-real",
    },
    { name: "Team", href: "/team" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@iWealthX-real",
      icon: <i className="fab fa-youtube text-xl"></i>,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/iwealthx/posts/?feedView=all",
      icon: <i className="fab fa-linkedin text-xl"></i>,
    },
  ];

  return (
    <footer className="bg-surface border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="iWealthX" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gold">iWealthX</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Democratizing access to Shariah-compliant fractional asset
              investments through blockchain technology and Islamic finance
              principles.
            </p>
            <div className="flex items-center space-x-2 text-accent-green text-sm">
              <div className="w-2 h-2 bg-accent-green rounded-full"></div>
              <span>100% Shariah Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-text-secondary hover:text-gold transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-text-secondary hover:text-gold transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/investor"
                  className="text-text-secondary hover:text-gold transition-colors text-sm"
                >
                  Investment Opportunities
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-text-secondary hover:text-gold transition-colors text-sm"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-text-secondary hover:text-gold transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-text-secondary hover:text-gold transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold" />
                <span className="text-text-secondary text-sm">
                  saifkhan@iwealthx.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold" />
                <span className="text-text-secondary text-sm">
                  +60 12-352 4656
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-text-secondary text-sm">
                  Kuala Lumpur, Malaysia
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">
              Stay Updated
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Subscribe to our newsletter for the latest Shariah-compliant
              investment opportunities.
            </p>

            {submitStatus && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  submitStatus === "success"
                    ? "bg-accent-green/10 text-accent-green"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {submitStatus === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{submitMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-3 py-2 bg-background border border-gray-700/50 rounded-l-lg text-text-primary text-sm focus:outline-none focus:border-gold/50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold text-background px-4 py-2 rounded-r-lg hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-text-secondary text-sm">
              © 2024 iWealthX. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-text-secondary hover:text-gold transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-gold transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-gold transition-colors"
              >
                Shariah Compliance
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
