import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-name.png";

const Footer = () => {
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
      icon: (
        <i className="fab fa-youtube text-xl"></i>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/iwealthx/posts/?feedView=all",
      icon: (
        <i className="fab fa-linkedin text-xl"></i>
      ),
    },
  ];

  return (
    <footer className="bg-background border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <img src={logo} alt="iWealthX" className="h-12" />

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                target={item.name === "Academy" ? "_blank" : undefined}
                rel={
                  item.name === "Academy" ? "noopener noreferrer" : undefined
                }
                className="text-text-primary hover:text-gold transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-gold transition-colors"
                aria-label={item.name}
              >
                {item.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} iWealthX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
