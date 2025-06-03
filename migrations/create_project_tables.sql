-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2),
    investment_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'active', 'funded', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Documents Table
CREATE TABLE project_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX idx_project_documents_status ON project_documents(status);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

-- Create RLS policies for projects
CREATE POLICY "Allow public insert on projects" 
ON projects 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on projects" 
ON projects 
FOR SELECT 
TO public
USING (true);

-- Create RLS policies for project documents
CREATE POLICY "Allow public insert on project_documents" 
ON project_documents 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on project_documents" 
ON project_documents 
FOR SELECT 
TO public
USING (true);

-- Create storage policies
CREATE POLICY "Allow public upload of project documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-documents');

CREATE POLICY "Allow public read of project documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-documents'); 