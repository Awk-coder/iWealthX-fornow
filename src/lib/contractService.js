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
  async initialize() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed");
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Create contract instance
      this.contract = new ethers.Contract(
        CONTRACT_CONFIG.contractAddress,
        IWX_TOKEN_ABI,
        this.signer
      );

      this.isConnected = true;

      // Check if we're on the correct network
      await this.checkNetwork();

      return {
        success: true,
        address: await this.signer.getAddress(),
        network: await this.provider.getNetwork(),
      };
    } catch (error) {
      console.error("Failed to initialize contract service:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check if we're on the correct network
  async checkNetwork() {
    try {
      const network = await this.provider.getNetwork();
      if (network.chainId !== BigInt(CONTRACT_CONFIG.network.chainId)) {
        // Request to switch to Polygon Mumbai
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: `0x${CONTRACT_CONFIG.network.chainId.toString(16)}` },
          ],
        });
      }
    } catch (error) {
      console.error("Network check failed:", error);
      throw new Error("Please switch to Polygon Amoy testnet");
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

      const [name, symbol, decimals, totalSupply, maxSupply] =
        await Promise.all([
          this.contract.name(),
          this.contract.symbol(),
          this.contract.decimals(),
          this.contract.totalSupply(),
          this.contract.MAX_SUPPLY(),
        ]);

      return {
        success: true,
        data: {
          name,
          symbol,
          decimals: decimals.toString(),
          totalSupply: ethers.formatEther(totalSupply),
          maxSupply: ethers.formatEther(maxSupply),
          contractAddress: CONTRACT_CONFIG.contractAddress,
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
