import React from "react";

const TeamMember = ({ name, role, image, description }) => {
  return (
    <div className="relative group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative p-8 bg-black/30 backdrop-blur-sm">
        <h3 className="text-text-primary text-2xl font-bold mb-2 group-hover:text-gold transition-colors duration-300">
          {name}
        </h3>
        <p className="text-gold mb-4">{role}</p>
        <p className="text-text-secondary text-lg leading-relaxed">
          {description}
        </p>
      </div>

      {/* Border */}
      <div className="absolute inset-0 border border-gold/30 rounded-3xl pointer-events-none transition-all duration-500 group-hover:border-gold/50 group-hover:border-2"></div>
    </div>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "John Smith",
      role: "Chief Executive Officer",
      image: "https://placehold.co/400x400/1a1a1a/gold?text=JS",
      description:
        "With over 20 years of experience in sustainable investments, John leads our vision of making impact investing accessible to everyone.",
    },
    {
      name: "Sarah Johnson",
      role: "Chief Investment Officer",
      image: "https://placehold.co/400x400/1a1a1a/gold?text=SJ",
      description:
        "Sarah brings 15 years of expertise in Islamic finance and sustainable investments, ensuring our projects meet both financial and ethical standards.",
    },
    {
      name: "Dr. Ahmad Hassan",
      role: "Head of Shariah Compliance",
      image: "https://placehold.co/400x400/1a1a1a/gold?text=AH",
      description:
        "A renowned scholar in Islamic finance, Dr. Ahmad ensures all our investments strictly adhere to Shariah principles.",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://placehold.co/400x400/1a1a1a/gold?text=MC",
      description:
        "Leading our digital transformation, Michael combines blockchain expertise with sustainable finance innovation.",
    },
    {
      name: "Lisa Wong",
      role: "Head of Sustainability",
      image: "https://placehold.co/400x400/1a1a1a/gold?text=LW",
      description:
        "Lisa oversees our environmental impact assessment and ensures all projects meet strict sustainability criteria.",
    },
    {
      name: "David Park",
      role: "Chief Risk Officer",
      image: "https://placehold.co/400x400/1a1a1a/gold?text=DP",
      description:
        "With extensive experience in risk management, David ensures our investments maintain the perfect balance of impact and security.",
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