-- Complete Database Setup for iWealthX
-- Run this entire script in your Supabase SQL Editor

-- =====================================================
-- 1. KYC TABLES
-- =====================================================

-- KYC Sessions Table
CREATE TABLE IF NOT EXISTS didit_kyc_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    didit_session_id TEXT NOT NULL,
    verification_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'expired', 'failed')),
    redirect_url TEXT,
    user_info JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC Results Table
CREATE TABLE IF NOT EXISTS didit_kyc_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES didit_kyc_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verified BOOLEAN DEFAULT FALSE,
    confidence DECIMAL(3,2) DEFAULT 0,
    verification_data JSONB,
    documents_verified TEXT[],
    risk_score DECIMAL(3,2) DEFAULT 0,
    aml_status TEXT DEFAULT 'pending',
    raw_response JSONB,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User KYC Status Table
CREATE TABLE IF NOT EXISTS user_kyc_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    kyc_status TEXT DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected', 'expired')),
    verification_provider TEXT,
    latest_session_id UUID REFERENCES didit_kyc_sessions(id),
    latest_result_id UUID REFERENCES didit_kyc_results(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. WEBSITE CONTENT TABLES
-- =====================================================

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment Interests
CREATE TABLE IF NOT EXISTS investment_interests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID,
    project_name TEXT,
    user_email TEXT NOT NULL,
    user_name TEXT,
    investment_amount DECIMAL(15,2),
    status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'contacted', 'converted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PROJECT MANAGEMENT TABLES
-- =====================================================

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2),
    current_amount DECIMAL(15,2) DEFAULT 0,
    investment_type TEXT CHECK (investment_type IN ('equity', 'debt', 'real_estate', 'infrastructure', 'renewable_energy')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'funded', 'completed', 'cancelled')),
    location TEXT,
    sector TEXT,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
    expected_return DECIMAL(5,2),
    duration_months INTEGER,
    min_investment DECIMAL(10,2),
    max_investment DECIMAL(15,2),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Documents
CREATE TABLE IF NOT EXISTS project_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('prospectus', 'financial_model', 'legal_docs', 'images', 'videos', 'other')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT,
    file_size INTEGER,
    mime_type TEXT,
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. USER PROFILE TABLES
-- =====================================================

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    nationality TEXT,
    address JSONB,
    investor_type TEXT CHECK (investor_type IN ('individual', 'institutional', 'accredited', 'retail')),
    investment_preferences JSONB,
    risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    annual_income_range TEXT,
    net_worth_range TEXT,
    investment_experience TEXT CHECK (investment_experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- KYC Indexes
CREATE INDEX IF NOT EXISTS idx_didit_kyc_sessions_user_id ON didit_kyc_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_didit_kyc_sessions_didit_session_id ON didit_kyc_sessions(didit_session_id);
CREATE INDEX IF NOT EXISTS idx_didit_kyc_sessions_status ON didit_kyc_sessions(status);
CREATE INDEX IF NOT EXISTS idx_didit_kyc_results_session_id ON didit_kyc_results(session_id);
CREATE INDEX IF NOT EXISTS idx_didit_kyc_results_user_id ON didit_kyc_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_kyc_status_user_id ON user_kyc_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_kyc_status_status ON user_kyc_status(kyc_status);

-- Website Content Indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_investment_interests_email ON investment_interests(user_email);
CREATE INDEX IF NOT EXISTS idx_investment_interests_project_id ON investment_interests(project_id);

-- Project Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_investment_type ON projects(investment_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_document_type ON project_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_project_documents_status ON project_documents(status);

-- User Profile Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_investor_type ON user_profiles(investor_type);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE didit_kyc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE didit_kyc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kyc_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. RLS POLICIES
-- =====================================================

-- KYC Policies
CREATE POLICY "Users can view own kyc sessions" ON didit_kyc_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own kyc results" ON didit_kyc_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own kyc status" ON user_kyc_status
    FOR SELECT USING (auth.uid() = user_id);

-- Service role policies for Edge Functions
CREATE POLICY "Service role full access to kyc sessions" ON didit_kyc_sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to kyc results" ON didit_kyc_results
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to kyc status" ON user_kyc_status
    FOR ALL USING (auth.role() = 'service_role');

-- Contact submissions - anyone can insert, only service role can view
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view contact submissions" ON contact_submissions
    FOR SELECT USING (auth.role() = 'service_role');

-- Newsletter subscriptions - anyone can insert/update
CREATE POLICY "Anyone can manage newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL USING (true);

-- Investment interests - anyone can insert, users can view own
CREATE POLICY "Anyone can submit investment interest" ON investment_interests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own investment interests" ON investment_interests
    FOR SELECT USING (auth.uid()::text = user_email OR auth.role() = 'service_role');

-- Projects - public read, authenticated users can create
CREATE POLICY "Public can view active projects" ON projects
    FOR SELECT USING (status IN ('active', 'funded', 'completed'));

CREATE POLICY "Authenticated users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project creators can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = created_by);

-- Project documents - public read for active projects
CREATE POLICY "Public can view documents for active projects" ON project_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_documents.project_id 
            AND projects.status IN ('active', 'funded', 'completed')
        )
    );

CREATE POLICY "Project creators can manage documents" ON project_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_documents.project_id 
            AND projects.created_by = auth.uid()
        )
    );

-- User profiles - users can manage own profile
CREATE POLICY "Users can manage own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 8. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_didit_kyc_sessions_updated_at 
    BEFORE UPDATE ON didit_kyc_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_kyc_status_updated_at 
    BEFORE UPDATE ON user_kyc_status 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at 
    BEFORE UPDATE ON newsletter_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_interests_updated_at 
    BEFORE UPDATE ON investment_interests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_documents_updated_at 
    BEFORE UPDATE ON project_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. SAMPLE DATA (Optional)
-- =====================================================

-- Insert sample projects
INSERT INTO projects (title, description, target_amount, investment_type, status, location, sector, risk_level, expected_return, duration_months, min_investment, max_investment) VALUES
('Solar Farm Development', 'Large-scale solar energy project in rural area', 5000000.00, 'renewable_energy', 'active', 'Rural Area', 'Energy', 'medium', 12.50, 24, 1000.00, 500000.00),
('Commercial Real Estate', 'Office building development in city center', 3000000.00, 'real_estate', 'active', 'City Center', 'Real Estate', 'medium', 15.00, 36, 5000.00, 300000.00),
('Tech Startup Investment', 'Early-stage technology company funding', 1000000.00, 'equity', 'active', 'Tech Hub', 'Technology', 'high', 25.00, 60, 10000.00, 100000.00)
ON CONFLICT DO NOTHING;

-- Insert sample newsletter subscription
INSERT INTO newsletter_subscriptions (email, status) VALUES
('demo@example.com', 'active')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 10. STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES
('kyc-documents', 'kyc-documents', false),
('project-documents', 'project-documents', true),
('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for KYC documents (private)
CREATE POLICY "Users can upload own KYC documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own KYC documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for project documents (public read)
CREATE POLICY "Public can view project documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-documents');

CREATE POLICY "Project creators can upload documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'project-documents');

-- Storage policies for user avatars (public read, users can upload own)
CREATE POLICY "Public can view user avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This will show a success message when the script completes
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: didit_kyc_sessions, didit_kyc_results, user_kyc_status, contact_submissions, newsletter_subscriptions, investment_interests, projects, project_documents, user_profiles';
    RAISE NOTICE 'Storage buckets created: kyc-documents, project-documents, user-avatars';
    RAISE NOTICE 'RLS policies and indexes configured';
END $$; 