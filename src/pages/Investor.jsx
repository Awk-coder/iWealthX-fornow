import React from "react";
import { useState } from "react";
import re1 from "../assets/re1.png";
import re2 from "../assets/re2.png";
import re3 from "../assets/re3.png";
import solarpanel from "../assets/solarpanel.png";
import wind from "../assets/wind.png";
import hydro from "../assets/hydro.png";
import dinar from "../assets/dinar.png";
import diversified from "../assets/diversified.png";
import access from "../assets/access.png";
import hassle from "../assets/hassle.png";
import gridImage from "../assets/img-grid-hero.png";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../components/RegisterModal";

const InvestorHero = () => {
  return (
    <section className="pt-48 pb-64 bg-background min-h-[70vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Small heading */}
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            Investors
          </h2>

          {/* Main heading */}
          <h1 className="text-text-primary text-5xl lg:text-6xl font-bold mb-8">
            invest in income
            <br />
            generating assets
          </h1>
        </div>
      </div>
    </section>
  );
};

const PropertyCard = ({ image, location, title, returnRate, category, id }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    window.scrollTo(0, 0);
    navigate(`/projects/${category}/${id}`);
  };

  return (
    <div
      onClick={handleNavigation}
      className="relative group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative p-8 bg-black/30 backdrop-blur-sm cursor-pointer">
        <p className="text-text-secondary mb-2">{location}</p>
        <h3 className="text-text-primary text-2xl font-bold mb-4 group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>
        <div className="space-y-2">
          <p className="text-gold text-2xl font-bold">{returnRate}</p>
          <p className="text-text-secondary">Projected Return</p>
        </div>
        <button
          className="mt-6 text-gold hover:text-white transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigation();
          }}
        >
          Learn More &gt;
        </button>
      </div>

      {/* Border */}
      <div className="absolute inset-0 border border-gold/30 rounded-3xl pointer-events-none transition-all duration-500 group-hover:border-gold/50 group-hover:border-2"></div>
    </div>
  );
};

const RealEstateSection = () => {
  const properties = [
    {
      image: re1,
      location: "Selangor, Malaysia",
      title: "Student Housing",
      returnRate: "5% Est. Annual Return",
      id: "student-housing",
    },
    {
      image: re2,
      location: "KL EcoCity, Kuala Lumpur",
      title: "Viaa Residences",
      returnRate: "8.5% Est Annual Return",
      id: "viaa-residences",
    },
    {
      image: re3,
      location: "KLCC, Kuala Lumpur",
      title: "Face Suites",
      returnRate: "9% Est Annual Return",
      id: "face-suites",
    },
  ];

  return (
    <section className="pt-0 pb-32 bg-background -mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-text-primary text-3xl font-bold mb-4">
            Launching soon - Real Estate
          </h2>
          <p className="text-text-secondary italic">
            *Projects and Images are for illustration purposes only*
          </p>
        </div>

        {/* Property cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <PropertyCard
              key={index}
              image={property.image}
              location={property.location}
              title={property.title}
              returnRate={property.returnRate}
              category="real-estate"
              id={property.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const GreenEnergySection = () => {
  const projects = [
    {
      image: wind,
      location: "EcoEnergy",
      title: "Wind Rural Electrification",
      returnRate: "6.8% Est Annual return",
      id: "wind-rural",
    },
    {
      image: hydro,
      location: "Malaysia",
      title: "Hydro Power Expansion",
      returnRate: "8% Est Annual return",
      id: "hydro-power",
    },
    {
      image: solarpanel,
      location: "Africa & Asia",
      title: "SolarGrid Initiative",
      returnRate: "7.5% Est Annual Return",
      id: "solar-grid",
    },
  ];

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-text-primary text-3xl font-bold mb-4">
            Launching soon - Green Energy
          </h2>
          <p className="text-text-secondary italic">
            *Projects and Images are for illustration purposes only*
          </p>
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <PropertyCard
              key={index}
              image={project.image}
              location={project.location}
              title={project.title}
              returnRate={project.returnRate}
              category="green-energy"
              id={project.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const GoldDinarSection = () => {
  const project = {
    image: dinar,
    location: "Bursa Malaysia",
    title: "Gold Dinar",
    returnRate: "10.5% Est Annual return",
  };

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-text-primary text-3xl font-bold mb-4">
            Launching soon - Gold Dinar
          </h2>
          <p className="text-text-secondary italic">
            *Projects and Images are for illustration purposes only*
          </p>
        </div>

        {/* Single card centered */}
        <div className="max-w-xl mx-auto">
          <PropertyCard
            image={project.image}
            location={project.location}
            title={project.title}
            returnRate={project.returnRate}
            category="gold"
            id="gold-dinar"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ image, title, description }) => {
  return (
    <div className="relative group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20">
      {/* Image container */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative p-8 bg-black/30 backdrop-blur-sm">
        <h3 className="text-text-primary text-2xl font-bold mb-4 group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="text-text-primary text-lg leading-relaxed opacity-90">
          {description}
        </p>
      </div>

      {/* Border */}
      <div className="absolute inset-0 border border-gold/30 rounded-3xl pointer-events-none transition-all duration-500 group-hover:border-gold/50 group-hover:border-2"></div>
    </div>
  );
};

const HowItWorksSection = () => {
  const features = [
    {
      image: diversified,
      title: "Diversified Portfolio",
      description:
        "Diversify your portfolio across all of World's prime real-world assets",
    },
    {
      image: access,
      title: "Easy access",
      description: "Access real-world assets with low minimums in Malaysia",
    },
    {
      image: hassle,
      title: "Hassle free",
      description:
        "Generate passive income effortlessly through our streamlined digital platform",
    },
  ];

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            How It Works
          </h2>
          <h3 className="text-text-primary text-5xl font-bold">
            Browse our set of features
          </h3>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              image={feature.image}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ChangeWorldSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-text-primary text-5xl font-bold mb-8">
              Change the World with Us
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              We are leading the future of investing in real-world assets with
              solutions that are accessible, inclusive, and transparent
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gold text-background px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20 group relative overflow-hidden"
            >
              <span className="relative z-10">Get started</span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
          </div>

          {/* Right content - Image Grid */}
          <div className="flex-1 relative group">
            <img
              src={gridImage}
              alt="Investment Options Grid"
              className="w-full h-auto rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-3xl border border-gold/30 group-hover:border-gold/50 transition-all duration-500"></div>
          </div>
        </div>
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

const Investor = () => {
  return (
    <div className="bg-background min-h-screen">
      <InvestorHero />
      <GoldDinarSection />
      <GreenEnergySection />
      <RealEstateSection />
      <HowItWorksSection />
      <ChangeWorldSection />
    </div>
  );
};

export default Investor;
