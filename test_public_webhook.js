// Test the new public webhook function
const https = require("https");

const testPublicWebhook = () => {
  console.log("Testing new public webhook function...");

  const webhookUrl =
    "https://xmsvychorllkbluktgmt.functions.supabase.co/kyc-webhook-public";
  console.log("Webhook URL:", webhookUrl);

  // Simulate a Didit webhook payload
  const webhookPayload = {
    session_id: "test_session_789",
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

  const options = {
    hostname: "xmsvychorllkbluktgmt.functions.supabase.co",
    port: 443,
    path: "/kyc-webhook-public",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Didit-Webhook/1.0",
      "Content-Length": Buffer.byteLength(payloadString),
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
        console.log("✅ Public webhook is working!");
      } else if (res.statusCode === 401) {
        console.log("❌ Still getting 401 - auth issue persists");
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

testPublicWebhook();
