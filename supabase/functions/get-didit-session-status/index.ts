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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from JWT token
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get session ID from request body
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log("Looking up session in database:", sessionId);

    // First, look up the actual Didit session ID from our database
    const { data: sessionData, error: sessionError } = await supabaseClient
      .from("didit_kyc_sessions")
      .select("didit_session_id, status")
      .eq("user_id", user.id)
      .eq("id", sessionId)
      .single();

    if (sessionError || !sessionData) {
      console.error("Session lookup error:", sessionError);
      throw new Error("Session not found");
    }

    const diditSessionId = sessionData.didit_session_id;
    console.log("Found Didit session ID:", diditSessionId);

    // Get Didit API credentials from environment variables
    const DIDIT_API_KEY = Deno.env.get("DIDIT_API_KEY");
    const DIDIT_WORKFLOW_ID =
      Deno.env.get("DIDIT_WORKFLOW_ID") ||
      "b263e7e4-6a12-45e6-9065-a43631b4fc50";

    if (!DIDIT_API_KEY) {
      throw new Error("Didit API key not configured");
    }

    console.log("Calling Didit API for session:", diditSessionId);
    console.log("Using API key:", DIDIT_API_KEY ? "SET" : "NOT SET");

    // Call Didit API to retrieve session status using the correct endpoint
    const diditResponse = await fetch(
      `https://verification.didit.me/v2/session/${diditSessionId}/decision/`,
      {
        method: "GET",
        headers: {
          "X-API-Key": DIDIT_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!diditResponse.ok) {
      const errorText = await diditResponse.text();
      console.error("Didit API error:", diditResponse.status, errorText);
      throw new Error(`Didit API error: ${diditResponse.status}`);
    }

    const diditData = await diditResponse.json();
    console.log("Didit session data:", diditData);

    // Extract verification status from Didit response based on actual format
    let verificationStatus = "pending";
    let verificationData = null;

    // Check overall session status
    if (diditData.status === "Approved") {
      verificationStatus = "verified";
      verificationData = {
        verified: true,
        confidence: 100,
        verification_data: diditData,
        documents_verified: ["ID_VERIFICATION", "LIVENESS", "FACE_MATCH"],
        verified_at: new Date().toISOString(),
      };
    } else if (diditData.status === "Declined") {
      verificationStatus = "rejected";
      verificationData = {
        verified: false,
        confidence: 0,
        verification_data: diditData,
        documents_verified: [],
        verified_at: new Date().toISOString(),
      };
    } else if (diditData.status === "In Review") {
      verificationStatus = "pending";
    } else if (diditData.status === "Expired") {
      verificationStatus = "expired";
    } else if (diditData.status === "Failed") {
      verificationStatus = "failed";
    }

    // Also check individual feature statuses
    if (
      diditData.id_verification?.status === "Approved" &&
      diditData.liveness?.status === "Approved" &&
      diditData.face_match?.status === "Approved"
    ) {
      verificationStatus = "verified";
      verificationData = {
        verified: true,
        confidence: 100,
        verification_data: diditData,
        documents_verified: ["ID_VERIFICATION", "LIVENESS", "FACE_MATCH"],
        verified_at: new Date().toISOString(),
      };
    }

    // Update session status in our database
    const { error: updateError } = await supabaseClient
      .from("didit_kyc_sessions")
      .update({
        status: verificationStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating session status:", updateError);
    }

    // If verification is complete, save the result
    if (verificationData) {
      const { error: resultError } = await supabaseClient
        .from("didit_kyc_results")
        .upsert({
          session_id: sessionId, // Use our internal session ID, not Didit's
          user_id: user.id,
          verified: verificationData.verified,
          confidence: verificationData.confidence,
          verification_data: verificationData.verification_data,
          documents_verified: verificationData.documents_verified,
          verified_at: verificationData.verified_at,
        });

      if (resultError) {
        console.error("Error saving verification result:", resultError);
      }

      // Update user KYC status if verification is successful
      if (verificationStatus === "verified") {
        const { error: kycError } = await supabaseClient
          .from("user_kyc_status")
          .upsert({
            user_id: user.id,
            kyc_status: "verified",
            verification_provider: "didit",
            verified_at: verificationData.verified_at,
            expires_at: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(), // 1 year
            latest_session_id: sessionId,
            latest_result_id: sessionId, // Use consistent session ID reference
          });

        if (kycError) {
          console.error("Error updating user KYC status:", kycError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        session: {
          id: sessionId,
          status: verificationStatus,
          diditData: diditData,
          verificationData: verificationData,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in get-didit-session-status:", error);

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
