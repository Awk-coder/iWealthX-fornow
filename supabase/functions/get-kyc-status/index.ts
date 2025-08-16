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
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header:", authHeader);

    let user = null;
    let isDemoUser = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.replace("Bearer ", "");
        console.log("Token extracted:", token.substring(0, 20) + "...");

        const {
          data: { user: authUser },
          error: authError,
        } = await supabaseClient.auth.getUser(token);

        console.log("Auth result:", { user: authUser?.id, error: authError });

        if (!authError && authUser) {
          user = authUser;
          console.log("User authenticated:", user.id);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    }

    // If no user found, check if this is a demo request
    if (!user) {
      console.log("No authenticated user, checking for demo session...");

      // Check request body for demo session info
      try {
        const body = await req.json();
        console.log("Request body:", body);

        if (body.demoSession === true) {
          isDemoUser = true;
          user = {
            id: "demo_user",
            email: "demo@example.com",
          };
          console.log("Demo user set:", user.id);
        }
      } catch (error) {
        console.error("Error parsing request body:", error);
      }
    }

    if (!user) {
      console.log(
        "No authenticated user or demo session. Returning unverified."
      );
      return new Response(
        JSON.stringify({
          success: true,
          kycStatus: {
            status: "unverified",
            provider: null,
            verifiedAt: null,
            expiresAt: null,
            latestSession: null,
            latestResult: null,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get session ID from URL params if provided
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    if (sessionId) {
      // Get specific session status
      const { data: session, error: sessionError } = await supabaseClient
        .from("didit_kyc_sessions")
        .select(
          `
          *,
          didit_kyc_results (*)
        `
        )
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

      if (sessionError || !session) {
        throw new Error("Session not found");
      }

      return new Response(
        JSON.stringify({
          success: true,
          session: {
            id: session.id,
            diditSessionId: session.didit_session_id,
            status: session.status,
            createdAt: session.created_at,
            expiresAt: session.expires_at,
            result: session.didit_kyc_results?.[0] || null,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      // Get overall user KYC status
      const { data: kycStatus, error: statusError } = await supabaseClient
        .from("user_kyc_status")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (statusError && statusError.code !== "PGRST116") {
        throw new Error(`Database error: ${statusError.message}`);
      }

      // If no KYC status found, user is unverified
      if (!kycStatus) {
        return new Response(
          JSON.stringify({
            success: true,
            kycStatus: {
              status: "unverified",
              provider: null,
              verifiedAt: null,
              expiresAt: null,
              latestSession: null,
              latestResult: null,
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          kycStatus: {
            status: kycStatus.kyc_status,
            provider: kycStatus.verification_provider,
            verifiedAt: kycStatus.verified_at,
            expiresAt: kycStatus.expires_at,
            latestSession: null,
            latestResult: null,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error in get-kyc-status:", error);

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
