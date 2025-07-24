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
    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse demo completion payload
    const { session, verified, confidence } = await req.json();

    console.log("Demo verification completion:", {
      session,
      verified,
      confidence,
    });

    // For demo purposes, we'll find sessions that start with "demo_"
    // and mark them as completed in the database
    if (session && session.toString().startsWith("demo_")) {
      // This would typically be handled by the actual Didit webhook
      // For demo, we'll create a mock successful result

      const mockWebhookPayload = {
        session_id: `demo_${session}`,
        status: "completed",
        verification_result: {
          verified: verified !== false, // Default to true unless explicitly false
        },
        confidence: confidence || 0.95,
        extracted_data: {
          firstName: "Demo",
          lastName: "User",
          dateOfBirth: "1990-01-01",
          nationality: "Malaysian",
          documentNumber: "DEMO123456789",
        },
        documents_verified: ["passport", "selfie"],
        risk_assessment: {
          risk_score: 0.1,
        },
        aml_result: {
          status: "clear",
        },
      };

      // Try to process through our webhook handler
      try {
        const { data: webhookResult, error: webhookError } =
          await supabaseClient.functions.invoke("kyc-webhook", {
            body: mockWebhookPayload,
          });

        console.log("Webhook processing result:", {
          webhookResult,
          webhookError,
        });
      } catch (webhookError) {
        console.log(
          "Webhook processing failed (expected in demo):",
          webhookError
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Demo verification completed",
        session: session,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in complete-demo-verification:", error);

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
