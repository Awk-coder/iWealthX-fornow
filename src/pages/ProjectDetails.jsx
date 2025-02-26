import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const ProjectDetails = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();

  // Project data store
  const projectsData = {
    "real-estate": [
      {
        id: "student-housing",
        location: "Selangor, Malaysia",
        title: "Student Housing",
        returnRate: "5% Est. Annual Return",
        images: {
          main: require("../assets/prop images/1 prop images/1.png"),
          secondary: require("../assets/prop images/1 prop images/2.png"),
          tertiary: require("../assets/prop images/1 prop images/3.png"),
        },
        description:
          "This project leverages state-of-the-art 3D printing technology to construct modern, affordable student housing near major universities in Selangor. Managed by a reputable property management firm, the development offers durable, cost-effective living spaces with high occupancy rates. This project focuses on stable rental income, providing a socially impactful investment with a long-term horizon for growth.",
        details: [
          "Strategic location near major universities",
          "Fully managed property",
          "High occupancy rates",
          "Regular rental income",
          "3D printing construction technology",
          "Cost-effective development",
          "Professional property management",
          "Long-term growth potential",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 5,000,000",
          term: "5 years",
          type: "Asset-backed security",
        },
      },
      {
        id: "viaa-residences",
        location: "KL EcoCity, Kuala Lumpur",
        title: "Viaa Residences",
        returnRate: "8.5% Est Annual Return",
        images: {
          main: require("../assets/prop images/2 prop images/1.png"),
          secondary: require("../assets/prop images/2 prop images/2.png"),
          tertiary: require("../assets/prop images/2 prop images/3.png"),
        },
        description:
          "Viaa Residences provides 5-star serviced apartments in the up-and-coming KL EcoCity. Managed by Five Senses, these luxury Airbnb units cater to business travelers and tourists. Investors can expect consistent rental income along with capital appreciation driven by the area's rapid urban development and increasing property values.",
        details: [
          "Prime location in KL EcoCity",
          "Integrated development",
          "Premium facilities",
          "High rental demand",
          "Sustainable building features",
          "Excellent connectivity",
          "Strong capital growth potential",
          "Professional property management",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 8,000,000",
          term: "5 years",
          type: "Asset-backed security",
        },
      },
      {
        id: "face-suites",
        location: "KLCC, Kuala Lumpur",
        title: "Face Suites",
        returnRate: "9% Est Annual Return",
        images: {
          main: require("../assets/prop images/3 prop images/1.png"),
          secondary: require("../assets/prop images/3 prop images/2.png"),
          tertiary: require("../assets/prop images/3 prop images/3.png"),
        },
        description:
          "Face Suites offers high-end 5-star Airbnb accommodation in the prestigious KLCC area, managed by luxury property manager Five Senses. Investors benefit from strong short-term rental income, with potential capital appreciation as the KLCC property market continues to grow due to its prime location and increasing demand for luxury stays.",
        details: [
          "Prime KLCC location",
          "Iconic development",
          "Luxury amenities",
          "International tenant pool",
          "Stunning city views",
          "High rental yields",
          "Strong appreciation potential",
          "Professional facility management",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 10,000,000",
          term: "5 years",
          type: "Asset-backed security",
        },
      },
    ],
    "green-energy": [
      {
        id: "agro-waste-energy",
        location: "Putrajaya, Malaysia",
        title: "Agro Waste to Energy",
        returnRate: "7.2% Est Annual Return",
        images: {
          main: require("../assets/energy images/4/1.png"),
          secondary: require("../assets/energy images/4/2.png"),
        },
        description:
          "This project converts agricultural waste into energy-efficient pellets, reducing carbon emissions and promoting renewable energy adoption. It supports local farmers by providing an additional income stream while ensuring a sustainable energy source.",
        details: [
          "Waste-to-energy technology",
          "Reduces agricultural waste",
          "Sustainable biomass fuel",
          "Supports local farmers",
          "Eco-friendly energy solution",
          "Growing demand for biomass",
          "Government incentives",
          "Long-term sustainability",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 10,000,000",
          term: "8 years",
          type: "Green energy token",
        },
      },
      {
        id: "sme-green-energy",
        location: "Malaysia",
        title: "SME Green Energy Transition",
        returnRate: "8.5% Est Annual Return",
        images: {
          main: require("../assets/energy images/5/1.png"),
          secondary: require("../assets/energy images/5/2.png"),
        },
        description:
          "This initiative helps SMEs transition to green energy by installing solar panels at no upfront cost, reducing carbon footprints and lowering long-term electricity expenses. The project ensures sustainable energy adoption among small businesses.",
        details: [
          "Solar energy adoption",
          "Zero upfront cost for SMEs",
          "Reduces electricity bills",
          "Supports green energy transition",
          "Government-backed incentives",
          "Long-term sustainability",
          "High energy savings potential",
          "Environmentally responsible investment",
        ],
        investment: {
          minimum: "RM 500",
          target: "RM 7,500,000",
          term: "12 years",
          type: "Solar energy token",
        },
      },
      {
        id: "waqf-solar-surau",
        location: "Bangi, Malaysia",
        title: "Waqf Solar for Surau",
        returnRate: "No Returns - Charity",
        images: {
          main: require("../assets/energy images/6/1.png"),
          secondary: require("../assets/energy images/6/2.png"),
        },
        description:
          "This Waqf initiative funds solar panel installations for a surau in Bangi, reducing electricity costs and promoting sustainable energy use. Contributors support a long-term charitable cause with no expected financial returns.",
        details: [
          "Islamic Waqf-based charity",
          "Funds renewable energy for surau",
          "No financial returns expected",
          "Supports community sustainability",
          "Reduces electricity costs for places of worship",
          "Encourages renewable energy adoption",
          "Long-term impact",
          "Faith-based giving opportunity",
        ],
        investment: {
          minimum: "RM 100",
          target: "RM 500,000",
          term: "N/A",
          type: "Charity token",
        },
      },
      {
        id: "mujtaba-health-charity",
        location: "India",
        title: "Health Card Token",
        returnRate: "No Returns - Charity",
        images: {
          main: require("../assets/energy images/7/1.png"),
          secondary: require("../assets/energy images/7/2.png"),
        },
        description:
          "This charity token funds health cards for underprivileged families, providing 20-50% discounts at select hospitals. The initiative ensures accessible healthcare for those who cannot afford the annual fee of 1,000 PKR per family.",
        details: [
          "Provides health access to low-income families",
          "Covers a family of six",
          "Discounts on medical services (20-50%)",
          "Charity-based healthcare support",
          "Improves community health standards",
          "No financial returns expected",
          "Ensures sustainable healthcare funding",
          "Encourages social responsibility",
        ],
        investment: {
          minimum: "₹500",
          target: "₹2,000,000",
          term: "N/A",
          type: "Charity token",
        },
      },      
      {
        id: "wind-rural",
        location: "EcoEnergy",
        title: "Wind Rural Electrification",
        returnRate: "6.8% Est Annual return",
        images: {
          main: require("../assets/energy images/1/1.png"),
          secondary: require("../assets/energy images/1/2.png"),
        },
        description:
          "Investing in wind power supports the global shift to renewable energy while offering steady returns. As technology improves and demand for clean energy rises, wind power stands out for its sustainability and growth potential. This investment fuels the transition to a low-carbon future, aligning profit with environmental impact.",
        details: [
          "Renewable energy infrastructure",
          "Government backed project",
          "Social impact investment",
          "Green energy credits",
          "Long-term power purchase agreements",
          "Sustainable development goals aligned",
          "Community benefit sharing",
          "Carbon credit generation",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 3,000,000",
          term: "7 years",
          type: "Green bond",
        },
      },
      {
        id: "hydro-power",
        location: "Malaysia",
        title: "Hydro Power Expansion",
        returnRate: "8% Est Annual return",
        images: {
          main: require("../assets/energy images/2/1.png"),
          secondary: require("../assets/energy images/2/2.png"),
        },
        description:
          "This project focuses on expanding hydroelectric power generation in remote areas of Bangladesh, supplying consistent electricity to villages, reducing emissions, and creating local jobs. It aims to improve living standards, support small businesses, and enhance community resilience through renewable energy solutions, contributing to long-term sustainability and economic growth.",
        details: [
          "Established hydropower technology",
          "Guaranteed power offtake",
          "Environmental sustainability",
          "Government support",
          "Reliable base load power",
          "Low operational costs",
          "Long-term contracts",
          "Strategic water resource management",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 5,000,000",
          term: "10 years",
          type: "Green bond",
        },
      },
      {
        id: "solar-grid",
        location: "Africa & Asia",
        title: "SolarGrid Initiative",
        returnRate: "7.5% Est Annual Return",
        images: {
          main: require("../assets/energy images/3/1.png"),
          secondary: require("../assets/energy images/3/2.png"),
        },
        description:
          "SolarGrid aims to install off-grid solar power systems in rural communities across Kenya. This project provides sustainable, clean energy to over 10,000 households, reducing reliance on fossil fuels and improving quality of life.",
        details: [
          "Multi-country deployment",
          "Advanced solar technology",
          "Diversified revenue streams",
          "Carbon credit benefits",
          "Scalable infrastructure",
          "Impact investing opportunity",
          "Regional energy security",
          "Tech-enabled monitoring",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 4,000,000",
          term: "8 years",
          type: "Green bond",
        },
      },
    ],
    gold: [
      {
        id: "gold-dinar",
        location: "Bursa Malaysia",
        title: "Gold Dinar",
        returnRate: "10.5% Est Annual return",
        images: {
          main: require("../assets/dinar.png"),
          secondary: require("../assets/gold chart.png"),
        },
        description:
          "The Gold Dinar represents a Shariah-compliant investment in physical gold, offering a hedge against inflation and currency fluctuations. This innovative product combines traditional Islamic finance principles with modern investment accessibility, providing investors with secure exposure to precious metals while maintaining full compliance with Islamic financial principles.",
        details: [
          "Physical gold backing",
          "Daily liquidity",
          "Secure vault storage",
          "Regular audits",
          "Shariah-compliant structure",
          "Professional custody",
          "Transparent pricing",
          "Easy digital access",
        ],
        investment: {
          minimum: "RM 1,000",
          target: "RM 10,000,000",
          term: "Flexible",
          type: "Physical gold-backed token",
        },
      },
    ],
  };

  // Find the current project
  const project = projectsData[category]?.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="pt-32 pb-16 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-gold text-4xl font-bold mb-8">
            Project Not Found
          </h1>
          <Link to="/investor" className="text-text-primary hover:text-gold">
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-32 left-8 z-10 text-text-secondary hover:text-gold transition-colors flex items-center gap-2"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left content - Images */}
            <div className="flex-1">
              <div className="space-y-6">
                {/* Main Image */}
                <div className="relative group rounded-3xl overflow-hidden">
                  <img
                    src={project.images?.main || project.images}
                    alt={project.title}
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-3xl border border-gold/30"></div>
                </div>

                {/* Secondary Images */}
                {project.images.secondary && (
                  <div
                    className={`grid ${
                      project.images.tertiary ? "grid-cols-2" : "grid-cols-1"
                    } gap-6`}
                  >
                    <div className="relative group rounded-3xl overflow-hidden">
                      <img
                        src={project.images.secondary}
                        alt={`${project.title} Interior View`}
                        className="w-full h-auto rounded-3xl shadow-2xl"
                      />
                      <div className="absolute inset-0 rounded-3xl border border-gold/30"></div>
                    </div>
                    {project.images.tertiary && (
                      <div className="relative group rounded-3xl overflow-hidden">
                        <img
                          src={project.images.tertiary}
                          alt={`${project.title} Another View`}
                          className="w-full h-auto rounded-3xl shadow-2xl"
                        />
                        <div className="absolute inset-0 rounded-3xl border border-gold/30"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right content - Details */}
            <div className="flex-1">
              <div className="space-y-6">
                <p className="text-text-secondary">{project.location}</p>
                <h1 className="text-text-primary text-5xl font-bold">
                  {project.title}
                </h1>
                <p className="text-gold text-3xl font-bold">
                  {project.returnRate}
                </p>
                <p className="text-text-secondary text-xl">
                  {project.description}
                </p>

                {/* Investment Details */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {Object.entries(project.investment).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 border border-gold/30 rounded-xl"
                    >
                      <p className="text-text-secondary mb-1 capitalize">
                        {key.replace("_", " ")}
                      </p>
                      <p className="text-text-primary text-lg font-bold">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() =>
                    navigate("/investor-form", {
                      state: {
                        projectDetails: `${project.title} - ${project.location}`,
                      },
                    })
                  }
                  className="w-full bg-gold text-background px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20 mt-8"
                >
                  Invest Now
                </button>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="mt-16">
            <h2 className="text-text-primary text-3xl font-bold mb-8">
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gold/30 rounded-xl"
                >
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <p className="text-text-secondary">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
