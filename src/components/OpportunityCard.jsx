import React from "react";
import { MapPin, Calendar, Users, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const OpportunityCard = ({ opportunity, onInvest, className = "" }) => {
  const navigate = useNavigate();

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-white bg-accent-green";
      case "medium":
        return "text-white bg-accent-amber";
      case "high":
        return "text-white bg-accent-red";
      default:
        return "text-white bg-gray-600";
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "energy":
        return "text-white bg-accent-green";
      case "real estate":
        return "text-white bg-accent-blue";
      case "agriculture":
        return "text-white bg-accent-amber";
      case "healthcare":
        return "text-white bg-accent-purple";
      default:
        return "text-white bg-gray-600";
    }
  };

  const handleInvest = () => {
    navigate("/kyc");
  };

  return (
    <div
      className={`bg-surface rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 border border-gray-700/50 hover:border-gold/30 ${className}`}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-800">
        <img
          src={opportunity.image}
          alt={opportunity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
              opportunity.type
            )}`}
          >
            {opportunity.type}
          </span>
          {opportunity.shariahCompliant && (
            <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold text-background">
              <Shield className="w-3 h-3 mr-1" />
              Shariah
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          {opportunity.isPilot && (
            <div className="bg-gold text-background px-3 py-1 rounded-full font-bold text-xs shadow-lg transform rotate-2">
              Pilot
            </div>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
              opportunity.riskLevel
            )}`}
          >
            {opportunity.riskLevel} Risk
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {opportunity.name}
        </h3>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {opportunity.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-text-secondary mb-1">Expected Return</p>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-accent-green mr-1" />
              <span className="text-lg font-bold text-accent-green">
                {opportunity.expectedReturn}%
              </span>
            </div>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-text-secondary mb-1">Duration</p>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-text-secondary mr-1" />
              <span className="text-sm font-medium text-text-primary">
                {opportunity.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
          <ProgressBar
            current={opportunity.currentFunding}
            target={opportunity.targetAmount}
            label="Funding Progress"
            showAmounts={true}
            className="mb-4"
          />
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm text-text-secondary mb-4 bg-background rounded-lg p-3">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{opportunity.investorCount} investors</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{opportunity.location}</span>
          </div>
        </div>

        {/* Investment Info */}
        <div className="border-t border-gray-700/50 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-text-secondary">Min. Investment</span>
            <span className="text-sm font-semibold text-gold">
              RM {opportunity.minInvestment.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleInvest}
            className="w-full bg-gold text-background py-3 rounded-lg font-medium hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 group relative overflow-hidden"
          >
            <span className="relative z-10">Invest Now</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
