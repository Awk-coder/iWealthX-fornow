import React, { useState, useEffect, useRef } from "react";

// Counter component that animates counting up
const AnimatedCounter = ({ endValue, duration, label }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  // Intersection Observer to start animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const steps = 50; // Number of steps in animation
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const progress = currentStep / steps;
      const currentCount = Math.floor(progress * endValue);

      setCount(currentCount);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [endValue, duration, isVisible]);

  return (
    <div ref={counterRef} className="text-center">
      <div className="text-gold text-5xl lg:text-6xl font-bold">{count}+</div>
      <div className="text-text-secondary mt-2 text-lg">{label}</div>
    </div>
  );
};

const PeopleCard = ({ name }) => {
  return (
    <div className="bg-black/30 py-3 px-6 rounded-full border border-gold/30 min-w-max mx-2 backdrop-blur-sm transition-all hover:border-gold/50 hover:shadow-md hover:shadow-gold/10">
      <span className="text-text-primary whitespace-nowrap">{name}</span>
    </div>
  );
};

const Testimonials = () => {
  // List of names for the flowing animation
  const peopleNames = [
    "Segar",
    "R.Kamalan",
    "Fera Aisyah Mohamad",
    "Jamil",
    "Luqman Sazaki",
    "Khairul Nazrene",
    "Fadhil",
    "Abdul Muneeb Dar",
    "Ahmad Fathi bin Zawa",
    "Jabbar Azmil",
    "Ajani Ibrahim Tunde",
    "Johan Zep Bin Md Yus",
    "Naima Ado",
    "Weseem Ahmed",
    "Zafrul Noordin",
    "Nimotallahi Durojaiye",
    "Ariful Haque",
    "HAMID AHMED",
    "Md Tanzirul Amin",
    "Muaz Azhari",
    "Sabith Khan",
    "Farhan",
    "Hamza Aziz",
    "Bakythek",
    "Hakim Roslan",
    "Adamu Anas Sambo",
    "Muhammad Aiman Mol",
    "Parsa",
    "Arya",
    "Syed Omar",
    "Anass",
    "Ahmad Sulaiman",
  ];

  // Create multiple rows with different speeds
  const rows = [
    {
      speed: 35,
      direction: "left",
      names: [...peopleNames].sort(() => Math.random() - 0.5),
    },
    {
      speed: 45,
      direction: "right",
      names: [...peopleNames].sort(() => Math.random() - 0.5),
    },
    {
      speed: 30,
      direction: "left",
      names: [...peopleNames].sort(() => Math.random() - 0.5),
    },
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
            Growing Community
          </h2>
          <h3 className="text-text-primary text-5xl font-bold mb-10">
            People Interested in iWealthX
          </h3>

          {/* Stats counter */}
          <div className="max-w-xs mx-auto bg-black/40 backdrop-blur-sm p-8 rounded-3xl border border-gold/20 hover:border-gold/30 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-gold/10 mb-16">
            <AnimatedCounter
              endValue={100}
              duration={2000}
              label="Growing Community"
            />
          </div>
        </div>
      </div>

      {/* Flowing cards */}
      <div className="space-y-8">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative flex items-center">
            <div
              className={`flex animate-flow-${row.direction}`}
              style={{
                "--flow-speed": `${row.speed}s`,
                animation: `flow-${row.direction} ${row.speed}s linear infinite`,
              }}
            >
              {row.names.map((name, nameIndex) => (
                <PeopleCard key={`${rowIndex}-${nameIndex}`} name={name} />
              ))}
            </div>
            <div
              className={`flex animate-flow-${row.direction}`}
              style={{
                "--flow-speed": `${row.speed}s`,
                animation: `flow-${row.direction} ${row.speed}s linear infinite`,
                animationDelay: `${-row.speed / 2}s`,
              }}
            >
              {row.names.map((name, nameIndex) => (
                <PeopleCard key={`${rowIndex}-${nameIndex}-dup`} name={name} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes flow-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes flow-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-flow-left {
          animation: flow-left var(--flow-speed) linear infinite;
        }

        .animate-flow-right {
          animation: flow-right var(--flow-speed) linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
