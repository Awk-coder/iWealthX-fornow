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

    // Log the request for debugging
    console.log("Webhook request method:", req.method);
    console.log(
      "Webhook request headers:",
      Object.fromEntries(req.headers.entries())
    );

    // Parse webhook payload
    const webhookPayload = await req.json();
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

    // Find the session in our database
    const { data: session, error: sessionError } = await supabaseClient
      .from("didit_kyc_sessions")
      .select("*")
      .eq("didit_session_id", session_id)
      .single();

    if (sessionError || !session) {
      throw new Error(`Session not found: ${session_id}`);
    }

    // Update session status
    const { error: updateError } = await supabaseClient
      .from("didit_kyc_sessions")
      .update({
        status: status || "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (updateError) {
      throw new Error(`Failed to update session: ${updateError.message}`);
    }

    // Process verification result
    const isVerified = verification_result?.verified || false;
    const verificationConfidence = confidence || 0;
    const riskScore = risk_assessment?.risk_score || 0;
    const amlStatus = aml_result?.status || "pending";

    // Store detailed results
    const { data: result, error: resultError } = await supabaseClient
      .from("didit_kyc_results")
      .insert({
        session_id: session.id,
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
      throw new Error(
        `Failed to store verification result: ${resultError.message}`
      );
    }

    // Update user KYC status
    let kycStatus = "unverified";
    if (isVerified && verificationConfidence >= 0.8 && amlStatus === "clear") {
      kycStatus = "verified";
    } else if (isVerified && verificationConfidence >= 0.6) {
      kycStatus = "pending"; // Manual review required
    } else {
      kycStatus = "rejected";
    }

    const { error: statusUpdateError } = await supabaseClient
      .from("user_kyc_status")
      .upsert({
        user_id: session.user_id,
        kyc_status: kycStatus,
        verification_provider: "didit",
        latest_session_id: session.id,
        latest_result_id: result.id,
        verified_at: kycStatus === "verified" ? new Date().toISOString() : null,
        expires_at:
          kycStatus === "verified"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null, // 1 year expiry
      });

    if (statusUpdateError) {
      console.error("Error updating user KYC status:", statusUpdateError);
    }

    // Send notification email (optional)
    if (kycStatus === "verified") {
      try {
        // You can integrate with email service here
        console.log(`KYC verified for user ${session.user_id}`);
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
      }
    }

    // Log the webhook processing
    console.log(
      `Processed webhook for session ${session_id}: status=${kycStatus}, confidence=${verificationConfidence}`
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
