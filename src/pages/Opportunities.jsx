import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import OpportunityCard from "../components/OpportunityCard";
import { mockData } from "../data/mockData";
import { Search, Filter, TrendingUp } from "lucide-react";

const Opportunities = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    "Energy",
    "Real Estate",
    "Agriculture",
    "Healthcare",
  ];

  const filteredOpportunities = mockData.opportunities.filter((opportunity) => {
    const matchesCategory =
      selectedCategory === "All" || opportunity.category === selectedCategory;
    const matchesSearch =
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout
      title="Investment Opportunities"
      subtitle="Discover and invest in Shariah-compliant opportunities"
    >
      {/* Search and Filter Section */}
      <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="text-text-secondary w-5 h-5" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gold text-background"
                      : "bg-gray-700/50 text-text-secondary hover:bg-gray-600/50 hover:text-text-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-text-secondary">
            Showing {filteredOpportunities.length} of{" "}
            {mockData.opportunities.length} opportunities
          </span>
          <div className="flex items-center space-x-2 text-text-secondary">
            <TrendingUp className="w-4 h-4" />
            <span>Sorted by potential return</span>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl p-12 border border-gray-700/50 text-center">
          <div className="text-text-secondary mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No opportunities found
            </h3>
            <p>Try adjusting your search criteria or category filter.</p>
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="bg-gold text-background px-6 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Investment Disclaimer */}
      <div className="bg-accent-amber/10 border border-accent-amber/20 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-accent-amber/20 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-accent-amber text-sm font-bold">!</span>
          </div>
          <div>
            <h4 className="text-accent-amber font-semibold mb-2">
              Investment Disclaimer
            </h4>
            <p className="text-accent-amber/80 text-sm leading-relaxed">
              All investments carry risk and past performance is not indicative
              of future results. Please read the offering documents carefully
              and consider your financial situation before investing. All
              opportunities are Shariah-compliant and have been reviewed by our
              Shariah advisory board.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl p-8 border border-gold/20 text-center">
        <h3 className="text-2xl font-bold text-text-primary mb-4">
          Ready to Start Investing?
        </h3>
        <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
          Join thousands of investors who are building wealth through our
          carefully curated Shariah-compliant investment opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gold text-background px-8 py-3 rounded-lg font-medium hover:bg-gold/90 transition-colors">
            Browse All Opportunities
          </button>
          <button className="border border-gold text-gold px-8 py-3 rounded-lg font-medium hover:bg-gold/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Opportunities;
