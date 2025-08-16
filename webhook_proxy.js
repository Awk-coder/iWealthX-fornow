// Simple webhook proxy server
const express = require("express");
const https = require("https");
const app = express();
const PORT = 3001;

app.use(express.json());

// Webhook proxy endpoint
app.post("/webhook-proxy", async (req, res) => {
  console.log("🌐 Webhook proxy received:", req.body);

  try {
    // Forward to Supabase with auth headers
    const supabaseUrl =
      "https://xmsvychorllkbluktgmt.functions.supabase.co/kyc-webhook-public";

    const options = {
      hostname: "xmsvychorllkbluktgmt.functions.supabase.co",
      port: 443,
      path: "/kyc-webhook-public",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc3Z5Y2hvcmxsa2JsdWt0Z210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTUzMzQsImV4cCI6MjA3MDczMTMzNH0.Bprz4_EfVOE5U783Xe_SWWrASdcLtwe8jIbOEtX3Ffg",
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc3Z5Y2hvcmxsa2JsdWt0Z210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTUzMzQsImV4cCI6MjA3MDczMTMzNH0.Bprz4_EfVOE5U783Xe_SWWrASdcLtwe8jIbOEtX3Ffg",
        "Content-Length": Buffer.byteLength(JSON.stringify(req.body)),
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let responseData = "";
      proxyRes.on("data", (chunk) => {
        responseData += chunk;
      });

      proxyRes.on("end", () => {
        console.log("🌐 Supabase response:", proxyRes.statusCode, responseData);
        res.status(proxyRes.statusCode).json({
          success: proxyRes.statusCode === 200,
          message: "Webhook forwarded to Supabase",
          supabaseResponse: responseData,
        });
      });
    });

    proxyReq.on("error", (error) => {
      console.error("🌐 Proxy error:", error);
      res.status(500).json({ error: error.message });
    });

    proxyReq.write(JSON.stringify(req.body));
    proxyReq.end();
  } catch (error) {
    console.error("🌐 Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Webhook proxy running on http://localhost:${PORT}`);
  console.log(
    `🌐 Webhook URL for Didit: http://localhost:${PORT}/webhook-proxy`
  );
  console.log(`🌐 Or use ngrok: ngrok http ${PORT}`);
});

module.exports = app;
