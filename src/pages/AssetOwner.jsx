import React, { useState } from "react";

const AssetOwnerHero = () => {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const response = await fetch("https://formspree.io/f/mwppwdpj", {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section className="pt-48 pb-32 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-24">
          {/* Left content */}
          <div className="flex-1 lg:sticky lg:top-32">
            <h1 className="text-gold text-5xl lg:text-6xl font-bold mb-6">
              What asset
              <br />
              would you like
              <br />
              to tokenize?
            </h1>
            <p className="text-text-secondary text-lg opacity-80">
              By submitting this form, you agree to be contacted by iWealthX. We
              will also add you to the email newsletter.
            </p>
          </div>

          {/* Right content - Form */}
          <div className="flex-1 w-full lg:max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-12 w-full">
              <div>
                <label
                  htmlFor="name"
                  className="block text-text-secondary text-lg mb-3"
                >
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full bg-transparent border-b border-text-secondary/30 px-0 py-3 text-text-primary focus:border-gold focus:outline-none transition-colors text-lg placeholder:text-text-secondary/50"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-text-secondary text-lg mb-3"
                >
                  Email address:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full bg-transparent border-b border-text-secondary/30 px-0 py-3 text-text-primary focus:border-gold focus:outline-none transition-colors text-lg placeholder:text-text-secondary/50"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-text-secondary text-lg mb-3"
                >
                  Phone Number:
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  className="w-full bg-transparent border-b border-text-secondary/30 px-0 py-3 text-text-primary focus:border-gold focus:outline-none transition-colors text-lg placeholder:text-text-secondary/50"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-text-secondary text-lg mb-3"
                >
                  Please share details of asset to be tokenized
                </label>
                <textarea
                  name="details"
                  id="details"
                  rows="4"
                  required
                  className="w-full bg-transparent border-b border-text-secondary/30 px-0 py-3 text-text-primary focus:border-gold focus:outline-none transition-colors text-lg placeholder:text-text-secondary/50 resize-none"
                  placeholder="Describe your asset here..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-background px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20 group relative overflow-hidden"
              >
                <span className="relative z-10">Send Message</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>

              {status === "success" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-500 text-center">
                    Thanks for your submission! We'll be in touch soon.
                  </p>
                </div>
              )}
              {status === "error" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-500 text-center">
                    Oops! There was a problem. Please try again.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const AssetOwner = () => {
  return (
    <div className="bg-background min-h-screen">
      <AssetOwnerHero />
    </div>
  );
};

export default AssetOwner;
