import React from "react";

const TestimonialCard = ({ image, name, role, company, quote }) => {
  return (
    <div className="relative group rounded-3xl bg-black/30 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20">
      {/* Content */}
      <div className="flex flex-col">
        <p className="text-text-primary text-lg leading-relaxed mb-8 opacity-90 italic">
          "{quote}"
        </p>

        {/* Author info */}
        <div className="flex items-center mt-auto">
          <img
            src={`https://randomuser.me/api/portraits/${image}`}
            alt={name}
            className="w-14 h-14 rounded-full border-2 border-gold/30 group-hover:border-gold/50 transition-all duration-500"
          />
          <div className="ml-4">
            <h4 className="text-text-primary font-bold group-hover:text-gold transition-colors duration-300">
              {name}
            </h4>
            <p className="text-text-secondary text-sm">
              {role} at {company}
            </p>
          </div>
        </div>
      </div>

      {/* Gold border */}
      <div className="absolute inset-0 border border-gold/30 rounded-3xl pointer-events-none transition-all duration-500 group-hover:border-gold/50 group-hover:border-2"></div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      image: "men/75.jpg",
      name: "Ali Abu",
      role: "Marketer",
      company: "Petronas",
      quote:
        "The platform makes real-world asset investing straightforward and efficient. The returns have been consistently strong, exceeding my expectations.",
    },
    {
      image: "men/45.jpg",
      name: "Salahuddin",
      role: "Banker",
      company: "Maybank",
      quote:
        "The transparency and ease of use are impressive. It's perfect for generating passive income from real estate without the usual complexities and barriers to entry.",
    },
    {
      image: "women/65.jpg",
      name: "Siti Fatima",
      role: "Cashier",
      company: "7/11",
      quote:
        "The investment process is remarkably straightforward and efficient. Everything is smooth and hassle-free, making it easy to manage investments and track returns.",
    },
    {
      image: "men/25.jpg",
      name: "Mohammed Zaki",
      role: "Manager",
      company: "CIMB",
      quote:
        "As an experienced investor, I appreciate the diverse investment options in real estate, gold, and green energy. It's been excellent for portfolio diversification.",
    },
    {
      image: "men/55.jpg",
      name: "Ibrahim",
      role: "Designer",
      company: "Google",
      quote:
        "The platform offers innovative investment opportunities that align perfectly with modern portfolio strategies. The user experience is top-notch.",
    },
    {
      image: "women/45.jpg",
      name: "Nur Asikyan",
      role: "Procurement",
      company: "TNB",
      quote:
        "The tokenized investment approach makes portfolio diversification accessible and manageable. The future of investing is definitely here.",
    },
  ];

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            Testimonials
          </h2>
          <h3 className="text-text-primary text-5xl font-bold">
            What the People Say
          </h3>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              image={testimonial.image}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              quote={testimonial.quote}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
