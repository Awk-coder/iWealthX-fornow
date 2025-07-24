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
    console.log("=== SIMPLE DIDIT TEST START ===");

    // Didit API configuration
    const DIDIT_API_URL = "https://verification.didit.me";
    const DIDIT_API_KEY = "byfpU6XLydKEJRUT8KYQwVmJGh7Nl-x9H6mBnQz8aR0";
    const DIDIT_WORKFLOW_ID = "b263e7e4-6a12-45e6-9065-a43631b4fc50";

    console.log("Testing with:", {
      apiUrl: DIDIT_API_URL,
      apiKey: DIDIT_API_KEY,
      workflowId: DIDIT_WORKFLOW_ID,
    });

    const sessionBody = {
      workflow_id: DIDIT_WORKFLOW_ID,
      callback: "https://example.com/callback",
    };

    console.log("Request body:", JSON.stringify(sessionBody, null, 2));

    const sessionResponse = await fetch(`${DIDIT_API_URL}/v2/session/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": DIDIT_API_KEY,
      },
      body: JSON.stringify(sessionBody),
    });

    console.log("Response status:", sessionResponse.status);
    console.log(
      "Response headers:",
      Object.fromEntries(sessionResponse.headers.entries())
    );

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text();
      console.error("Error response:", errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: `API call failed: ${sessionResponse.status} - ${errorText}`,
          status: sessionResponse.status,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const sessionData = await sessionResponse.json();
    console.log("Success response:", JSON.stringify(sessionData, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        data: sessionData,
        verificationUrl: `https://verification.didit.me/v2/session/${sessionData.session_id}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
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
        status: 200,
      }
    );
  }
});
