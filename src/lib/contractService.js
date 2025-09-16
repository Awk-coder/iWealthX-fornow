import { ethers } from "ethers";

// Contract ABI - this is the interface to interact with your smart contract
const IWX_TOKEN_ABI = [
  // Events
  "event ProjectCreated(uint256 indexed projectId, address owner, uint256 tokenPrice, bool isERC20Payment, address paymentToken)",
  "event TokensMinted(uint256 indexed projectId, address indexed minter, uint256 amount, uint256 investmentAmount)",
  "event MinterAuthorized(address indexed minter, bool authorized)",
  "event FundsWithdrawn(address indexed recipient, uint256 amount, address token)",

  // Functions
  "function createProjectToken(uint256 _tokenPrice, bool _isERC20Payment, address _paymentToken) external returns (uint256 projectId)",
  "function mintProjectTokens(uint256 _projectId, uint256 _investmentAmount) external payable",
  "function setAuthorizedMinter(address _minter, bool _authorized) external",
  "function withdrawFunds(address _token, address _recipient, uint256 _amount) external",
  "function getTotalProjects() external view returns (uint256)",
  "function getProjectInfo(uint256 _projectId) external view returns (address owner, uint256 tokenPrice, uint256 totalSupply, bool isERC20Payment, address paymentToken)",
  "function isAuthorizedMinter(address) external view returns (bool)",
  "function owner() external view returns (address)",
  "function MAX_SUPPLY() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
];

// Contract configuration
const CONTRACT_CONFIG = {
  // Replace with your actual contract address
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || "0x...",

  // Polygon Amoy testnet configuration
  network: {
    chainId: 80002,
    name: "Polygon Amoy",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    blockExplorer: "https://amoy.polygonscan.com",
  },
};

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }

  // Initialize the service with user's wallet
  async initialize(forceReconnect = true) {
    try {
      // Reset state first
      this.provider = null;
      this.signer = null;
      this.contract = null;
      this.isConnected = false;
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask extension."
        );
      }

      // Check if ethereum object is properly loaded
      if (!window.ethereum.request) {
        throw new Error(
          "MetaMask is not properly loaded. Please refresh the page."
        );
      }

      // Always request fresh account access to trigger MetaMask popup
      console.log("Requesting MetaMask connection...");

      let accounts;
      if (forceReconnect) {
        // For forced reconnection, request permissions first to ensure popup
        try {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
        } catch (permError) {
          console.log(
            "Permission request failed, trying direct account request:",
            permError.message
          );
        }
      }

      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Accounts received:", accounts);

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Verify signer
      const address = await this.signer.getAddress();
      if (!address) {
        throw new Error("Failed to get wallet address");
      }

      // Check if we're on the correct network first
      await this.checkNetwork();

      // Create contract instance after network check
      this.contract = new ethers.Contract(
        CONTRACT_CONFIG.contractAddress,
        IWX_TOKEN_ABI,
        this.signer
      );

      this.isConnected = true;

      return {
        success: true,
        address: address,
        network: await this.provider.getNetwork(),
      };
    } catch (error) {
      console.error("Failed to initialize contract service:", error);
      this.isConnected = false;
      return {
        success: false,
        error: error.message || "Failed to connect to wallet",
      };
    }
  }

  // Check if we're on the correct network
  async checkNetwork() {
    try {
      const network = await this.provider.getNetwork();
      const currentChainId = Number(network.chainId);
      const targetChainId = CONTRACT_CONFIG.network.chainId;

      if (currentChainId !== targetChainId) {
        try {
          // Request to switch to Polygon Amoy
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${targetChainId.toString(16)}` }],
          });

          // Wait a bit for the network to switch
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Refresh the provider after network switch
          this.provider = new ethers.BrowserProvider(window.ethereum);
          this.signer = await this.provider.getSigner();
          this.contract = new ethers.Contract(
            CONTRACT_CONFIG.contractAddress,
            IWX_TOKEN_ABI,
            this.signer
          );
        } catch (switchError) {
          // If switching fails, try to add the network
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${targetChainId.toString(16)}`,
                  chainName: CONTRACT_CONFIG.network.name,
                  rpcUrls: [CONTRACT_CONFIG.network.rpcUrl],
                  blockExplorerUrls: [CONTRACT_CONFIG.network.blockExplorer],
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
    } catch (error) {
      console.error("Network check failed:", error);
      throw new Error(
        `Please switch to ${CONTRACT_CONFIG.network.name} testnet`
      );
    }
  }

  // Create a new project token
  async createProjectToken(
    tokenPrice,
    isERC20Payment = false,
    paymentToken = null
  ) {
    try {
      if (!this.isConnected) {
        throw new Error("Contract service not initialized");
      }

      const tx = await this.contract.createProjectToken(
        ethers.parseEther(tokenPrice.toString()),
        isERC20Payment,
        paymentToken || ethers.ZeroAddress
      );

      const receipt = await tx.wait();

      // Parse the ProjectCreated event
      const event = receipt.logs.find((log) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === "ProjectCreated";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        return {
          success: true,
          projectId: parsed.args.projectId.toString(),
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
        };
      }

      throw new Error("Project creation event not found");
    } catch (error) {
      console.error("Failed to create project token:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Mint tokens for a project
  async mintProjectTokens(projectId, investmentAmount, isERC20Payment = false) {
    try {
      if (!this.isConnected) {
        throw new Error("Contract service not initialized");
      }

      const value = isERC20Payment
        ? 0
        : ethers.parseEther(investmentAmount.toString());

      const tx = await this.contract.mintProjectTokens(
        projectId,
        ethers.parseEther(investmentAmount.toString()),
        { value }
      );

      const receipt = await tx.wait();

      // Parse the TokensMinted event
      const event = receipt.logs.find((log) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === "TokensMinted";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        return {
          success: true,
          tokenAmount: ethers.formatEther(parsed.args.amount),
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
        };
      }

      throw new Error("Token minting event not found");
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get project information
  async getProjectInfo(projectId) {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const info = await this.contract.getProjectInfo(projectId);

      return {
        success: true,
        data: {
          owner: info.owner,
          tokenPrice: ethers.formatEther(info.tokenPrice),
          totalSupply: ethers.formatEther(info.totalSupply),
          isERC20Payment: info.isERC20Payment,
          paymentToken: info.paymentToken,
        },
      };
    } catch (error) {
      console.error("Failed to get project info:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get total number of projects
  async getTotalProjects() {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const total = await this.contract.getTotalProjects();
      return {
        success: true,
        total: total.toString(),
      };
    } catch (error) {
      console.error("Failed to get total projects:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get user's token balance
  async getUserBalance(address = null) {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const userAddress = address || (await this.signer.getAddress());
      const balance = await this.contract.balanceOf(userAddress);

      return {
        success: true,
        balance: ethers.formatEther(balance),
      };
    } catch (error) {
      console.error("Failed to get user balance:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check if address is authorized minter
  async isAuthorizedMinter(address) {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const isAuthorized = await this.contract.isAuthorizedMinter(address);
      return {
        success: true,
        isAuthorized,
      };
    } catch (error) {
      console.error("Failed to check minter authorization:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get contract information
  async getContractInfo() {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      console.log(
        "Calling contract at address:",
        CONTRACT_CONFIG.contractAddress
      );
      console.log("Contract instance:", this.contract.target);

      // Test if contract exists at this address
      const code = await this.provider.getCode(CONTRACT_CONFIG.contractAddress);
      if (code === "0x") {
        throw new Error(
          "No contract found at this address - it may not be deployed or you're on the wrong network"
        );
      }
      console.log("Contract bytecode length:", code.length, "characters");

      const [name, symbol, decimals, totalSupply, maxSupply, owner] =
        await Promise.all([
          this.contract.name(),
          this.contract.symbol(),
          this.contract.decimals(),
          this.contract.totalSupply(),
          this.contract.MAX_SUPPLY(),
          this.contract.owner(),
        ]);

      console.log("Raw blockchain responses:");
      console.log("- name():", name);
      console.log("- symbol():", symbol);
      console.log("- decimals():", decimals.toString());
      console.log("- totalSupply():", totalSupply.toString());
      console.log("- MAX_SUPPLY():", maxSupply.toString());
      console.log("- owner():", owner);

      return {
        success: true,
        data: {
          name,
          symbol,
          decimals: decimals.toString(),
          totalSupply: ethers.formatEther(totalSupply),
          maxSupply: ethers.formatEther(maxSupply),
          contractAddress: CONTRACT_CONFIG.contractAddress,
          ownerAddress: owner,
        },
      };
    } catch (error) {
      console.error("Failed to get contract info:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Create singleton instance
const contractService = new ContractService();

export default contractService;
