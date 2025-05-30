import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { websiteService } from "../lib/supabase";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");

    try {
      await websiteService.submitContactForm(formData);
      setSubmitStatus("success");
      setSubmitMessage(
        "Thank you for your message! We'll get back to you within 24 hours."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Have questions about Shariah-compliant investing or need support?
            We're here to help you on your investment journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      Email
                    </h3>
                    <p className="text-text-secondary">saifkhan@iwealthx.com</p>
                    <p className="text-text-secondary text-sm">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/20 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      Phone
                    </h3>
                    <p className="text-text-secondary">+60 12-904-2153</p>
                    <p className="text-text-secondary text-sm">
                      Monday to Friday, 9 AM - 6 PM (MYT)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      Location
                    </h3>
                    <p className="text-text-secondary">
                      Kuala Lumpur, Malaysia
                    </p>
                    <p className="text-text-secondary text-sm">
                      Serving investors globally
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-surface border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Office Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Monday - Friday</span>
                  <span className="text-text-primary">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Saturday</span>
                  <span className="text-text-primary">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Sunday</span>
                  <span className="text-text-primary">Closed</span>
                </div>
              </div>
              <p className="text-text-secondary text-xs mt-4">
                * All times are in Malaysia Time (MYT)
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Send us a Message
            </h2>

            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  submitStatus === "success"
                    ? "bg-accent-green/10 border-accent-green/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {submitStatus === "success" ? (
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <p
                    className={`text-sm ${
                      submitStatus === "success"
                        ? "text-accent-green"
                        : "text-red-500"
                    }`}
                  >
                    {submitMessage}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Investment Questions">
                    Investment Questions
                  </option>
                  <option value="KYC Support">KYC Support</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership Opportunities">
                    Partnership Opportunities
                  </option>
                  <option value="Media Inquiry">Media Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-background px-6 py-3 rounded-lg font-medium hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Our Location
          </h2>
          <div className="bg-surface border border-gray-700/50 rounded-lg p-6">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Kuala Lumpur, Malaysia
                </h3>
                <p className="text-text-secondary">
                  Serving Shariah-compliant investors globally
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
