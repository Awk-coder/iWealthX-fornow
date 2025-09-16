import { supabase } from "./supabase";

class AuthService {
  constructor() {
    this.refreshTimer = null;
    this.isRefreshing = false;
    this.listeners = [];
    this.sessionTimeoutTimer = null;
    this.lastActivity = Date.now();
    this.SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours of inactivity

    // Track user activity
    this.setupActivityTracking();
  }

  // Setup activity tracking for session timeout
  setupActivityTracking() {
    // Track mouse movement, clicks, keyboard input, and scroll
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const resetInactivityTimer = () => {
      this.lastActivity = Date.now();
      this.resetSessionTimeout();
    };

    events.forEach((event) => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Also track focus/blur events
    window.addEventListener("focus", resetInactivityTimer);
    window.addEventListener("blur", () => {
      // Don't reset timer on blur, but track when user comes back
    });
  }

  // Reset session timeout timer
  resetSessionTimeout() {
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
    }

    // Set timeout for inactivity
    this.sessionTimeoutTimer = setTimeout(() => {
      console.log("Session timeout due to inactivity");
      this.handleSessionTimeout();
    }, this.INACTIVITY_TIMEOUT);
  }

  // Handle session timeout
  async handleSessionTimeout() {
    console.log("Session timed out - signing out user");
    this.clearRefreshTimer();
    this.clearSessionTimeout();

    // Sign out the user
    await supabase.auth.signOut();

    // Notify listeners
    this.notifyListeners({
      isAuthenticated: false,
      user: null,
      sessionTimeout: true,
    });
  }

  // Clear session timeout timer
  clearSessionTimeout() {
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
      this.sessionTimeoutTimer = null;
    }
  }

  // Initialize auth service with automatic token refresh
  async initialize() {
    try {
      // Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return { success: false, error: error.message };
      }

      // Set up automatic refresh if session exists
      if (session) {
        this.setupAutoRefresh(session);
        this.resetSessionTimeout(); // Start session timeout tracking
        this.notifyListeners({ isAuthenticated: true, user: session.user });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);

        if (event === "SIGNED_IN" && session) {
          this.setupAutoRefresh(session);
          this.resetSessionTimeout(); // Start session timeout tracking
          this.notifyListeners({ isAuthenticated: true, user: session.user });
        } else if (event === "SIGNED_OUT") {
          this.clearRefreshTimer();
          this.clearSessionTimeout();
          this.notifyListeners({ isAuthenticated: false, user: null });
        } else if (event === "TOKEN_REFRESHED" && session) {
          this.setupAutoRefresh(session);
          this.notifyListeners({
            isAuthenticated: true,
            user: session.user,
            refreshed: true,
          });
        }
      });

      return {
        success: true,
        session,
        isAuthenticated: !!session,
      };
    } catch (error) {
      console.error("Auth service initialization failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Set up automatic token refresh
  setupAutoRefresh(session) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!session?.expires_at) return;

    // Calculate time until token expires (refresh 5 minutes before expiry)
    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60000); // At least 1 minute

    console.log(
      `Token will refresh in ${Math.round(refreshTime / 1000 / 60)} minutes`
    );

    this.refreshTimer = setTimeout(async () => {
      await this.refreshToken();
    }, refreshTime);
  }

  // Manually refresh token
  async refreshToken() {
    if (this.isRefreshing) {
      console.log("Token refresh already in progress");
      return;
    }

    try {
      this.isRefreshing = true;
      console.log("Refreshing token...");

      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Token refresh failed:", error);
        this.clearRefreshTimer();
        this.notifyListeners({
          isAuthenticated: false,
          user: null,
          error: error.message,
        });
        return { success: false, error: error.message };
      }

      console.log("Token refreshed successfully");
      this.setupAutoRefresh(data.session);
      this.notifyListeners({
        isAuthenticated: true,
        user: data.user,
        refreshed: true,
      });

      return { success: true, session: data.session, user: data.user };
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearRefreshTimer();
      return { success: false, error: error.message };
    } finally {
      this.isRefreshing = false;
    }
  }

  // Clear refresh timer
  clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, session, isAuthenticated: !!session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user, isAuthenticated: !!user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        this.setupAutoRefresh(data.session);
      }

      return { success: true, session: data.session, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      this.clearRefreshTimer();
      this.clearSessionTimeout();
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      this.notifyListeners({ isAuthenticated: false, user: null });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = supabase.auth.getSession();
    return !!session;
  }

  // Add auth state listener
  addAuthListener(callback) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  // Notify all listeners of auth state changes
  notifyListeners(authState) {
    this.listeners.forEach((listener) => {
      try {
        listener(authState);
      } catch (error) {
        console.error("Error in auth listener:", error);
      }
    });
  }

  // Get session timeout info
  getSessionTimeoutInfo() {
    const timeUntilTimeout =
      this.lastActivity + this.INACTIVITY_TIMEOUT - Date.now();
    const isNearTimeout = timeUntilTimeout < 5 * 60 * 1000; // 5 minutes warning

    return {
      timeUntilTimeout: Math.max(0, timeUntilTimeout),
      isNearTimeout,
      lastActivity: this.lastActivity,
    };
  }

  // Extend session (when user confirms they want to stay logged in)
  extendSession() {
    console.log("User extended session");
    this.lastActivity = Date.now();
    this.resetSessionTimeout();
  }

  // Cleanup
  destroy() {
    this.clearRefreshTimer();
    this.clearSessionTimeout();
    this.listeners = [];
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
