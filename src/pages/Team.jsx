import React from "react";
import saifImg from "../assets/team/saif.png";
import azmathImg from "../assets/team/azmath.png";
import muraliImg from "../assets/team/murali.png";
import hishamImg from "../assets/team/hisham.png";
import helmeyImg from "../assets/team/helmey.png";
import akramImg from "../assets/team/akram.png";
import turalayImg from "../assets/team/turalay.png";
import ezamshahImg from "../assets/team/ezamshah.png";
import debuImg from "../assets/team/debu.png";
import sabithImg from "../assets/team/sabith.png";

const CompanyLogos = ({ companies }) => {
  return (
    <div className="flex items-center gap-6 mt-4">
      {companies.map((company, index) => {
        const isVantage = company.includes("vantage");
        return (
          <img
            key={index}
            src={company}
            alt="Company logo"
            className={`${isVantage ? "h-10" : "h-7"} w-auto opacity-80`}
          />
        );
      })}
    </div>
  );
};

const TeamMember = ({ name, role, image, description, companies }) => {
  return (
    <div className="relative group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20 bg-[#0A0A0A] border border-gold/30">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative p-8">
        <h3 className="text-text-primary text-3xl font-bold mb-2">{name}</h3>
        <p className="text-gold text-lg mb-4">{role}</p>
        <p className="text-text-secondary text-base leading-relaxed mb-6">
          {description}
        </p>
        {companies && <CompanyLogos companies={companies} />}
      </div>
    </div>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "Saif Khan",
      role: "Founder & CEO",
      image: saifImg,
      description:
        "22+ years in Global Tech, Business, Strategy, Consulting with experience at Siemens, Dell and other leading companies.",
      companies: [
        require("../assets/company-logos/siemens.png"),
        require("../assets/company-logos/dell.png"),
        require("../assets/company-logos/cognizant.png"),
      ],
    },
    {
      name: "Azmatullah Mohammad",
      role: "Blockchain Lead",
      image: azmathImg,
      description:
        "19+ years in Tech, Project & Program Management with experience at IBM and other tech leaders.",
      companies: [require("../assets/company-logos/ibm.png")],
    },
    {
      name: "Murali Haripalan",
      role: "Green Energy",
      image: muraliImg,
      description:
        "20+ years in Green Energy, PPA, Operations & Support with extensive industry experience.",
      companies: [
        require("../assets/company-logos/vantage.png"),
        require("../assets/company-logos/bolt.png"),
      ],
    },
    {
      name: "Muhammad Hisyam",
      role: "Company Secretary",
      image: hishamImg,
      description:
        "8+ Years in Legal, Dispute Resolution & Finance, ensuring compliance and legal oversight.",
    },
    {
      name: "Helmey Haris",
      role: "Investor Relations",
      image: helmeyImg,
      description:
        "Investor relations & Shariah Expert, managing stakeholder relationships and ensuring Shariah compliance.",
    },
    {
      name: "Sabith Khan",
      role: "Head of Research",
      image: sabithImg,
      description:
        "Leading research initiatives and market analysis to drive informed investment decisions.",
    },
  ];

  const advisors = [
    {
      name: "Dr Datuk Akram Laldin",
      role: "Shariah Advisor",
      image: akramImg,
      description:
        "Expert in Shariah compliance and Islamic finance with extensive experience in ISRA and FABS.",
      companies: [require("../assets/company-logos/isra.png")],
    },
    {
      name: "Dr Turalay Kenc",
      role: "Regulatory Advisor",
      image: turalayImg,
      description:
        "Regulatory expert with deep knowledge of financial markets and compliance frameworks.",
    },
    {
      name: "Ezamshah Ismail",
      role: "Risk Management Advisor",
      image: ezamshahImg,
      description:
        "Specialist in risk management and financial strategy implementation.",
    },
    {
      name: "Debu Dasgupta",
      role: "AI, Data & Tech Advisor",
      image: debuImg,
      description:
        "Technology expert with experience at Ford and HP, specializing in AI and data solutions.",
      companies: [
        require("../assets/company-logos/ford.png"),
        require("../assets/company-logos/hp.png"),
        require("../assets/company-logos/cognizant.png"),
      ],
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-48 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Our Team
            </h2>
            <h1 className="text-text-primary text-5xl lg:text-6xl font-bold mb-8">
              Meet the Experts Behind
              <br />
              Our Success
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed">
              Our diverse team brings together expertise in Islamic finance,
              sustainable investments, and technology to make impact investing
              accessible to everyone.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
                description={member.description}
                companies={member.companies}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Our Advisors
            </h2>
            <h3 className="text-text-primary text-4xl font-bold mb-8">
              Expert Guidance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((advisor, index) => (
              <TeamMember
                key={index}
                name={advisor.name}
                role={advisor.role}
                image={advisor.image}
                description={advisor.description}
                companies={advisor.companies}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Our Values
            </h2>
            <h3 className="text-text-primary text-4xl font-bold">
              What Drives Us Forward
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Islamic Values",
                description:
                  "We ensure all our operations and investments strictly adhere to Shariah principles.",
              },
              {
                title: "Sustainability",
                description:
                  "Environmental and social impact is at the heart of every investment decision we make.",
              },
              {
                title: "Innovation",
                description:
                  "We leverage technology to make impact investing accessible and efficient.",
              },
              {
                title: "Transparency",
                description:
                  "We believe in complete transparency in all our operations and investments.",
              },
              {
                title: "Community Focus",
                description:
                  "We prioritize investments that create positive impact in communities.",
              },
              {
                title: "Excellence",
                description:
                  "We strive for excellence in everything we do, from investment selection to customer service.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-8 border border-gold/30 rounded-3xl hover:border-gold/50 transition-all duration-300"
              >
                <h4 className="text-text-primary text-2xl font-bold mb-4">
                  {value.title}
                </h4>
                <p className="text-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
