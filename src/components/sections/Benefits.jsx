import React from "react";
import card1 from "../../assets/card1.png";
import card2 from "../../assets/card2.png";
import card3 from "../../assets/card3.png";

const BenefitCard = ({ image, title, description }) => {
  return (
    <div className="relative group overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/70 transition-all duration-500 group-hover:bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative p-10 h-[400px] flex flex-col justify-end transform transition-all duration-500 group-hover:translate-y-[-8px]">
        <h3 className="text-text-primary text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-gold">
          {title}
        </h3>
        <p className="text-text-primary text-lg leading-relaxed transform transition-all duration-500 opacity-90 group-hover:opacity-100">
          {description}
        </p>
      </div>

      {/* Gold border */}
      <div className="absolute inset-0 border border-gold/30 rounded-3xl pointer-events-none transition-all duration-500 group-hover:border-gold/50 group-hover:border-2"></div>
    </div>
  );
};

const Benefits = () => {
  const benefits = [
    {
      image: card1,
      title: "Invest in Vetted High-Value Assets",
      description:
        "Build income from periodic payments with income-generating assets.",
    },
    {
      image: card2,
      title: "Generate Consistent Passive Income",
      description:
        "Earn passive income through premium asset investments with ease and security.",
    },
    {
      image: card3,
      title: "Liquidity, when you need it most",
      description:
        "In case you need cash - Sell to our Vetted Investors on our Secondary Platform",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            Benefits
          </h2>
          <h3 className="text-text-primary text-5xl font-bold">
            Benefits With Us
          </h3>
        </div>

        {/* Benefits cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              image={benefit.image}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
