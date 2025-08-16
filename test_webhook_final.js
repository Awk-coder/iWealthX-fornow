// Test the final public webhook function
const https = require("https");

const testWebhook = () => {
  console.log("Testing final public webhook function...");

  const webhookUrl =
    "https://xmsvychorllkbluktgmt.functions.supabase.co/kyc-webhook-public";
  console.log("Webhook URL:", webhookUrl);

  // Simulate a real Didit webhook payload
  const payload = {
    session_id: "216eb428-cee2-4ff0-9173-c37920074706", // Use the actual session ID from your test
    status: "Approved",
    session_number: 1234,
    session_token: "test_token_123",
    url: "https://verify.didit.me/session/test_token_123",
    confidence: 95,
    documents_verified: ["ID_VERIFICATION", "LIVENESS", "FACE_MATCH"],
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
  console.log("Payload:", payload);

  const req = https.request(options, (res) => {
    console.log(`Response Status: ${res.statusCode}`);

    let responseData = "";
    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Response:", responseData);

      if (res.statusCode === 200) {
        console.log("✅ Webhook is working! This URL can be used in Didit");
        console.log("✅ Webhook URL for Didit:", webhookUrl);
      } else if (res.statusCode === 401) {
        console.log("❌ Still getting 401 - webhook not public");
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
