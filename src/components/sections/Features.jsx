import React from "react";
import win from "../../assets/win.png";
import chart from "../../assets/chart.png";

const FeatureCard = ({ image, title, description }) => {
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
      <div className="relative p-10 h-[300px] flex flex-col justify-end transform transition-all duration-500 group-hover:translate-y-[-8px]">
        <h3 className="text-text-primary text-3xl font-bold mb-4 transition-colors duration-300 group-hover:text-gold">
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

const StatCard = ({ number, text }) => {
  return (
    <div className="relative group bg-black/30 rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-xl hover:shadow-gold/10">
      <h3 className="text-text-primary text-5xl font-bold mb-2">{number}</h3>
      <p className="text-text-secondary text-lg">{text}</p>
      <div className="absolute inset-0 border border-gold/30 rounded-3xl pointer-events-none transition-all duration-500 group-hover:border-gold/50"></div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      image: win,
      title: "Wide Variety of Assets",
      description:
        "Invest in Real Estate, Green Energy, Gold, Diamonds, Natural Gas, Agriculture, Carbon Credits & more.",
    },
    {
      image: chart,
      title: "Build a Wealth Portfolio",
      description:
        "Diversify your portfolio with investments across asset classes as listed above.",
    },
  ];

  const stats = [
    {
      number: "50+",
      text: "projects in pipeline",
    },
    {
      number: "200 yrs",
      text: "of combined experience",
    },
  ];

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            Features
          </h2>
          <h3 className="text-text-primary text-5xl font-bold">
            Browse our set of features
          </h3>
        </div>

        {/* Features cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              image={feature.image}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Stats cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} number={stat.number} text={stat.text} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
