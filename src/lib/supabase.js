import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lrmsfhjpnschinvxhiya.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXNmaGpwbnNjaGludnhoaXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1Nzg0NTIsImV4cCI6MjA2NDE1NDQ1Mn0.vUhpdtSd3HdHTLqvo3494ZuyXSDN8sl80_47Wo_tzp4";

// Create Supabase client with realtime disabled to avoid WebSocket issues
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    disabled: true,
  },
  global: {
    headers: {
      "X-Client-Info": "iwealthx-web",
    },
  },
});

// Helper functions for KYC data
export const kycService = {
  // Create a new KYC application
  async createKYCApplication(data) {
    const { data: result, error } = await supabase
      .from("kyc_applications")
      .insert([
        {
          personal_info: data.personalInfo,
          identity_verification: data.identityVerification,
          financial_profile: data.financialProfile,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return result[0];
  },

  // Update KYC application
  async updateKYCApplication(id, data) {
    const { data: result, error } = await supabase
      .from("kyc_applications")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return result[0];
  },

  // Get KYC application by ID
  async getKYCApplication(id) {
    const { data, error } = await supabase
      .from("kyc_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Upload file to Supabase storage
  async uploadFile(file, bucket = "kyc-documents") {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { fileName, publicUrl };
  },
};

// Helper functions for contact forms and other website data
export const websiteService = {
  // Store contact form submissions
  async submitContactForm(data) {
    const { data: result, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return result[0];
  },

  // Store newsletter subscriptions
  async subscribeNewsletter(email) {
    const { data: result, error } = await supabase
      .from("newsletter_subscriptions")
      .insert([
        {
          email: email,
          subscribed_at: new Date().toISOString(),
          status: "active",
        },
      ])
      .select();

    if (error) throw error;
    return result[0];
  },

  // Store investment interest
  async submitInvestmentInterest(data) {
    const { data: result, error } = await supabase
      .from("investment_interests")
      .insert([
        {
          project_id: data.projectId,
          project_name: data.projectName,
          user_email: data.email,
          user_name: data.name,
          investment_amount: data.amount,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return result[0];
  },
};
