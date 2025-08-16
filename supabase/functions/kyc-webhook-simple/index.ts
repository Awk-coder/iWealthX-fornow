import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Webhook signature validation utility
async function validateWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!signature || !secret) {
    return false;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(body)
  );
  const expectedHex = Array.from(new Uint8Array(expectedSignature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Remove 'sha256=' prefix if present
  const receivedSignature = signature.replace(/^sha256=/, "");

  return expectedHex === receivedSignature;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  // Bypass Supabase auth check for webhooks
  // This is a workaround for the 401 issue
  const authHeader = req.headers.get("Authorization");
  const apiKeyHeader = req.headers.get("apikey");

  if (!authHeader && !apiKeyHeader) {
    console.log("No auth headers - treating as webhook request");
    // Continue processing as webhook
  }

  try {
    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get webhook secret for signature validation
    const webhookSecret = Deno.env.get("DIDIT_WEBHOOK_SECRET");

    // Log the request for debugging
    console.log("Webhook request method:", req.method);
    console.log(
      "Webhook request headers:",
      Object.fromEntries(req.headers.entries())
    );

    // Get the raw body for signature validation
    const rawBody = await req.text();

    // Check if this is a test request (no signature)
    const isTestRequest =
      !req.headers.get("x-didit-signature") && !req.headers.get("x-signature");

    if (isTestRequest) {
      console.log("Test webhook request received");
      return new Response(
        JSON.stringify({
          message: "Webhook endpoint is working! This is a test response.",
          timestamp: new Date().toISOString(),
          body: rawBody,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Validate webhook signature if secret is configured
    if (webhookSecret) {
      const signature =
        req.headers.get("x-didit-signature") || req.headers.get("x-signature");

      if (!signature) {
        console.error("Missing webhook signature");
        return new Response(JSON.stringify({ error: "Missing signature" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      const isValidSignature = await validateWebhookSignature(
        rawBody,
        signature,
        webhookSecret
      );

      if (!isValidSignature) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      console.log("Webhook signature validated successfully");
    } else {
      console.warn(
        "Webhook secret not configured - signature validation skipped"
      );
    }

    // Parse webhook payload
    const webhookPayload = JSON.parse(rawBody);
    console.log(
      "Received Didit webhook:",
      JSON.stringify(webhookPayload, null, 2)
    );

    // Extract key information from webhook
    const {
      session_id,
      status,
      verification_result,
      confidence,
      extracted_data,
      documents_verified,
      risk_assessment,
      aml_result,
    } = webhookPayload;

    if (!session_id) {
      throw new Error("Missing session_id in webhook payload");
    }

    console.log(
      `Processing webhook for session: ${session_id}, status: ${status}`
    );

    // Find the session in our database
    const { data: session, error: sessionError } = await supabaseClient
      .from("didit_kyc_sessions")
      .select("*")
      .eq("didit_session_id", session_id)
      .single();

    if (sessionError || !session) {
      console.error(`Session not found: ${session_id}`);
      throw new Error(`Session not found: ${session_id}`);
    }

    console.log(`Found session in database: ${session.id}`);

    // Update session status
    const { error: updateError } = await supabaseClient
      .from("didit_kyc_sessions")
      .update({
        status: status || "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (updateError) {
      console.error("Error updating session:", updateError);
      throw new Error(`Failed to update session: ${updateError.message}`);
    }

    console.log(`Updated session status to: ${status}`);

    // Process verification result
    const isVerified = verification_result?.verified || false;
    const verificationConfidence = confidence || 0;
    const riskScore = risk_assessment?.risk_score || 0;
    const amlStatus = aml_result?.status || "pending";

    console.log(
      `Verification result: verified=${isVerified}, confidence=${verificationConfidence}`
    );

    // Store detailed results
    const { data: result, error: resultError } = await supabaseClient
      .from("didit_kyc_results")
      .insert({
        session_id: session.id, // Use our internal session ID for consistency
        user_id: session.user_id,
        verified: isVerified,
        confidence: verificationConfidence,
        verification_data: extracted_data || {},
        documents_verified: documents_verified || [],
        risk_score: riskScore,
        aml_status: amlStatus,
        raw_response: webhookPayload,
        verified_at: isVerified ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (resultError) {
      console.error("Error storing verification result:", resultError);
      throw new Error(
        `Failed to store verification result: ${resultError.message}`
      );
    }

    console.log(`Stored verification result: ${result.id}`);

    // Update user KYC status
    let kycStatus = "unverified";
    if (isVerified && verificationConfidence >= 0.8 && amlStatus === "clear") {
      kycStatus = "verified";
    } else if (isVerified && verificationConfidence >= 0.6) {
      kycStatus = "pending"; // Manual review required
    } else {
      kycStatus = "rejected";
    }

    console.log(`Determined KYC status: ${kycStatus}`);

    const { error: statusUpdateError } = await supabaseClient
      .from("user_kyc_status")
      .upsert({
        user_id: session.user_id,
        kyc_status: kycStatus,
        verification_provider: "didit",
        latest_session_id: session.id,
        latest_result_id: result.id, // Use the actual result ID from the insert
        verified_at: kycStatus === "verified" ? new Date().toISOString() : null,
        expires_at:
          kycStatus === "verified"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null, // 1 year expiry
      });

    if (statusUpdateError) {
      console.error("Error updating user KYC status:", statusUpdateError);
    } else {
      console.log(`Updated user KYC status to: ${kycStatus}`);
    }

    // Log the webhook processing
    console.log(
      `Successfully processed webhook for session ${session_id}: status=${kycStatus}, confidence=${verificationConfidence}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
        session_id: session_id,
        kyc_status: kycStatus,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing Didit webhook:", error);

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
