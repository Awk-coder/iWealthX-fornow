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
    console.log("=== CREATE KYC SESSION START ===");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Supabase client created successfully");

    // Parse request body first
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed:", JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      throw new Error(`Invalid request body: ${parseError.message}`);
    }

    const { redirectUrl, userInfo } = requestBody;

    console.log("Extracted data:", { redirectUrl, userInfo });

    // Get user from JWT token or use demo user
    let user = null;
    let isDemoUser = false;

    try {
      const authHeader = req.headers.get("Authorization");
      console.log("Auth header present:", !!authHeader);

      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        console.log("Processing auth token...");

        const {
          data: { user: authUser },
          error: authError,
        } = await supabaseClient.auth.getUser(token);

        if (!authError && authUser) {
          user = authUser;
          console.log("Authenticated user found:", user.id);
        } else {
          console.log("Auth error:", authError);
        }
      }
    } catch (error) {
      console.log("Auth token error, checking for demo user:", error.message);
    }

    // If no authenticated user, check for demo user info
    if (!user && userInfo?.userId && userInfo?.email) {
      isDemoUser = true;
      user = {
        id: userInfo.userId,
        email: userInfo.email,
      };
      console.log("Using demo user for KYC session:", user.id);
    }

    if (!user) {
      console.error("No valid user found");
      throw new Error("Unauthorized - No valid user session");
    }

    console.log("User validated:", { userId: user.id, isDemoUser });

    // Didit API configuration (based on official documentation)
    const DIDIT_API_URL = "https://verification.didit.me";
    const DIDIT_API_KEY = Deno.env.get("DIDIT_API_KEY");
    const DIDIT_WORKFLOW_ID =
      Deno.env.get("DIDIT_WORKFLOW_ID") ||
      "b263e7e4-6a12-45e6-9065-a43631b4fc50";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

    console.log("Didit configuration:", {
      apiUrl: DIDIT_API_URL,
      apiKey: DIDIT_API_KEY ? "SET" : "NOT SET",
      workflowId: DIDIT_WORKFLOW_ID,
      hasUser: !!user,
      isDemoUser,
      userId: user?.id,
    });

    if (!DIDIT_API_KEY) {
      console.error("Missing Didit API key");
      throw new Error("Didit API key not configured");
    }

    if (!SUPABASE_URL) {
      console.error("Missing Supabase URL");
      throw new Error("Supabase URL not configured");
    }

    // Step 1: Create verification session directly with API key (no OAuth needed)
    let sessionData;
    let isRealDiditSession = false;
    let diditError = null;

    try {
      console.log("=== DIDIT SESSION CREATION START ===");
      console.log("Session URL:", `${DIDIT_API_URL}/v2/session/`);
      console.log("API Key:", DIDIT_API_KEY);
      console.log("Workflow ID:", DIDIT_WORKFLOW_ID);

      const sessionBody = {
        workflow_id: DIDIT_WORKFLOW_ID,
        callback: `${SUPABASE_URL}/functions/v1/kyc-webhook-simple`,
      };

      console.log(
        "Session request body:",
        JSON.stringify(sessionBody, null, 2)
      );

      const sessionResponse = await fetch(`${DIDIT_API_URL}/v2/session/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": DIDIT_API_KEY,
        },
        body: JSON.stringify(sessionBody),
      });

      console.log("Session response status:", sessionResponse.status);
      console.log(
        "Session response headers:",
        Object.fromEntries(sessionResponse.headers.entries())
      );

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        console.error("Didit session creation error:", errorText);
        diditError = `Didit session creation failed: ${sessionResponse.status} - ${errorText}`;
        throw new Error(diditError);
      }

      sessionData = await sessionResponse.json();
      console.log(
        "Session response data:",
        JSON.stringify(sessionData, null, 2)
      );

      // Use the URL directly from the response (this is the correct verification URL)
      console.log("Verification URL from response:", sessionData.url);

      // Ensure we have the session_id for database storage
      if (!sessionData.session_id) {
        throw new Error("No session_id in response");
      }

      isRealDiditSession = true;
      console.log("✅ Real Didit session created successfully");
      console.log("Verification URL:", sessionData.url);
    } catch (error) {
      console.error("❌ Didit session creation failed:", error.message);
      console.error("Full error:", error);
      diditError = error.message;

      // Fall back to demo mode for all users if session creation fails
      console.log("Falling back to demo mode due to session creation failure");
      sessionData = {
        session_id: `demo_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        url: `${SUPABASE_URL}/functions/v1/demo-kyc-verification?session=${Date.now()}`,
        status: "pending",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      console.log("✅ Demo session created as fallback:", sessionData);
    }

    // Step 3: Create session object (simplified for now)
    let dbSession = {
      id: isRealDiditSession
        ? `real_${sessionData.session_id}`
        : `demo_session_${Date.now()}`,
      user_id: user.id,
      didit_session_id: sessionData.session_id,
      verification_url: sessionData.url,
      status: "pending",
      redirect_url: redirectUrl,
      user_info: userInfo,
      expires_at:
        sessionData.expires_at ||
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Try to store in database, but don't fail if it doesn't work
    try {
      if (isRealDiditSession || !isDemoUser) {
        const { data: storedSession, error: dbError } = await supabaseClient
          .from("didit_kyc_sessions")
          .insert({
            user_id: user.id,
            didit_session_id: sessionData.session_id,
            verification_url: sessionData.url,
            status: "pending",
            redirect_url: redirectUrl,
            user_info: userInfo,
            expires_at: dbSession.expires_at,
          })
          .select()
          .single();

        if (!dbError && storedSession) {
          dbSession = storedSession;
        }

        // Update or create user KYC status
        const { error: statusError } = await supabaseClient
          .from("user_kyc_status")
          .upsert({
            user_id: user.id,
            kyc_status: "pending",
            verification_provider: "didit",
            latest_session_id: dbSession.id,
          });

        if (statusError) {
          console.error("Error updating KYC status:", statusError);
        }
      }
    } catch (dbError) {
      console.error(
        "Database operation failed, continuing with session creation:",
        dbError
      );
    }

    // Return session information
    return new Response(
      JSON.stringify({
        success: true,
        sessionId: dbSession.id,
        diditSessionId: sessionData.session_id,
        verificationUrl: sessionData.url,
        status: "pending",
        expiresAt: dbSession.expires_at,
        isDemo: !isRealDiditSession,
        isRealDiditSession: isRealDiditSession,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-kyc-session:", error);

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
