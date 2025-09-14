import { supabase } from "./supabase";
import contractService from "./contractService";

class TokenApiService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize the service
  async initialize() {
    try {
      const result = await contractService.initialize();
      if (result.success) {
        this.isInitialized = true;
        return { success: true, data: result };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create a new project token on blockchain and database
  async createProjectToken(projectData) {
    try {
      const {
        projectId,
        tokenPrice,
        isERC20Payment = false,
        paymentToken = null,
      } = projectData;

      // 1. Create project token on blockchain
      const blockchainResult = await contractService.createProjectToken(
        tokenPrice,
        isERC20Payment,
        paymentToken
      );

      if (!blockchainResult.success) {
        return { success: false, error: blockchainResult.error };
      }

      // 2. Store project token metadata in database
      const { data, error } = await supabase
        .from("project_token_metadata")
        .insert({
          project_id: projectId,
          blockchain_project_id: parseInt(blockchainResult.projectId),
          token_contract_address: process.env.REACT_APP_CONTRACT_ADDRESS,
          token_price: tokenPrice,
          is_erc20_payment: isERC20Payment,
          payment_token_address: paymentToken,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return {
          success: false,
          error: "Failed to store project token metadata",
        };
      }

      return {
        success: true,
        data: {
          projectId: blockchainResult.projectId,
          transactionHash: blockchainResult.transactionHash,
          blockNumber: blockchainResult.blockNumber,
          databaseId: data.id,
        },
      };
    } catch (error) {
      console.error("Failed to create project token:", error);
      return { success: false, error: error.message };
    }
  }

  // Mint tokens for a user
  async mintTokens(mintData) {
    try {
      const { projectId, userId, investmentAmount, walletAddress } = mintData;

      // 1. Get project token metadata
      const { data: projectMetadata, error: projectError } = await supabase
        .from("project_token_metadata")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (projectError || !projectMetadata) {
        return { success: false, error: "Project token not found" };
      }

      // 2. Mint tokens on blockchain
      const blockchainResult = await contractService.mintProjectTokens(
        projectMetadata.blockchain_project_id,
        investmentAmount,
        projectMetadata.is_erc20_payment
      );

      if (!blockchainResult.success) {
        return { success: false, error: blockchainResult.error };
      }

      // 3. Store transaction in database
      const { data: transactionData, error: transactionError } = await supabase
        .from("token_transactions")
        .insert({
          project_id: projectId,
          user_id: userId,
          transaction_hash: blockchainResult.transactionHash,
          token_amount: parseFloat(blockchainResult.tokenAmount),
          investment_amount: investmentAmount,
          block_number: blockchainResult.blockNumber,
          status: "confirmed",
          transaction_type: "mint",
        })
        .select()
        .single();

      if (transactionError) {
        console.error("Transaction storage error:", transactionError);
        // Don't fail the whole operation, just log the error
      }

      // 4. Update user token balance
      await this.updateUserTokenBalance(userId, projectId, walletAddress);

      return {
        success: true,
        data: {
          tokenAmount: blockchainResult.tokenAmount,
          transactionHash: blockchainResult.transactionHash,
          blockNumber: blockchainResult.blockNumber,
          transactionId: transactionData?.id,
        },
      };
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      return { success: false, error: error.message };
    }
  }

  // Update user token balance
  async updateUserTokenBalance(userId, projectId, walletAddress) {
    try {
      // Get current balance from blockchain
      const balanceResult = await contractService.getUserBalance(walletAddress);

      if (!balanceResult.success) {
        console.error("Failed to get user balance:", balanceResult.error);
        return;
      }

      // Upsert user token balance
      const { error } = await supabase.from("user_token_balances").upsert({
        user_id: userId,
        project_id: projectId,
        wallet_address: walletAddress,
        token_balance: parseFloat(balanceResult.balance),
        last_updated: new Date().toISOString(),
      });

      if (error) {
        console.error("Failed to update user token balance:", error);
      }
    } catch (error) {
      console.error("Error updating user token balance:", error);
    }
  }

  // Get user's token balances across all projects
  async getUserTokenBalances(userId) {
    try {
      const { data, error } = await supabase
        .from("user_token_balances")
        .select(
          `
          *,
          projects (
            id,
            title,
            description,
            status
          )
        `
        )
        .eq("user_id", userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Failed to get user token balances:", error);
      return { success: false, error: error.message };
    }
  }

  // Get project token information
  async getProjectTokenInfo(projectId) {
    try {
      const { data, error } = await supabase
        .from("project_token_metadata")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) {
        return { success: false, error: "Project token not found" };
      }

      // Get blockchain project info
      const blockchainInfo = await contractService.getProjectInfo(
        data.blockchain_project_id
      );

      if (blockchainInfo.success) {
        return {
          success: true,
          data: {
            ...data,
            blockchainInfo: blockchainInfo.data,
          },
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Failed to get project token info:", error);
      return { success: false, error: error.message };
    }
  }

  // Get user's transaction history
  async getUserTransactionHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("token_transactions")
        .select(
          `
          *,
          projects (
            id,
            title,
            description
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Failed to get user transaction history:", error);
      return { success: false, error: error.message };
    }
  }

  // Get contract information
  async getContractInfo() {
    try {
      const result = await contractService.getContractInfo();
      return result;
    } catch (error) {
      console.error("Failed to get contract info:", error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authorized minter
  async isUserAuthorizedMinter(walletAddress) {
    try {
      const result = await contractService.isAuthorizedMinter(walletAddress);
      return result;
    } catch (error) {
      console.error("Failed to check minter authorization:", error);
      return { success: false, error: error.message };
    }
  }

  // Get total projects count
  async getTotalProjects() {
    try {
      const result = await contractService.getTotalProjects();
      return result;
    } catch (error) {
      console.error("Failed to get total projects:", error);
      return { success: false, error: error.message };
    }
  }

  // Sync blockchain data with database
  async syncBlockchainData() {
    try {
      // Get all project token metadata
      const { data: projects, error } = await supabase
        .from("project_token_metadata")
        .select("*");

      if (error) {
        return { success: false, error: error.message };
      }

      // Update each project's blockchain data
      for (const project of projects) {
        const blockchainInfo = await contractService.getProjectInfo(
          project.blockchain_project_id
        );

        if (blockchainInfo.success) {
          await supabase
            .from("project_token_metadata")
            .update({
              minted_amount: parseFloat(blockchainInfo.data.totalSupply),
              updated_at: new Date().toISOString(),
            })
            .eq("id", project.id);
        }
      }

      return { success: true, message: "Blockchain data synced successfully" };
    } catch (error) {
      console.error("Failed to sync blockchain data:", error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const tokenApiService = new TokenApiService();

export default tokenApiService;

