import React from "react";

const ProgressBar = ({
  current,
  target,
  label = "Progress",
  showPercentage = true,
  showAmounts = false,
  className = "",
}) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `RM ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `RM ${(amount / 1000).toFixed(0)}K`;
    }
    return `RM ${amount.toLocaleString()}`;
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        {showPercentage && (
          <span className="text-sm font-bold text-gold">{percentage}%</span>
        )}
      </div>

      <div className="w-full bg-gray-700/50 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-gold to-gold/80 h-3 rounded-full transition-all duration-300 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      {showAmounts && (
        <div className="flex justify-between text-xs text-text-secondary">
          <span>
            Raised:{" "}
            <span className="text-accent-green font-medium">
              {formatAmount(current)}
            </span>
          </span>
          <span>
            Target:{" "}
            <span className="text-text-primary font-medium">
              {formatAmount(target)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
