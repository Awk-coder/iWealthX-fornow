import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

  // No Authorization header needed - function is public
  console.log("🌐 Public webhook received (no auth required)!");

  try {
    console.log("🌐 Public webhook received!");
    console.log("Headers:", Object.fromEntries(req.headers.entries()));

    // Get the raw body
    const rawBody = await req.text();
    console.log("Raw body:", rawBody);

    // Try to parse as JSON
    let webhookPayload;
    try {
      webhookPayload = JSON.parse(rawBody);
      console.log("Parsed webhook payload:", webhookPayload);
    } catch (error) {
      console.log("Failed to parse JSON:", error.message);
      return new Response(
        JSON.stringify({
          message: "Invalid JSON payload",
          received: rawBody,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create Supabase client with service role (bypasses auth)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract session_id and status from webhook
    const { session_id, status, session_number, session_token, url } =
      webhookPayload;

    if (session_id) {
      console.log(
        `🌐 Processing webhook for session: ${session_id}, status: ${status}`
      );

      // Find the session in our database by Didit session ID
      const { data: session, error: sessionError } = await supabaseClient
        .from("didit_kyc_sessions")
        .select("*")
        .eq("didit_session_id", session_id)
        .single();

      if (sessionError || !session) {
        console.error(`🌐 Session not found: ${session_id}`);
        console.error("🌐 Session error:", sessionError);

        // Let's see what sessions exist
        const { data: allSessions, error: allSessionsError } =
          await supabaseClient
            .from("didit_kyc_sessions")
            .select("id, user_id, didit_session_id, status")
            .limit(10);

        console.log("🌐 All sessions in DB:", allSessions);
        console.log("🌐 All sessions error:", allSessionsError);

        return new Response(
          JSON.stringify({
            error: `Session not found: ${session_id}`,
            received_payload: webhookPayload,
            all_sessions: allSessions,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }

      console.log(`🌐 Found session in database: ${session.id}`);

      // Update session status with all available data
      const { error: updateError } = await supabaseClient
        .from("didit_kyc_sessions")
        .update({
          status: status || "completed",
          session_number: session_number,
          session_token: session_token,
          verification_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      if (updateError) {
        console.error("🌐 Error updating session:", updateError);
        return new Response(
          JSON.stringify({
            error: `Failed to update session: ${updateError.message}`,
            received_payload: webhookPayload,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      console.log(`🌐 Updated session status to: ${status}`);

      // Store webhook data for debugging
      const { error: logError } = await supabaseClient
        .from("didit_kyc_results")
        .insert({
          session_id: session.id,
          user_id: session.user_id,
          verified: status === "Approved",
          confidence: webhookPayload.confidence || 0,
          verification_data: webhookPayload,
          documents_verified: webhookPayload.documents_verified || [],
          verified_at: new Date().toISOString(),
        });

      if (logError) {
        console.error("🌐 Error storing webhook data:", logError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Webhook processed for session ${session_id}`,
          status: status,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      console.log("🌐 No session_id in webhook payload");
      return new Response(
        JSON.stringify({
          message: "Webhook received but no session_id found",
          received_payload: webhookPayload,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("🌐 Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
