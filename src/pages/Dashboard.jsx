import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/StatCard";
import InvestmentCard from "../components/InvestmentCard";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { mockData } from "../data/mockData";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Plus,
  Minus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  CreditCard,
  Shield,
  Zap,
  Copy,
  CheckCircle,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user, investments, transactions } = mockData;
  const [iWealthXBalance, setIWealthXBalance] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [copied, setCopied] = useState(false);

  // Generate random demo values for iWealthX token
  useEffect(() => {
    const generateRandomValues = () => {
      // Random balance between 1000 and 50000
      const balance = Math.floor(Math.random() * 49000) + 1000;
      // Random price between 0.98 and 1.02 (stable coin)
      const price = (Math.random() * 0.04 + 0.98).toFixed(4);

      setIWealthXBalance(balance);
      setTokenPrice(parseFloat(price));
    };

    generateRandomValues();

    // Update values every 30 seconds for demo
    const interval = setInterval(generateRandomValues, 30000);

    return () => clearInterval(interval);
  }, []);

  // Mock wallet address
  const walletAddress = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Chart data for portfolio allocation
  const chartData = {
    labels: ["Real Estate", "Agriculture", "iWealthX Tokens", "Cash"],
    datasets: [
      {
        data: [35, 25, 25, 15],
        backgroundColor: ["#D4AF37", "#10B981", "#8B5CF6", "#6B7280"],
        borderColor: ["#B8941F", "#059669", "#7C3AED", "#4B5563"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#E5E7EB",
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#E5E7EB",
        borderColor: "#374151",
        borderWidth: 1,
      },
    },
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "investment":
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case "return":
        return <ArrowDownRight className="w-4 h-4 text-blue-400" />;
      case "deposit":
        return <Plus className="w-4 h-4 text-green-400" />;
      case "withdrawal":
        return <Minus className="w-4 h-4 text-red-400" />;
      case "token_mint":
        return <Coins className="w-4 h-4 text-purple-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  // Enhanced transactions with iWealthX token transactions
  const enhancedTransactions = [
    {
      type: "token_mint",
      description: "iWealthX Token Mint",
      amount: 5000,
      date: "2025-01-02",
    },
    ...transactions.slice(0, 4),
  ];

  return (
    <DashboardLayout
      title="Portfolio Overview"
      subtitle="Track your investments and iWealthX token balance"
    >
      {/* Welcome Message */}
      <div className="mb-6 bg-gradient-to-r from-gold/10 to-purple-600/10 border border-gold/20 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-gold" />
          <div>
            <h3 className="text-xl font-semibold text-text-primary">
              Welcome to iWealthX!
            </h3>
            <p className="text-text-secondary">
              Your KYC verification is complete. Start investing in
              Shariah-compliant opportunities and earn iWealthX tokens.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Investment"
          value={`RM ${user.totalInvestment.toLocaleString()}`}
          trend="+8.2%"
          icon={DollarSign}
          trendUp={true}
        />
        <StatCard
          title="Total Returns"
          value={`RM ${user.totalReturns.toLocaleString()}`}
          trend="+8.2%"
          icon={TrendingUp}
          trendUp={true}
        />
        <StatCard
          title="iWealthX Tokens"
          value={`${iWealthXBalance.toLocaleString()} iWX`}
          trend="+12.3%"
          icon={Coins}
          trendUp={true}
        />
        <StatCard
          title="Wallet Balance"
          value={`RM ${user.walletBalance.toLocaleString()}`}
          trend="-5.3%"
          icon={Wallet}
          trendUp={false}
        />
      </div>

      {/* iWealthX Token Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Overview */}
        <div className="bg-gradient-to-br from-purple-600/10 to-gold/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-gold rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  iWealthX Token
                </h3>
                <p className="text-text-secondary text-sm">
                  Shariah-Compliant Stable Coin
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-text-primary">
                {iWealthXBalance.toLocaleString()}
              </p>
              <p className="text-text-secondary text-sm">iWX Tokens</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface/50 rounded-lg p-4">
              <p className="text-text-secondary text-sm mb-1">Current Price</p>
              <p className="text-lg font-semibold text-text-primary">
                ${tokenPrice}
              </p>
              <p className="text-green-400 text-xs">+0.02% (24h)</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-4">
              <p className="text-text-secondary text-sm mb-1">USD Value</p>
              <p className="text-lg font-semibold text-text-primary">
                $
                {(iWealthXBalance * tokenPrice).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-blue-400 text-xs">
                ≈ RM{" "}
                {(iWealthXBalance * tokenPrice * 4.5).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 0 }
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Backed by:</span>
              <span className="text-text-primary">
                Real Estate & Commodities
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Shariah Status:</span>
              <span className="text-green-400 flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Certified</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Yield (APY):</span>
              <span className="text-gold">8.5%</span>
            </div>
          </div>
        </div>

        {/* Wallet Information */}
        <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="w-6 h-6 text-gold" />
            <h3 className="text-xl font-semibold text-text-primary">
              Your Wallet
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2 bg-background rounded-lg p-3 border border-gray-700/50">
                <code className="text-text-primary font-mono text-sm flex-1 truncate">
                  {walletAddress}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-secondary" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-xs mt-1">
                  Address copied to clipboard!
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gold text-background py-3 px-4 rounded-lg font-medium hover:bg-gold/90 transition-colors flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Buy iWX</span>
              </button>
              <button className="bg-gray-700 text-text-primary py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                <Minus className="w-4 h-4" />
                <span>Sell iWX</span>
              </button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium text-sm">
                    Auto-Staking Active
                  </h4>
                  <p className="text-blue-400/80 text-xs mt-1">
                    Your iWX tokens are automatically earning 8.5% APY through
                    Shariah-compliant investments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Allocation Chart */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Portfolio Allocation
            </h3>
            <div className="h-64">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Active Investments */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Active Investments
              </h3>
              <span className="text-sm text-text-secondary">
                {investments.length} investments
              </span>
            </div>
            <div className="space-y-4">
              {investments.map((investment, index) => (
                <InvestmentCard key={index} investment={investment} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-text-primary mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gold text-background py-3 px-4 rounded-lg font-medium hover:bg-gold/90 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Funds</span>
            </button>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Buy iWX Tokens</span>
            </button>
            <button className="w-full bg-gray-700 text-text-primary py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
              <Minus className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Browse Opportunities</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Recent Transactions
              </h3>
              <button className="text-gold hover:text-gold/80 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {enhancedTransactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-gray-700/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">
                        {transaction.description}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.amount > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.type === "token_mint"
                        ? `${Math.abs(transaction.amount).toLocaleString()} iWX`
                        : `RM ${Math.abs(transaction.amount).toLocaleString()}`}
                    </p>
                    <p className="text-text-secondary text-sm capitalize">
                      {transaction.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
