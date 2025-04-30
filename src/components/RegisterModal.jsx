import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Asset Owner",
      description: "List your asset for tokenization",
      path: "/asset-owner",
    },
    {
      title: "Investor",
      description: "Invest in tokenized assets",
      path: "/investor",
    },
    {
      title: "Partner",
      description: "Partner with iWealthX",
      path: "/partner-form",
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-background border border-gold/30 rounded-3xl p-8 max-w-2xl w-full mx-4 transform transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="text-gold text-3xl font-bold mb-8 text-center">
          Choose your path
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <button
              key={option.title}
              onClick={() => {
                onClose();
                navigate(option.path);
              }}
              className="group p-6 border border-gold/30 rounded-2xl hover:border-gold transition-all hover:shadow-lg hover:shadow-gold/10"
            >
              <h3 className="text-text-primary text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                {option.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mb-6 bg-black/40 border border-gold/30 rounded-lg p-3">
          <p className="text-text-secondary text-xs">
            By registering, you acknowledge that any investments made through iWealthX are equity investments where your capital is at risk. The value of your investment can go down as well as up, and returns are not guaranteed.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-gold transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
