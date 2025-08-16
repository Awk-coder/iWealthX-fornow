-- KYC Tables Setup
-- Run this in Supabase SQL Editor

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_didit_kyc_sessions_user_id ON didit_kyc_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_didit_kyc_sessions_didit_session_id ON didit_kyc_sessions(didit_session_id);
CREATE INDEX IF NOT EXISTS idx_didit_kyc_results_session_id ON didit_kyc_results(session_id);
CREATE INDEX IF NOT EXISTS idx_didit_kyc_results_user_id ON didit_kyc_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_kyc_status_user_id ON user_kyc_status(user_id);

-- Enable RLS
ALTER TABLE didit_kyc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE didit_kyc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kyc_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own kyc sessions" ON didit_kyc_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own kyc results" ON didit_kyc_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own kyc status" ON user_kyc_status
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to kyc sessions" ON didit_kyc_sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to kyc results" ON didit_kyc_results
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to kyc status" ON user_kyc_status
    FOR ALL USING (auth.role() = 'service_role'); 