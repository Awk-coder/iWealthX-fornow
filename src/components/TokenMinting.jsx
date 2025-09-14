import React, { useState, useEffect } from "react";
import tokenApiService from "../lib/tokenApiService";
import { supabase } from "../lib/supabase";

const TokenMinting = ({ projectId, projectTitle, onMintSuccess }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contractInfo, setContractInfo] = useState(null);

  useEffect(() => {
    initializeService();
    loadProjectInfo();
  }, [projectId]);

  const initializeService = async () => {
    try {
      const result = await tokenApiService.initialize();
      if (result.success) {
        setIsConnected(true);
        setWalletAddress(result.data.address);
        setError("");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to connect to wallet");
    }
  };

  const loadProjectInfo = async () => {
    try {
      const result = await tokenApiService.getProjectTokenInfo(projectId);
      if (result.success) {
        setTokenPrice(parseFloat(result.data.token_price));
      }
    } catch (error) {
      console.error("Failed to load project info:", error);
    }
  };

  const calculateEstimatedTokens = (amount) => {
    if (amount && tokenPrice > 0) {
      const tokens = parseFloat(amount) / tokenPrice;
      setEstimatedTokens(tokens);
    } else {
      setEstimatedTokens(0);
    }
  };

  const handleInvestmentChange = (e) => {
    const value = e.target.value;
    setInvestmentAmount(value);
    calculateEstimatedTokens(value);
  };

  const handleMintTokens = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }

    setIsMinting(true);
    setError("");
    setSuccess("");

    try {
      // Get current user from Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to mint tokens");
        setIsMinting(false);
        return;
      }

      const result = await tokenApiService.mintTokens({
        projectId,
        userId: user.id,
        investmentAmount: parseFloat(investmentAmount),
        walletAddress,
      });

      if (result.success) {
        setSuccess(`Successfully minted ${result.data.tokenAmount} tokens!`);
        setInvestmentAmount("");
        setEstimatedTokens(0);

        // Call success callback if provided
        if (onMintSuccess) {
          onMintSuccess(result.data);
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to mint tokens. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const connectWallet = async () => {
    try {
      const result = await tokenApiService.initialize();
      if (result.success) {
        setIsConnected(true);
        setWalletAddress(result.data.address);
        setError("");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to connect wallet");
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Connect Wallet to Mint Tokens
        </h3>
        <p className="text-gray-600 mb-4">
          Connect your MetaMask wallet to mint tokens for this project.
        </p>
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Connect Wallet
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        Mint Tokens for {projectTitle}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Connected Wallet
          </label>
          <div className="p-3 bg-gray-100 rounded border">
            <code className="text-sm">{walletAddress}</code>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Amount (AMOY)
          </label>
          <input
            type="number"
            value={investmentAmount}
            onChange={handleInvestmentChange}
            placeholder="Enter amount in AMOY"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.01"
          />
        </div>

        {tokenPrice > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Price
              </label>
              <div className="p-3 bg-gray-100 rounded border">
                {tokenPrice} AMOY per token
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Tokens
              </label>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                {estimatedTokens.toFixed(6)} IWX
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleMintTokens}
          disabled={
            isMinting || !investmentAmount || parseFloat(investmentAmount) <= 0
          }
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isMinting ? "Minting Tokens..." : "Mint Tokens"}
        </button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Make sure you're on Polygon Amoy testnet</li>
          <li>• You need AMOY tokens for gas fees</li>
          <li>• Transactions are irreversible once confirmed</li>
          <li>• Token price is set by the project owner</li>
        </ul>
      </div>
    </div>
  );
};

export default TokenMinting;
