import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sessionParam = url.searchParams.get("session");

    // Create demo verification page
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>iWealthX KYC Verification - Powered by Didit</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .container {
          max-width: 500px;
          width: 90%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .logo {
          background: linear-gradient(45deg, #D4AF37, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        
        .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #ffffff;
        }
        
        .subtitle {
          color: #b0b0b0;
          margin-bottom: 30px;
        }
        
        .status {
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          font-weight: 500;
        }
        
        .status.success {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }
        
        .progress {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          margin: 20px 0;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #D4AF37, #8B5CF6);
          transition: width 0.8s ease;
          border-radius: 6px;
        }
        
        .step {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin: 15px 0;
          padding: 15px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          opacity: 0;
          animation: slideIn 0.5s ease forwards;
        }
        
        .step-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4ade80;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          color: #000;
          font-weight: bold;
          font-size: 14px;
        }
        
        .step-text {
          color: #e0e0e0;
          font-weight: 500;
        }
        
        .button {
          background: linear-gradient(45deg, #D4AF37, #8B5CF6);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: transform 0.2s ease;
          margin: 20px 10px;
        }
        
        .button:hover {
          transform: translateY(-2px);
        }
        
        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 30px 0;
        }
        
        .feature {
          background: rgba(255, 255, 255, 0.03);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .feature-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .feature-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 5px;
          color: #D4AF37;
        }
        
        .feature-desc {
          font-size: 12px;
          color: #b0b0b0;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid #D4AF37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🔐 Didit × iWealthX</div>
        <h1 class="title">Identity Verification</h1>
        <p class="subtitle">Secure, fast, and Shariah-compliant KYC verification</p>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">⚡</div>
            <div class="feature-title">30-Second Process</div>
            <div class="feature-desc">Lightning fast verification</div>
          </div>
          <div class="feature">
            <div class="feature-icon">🛡️</div>
            <div class="feature-title">Bank-Level Security</div>
            <div class="feature-desc">Advanced encryption</div>
          </div>
          <div class="feature">
            <div class="feature-icon">🌙</div>
            <div class="feature-title">Shariah Compliant</div>
            <div class="feature-desc">Islamic finance approved</div>
          </div>
          <div class="feature">
            <div class="feature-icon">🌍</div>
            <div class="feature-title">Global Support</div>
            <div class="feature-desc">220+ countries</div>
          </div>
        </div>
        
        <div class="status" id="status">
          Ready to start verification process
        </div>
        
        <div class="progress">
          <div class="progress-bar" id="progressBar" style="width: 0%"></div>
        </div>
        
        <div id="steps"></div>
        
        <button class="button" onclick="startVerification()" id="startBtn">
          Start Verification
        </button>
      </div>
      
      <script>
        let progress = 0;
        let currentStep = 0;
        
        const steps = [
          { text: "Document Analysis", icon: "📄" },
          { text: "Liveness Detection", icon: "👁️" },
          { text: "Face Matching", icon: "🔍" },
          { text: "AML Screening", icon: "🛡️" },
          { text: "Verification Complete", icon: "✅" }
        ];
        
        function startVerification() {
          document.getElementById('startBtn').style.display = 'none';
          document.getElementById('status').innerHTML = '<div class="spinner"></div>Processing your verification...';
          simulateVerification();
        }
        
        function simulateVerification() {
          const interval = setInterval(() => {
            progress += 20;
            document.getElementById('progressBar').style.width = progress + '%';
            
            if (currentStep < steps.length) {
              const stepDiv = document.createElement('div');
              stepDiv.className = 'step';
              stepDiv.style.animationDelay = (currentStep * 0.2) + 's';
              stepDiv.innerHTML = \`
                <div class="step-icon">\${steps[currentStep].icon}</div>
                <div class="step-text">\${steps[currentStep].text}</div>
              \`;
              document.getElementById('steps').appendChild(stepDiv);
              currentStep++;
            }
            
            if (progress >= 100) {
              clearInterval(interval);
              document.getElementById('status').className = 'status success';
              document.getElementById('status').innerHTML = '✅ Verification completed successfully!';
              
              // Simulate webhook call to complete the process
              setTimeout(async () => {
                try {
                  // For demo purposes, we'll just simulate completion
                  // without making actual API calls that require authorization
                  console.log('Demo verification completed for session:', '${sessionParam}');
                  
                  // Store completion in localStorage for demo purposes
                  if (window.opener) {
                    // Get the allowed origin from the referrer or use default
                    const allowedOrigin = document.referrer ? new URL(document.referrer).origin : window.location.origin;
                    
                    window.opener.postMessage({
                      type: 'KYC_VERIFICATION_COMPLETE',
                      success: true,
                      verified: true,
                      sessionId: '${sessionParam}'
                    }, allowedOrigin);
                  }
                } catch (error) {
                  console.log('Demo completion failed:', error);
                }
                
                // Close window after a short delay
                setTimeout(() => {
                  window.close();
                }, 2000);
              }, 1000);
            }
          }, 1200);
        }
      </script>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in demo-kyc-verification:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
