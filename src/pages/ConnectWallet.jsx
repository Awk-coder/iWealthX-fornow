import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractService from "../lib/contractService";

const ConnectWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [contractInfo, setContractInfo] = useState(null);
  const [isTestingContract, setIsTestingContract] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  // Check if MetaMask is available and connection status on component mount
  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window.ethereum !== "undefined") {
        setIsMetaMaskAvailable(true);

        // Check if already connected
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0) {
            // Already connected, but don't set as connected until user clicks connect
            console.log("MetaMask has connected accounts:", accounts);
          }
        } catch (error) {
          console.log("Error checking existing connections:", error);
        }
      } else {
        setIsMetaMaskAvailable(false);
      }
    };

    checkMetaMask();

    // Listen for MetaMask installation
    const handleEthereumLoad = () => {
      checkMetaMask();
    };

    window.addEventListener("ethereum#initialized", handleEthereumLoad);

    // Also check after a short delay in case MetaMask loads asynchronously
    const timeout = setTimeout(checkMetaMask, 1000);

    return () => {
      window.removeEventListener("ethereum#initialized", handleEthereumLoad);
      clearTimeout(timeout);
    };
  }, []);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError("");

    try {
      console.log("Starting wallet connection...");

      // Clear any previous state
      setContractInfo(null);
      setTestResults(null);

      // Initialize contract service with force reconnect
      const result = await contractService.initialize(true);

      if (!result.success) {
        throw new Error(result.error);
      }

      setWalletAddress(result.address);
      setIsConnected(true);

      console.log("Connected successfully!");
      console.log("Address:", result.address);
      console.log(
        "Network:",
        result.network.name,
        "Chain ID:",
        result.network.chainId.toString()
      );
    } catch (error) {
      console.error("Connection failed:", error);

      // Provide more specific error messages
      let errorMessage = error.message;

      if (error.message.includes("User rejected")) {
        errorMessage =
          "Connection was rejected. Please approve the connection in MetaMask.";
      } else if (error.message.includes("network")) {
        errorMessage =
          "Network issue detected. Please make sure you're on Polygon Amoy testnet.";
      } else if (error.message.includes("MetaMask")) {
        errorMessage = error.message;
      } else {
        errorMessage = "Failed to connect to wallet. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    setError("");
    setContractInfo(null);
    setTestResults(null);
  };

  const testContractConnection = async () => {
    setIsTestingContract(true);
    setError("");

    try {
      console.log("Testing contract connection...");
      console.log(
        "Contract address being used:",
        process.env.REACT_APP_CONTRACT_ADDRESS
      );

      // Test 0: Simple blockchain connectivity test
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      const blockTime = new Date(block.timestamp * 1000);
      console.log("Connected to network:", network.name);
      console.log("Current block #:", blockNumber);
      console.log("Block timestamp:", blockTime.toLocaleString());
      console.log("This proves we're connected to live blockchain data!");

      // Test 1: Get contract info (includes MAX_SUPPLY)
      const contractResult = await contractService.getContractInfo();
      if (!contractResult.success) {
        throw new Error(`Contract info failed: ${contractResult.error}`);
      }
      console.log("Raw contract info from blockchain:", contractResult.data);

      // Test 2: Get total projects
      const projectsResult = await contractService.getTotalProjects();
      if (!projectsResult.success) {
        throw new Error(`Total projects failed: ${projectsResult.error}`);
      }
      console.log("Total projects:", projectsResult.total);

      // Test 3: Get user balance
      const balanceResult = await contractService.getUserBalance();
      if (!balanceResult.success) {
        throw new Error(`User balance failed: ${balanceResult.error}`);
      }
      console.log("User balance:", balanceResult.balance);

      // Test 4: Check if current user is authorized minter
      const authResult = await contractService.isAuthorizedMinter(
        walletAddress
      );
      console.log("Authorization check for", walletAddress, ":", authResult);

      setContractInfo(contractResult.data);
      setTestResults({
        contractInfo: contractResult.data,
        totalProjects: projectsResult.total,
        userBalance: balanceResult.balance,
        isAuthorizedMinter: authResult.success
          ? authResult.isAuthorized
          : false,
        blockchainInfo: {
          network: network.name,
          blockNumber: blockNumber,
          blockTime: blockTime.toLocaleString(),
        },
        success: true,
      });
    } catch (error) {
      console.error("Contract test failed:", error);
      setError(error.message);
      setTestResults({
        success: false,
        error: error.message,
      });
    } finally {
      setIsTestingContract(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-text-secondary">
            Connect your MetaMask wallet to continue
          </p>
        </div>

        {/* Connection Status */}
        {isConnected ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Wallet Connected!
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Your wallet is successfully connected
              </p>
              <div className="bg-white rounded border p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Connected Address:</p>
                <code className="text-sm text-gray-800 break-all">
                  {walletAddress}
                </code>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={disconnectWallet}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex-1"
                >
                  Disconnect
                </button>
                <button
                  onClick={connectMetaMask}
                  disabled={isConnecting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex-1"
                >
                  {isConnecting ? "Connecting..." : "Reconnect"}
                </button>
              </div>
            </div>

            {/* Contract Testing Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Test Smart Contract Connection
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Test the connection to your deployed smart contract
              </p>

              <button
                onClick={testContractConnection}
                disabled={isTestingContract}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-4"
              >
                {isTestingContract ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                    Testing Contract...
                  </>
                ) : (
                  "Test Contract Connection"
                )}
              </button>

              {/* Test Results */}
              {testResults && (
                <div
                  className={`border rounded-lg p-4 ${
                    testResults.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {testResults.success ? (
                    <div>
                      <div className="flex items-center mb-3">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <h4 className="font-medium text-green-800">
                          Contract Connection Successful!
                        </h4>
                      </div>

                      <div className="text-sm text-green-700 space-y-2">
                        <div>
                          <strong>Contract Name:</strong>{" "}
                          {testResults.contractInfo.name}
                        </div>
                        <div>
                          <strong>Symbol:</strong>{" "}
                          {testResults.contractInfo.symbol}
                        </div>
                        <div>
                          <strong>Decimals:</strong>{" "}
                          {testResults.contractInfo.decimals}
                        </div>
                        <div>
                          <strong>Total Supply:</strong>{" "}
                          {parseFloat(
                            testResults.contractInfo.totalSupply
                          ).toLocaleString()}{" "}
                          {testResults.contractInfo.symbol}
                        </div>
                        <div>
                          <strong>Max Supply:</strong>{" "}
                          {parseFloat(
                            testResults.contractInfo.maxSupply
                          ).toLocaleString()}{" "}
                          {testResults.contractInfo.symbol}
                        </div>
                        <div>
                          <strong>Your Balance:</strong>{" "}
                          {parseFloat(testResults.userBalance).toLocaleString()}{" "}
                          {testResults.contractInfo.symbol}
                        </div>
                        <div>
                          <strong>Total Projects:</strong>{" "}
                          {testResults.totalProjects}
                        </div>
                        <div>
                          <strong>Contract Owner:</strong>
                          <code className="block text-xs mt-1 break-all bg-white p-2 rounded border">
                            {testResults.contractInfo.ownerAddress}
                          </code>
                        </div>
                        <div>
                          <strong>Contract Address:</strong>
                          <code className="block text-xs mt-1 break-all bg-white p-2 rounded border">
                            {testResults.contractInfo.contractAddress}
                          </code>
                        </div>
                        {testResults.isAuthorizedMinter !== undefined && (
                          <div>
                            <strong>Authorized Minter:</strong>{" "}
                            <span
                              className={
                                testResults.isAuthorizedMinter
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {testResults.isAuthorizedMinter
                                ? "✓ Yes"
                                : "✗ No"}
                            </span>
                          </div>
                        )}

                        {/* Blockchain Verification Info */}
                        {testResults.blockchainInfo && (
                          <div className="mt-4 pt-4 border-t border-green-300">
                            <div className="text-xs text-green-600 font-medium mb-2">
                              🔗 Live Blockchain Data:
                            </div>
                            <div>
                              <strong>Network:</strong>{" "}
                              {testResults.blockchainInfo.network}
                            </div>
                            <div>
                              <strong>Current Block:</strong> #
                              {testResults.blockchainInfo.blockNumber}
                            </div>
                            <div>
                              <strong>Block Time:</strong>{" "}
                              {testResults.blockchainInfo.blockTime}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-2">
                        <svg
                          className="w-5 h-5 text-red-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h4 className="font-medium text-red-800">
                          Contract Test Failed
                        </h4>
                      </div>
                      <p className="text-sm text-red-700">
                        {testResults.error}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Connect Button */}
            <button
              onClick={connectMetaMask}
              disabled={isConnecting || !isMetaMaskAvailable}
              className="w-full bg-gold text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-gold/20 group relative overflow-hidden mb-6"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Connecting...
                  </>
                ) : !isMetaMaskAvailable ? (
                  <>
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Install MetaMask First
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Connect MetaMask
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Instructions */}
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Instructions:
          </h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="w-4 h-4 bg-gold rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                1
              </span>
              Make sure MetaMask is installed and set to Polygon Amoy testnet
            </li>
            <li className="flex items-start">
              <span className="w-4 h-4 bg-gold rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                2
              </span>
              Click "Connect MetaMask" to connect your wallet
            </li>
            <li className="flex items-start">
              <span className="w-4 h-4 bg-gold rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                3
              </span>
              Approve the connection in the MetaMask popup
            </li>
            <li className="flex items-start">
              <span className="w-4 h-4 bg-gold rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                4
              </span>
              Test the smart contract connection to verify everything works
            </li>
          </ul>
        </div>

        {/* MetaMask Download Link */}
        {!isMetaMaskAvailable && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">
              Don't have MetaMask installed?
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Download MetaMask →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
