import React from "react";
import { Link } from "react-router-dom";

const JoinUsCTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/40 backdrop-blur-sm p-16 rounded-3xl border border-gold/30 hover:border-gold/40 transition-all duration-300">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-gold text-4xl lg:text-5xl font-bold mb-8">
              Join Our Movement
            </h2>

            <p className="text-text-primary text-xl leading-relaxed mb-12">
              Be part of the revolution in accessible investing. Together we're
              building a future where quality investments create both wealth and
              positive global impact.
            </p>

            <Link
              to="/investor"
              className="bg-gold text-background px-10 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20 inline-block"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsCTA;
