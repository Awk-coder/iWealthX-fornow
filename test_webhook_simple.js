// Simple test to verify webhook endpoint
const https = require("https");

const testWebhook = () => {
  console.log("Testing webhook endpoint accessibility...");

  const webhookUrl =
    "https://xmsvychorllkbluktgmt.functions.supabase.co/kyc-webhook-public";
  console.log("Webhook URL:", webhookUrl);

  // Simulate a Didit webhook payload
  const payload = {
    session_id: "test_session_123",
    status: "Not Started",
    session_number: 1234,
    session_token: "test_token",
    url: "https://verify.didit.me/session/test_token",
  };

  const payloadString = JSON.stringify(payload);

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

  console.log("Sending test webhook...");

  const req = https.request(options, (res) => {
    console.log(`Response Status: ${res.statusCode}`);

    let responseData = "";
    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Response:", responseData);

      if (res.statusCode === 200) {
        console.log("✅ Webhook endpoint is working!");
        console.log("✅ This URL can be used in Didit webhook configuration");
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

testWebhook();
