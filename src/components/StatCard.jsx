import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  className = "",
}) => {
  const getTrendColor = () => {
    if (!trend) return "";
    return trendUp ? "text-accent-green" : "text-accent-red";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trendUp ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  return (
    <div
      className={`bg-surface rounded-xl shadow-lg p-6 border border-gray-700/50 hover:border-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-text-primary mb-2">{value}</p>
          {trend && (
            <div className={`flex items-center ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium ml-1">{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="ml-4">
            <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-gold" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
