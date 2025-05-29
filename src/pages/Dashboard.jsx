import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/StatCard";
import InvestmentCard from "../components/InvestmentCard";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { mockData } from "../data/mockData";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Wallet,
  Plus,
  Minus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user, investments, transactions } = mockData;

  // Chart data for portfolio allocation
  const chartData = {
    labels: ["Real Estate", "Agriculture", "Cash"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ["#D4AF37", "#10B981", "#6B7280"],
        borderColor: ["#B8941F", "#059669", "#4B5563"],
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
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout
      title="Portfolio Overview"
      subtitle="Track your investments and portfolio performance"
    >
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
          title="Monthly Return"
          value={`${user.monthlyReturn}%`}
          trend="+2.1%"
          icon={Calendar}
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
              {transactions.slice(0, 5).map((transaction, index) => (
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
                      {transaction.amount > 0 ? "+" : ""}RM{" "}
                      {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-text-secondary text-sm capitalize">
                      {transaction.type}
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
