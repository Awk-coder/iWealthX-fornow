import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-name.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg backdrop-saturate-150"
          : "bg-background"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} alt="iWealthX" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-text-primary hover:text-gold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/investor"
              className="text-text-primary hover:text-gold transition-colors"
            >
              Investor
            </Link>
            <Link
              to="/asset-owner"
              className="text-text-primary hover:text-gold transition-colors"
            >
              Asset Owner
            </Link>
            <a
              href="https://www.youtube.com/channel/UCZKRRbxpObNoQGNzHVgewLw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-gold transition-colors"
            >
              Academy
            </a>
            <a
              href="/about"
              className="text-text-primary hover:text-gold transition-colors"
            >
              About
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-primary hover:text-gold"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block text-text-primary hover:text-gold px-3 py-2"
              >
                Home
              </Link>
              <Link
                to="/investor"
                className="block text-text-primary hover:text-gold px-3 py-2"
              >
                Investor
              </Link>
              <Link
                to="/asset-owner"
                className="block text-text-primary hover:text-gold px-3 py-2"
              >
                Asset Owner
              </Link>
              <a
                href="https://www.youtube.com/channel/UCZKRRbxpObNoQGNzHVgewLw"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-text-primary hover:text-gold px-3 py-2"
              >
                Academy
              </a>
              <a
                href="/about"
                className="block text-text-primary hover:text-gold px-3 py-2"
              >
                About
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
