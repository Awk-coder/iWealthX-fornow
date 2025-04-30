import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterModal from "../RegisterModal";
import gridImage from "../../assets/img-grid-hero.png";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Main Hero Section */}
      <section className="pt-40 pb-20 bg-background min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left content */}
            <div className="flex-1 text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gold">Explore</span>{" "}
                <span className="text-text-primary">the</span>
                <br />
                <span className="text-text-primary">Future</span>{" "}
                <span className="text-text-primary">of</span>{" "}
                <span className="text-gold">Investing</span>
              </h1>
              <p className="text-text-secondary text-xl leading-relaxed mb-10">
                Ready to grow your wealth? Invest in high quality fractional
                real world assets like Green energy, Gold, Agriculture, Carbon
                credits and more with as low as 1000RM.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gold text-background px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20 group relative overflow-hidden"
              >
                <span className="relative z-10">Invest Now</span>
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
      </section>

      {/* Explainer Section */}
      <section className="py-20 bg-gradient-to-b from-background to-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-black/40 backdrop-blur-sm p-10 rounded-3xl border border-gold/20 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5">
              <h3 className="text-2xl font-bold text-gold mb-6">
                Social Impact Tokens
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                Through our Social Impact Tokens, we're revolutionizing wealth
                distribution while funding vital social projects - making
                ethical investing work for everyone.
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-10 rounded-3xl border border-gold/20 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5">
              <h3 className="text-2xl font-bold text-gold mb-6">
                Investment Tokens
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                Our investment tokens allow you to own fractions of high-quality assets like real estate, 
                green energy projects, and precious metals - making premium investments accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Hero;
