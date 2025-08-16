// Didit KYC Service Integration via Supabase Edge Functions
// This service handles KYC verification through secure backend functions

import { supabase } from "./supabase";

class DidItService {
  constructor() {
    // Prevent multiple instances (singleton pattern)
    if (DidItService.instance) {
      return DidItService.instance;
    }

    this.sessionCache = new Map();
    DidItService.instance = this;
  }

  // Static method to get singleton instance
  static getInstance() {
    if (!DidItService.instance) {
      DidItService.instance = new DidItService();
    }
    return DidItService.instance;
  }

  async createVerificationSession(userInfo = {}) {
    try {
      // Get current session for authentication
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // Check for demo session if no real session exists
      let userEmail = null;
      let userId = null;

      if (sessionError || !session) {
        // Check for demo session
        const demoUser = localStorage.getItem("demo_user");
        const demoSession = localStorage.getItem("demo_session");

        if (demoUser && demoSession === "true") {
          const parsedUser = JSON.parse(demoUser);
          userEmail = parsedUser.email;
          userId = parsedUser.id;
          console.log("Using demo session for KYC verification");
        } else {
          throw new Error("Please sign in to start KYC verification");
        }
      } else {
        userEmail = session.user.email;
        userId = session.user.id;
      }

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke(
        "create-kyc-session",
        {
          body: {
            redirectUrl: window.location.origin + "/dashboard",
            userInfo: {
              email: userEmail,
              userId: userId,
              ...userInfo,
            },
          },
        }
      );

      if (error) {
        throw new Error(
          error.message || "Failed to create verification session"
        );
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to create verification session");
      }

      const sessionData = {
        sessionId: data.sessionId,
        diditSessionId: data.diditSessionId,
        verificationUrl: data.verificationUrl,
        status: data.status,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
      };

      // Cache the session
      this.sessionCache.set(data.sessionId, sessionData);

      return sessionData;
    } catch (error) {
      console.error("Failed to create verification session:", error);
      throw new Error(
        error.message ||
          "Unable to initiate KYC verification. Please try again."
      );
    }
  }

  // Check verification status - call Didit API directly for real-time status
  async getVerificationStatus(sessionId = null) {
    try {
      // Get current session for authentication
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // Check for demo session if no real session exists
      let userEmail = null;
      let userId = null;

      if (sessionError || !session) {
        // Check for demo session
        const demoUser = localStorage.getItem("demo_user");
        const demoSession = localStorage.getItem("demo_session");

        if (demoUser && demoSession === "true") {
          const parsedUser = JSON.parse(demoUser);
          userEmail = parsedUser.email;
          userId = parsedUser.id;
        } else {
          throw new Error("Authentication required");
        }
      } else {
        userEmail = session.user.email;
        userId = session.user.id;
      }

      // If we have a session ID, check Didit API directly for real-time status
      if (sessionId) {
        console.log("Checking Didit API directly for session:", sessionId);

        const isDemoSession =
          typeof window !== "undefined" &&
          localStorage.getItem("demo_session") === "true";

        console.log("🔍 Polling Didit session status for:", sessionId);
        console.log("🔍 Demo session:", isDemoSession);

        const { data: diditData, error: diditError } =
          await supabase.functions.invoke("get-didit-session-status", {
            body: {
              sessionId,
              demoSession: isDemoSession,
            },
          });

        console.log("🔍 Didit API response:", diditData);
        console.log("🔍 Didit API error:", diditError);

        if (diditError) {
          console.error("Didit API error:", diditError);
          throw new Error(
            diditError?.message || "Failed to get Didit session status"
          );
        }

        if (!diditData.success) {
          throw new Error(
            diditData.error || "Failed to get Didit session status"
          );
        }

        console.log("Didit API response:", diditData);
        return diditData.session;
      }

      // For overall user status, use the existing function
      const isDemoSession =
        typeof window !== "undefined" &&
        localStorage.getItem("demo_session") === "true";

      const { data, error } = await supabase.functions.invoke(
        "get-kyc-status",
        {
          body: {
            demoSession: isDemoSession,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to get verification status");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to get verification status");
      }

      return data.kycStatus;
    } catch (error) {
      console.error("Failed to get verification status:", error);
      return {
        status: "unverified",
        provider: null,
        verifiedAt: null,
        expiresAt: null,
      };
    }
  }

  // Get overall user KYC status
  async getUserKYCStatus() {
    try {
      return await this.getVerificationStatus();
    } catch (error) {
      console.error("Failed to get user KYC status:", error);
      return {
        status: "unverified",
        provider: null,
        verifiedAt: null,
        expiresAt: null,
      };
    }
  }

  // Simple verification window - check actual completion status
  openVerificationWindow(verificationUrl, onComplete, sessionId = null) {
    let checkCount = 0;
    const maxChecks = 60; // Maximum 10 minutes (60 * 10 seconds)
    const popup = window.open(
      verificationUrl,
      "didit_verification",
      "width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,status=no"
    );

    if (!popup) {
      throw new Error(
        "Popup blocked. Please allow popups for this site and try again."
      );
    }

    console.log("Didit popup opened");

    // Check for actual completion, not just popup close
    const checkCompletion = async () => {
      console.log("🔄 Polling attempt #", checkCount + 1);

      if (popup.closed) {
        console.log(
          "Verification popup closed - checking actual completion status"
        );

        try {
          // Check if verification was actually completed by calling Didit API
          const status = await this.getVerificationStatus(sessionId);
          console.log("Verification status after popup close:", status);

          if (status && status.status === "verified") {
            console.log("Verification actually completed successfully!");

            // Mark KYC as completed
            this.markKYCCompleted();

            if (onComplete) {
              onComplete({
                success: true,
                verified: true,
                reason: "verification_completed",
              });
            }

            // Redirect to dashboard
            window.location.href = "/dashboard";
          } else if (status && status.status === "rejected") {
            console.log("Verification was rejected/declined");

            if (onComplete) {
              onComplete({
                success: false,
                verified: false,
                reason: "verification_rejected",
              });
            }
          } else if (status && status.status === "failed") {
            console.log("Verification failed");

            if (onComplete) {
              onComplete({
                success: false,
                verified: false,
                reason: "verification_failed",
              });
            }
          } else {
            console.log(
              "Verification not completed - popup was closed without completion"
            );

            if (onComplete) {
              onComplete({
                success: false,
                verified: false,
                reason: "popup_closed_without_completion",
              });
            }
          }
        } catch (error) {
          console.error("Error checking verification status:", error);

          if (onComplete) {
            onComplete({
              success: false,
              verified: false,
              reason: "status_check_error",
            });
          }
        }
        return;
      }

      // Keep checking every 5 seconds for up to 10 minutes total
      checkCount++;
      if (checkCount >= maxChecks) {
        console.log("Maximum check time reached (10 minutes)");
        if (onComplete) {
          onComplete({
            success: false,
            verified: false,
            reason: "timeout",
          });
        }
        return;
      }
      setTimeout(checkCompletion, 5000);
    };

    // Start checking after 30 seconds to allow user to complete verification
    setTimeout(checkCompletion, 30000);

    return popup;
  }

  // Check if user has completed KYC (for route protection)
  async isKYCCompleted() {
    try {
      // For demo users only, check localStorage (development/testing purposes)
      const demoUser = localStorage.getItem("demo_user");
      const demoSession = localStorage.getItem("demo_session");

      if (demoUser && demoSession === "true") {
        const demoCompleted = localStorage.getItem("kycCompleted") === "true";
        if (demoCompleted) {
          console.log("Demo KYC completion detected");
          return true;
        }
      }

      // Only check database status if an authenticated user exists
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Not authenticated and not demo → not completed
        return false;
      }

      const status = await this.getUserKYCStatus();
      return status.status === "verified";
    } catch (error) {
      console.error("Error checking KYC completion:", error);
      return false;
    }
  }

  // Mark KYC completion (demo mode only)
  markKYCCompleted() {
    // Only allow demo users to mark completion locally
    const demoUser = localStorage.getItem("demo_user");
    const demoSession = localStorage.getItem("demo_session");

    if (demoUser && demoSession === "true") {
      localStorage.setItem("kycCompleted", "true");
      console.log("Demo KYC marked as completed");
    } else {
      console.log(
        "KYC completion marking ignored - real verification required"
      );
    }
  }

  // Clear KYC status (demo mode only)
  clearKYCStatus() {
    const demoUser = localStorage.getItem("demo_user");
    const demoSession = localStorage.getItem("demo_session");

    if (demoUser && demoSession === "true") {
      localStorage.removeItem("kycCompleted");
      console.log("Demo KYC status cleared");
    }
  }

  // Get stored KYC result (demo mode only)
  getStoredKYCResult() {
    const demoUser = localStorage.getItem("demo_user");
    const demoSession = localStorage.getItem("demo_session");

    if (demoUser && demoSession === "true") {
      const completed = localStorage.getItem("kycCompleted") === "true";
      return completed ? { verified: true } : null;
    }

    return null; // Force server-side verification for real users
  }
}

// Export singleton instance
const diditServiceInstance = DidItService.getInstance();
export default diditServiceInstance;
