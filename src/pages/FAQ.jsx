import React, { useState } from "react";

const FAQSection = ({ title, questions }) => {
  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-gold mb-8">{title}</h3>
      <div className="space-y-4">
        {questions.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatAnswer = (text) => {
    // Convert URLs to links
    const withLinks = text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-gold hover:text-white transition-colors">$1</a>'
    );

    // Convert numbered lists
    const lines = withLinks.split("\n");
    return lines
      .map((line, index) => {
        if (line.match(/^\d+\./)) {
          return `<li class="ml-4 pl-2">${line.replace(/^\d+\.\s*/, "")}</li>`;
        }
        if (line.startsWith("•")) {
          return `<li class="ml-4 pl-2">${line.replace(/^•\s*/, "")}</li>`;
        }
        return line;
      })
      .join("\n");
  };

  return (
    <div className="border-b border-gold/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-start justify-between text-left group"
      >
        <h4 className="text-lg font-medium text-text-primary group-hover:text-gold transition-colors pr-8">
          {question}
        </h4>
        <span
          className={`text-gold transition-transform duration-300 mt-1 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100 mb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="prose prose-invert prose-gold max-w-none">
          {answer.split("\n\n").map((paragraph, index) => (
            <div
              key={index}
              className="text-text-secondary leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: formatAnswer(paragraph) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  // Organize FAQs by category
  const faqCategories = {
    "About iWealthX": [
      {
        question: "What is iWealthX?",
        answer: `iWealthX is a platform that uses blockchain to offer fractional ownership of real-world assets like Green Energy(Solar, Biogas, Hydrogen, Wind energy projects etc), Gold, Luxury real estate, Agriculture and other Physical assets. With tokenization and smart contracts, investors can own small portions/fractions of high-quality and high value assets, making asset ownership more accessible, transparent, and liquid.

Our mission is to democratize wealth by providing access to high-quality, revenue-generating assets as mentioned above. We aim to close the wealth gap and give more people the chance to build wealth.

We are passionate about equitable distribution of wealth and planned the launch of Charity Tokens which support social impact projects like Green Energy transition of Surau's/Mosques/Churches/Temples, Orphanages, Drinking water facilities, Health facilities and other social impact projects for the underprivileged. These tokens are based on Zakat/Sadaqah/Waqf or CSR initiatives and align perfectly well with SDG-ISG initiatives.

Our vision is to develop a Wealth Creation and distribution platform where anyone can invest in real-world assets, regardless of location or financial capacity, making fractional ownership a mainstream form of investment class, generate returns and finally re-distribute that wealth in the society via our social impact tokens.

We aim to be the world's First regulated Shariah compliant Security token platform and are working closely with the Malaysian regulator to enable this.`,
      },
      {
        question: "Why does iWealthX use blockchain technology?",
        answer: `Blockchain ensures transparency, security, and efficiency for managing fractional ownership. It automates income distribution and ownership verification with smart contracts, cutting out intermediaries and lowering costs. It also provides liquidity by allowing easy token trading on a secondary market, so investors can exit when needed.

Without blockchain, iWealthX would need costly intermediaries, making transactions slower and more complex. Without blockchain ownership would be limited, with long holding periods and less liquidity. Manual processes would lead to delays and errors in rent collection and profit-sharing, reducing trust and efficiency.`,
      },
      {
        question: "Is iWealthX Shariah-compliant?",
        answer: `Yes, iWealthX follows Shariah principles like Musharakah (joint ownership) and risk-sharing. There's no involvement in interest (riba) or speculative activities (gharar), and profits and losses are shared fairly based on ownership. We have very senior Shariah scholars and thought leaders on board to guide our teams to ensure shariah compliance. For more details see the team section on https://www.iwealthx.com/team`,
      },
    ],
    "Investment & Ownership": [
      {
        question: "How does fractional ownership work on iWealthX?",
        answer: `iWealthX tokenizes assets like Green Energy, Agriculture, Real estate, allowing investors to buy digital tokens representing a share of the Asset. Each token gives you a portion of the income generated by the sale of solar power. You can also trade these tokens on a secondary market(in future), offering more liquidity than traditional real estate and on Regulated Digital Asset Exchanges globally (partnerships in the pipeline).`,
      },
      {
        question: "Do token holders have legal ownership of the asset?",
        answer: `Yes, token holders have a legal claim through their tokens, which represent fractional ownership. Typically, the asset is held in a special-purpose vehicle (SPV) or trust, and tokens give holders a share of rental income and sale proceeds. The exact legal structure may vary based on local regulations and projects, and we'll provide more details in the campaign page on our website https://www.iwealthx.com/investors.`,
      },
      {
        question: "How do investors benefit from iWealthX?",
        answer: `iWealthX provides investors with:
1. Fractional Ownership: Access to high-value assets through fractional investment, lowering entry barriers.
2. Liquidity: Future plans for a secondary market will allow token holders to trade their ownership stakes, providing liquidity in traditionally illiquid markets.
3. Transparency: Blockchain ensures transparent ownership records and automated income distribution.
4. Recurring and Long-Term Returns: Investors can benefit from both recurring income (such as rental payments) and capital appreciation over time.`,
      },
    ],
    "Operations & Returns": [
      {
        question: "How are payments made to investors from recurring returns?",
        answer: `At iWealthX, payments from recurring income, like rental returns/dividends, are automated and transparent. Here's how it works:
1. Income Collection: Rent/dividend is collected from customers and distributed to investors.
2. Automated Payouts: Smart contracts calculate and distribute returns based on your ownership share.
3. Regular Intervals: Payouts are made monthly or quarterly, depending on the project terms.
4. Direct to Account: Payments go straight to your account. Details will be finalized after regulatory approval.
5. Full Transparency: Track your returns anytime on the iWealthX platform, with compliance assured.`,
      },
      {
        question: "What are the risks involved in investing with iWealthX?",
        answer: `Like any investment, there are risks such as market changes, asset performance, and liquidity. iWealthX helps reduce these risks by focusing on high-quality assets, conduct through due diligence and project appraisal. However, returns aren't guaranteed, and asset values may drop, affecting token prices.`,
      },
      {
        question: "How does iWealthX handle asset management?",
        answer: `iWealthX works with professional asset managers to handle maintenance, tenant management, and rental collection. Investors enjoy a hands-off experience while earning returns.`,
      },
    ],
    "Getting Started": [
      {
        question: "How can I invest in iWealthX?",
        answer: `Our platform is under development and we are happy to assist you in registration and other tasks, we request you to kindly register as Early Investor and we will inform you in the next few weeks about registration.

To invest go to our platform and register as an Investor. We will ask you a few questions to assess your risk profile and investment style. You will have to complete a KYC process by submitting needed documents post which your profile will be activated and the various options to invest will be enabled for you.`,
      },
      {
        question: "How can I learn more about iWealthX?",
        answer: `We have our iWealthX social media channels that you can follow:
• LinkedIn: https://www.linkedin.com/company/iwealthx/posts/?feedView=all
• YouTube Channel: https://www.youtube.com/@iWealthX-real

If you're interested in joining us and believe in our vision of transparent and accessible investments, reach out to us directly for more information. Our team will be happy to discuss how you can get involved.`,
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-48 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Support Center
            </h2>
            <h1 className="text-text-primary text-5xl lg:text-6xl font-bold mb-8">
              How can we help you?
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed">
              Find detailed answers to the most common questions about
              iWealthX's platform, investments, and operations.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto">
            {Object.entries(faqCategories).map(([category, questions]) => (
              <FAQSection
                key={category}
                title={category}
                questions={questions}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
