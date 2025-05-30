-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- KYC Applications Table
CREATE TABLE kyc_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    personal_info JSONB NOT NULL,
    identity_verification JSONB,
    financial_profile JSONB,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Form Submissions Table
CREATE TABLE contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscriptions Table
CREATE TABLE newsletter_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Investment Interests Table
CREATE TABLE investment_interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id VARCHAR(100),
    project_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    investment_amount DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'interested' CHECK (status IN ('interested', 'contacted', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_kyc_applications_status ON kyc_applications(status);
CREATE INDEX idx_kyc_applications_created_at ON kyc_applications(created_at);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_investment_interests_project ON investment_interests(project_id);
CREATE INDEX idx_investment_interests_email ON investment_interests(user_email);

-- Enable Row Level Security (RLS)
ALTER TABLE kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_interests ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict these later)
CREATE POLICY "Allow public insert on kyc_applications" ON kyc_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on newsletter_subscriptions" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on investment_interests" ON investment_interests FOR INSERT WITH CHECK (true);

-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents', 'kyc-documents', false);

-- Create policy for KYC documents storage
CREATE POLICY "Allow public upload of KYC documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'kyc-documents');
CREATE POLICY "Allow public read of KYC documents" ON storage.objects FOR SELECT USING (bucket_id = 'kyc-documents'); 