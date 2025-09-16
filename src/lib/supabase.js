import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Create Supabase client with enhanced auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: "pkce",
    debug: process.env.NODE_ENV === "development",
    // Shorter token lifetime for better security
    tokenRefreshMargin: 60, // Refresh 1 minute before expiry
  },
  realtime: {
    disabled: true,
  },
  global: {
    headers: {
      "X-Client-Info": "iwealthx-web",
    },
  },
  db: {
    schema: "public",
  },
  // Explicitly disable any realtime features
  enableRealtime: false,
});

// Helper functions for KYC data
export const kycService = {
  // Create a new KYC application
  async createKYCApplication(data) {
    try {
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

      if (error) {
        console.error("KYC application creation error:", error);
        throw error;
      }
      return result[0];
    } catch (error) {
      console.error("KYC application creation error:", error);
      throw error;
    }
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
    try {
      const { data: result, error } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            status: "new", // Add default status
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Contact form submission error:", error);
        throw error;
      }
      return result[0];
    } catch (error) {
      console.error("Contact form submission error:", error);
      throw error;
    }
  },

  // Store newsletter subscriptions
  async subscribeNewsletter(email) {
    try {
      const { data: result, error } = await supabase
        .from("newsletter_subscriptions")
        .insert([
          {
            email: email,
            status: "active",
            subscribed_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Newsletter subscription error:", error);
        throw error;
      }
      return result[0];
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      throw error;
    }
  },

  // Store investment interest
  async submitInvestmentInterest(data) {
    try {
      const { data: result, error } = await supabase
        .from("investment_interests")
        .insert([
          {
            project_id: data.projectId,
            project_name: data.projectName,
            user_email: data.email,
            user_name: data.name,
            investment_amount: data.amount,
            status: "interested",
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Investment interest submission error:", error);
        throw error;
      }
      return result[0];
    } catch (error) {
      console.error("Investment interest submission error:", error);
      throw error;
    }
  },
};

// Project and Document Management Service
export const projectService = {
  // Get all projects
  async getProjects() {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Get projects error:", error);
        throw error;
      }
      return { data };
    } catch (error) {
      console.error("Get projects error:", error);
      throw error;
    }
  },

  // Get a single project
  async getProject(id) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Get project error:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Get project error:", error);
      throw error;
    }
  },

  // Create a new project
  async createProject(data) {
    try {
      const { data: result, error } = await supabase
        .from("projects")
        .insert([
          {
            title: data.title,
            description: data.description,
            target_amount: data.targetAmount,
            investment_type: data.investmentType,
            status: "draft",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Project creation error:", error);
        throw error;
      }
      return result[0];
    } catch (error) {
      console.error("Project creation error:", error);
      throw error;
    }
  },

  // Upload project document
  async uploadProjectDocument(file, projectId, documentType) {
    try {
      // First, upload the file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${projectId}/${documentType}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("project-documents").getPublicUrl(fileName);

      // Create document record in the database
      const { data: result, error: dbError } = await supabase
        .from("project_documents")
        .insert([
          {
            project_id: projectId,
            document_type: documentType,
            file_name: file.name,
            file_path: fileName,
            file_url: publicUrl,
            status: "pending_review",
            uploaded_at: new Date().toISOString(),
          },
        ])
        .select();

      if (dbError) throw dbError;
      return result[0];
    } catch (error) {
      console.error("Document upload error:", error);
      throw error;
    }
  },

  // Get project documents
  async getProjectDocuments(projectId) {
    try {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("uploaded_at", { ascending: false });

      if (error) {
        console.error("Get project documents error:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Get project documents error:", error);
      throw error;
    }
  },

  // Delete project document
  async deleteProjectDocument(documentId) {
    try {
      // First get the document to get the file path
      const { data: doc, error: getError } = await supabase
        .from("project_documents")
        .select("file_path")
        .eq("id", documentId)
        .single();

      if (getError) throw getError;

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from("project-documents")
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      // Delete the document record
      const { error: deleteError } = await supabase
        .from("project_documents")
        .delete()
        .eq("id", documentId);

      if (deleteError) throw deleteError;

      return true;
    } catch (error) {
      console.error("Delete document error:", error);
      throw error;
    }
  },
};
