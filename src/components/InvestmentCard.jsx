import React from "react";
import { MapPin, TrendingUp, Coins } from "lucide-react";

const InvestmentCard = ({ investment, className = "" }) => {
  const getReturnColor = (returnValue) => {
    if (returnValue >= 8) return "text-accent-green bg-accent-green/20";
    if (returnValue >= 5) return "text-accent-blue bg-accent-blue/20";
    return "text-accent-amber bg-accent-amber/20";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-accent-green bg-accent-green/20";
      case "pending":
        return "text-accent-amber bg-accent-amber/20";
      case "completed":
        return "text-accent-blue bg-accent-blue/20";
      default:
        return "text-text-secondary bg-gray-700/50";
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "energy":
        return "text-accent-green bg-accent-green/20";
      case "real estate":
        return "text-accent-blue bg-accent-blue/20";
      case "agriculture":
        return "text-accent-amber bg-accent-amber/20";
      default:
        return "text-text-secondary bg-gray-700/50";
    }
  };

  return (
    <div
      className={`bg-background rounded-xl p-6 border border-gray-700/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {investment.name}
          </h3>
          <div className="flex items-center text-sm text-text-secondary mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {investment.location}
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
              investment.type
            )}`}
          >
            {investment.type}
          </span>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            investment.status
          )}`}
        >
          {investment.status.charAt(0).toUpperCase() +
            investment.status.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-surface rounded-lg p-3">
          <p className="text-xs text-text-secondary mb-1">Invested Amount</p>
          <p className="text-lg font-semibold text-text-primary">
            RM {investment.investedAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface rounded-lg p-3">
          <p className="text-xs text-text-secondary mb-1">Current Value</p>
          <p className="text-lg font-semibold text-gold">
            RM {investment.currentValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-surface rounded-lg p-3">
        <div className="flex items-center">
          <Coins className="w-4 h-4 text-gold mr-2" />
          <span className="text-sm text-text-secondary">
            {investment.tokens} tokens
          </span>
        </div>
        <div
          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReturnColor(
            investment.return
          )}`}
        >
          <TrendingUp className="w-4 h-4 mr-1" />+{investment.return}%
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
