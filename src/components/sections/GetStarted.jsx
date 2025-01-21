import React from "react";
import { useNavigate } from "react-router-dom";

const ActionCard = ({ title, description, buttonText, path }) => {
  const navigate = useNavigate();

  return (
    <div className="relative group rounded-3xl bg-black/30 p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20">
      {/* Content */}
      <div className="flex flex-col h-full">
        <h3 className="text-text-primary text-4xl font-bold mb-6 group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="text-text-primary text-lg leading-relaxed mb-8 opacity-90">
          {description}
        </p>
        <button
          onClick={() => navigate(path)}
          className="mt-auto bg-gold text-background px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all w-fit"
        >
          {buttonText}
        </button>
      </div>

      {/* Gold border */}
      <div className="absolute inset-0 border border-gold/30 rounded-3xl pointer-events-none transition-all duration-500 group-hover:border-gold/50 group-hover:border-2"></div>
    </div>
  );
};

const GetStarted = () => {
  const options = [
    {
      title: "Are you an Asset Owner?",
      description:
        "Start generating income by listing your real-world assets. Unlock the potential of your assets and grow your wealth today!",
      buttonText: "Tokenize Now",
      path: "/asset-owner",
    },
    {
      title: "Are you an Investor?",
      description:
        "Seize the opportunity to invest in our curated list of real-world assets. Own, earn, and grow your wealth today!",
      buttonText: "Invest Now",
      path: "/investor",
    },
  ];

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            Get started
          </h2>
          <h3 className="text-text-primary text-5xl font-bold">
            Begin Investing Now
          </h3>
        </div>

        {/* Action cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((option, index) => (
            <ActionCard
              key={index}
              title={option.title}
              description={option.description}
              buttonText={option.buttonText}
              path={option.path}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
