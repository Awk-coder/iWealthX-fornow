const { createClient } = require("@supabase/supabase-js");

// Replace with your actual values
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function updateContractAddress() {
  try {
    console.log("🔄 Updating contract address...");

    // First, try to update existing record
    const { data: updateData, error: updateError } = await supabase
      .from("smart_contract_config")
      .update({
        contract_address: CONTRACT_ADDRESS,
        updated_at: new Date().toISOString(),
      })
      .eq("contract_name", "IWXToken")
      .select();

    if (updateError) {
      console.error("❌ Update error:", updateError);
      throw updateError;
    }

    // If no rows were updated, insert a new record
    if (!updateData || updateData.length === 0) {
      console.log("📝 No existing record found, creating new one...");

      const { data: insertData, error: insertError } = await supabase
        .from("smart_contract_config")
        .insert({
          contract_address: CONTRACT_ADDRESS,
          contract_name: "IWXToken",
          network_name: "Polygon Amoy",
          network_chain_id: 80002,
          rpc_url: "https://rpc-amoy.polygon.technology",
          block_explorer_url: "https://amoy.polygonscan.com",
        })
        .select();

      if (insertError) {
        console.error("❌ Insert error:", insertError);
        throw insertError;
      }

      console.log("✅ New contract config created:", insertData[0]);
    } else {
      console.log("✅ Contract address updated:", updateData[0]);
    }

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from("smart_contract_config")
      .select("*")
      .eq("contract_name", "IWXToken");

    if (verifyError) {
      console.error("❌ Verification error:", verifyError);
      throw verifyError;
    }

    console.log("🔍 Current contract config:", verifyData[0]);
    console.log("🎉 Contract address update completed successfully!");
  } catch (error) {
    console.error("💥 Failed to update contract address:", error);
    process.exit(1);
  }
}

// Run the update
updateContractAddress();
