// Test webhook functionality
const https = require("https");

const testWebhook = () => {
  const data = JSON.stringify({
    test: "webhook",
    timestamp: new Date().toISOString(),
  });

  const options = {
    hostname: "xmsvychorllkbluktgmt.functions.supabase.co",
    port: 443,
    path: "/kyc-webhook-simple",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let responseData = "";
    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Response:", responseData);
    });
  });

  req.on("error", (error) => {
    console.error("Error:", error);
  });

  req.write(data);
  req.end();
};

testWebhook();
