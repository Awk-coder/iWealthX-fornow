import React from "react";

const ProcessCard = ({ number, title, description }) => {
  return (
    <div className="relative group">
      {/* Background card with hover effect */}
      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl transform group-hover:scale-105 transition-all duration-300 border border-gold/20"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center p-10 h-full">
        {/* Number with glowing effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full"></div>
          <div className="relative w-24 h-24 rounded-full bg-black border-2 border-gold flex items-center justify-center">
            <span className="text-5xl font-bold text-gold">{number}</span>
          </div>
        </div>

        {/* Title with gradient underline on hover */}
        <div className="relative mb-6 group-hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-text-primary text-2xl font-bold mb-2">{title}</h3>
          <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500"></div>
        </div>

        {/* Description with fade-in effect */}
        <p className="text-text-secondary text-lg leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const processes = [
    {
      number: "1",
      title: "Sign Up & Verify",
      description:
        "Create your account, verify identity, and complete KYC compliance easily.",
    },
    {
      number: "2",
      title: "Invest Smartly",
      description:
        "Use AI tools, assess style, fund your account, and start investing securely.",
    },
    {
      number: "3",
      title: "Earn & Cash Out",
      description:
        "Generate income from assets and withdraw your earnings anytime.",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with animated underline */}
        <div className="text-center mb-20">
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            How It Works
          </h2>
          <h3 className="text-text-primary text-5xl font-bold mt-6">
            Our Process
          </h3>
        </div>

        {/* Process cards with grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {processes.map((process) => (
            <ProcessCard
              key={process.number}
              number={process.number}
              title={process.title}
              description={process.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
