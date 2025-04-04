import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const ProjectDetails = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();

  // Project-specific content mapping
  const projectContent = {
    "agro-waste-energy": {
      title: "Agro Waste to Energy",
      location: "Putrajaya, Malaysia",
      returnRate: "7.2% Est Annual Return",
      description: "This innovative project converts agricultural waste into energy-efficient pellets, reducing carbon emissions while promoting renewable energy adoption. It creates a sustainable cycle that supports local farmers through additional income streams.",
      minimum: "RM 1,000",
      target: "RM 10,000,000",
      images: [
        require("../assets/project-images/agro-waste/image1.jpg"),
        require("../assets/project-images/agro-waste/image2.jpg"),
        // Add more project-specific images
      ]
    },
    "mujtaba-health-charity": {
      title: "Mujtaba Helping Foundation",
      location: "Hyderabad, India",
      returnRate: "No Returns - Charity",
      description: "A charitable initiative providing healthcare services to underprivileged communities.",
      minimum: "Any amount",
      target: "RM 500,000",
      images: [
        require("../assets/project-images/mujtaba/hospital1.jpg"),
        require("../assets/project-images/mujtaba/hospital2.jpg"),
        // Hospital images only for this project
      ]
    },
    // Add other projects with their specific content and images
  };

  const currentProject = projectContent[id];

  if (!currentProject) {
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

  const EmpaneledCenters = () => {
    const centers = {
      hospitals: [
        {
          name: "CARE Hospitals",
          logo: require("../assets/hospital-logos/care.png"),
        },
        {
          name: "KAMINENI Hospitals",
          logo: require("../assets/hospital-logos/kamineni.png"),
        },
        {
          name: "VIRINCHI Hospitals",
          logo: require("../assets/hospital-logos/virinchi.png"),
        },
        {
          name: "MEDICOVER Hospitals",
          logo: require("../assets/hospital-logos/medicover.png"),
        },
        {
          name: "RENOVA Hospitals",
          logo: require("../assets/hospital-logos/renova.png"),
        },
        {
          name: "VASAN Eye Care Hospital",
          logo: require("../assets/hospital-logos/vasan.png"),
        },
      ],
      diagnostics: [
        {
          name: "VIJAYA Diagnostic Centre",
          logo: require("../assets/hospital-logos/vijaya.png"),
        },
        {
          name: "Crystal Diagnostic",
          logo: require("../assets/hospital-logos/crystal.png"),
        },
        {
          name: "ALFA Diagnostic",
          logo: require("../assets/hospital-logos/alfa.png"),
        },
      ],
      clinics: [
        {
          name: "Dr. ROMANA'S Dental Clinic",
          logo: require("../assets/hospital-logos/romana.png"),
        },
        {
          name: "Marwa Dental Hospital",
          logo: require("../assets/hospital-logos/marwa.png"),
        },
        {
          name: "Dr. SRIDEVI GUTTA Women's Health Care",
          logo: require("../assets/hospital-logos/sridevi.png"),
        },
      ],
    };

    return (
      <div>
        {/* Hospitals Section */}
        <div className="mb-12">
          <h3 className="text-text-primary text-2xl font-bold mb-6">
            Empanelled Hospitals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {centers.hospitals.map((hospital, index) => (
              <div
                key={index}
                className="p-6 bg-[#0A0A0A] rounded-2xl border border-gold/30 flex items-center justify-center h-32"
              >
                <img
                  src={hospital.logo}
                  alt={hospital.name}
                  className="max-h-16 w-auto"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Centers Section */}
        <div className="mb-12">
          <h3 className="text-text-primary text-2xl font-bold mb-6">
            Empanelled Diagnostic Centers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {centers.diagnostics.map((center, index) => (
              <div
                key={index}
                className="p-6 bg-[#0A0A0A] rounded-2xl border border-gold/30 flex items-center justify-center"
              >
                <img
                  src={center.logo}
                  alt={center.name}
                  className="max-h-16 w-auto"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Clinics Section */}
        <div>
          <h3 className="text-text-primary text-2xl font-bold mb-6">
            Empanelled Clinics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {centers.clinics.map((clinic, index) => (
              <div
                key={index}
                className="p-6 bg-[#0A0A0A] rounded-2xl border border-gold/30 flex items-center justify-center"
              >
                <img
                  src={clinic.logo}
                  alt={clinic.name}
                  className="max-h-16 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
                    src={currentProject.images[0]}
                    alt={currentProject.title}
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-3xl border border-gold/30"></div>
                </div>

                {/* Secondary Images */}
                {currentProject.images.length > 1 && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative group rounded-3xl overflow-hidden">
                      <img
                        src={currentProject.images[1]}
                        alt={`${currentProject.title} Interior View`}
                        className="w-full h-auto rounded-3xl shadow-2xl"
                      />
                      <div className="absolute inset-0 rounded-3xl border border-gold/30"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right content - Details */}
            <div className="flex-1">
              <div className="space-y-6">
                <p className="text-text-secondary">{currentProject.location}</p>
                <h1 className="text-text-primary text-5xl font-bold">
                  {currentProject.title}
                </h1>
                <p className="text-gold text-3xl font-bold">
                  {currentProject.returnRate}
                </p>
                <p className="text-text-secondary text-xl">
                  {currentProject.description}
                </p>

                {/* Investment Details */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 border border-gold/30 rounded-xl">
                    <p className="text-text-secondary mb-1 capitalize">
                      minimum
                    </p>
                    <p className="text-text-primary text-lg font-bold">
                      {currentProject.minimum}
                    </p>
                  </div>
                  <div className="p-4 border border-gold/30 rounded-xl">
                    <p className="text-text-secondary mb-1 capitalize">
                      target
                    </p>
                    <p className="text-text-primary text-lg font-bold">
                      {currentProject.target}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() =>
                    navigate("/investor-form", {
                      state: {
                        projectDetails: `${currentProject.title} - ${currentProject.location}`,
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
              {/* Add project-specific details here */}
            </div>
          </div>
        </div>
      </section>

      {/* After Project Details Section */}
      <section className="pt-16 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-text-primary text-3xl font-bold mb-8">
            Healthcare Network
          </h2>
          <EmpaneledCenters />
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
