import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { mockData } from "../data/mockData";
import {
  Wallet as WalletIcon,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

const Wallet = () => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const { user, transactions } = mockData;

  const transactionTypes = [
    "All",
    "Deposit",
    "Withdrawal",
    "Investment",
    "Return",
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === "All") return true;
    return transaction.type.toLowerCase() === selectedFilter.toLowerCase();
  });

  const getTransactionIcon = (type) => {
    switch (type) {
      case "investment":
        return <ArrowUpRight className="w-5 h-5 text-green-400" />;
      case "return":
        return <ArrowDownRight className="w-5 h-5 text-blue-400" />;
      case "deposit":
        return <Plus className="w-5 h-5 text-green-400" />;
      case "withdrawal":
        return <Minus className="w-5 h-5 text-red-400" />;
      default:
        return <WalletIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleAddFunds = () => {
    if (amount && parseFloat(amount) > 0) {
      alert(
        `Add funds functionality would be implemented here. Amount: RM ${amount}`
      );
      setAmount("");
      setShowAddFunds(false);
    }
  };

  const handleWithdraw = () => {
    if (amount && parseFloat(amount) > 0) {
      if (parseFloat(amount) <= user.walletBalance) {
        alert(
          `Withdraw functionality would be implemented here. Amount: RM ${amount}`
        );
        setAmount("");
        setShowWithdraw(false);
      } else {
        alert("Insufficient balance for withdrawal");
      }
    }
  };

  return (
    <DashboardLayout
      title="Wallet Management"
      subtitle="Manage your funds and view transaction history"
    >
      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gold/20 rounded-lg">
              <WalletIcon className="w-6 h-6 text-gold" />
            </div>
            <span className="text-sm text-text-secondary">
              Available Balance
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-text-primary mb-1">
              RM {user.walletBalance.toLocaleString()}
            </h3>
            <p className="text-text-secondary text-sm">Ready to invest</p>
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-text-secondary">Portfolio Value</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-text-primary mb-1">
              RM {(user.walletBalance + 15000).toLocaleString()}
            </h3>
            <p className="text-green-400 text-sm">+8.2% this month</p>
          </div>
        </div>

        {/* Total Invested */}
        <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <ArrowDownRight className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-sm text-text-secondary">Total Invested</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-text-primary mb-1">
              RM 15,000
            </h3>
            <p className="text-text-secondary text-sm">Across 3 investments</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-text-primary mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowAddFunds(true)}
            className="flex items-center justify-center space-x-3 bg-gold text-background py-4 px-6 rounded-lg font-medium hover:bg-gold/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Funds</span>
          </button>
          <button
            onClick={() => setShowWithdraw(true)}
            className="flex items-center justify-center space-x-3 bg-gray-700 text-text-primary py-4 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            <Minus className="w-5 h-5" />
            <span>Withdraw Funds</span>
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-text-primary mb-6">
          Payment Methods
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-gray-700/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Banknote className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-text-primary font-medium">Bank Transfer</p>
                <p className="text-text-secondary text-sm">
                  Instant transfer via FPX
                </p>
              </div>
            </div>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-gray-700/30 opacity-60">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-text-primary font-medium">
                  Credit/Debit Card
                </p>
                <p className="text-text-secondary text-sm">Visa, Mastercard</p>
              </div>
            </div>
            <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary">
            Transaction History
          </h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-text-secondary" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-background border border-gray-700/50 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold/50"
              >
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button className="flex items-center space-x-2 text-gold hover:text-gold/80 text-sm font-medium">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="text-text-primary font-medium">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 text-text-secondary text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{transaction.date}</span>
                    <span>•</span>
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.amount > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}RM{" "}
                  {Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-text-secondary text-sm">
                  Balance: RM{" "}
                  {(user.walletBalance + transaction.amount).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <WalletIcon className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-50" />
            <h4 className="text-lg font-semibold text-text-primary mb-2">
              No transactions found
            </h4>
            <p className="text-text-secondary">
              No transactions match your current filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md border border-gray-700/50">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Add Funds
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Amount (RM)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddFunds}
                  className="flex-1 bg-gold text-background py-3 rounded-lg font-medium hover:bg-gold/90 transition-colors"
                >
                  Add Funds
                </button>
                <button
                  onClick={() => {
                    setShowAddFunds(false);
                    setAmount("");
                  }}
                  className="flex-1 bg-gray-700 text-text-primary py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md border border-gray-700/50">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Withdraw Funds
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Amount (RM)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={user.walletBalance}
                  className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
                />
                <p className="text-text-secondary text-sm mt-1">
                  Available: RM {user.walletBalance.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => {
                    setShowWithdraw(false);
                    setAmount("");
                  }}
                  className="flex-1 bg-gray-700 text-text-primary py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Wallet;
