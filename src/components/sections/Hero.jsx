import React from "react";
import { useState } from "react";
import gridImage from "../../assets/img-grid-hero.png";
import RegisterModal from "../RegisterModal";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="pt-48 pb-64 bg-background min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left relative">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gold">Explore</span>{" "}
              <span className="text-text-primary">the Future</span>
              <br />
              <span className="text-text-primary">of</span>{" "}
              <span className="text-gold">Investing</span>
            </h1>

            <p className="text-text-secondary text-lg mb-8">
              Ready to grow your wealth? Invest in high quality fractional real
              world assets like Real estate, Green energy, Gold, Agriculture,
              Carbon credits and more with as low as 1000RM.
            </p>

            <p className="text-text-secondary text-lg mb-8 max-w-2xl">
              Join the movement to make Real World Assets, Accessible, Inclusive
              and Transparent.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gold text-background px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20 group relative overflow-hidden"
            >
              <span className="relative z-10">Register</span>
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

export default Hero;
