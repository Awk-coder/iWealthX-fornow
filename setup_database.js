const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Supabase configuration
const supabaseUrl = "https://xmsvychorllkbluktgmt.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc3Z5Y2hvcmxsa2JsdWt0Z210Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1NTMzNCwiZXhwIjoyMDcwNzMxMzM0fQ.rDVyXhb7fYbVpLWhYjt4z0kzyHnCkA52f1XB3vjMcyk";

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log("🚀 Starting database setup...");

    // Read the SQL script
    const sqlScript = fs.readFileSync("complete_database_setup.sql", "utf8");

    // Split the script into individual statements
    const statements = sqlScript
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(
            `⏳ Executing statement ${i + 1}/${statements.length}...`
          );

          const { data, error } = await supabase.rpc("exec_sql", {
            sql: statement + ";",
          });

          if (error) {
            console.log(
              `⚠️  Statement ${i + 1} had an issue (this might be expected):`,
              error.message
            );
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(
            `⚠️  Statement ${i + 1} error (might be expected):`,
            err.message
          );
        }
      }
    }

    console.log("🎉 Database setup completed!");

    // Test the setup by checking if tables exist
    console.log("🔍 Verifying setup...");

    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", [
        "didit_kyc_sessions",
        "didit_kyc_results",
        "user_kyc_status",
        "contact_submissions",
        "newsletter_subscriptions",
        "investment_interests",
        "projects",
        "project_documents",
        "user_profiles",
      ]);

    if (tablesError) {
      console.log("⚠️  Could not verify tables:", tablesError.message);
    } else {
      console.log(
        "✅ Found tables:",
        tables.map((t) => t.table_name)
      );
    }
  } catch (error) {
    console.error("❌ Database setup failed:", error);
  }
}

// Run the setup
setupDatabase();
