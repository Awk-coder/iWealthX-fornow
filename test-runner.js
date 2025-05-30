#!/usr/bin/env node

/**
 * iWealthX Test Runner
 *
 * This script provides various testing options for the Supabase integration
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader() {
  console.log(colorize("\n🧪 iWealthX Supabase Testing Suite", "cyan"));
  console.log(colorize("=====================================", "cyan"));
}

function printUsage() {
  console.log(colorize("\nUsage:", "bright"));
  console.log("  node test-runner.js [option]");
  console.log("\nOptions:");
  console.log(colorize("  unit", "green") + "        Run unit tests only");
  console.log(
    colorize("  integration", "green") +
      "  Run integration tests (requires test DB)"
  );
  console.log(colorize("  all", "green") + "         Run all tests");
  console.log(
    colorize("  coverage", "green") + "     Run tests with coverage report"
  );
  console.log(colorize("  watch", "green") + "       Run tests in watch mode");
  console.log(
    colorize("  manual", "green") + "      Show manual testing instructions"
  );
  console.log(colorize("  setup", "green") + "       Show setup instructions");
  console.log(colorize("  help", "green") + "        Show this help message");
}

function runCommand(command, description) {
  console.log(colorize(`\n🚀 ${description}...`, "blue"));
  try {
    execSync(command, { stdio: "inherit" });
    console.log(colorize(`✅ ${description} completed successfully!`, "green"));
  } catch (error) {
    console.error(colorize(`❌ ${description} failed!`, "red"));
    process.exit(1);
  }
}

function showManualTestingInstructions() {
  console.log(colorize("\n📋 Manual Testing Instructions", "yellow"));
  console.log(colorize("================================", "yellow"));
  console.log("\n1. Start the development server:");
  console.log(colorize("   npm start", "cyan"));
  console.log("\n2. Open the manual testing script:");
  console.log(colorize("   manual-testing-script.md", "cyan"));
  console.log("\n3. Follow the step-by-step instructions to test:");
  console.log("   • KYC Flow (complete journey)");
  console.log("   • Contact Form submission");
  console.log("   • Newsletter subscription");
  console.log("   • Investment interest tracking");
  console.log("   • Error handling scenarios");
  console.log("\n4. Verify data in Supabase dashboard after each test");
  console.log(
    "\n" +
      colorize("⚠️  Important:", "red") +
      " Make sure you're using a test database!"
  );
}

function showSetupInstructions() {
  console.log(colorize("\n⚙️  Setup Instructions", "yellow"));
  console.log(colorize("====================", "yellow"));
  console.log("\n1. Database Setup:");
  console.log("   • Go to your Supabase project dashboard");
  console.log("   • Navigate to SQL Editor");
  console.log("   • Run the contents of database-schema.sql");
  console.log("\n2. Environment Variables:");
  console.log(
    "   • Supabase URL and keys are already configured in src/lib/supabase.js"
  );
  console.log("   • For integration tests, set: SUPABASE_TEST_MODE=true");
  console.log("\n3. Install Dependencies:");
  console.log(colorize("   npm install", "cyan"));
  console.log("\n4. Run Tests:");
  console.log(colorize("   node test-runner.js unit", "cyan"));
  console.log("\nFor detailed setup, see: README-DATABASE-SETUP.md");
}

function checkTestFiles() {
  const testFiles = [
    "src/tests/supabase.test.js",
    "src/tests/KYCFlow.test.jsx",
    "src/tests/Contact.test.jsx",
    "src/tests/integration.test.js",
  ];

  const missingFiles = testFiles.filter((file) => !fs.existsSync(file));

  if (missingFiles.length > 0) {
    console.log(colorize("\n⚠️  Missing test files:", "yellow"));
    missingFiles.forEach((file) => console.log(`   ${file}`));
    console.log("\nPlease ensure all test files are created.");
    return false;
  }

  return true;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  printHeader();

  if (!checkTestFiles() && command !== "help" && command !== "setup") {
    process.exit(1);
  }

  switch (command) {
    case "unit":
      runCommand(
        "npm test -- --testPathIgnorePatterns=integration.test.js --watchAll=false",
        "Running unit tests"
      );
      break;

    case "integration":
      console.log(colorize("\n⚠️  Integration Test Warning:", "red"));
      console.log(
        "These tests will run against your actual Supabase database."
      );
      console.log("Make sure you are using a TEST database, not production!");
      console.log(
        "\nTo enable integration tests, set: SUPABASE_TEST_MODE=true"
      );
      runCommand(
        'SUPABASE_TEST_MODE=true npm test -- --testNamePattern="Integration" --watchAll=false',
        "Running integration tests"
      );
      break;

    case "all":
      runCommand("npm test -- --watchAll=false", "Running all tests");
      break;

    case "coverage":
      runCommand(
        "npm test -- --coverage --watchAll=false",
        "Running tests with coverage"
      );
      break;

    case "watch":
      runCommand("npm test", "Running tests in watch mode");
      break;

    case "manual":
      showManualTestingInstructions();
      break;

    case "setup":
      showSetupInstructions();
      break;

    case "help":
    default:
      printUsage();
      break;
  }
}

// Run the script
main();
