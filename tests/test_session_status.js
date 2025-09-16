// Test the fixed get-didit-session-status function
const https = require("https");

const testSessionStatus = () => {
  console.log("Testing get-didit-session-status function...");

  const testPayload = {
    sessionId: "test_session_123",
    demoSession: true,
  };

  const payloadString = JSON.stringify(testPayload);

  const options = {
    hostname: "xmsvychorllkbluktgmt.functions.supabase.co",
    port: 443,
    path: "/get-didit-session-status",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc3Z5Y2hvcmxsa2JsdWt0Z210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTUzMzQsImV4cCI6MjA3MDczMTMzNH0.Bprz4_EfVOE5U783Xe_SWWrASdcLtwe8jIbOEtX3Ffg",
      apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc3Z5Y2hvcmxsa2JsdWt0Z210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTUzMzQsImV4cCI6MjA3MDczMTMzNH0.Bprz4_EfVOE5U783Xe_SWWrASdcLtwe8jIbOEtX3Ffg",
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
        console.log("✅ Session status check successful!");
        try {
          const data = JSON.parse(responseData);
          console.log("Session data:", data);
        } catch (e) {
          console.log("Could not parse response as JSON");
        }
      } else {
        console.log(
          `❌ Session status check failed with status ${res.statusCode}`
        );
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request error:", error.message);
  });

  req.write(payloadString);
  req.end();
};

testSessionStatus();
