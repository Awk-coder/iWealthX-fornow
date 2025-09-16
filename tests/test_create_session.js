// Test create-kyc-session function with demo mode
const https = require("https");

const testCreateSession = () => {
  console.log("Testing create-kyc-session function with demo mode...");

  const testPayload = {
    userId: "demo_user_123",
    email: "demo@example.com",
  };

  const payloadString = JSON.stringify(testPayload);

  const options = {
    hostname: "xmsvychorllkbluktgmt.functions.supabase.co",
    port: 443,
    path: "/create-kyc-session",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
        console.log("✅ Session created successfully!");
        try {
          const data = JSON.parse(responseData);
          console.log("Session ID:", data.sessionId);
          console.log("Verification URL:", data.verificationUrl);
          console.log("Didit Session ID:", data.diditSessionId);
        } catch (e) {
          console.log("Could not parse response as JSON");
        }
      } else {
        console.log(`❌ Session creation failed with status ${res.statusCode}`);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request error:", error.message);
  });

  req.write(payloadString);
  req.end();
};

testCreateSession();
