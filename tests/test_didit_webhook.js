// Test Didit webhook with proper headers
const https = require("https");
const crypto = require("crypto");

const testDiditWebhook = () => {
  console.log("Testing Didit webhook with proper headers...");

  // Simulate a real Didit webhook payload
  const webhookPayload = {
    session_id: "test_session_123",
    status: "Declined",
    verification_result: {
      verified: false,
      confidence: 0,
    },
    confidence: 0,
    extracted_data: {},
    documents_verified: [],
    risk_assessment: {
      risk_score: 100,
    },
    aml_result: {
      status: "failed",
    },
    timestamp: new Date().toISOString(),
  };

  const payloadString = JSON.stringify(webhookPayload);

  // Get webhook secret from environment (you'll need to set this)
  const webhookSecret = process.env.DIDIT_WEBHOOK_SECRET || "test_secret";

  // Generate HMAC signature like Didit would
  const signature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payloadString)
    .digest("hex");

  console.log("Generated signature:", signature);
  console.log("Webhook secret used:", webhookSecret ? "SET" : "NOT SET");

  const options = {
    hostname: "xmsvychorllkbluktgmt.functions.supabase.co",
    port: 443,
    path: "/kyc-webhook-simple",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-didit-signature": signature,
      "User-Agent": "Didit-Webhook/1.0",
      "Content-Length": Buffer.byteLength(payloadString),
    },
  };

  console.log("Request headers:", options.headers);

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
        console.log("✅ Webhook processed successfully!");
      } else if (res.statusCode === 401) {
        console.log("❌ Still getting 401 - signature validation issue");
      } else {
        console.log(`⚠️  Webhook returned status ${res.statusCode}`);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request error:", error.message);
  });

  req.write(payloadString);
  req.end();
};

// Also test without signature to see if that works
const testWithoutSignature = () => {
  console.log("\n--- Testing without signature ---");

  const payload = JSON.stringify({
    session_id: "test_session_456",
    status: "Approved",
    test: true,
  });

  const options = {
    hostname: "xmsvychorllkbluktgmt.functions.supabase.co",
    port: 443,
    path: "/kyc-webhook-simple",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let responseData = "";
    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Response:", responseData);
    });
  });

  req.on("error", (error) => {
    console.error("Error:", error.message);
  });

  req.write(payload);
  req.end();
};

testDiditWebhook();
setTimeout(testWithoutSignature, 2000); // Test without signature after 2 seconds
