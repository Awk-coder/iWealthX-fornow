const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://xmsvychorllkbluktgmt.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc3Z5Y2hvcmxsa2JsdWt0Z210Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1NTMzNCwiZXhwIjoyMDcwNzMxMzM0fQ.rDVyXhb7fYbVpLWhYjt4z0kzyHnCkA52f1XB3vjMcyk";

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log("🔍 Testing Supabase connection...");

    // Test 1: Try to create a simple table to test connection
    console.log("⏳ Testing database access...");

    const { data, error } = await supabase.rpc("exec_sql", {
      sql: "SELECT current_timestamp;",
    });

    if (error) {
      console.log("❌ Database access failed:", error.message);
      return;
    }

    console.log("✅ Database connection successful!");
    console.log("📅 Current timestamp:", data);

    // Test 2: Check if KYC tables exist
    console.log("🔍 Checking for KYC tables...");

    const { data: tables, error: tablesError } = await supabase.rpc(
      "exec_sql",
      {
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('didit_kyc_sessions', 'didit_kyc_results', 'user_kyc_status');
        `,
      }
    );

    if (tablesError) {
      console.log("⚠️  Could not check tables:", tablesError.message);
    } else {
      console.log("📋 Existing KYC tables:", tables);

      if (tables && tables.length === 3) {
        console.log("✅ All KYC tables exist!");
      } else {
        console.log(
          "⚠️  Some KYC tables are missing. You need to run the SQL script."
        );
        console.log(
          "📝 Please run the kyc_tables.sql script in your Supabase SQL Editor"
        );
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testConnection();
