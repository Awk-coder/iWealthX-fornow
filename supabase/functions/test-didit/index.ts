import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log("=== TEST DIDIT FUNCTION START ===");

    // Didit API configuration
    const DIDIT_API_URL = "https://api.didit.me";
    const DIDIT_CLIENT_ID = "PWSG575O0XSQB62kJnydDw";
    const DIDIT_CLIENT_SECRET = "byfpU6XLydKEJRUT8KYQwVmJGh7Nl-x9H6mBnQz8aR0";

    console.log("Testing Didit configuration:", {
      apiUrl: DIDIT_API_URL,
      clientId: DIDIT_CLIENT_ID,
      clientSecret: DIDIT_CLIENT_SECRET ? "SET" : "NOT SET",
    });

    // Test 1: Basic connectivity
    console.log("Testing basic connectivity...");
    try {
      const testResponse = await fetch(`${DIDIT_API_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Health check status:", testResponse.status);
    } catch (error) {
      console.log("Health check failed:", error.message);
    }

    // Test 2: Authentication
    console.log("Testing authentication...");
    try {
      const authResponse = await fetch(`${DIDIT_API_URL}/auth/v2/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${DIDIT_CLIENT_ID}:${DIDIT_CLIENT_SECRET}`
          )}`,
        },
        body: "grant_type=client_credentials",
      });

      console.log("Auth response status:", authResponse.status);
      console.log(
        "Auth response headers:",
        Object.fromEntries(authResponse.headers.entries())
      );

      if (authResponse.ok) {
        const authData = await authResponse.json();
        console.log("Auth successful:", {
          hasAccessToken: !!authData.access_token,
          tokenType: authData.token_type,
          expiresIn: authData.expires_in,
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: "Didit authentication successful",
            hasAccessToken: !!authData.access_token,
            tokenType: authData.token_type,
            expiresIn: authData.expires_in,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } else {
        const errorText = await authResponse.text();
        console.error("Auth failed:", errorText);

        return new Response(
          JSON.stringify({
            success: false,
            error: `Authentication failed: ${authResponse.status} - ${errorText}`,
            status: authResponse.status,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }
    } catch (error) {
      console.error("Auth test failed:", error.message);

      return new Response(
        JSON.stringify({
          success: false,
          error: `Authentication test failed: ${error.message}`,
          fullError: error.toString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Test function error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
        fullError: error.toString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
