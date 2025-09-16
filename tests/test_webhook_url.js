// Test webhook URL accessibility
const https = require("https");

const testWebhookURL = () => {
  console.log("Testing webhook URL accessibility...");

  // Test the exact URL that Didit should use
  const webhookUrl =
    "https://xmsvychorllkbluktgmt.functions.supabase.co/kyc-webhook-simple";
  console.log("Webhook URL:", webhookUrl);

  const url = new URL(webhookUrl);

  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Didit-Webhook-Test/1.0",
    },
  };

  console.log("Request options:", {
    hostname: options.hostname,
    path: options.path,
    method: options.method,
  });

  const req = https.request(options, (res) => {
    console.log(`\nResponse Status: ${res.statusCode}`);
    console.log("Response Headers:", res.headers);

    let responseData = "";
    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("\nResponse Body:", responseData);

      if (res.statusCode === 200) {
        console.log("✅ Webhook endpoint is accessible!");
      } else if (res.statusCode === 401) {
        console.log(
          "❌ Webhook requires authorization - this might be an issue for Didit"
        );
      } else {
        console.log(`⚠️  Webhook returned status ${res.statusCode}`);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request error:", error.message);
  });

  // Send a simple test payload
  const testPayload = JSON.stringify({
    test: "webhook",
    session_id: "test_session_123",
    status: "test",
    timestamp: new Date().toISOString(),
  });

  req.write(testPayload);
  req.end();
};

testWebhookURL();
