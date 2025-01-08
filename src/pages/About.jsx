import React, { useState } from "react";
import RegisterModal from "../components/RegisterModal";
import gridImage from "../assets/img-grid-hero.png";

const AboutHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      number: "5+",
      label: "Years Experience",
    },
    {
      number: "20+",
      label: "Projects Launched",
    },
    {
      number: "1000+",
      label: "Trusted Investors",
    },
    {
      number: "100M+",
      label: "Assets Tokenized",
    },
  ];

  return (
    <section className="pt-40 pb-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How It Started */}
        <div className="flex flex-col lg:flex-row items-start gap-16 xl:gap-24 mb-32">
          {/* Left content */}
          <div className="flex-1 lg:max-w-2xl">
            <h1 className="text-gold text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 lg:mb-12">
              About Us
            </h1>
            <div className="text-text-secondary text-xl leading-relaxed">
              <p className="mb-6">
                At iWealthX, we make real-world investments accessible, ethical,
                and impactful. Our platform enables secure, Shariah-compliant
                investments in assets like real estate, green energy,
                agriculture, gold, precious minerals, carbon credits, etc.
              </p>
              <p className="mb-6">
                With as little as RM1000 (Approx. $220), anyone can start
                building real wealth and passive income while aligning their
                portfolio with their values. Our iWaqf tokens also let investors
                support sustainable development and social impact initiatives.
              </p>
              <p>
                Join us to unlock the $30 trillion opportunity in real-world
                asset investments and create wealth with purpose and integrity.
              </p>
            </div>
          </div>

          {/* Right content - Image & Stats */}
          <div className="flex-1 lg:max-w-lg">
            <div className="space-y-8">
              <div className="relative group rounded-3xl overflow-hidden max-w-md mx-auto">
                <img
                  src={gridImage}
                  alt="Investment Options Grid"
                  className="w-full h-auto rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-[1.02] bg-background transform scale-95"
                />
                <div className="absolute inset-0 rounded-3xl border border-gold/30 group-hover:border-gold/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-2xl border border-gold/30 hover:border-gold/50 transition-all group hover:shadow-lg hover:shadow-gold/5 bg-background/50 backdrop-blur-sm"
                  >
                    <div className="text-gold text-3xl lg:text-4xl font-bold mb-1 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </div>
                    <div className="text-text-secondary text-sm lg:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gold text-background px-10 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20 group relative overflow-hidden inline-flex items-center"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

const About = () => {
  return (
    <div className="bg-background min-h-screen">
      <AboutHero />
    </div>
  );
};

export default About;
