-- Create Projects Table if not exists
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2),
    investment_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'active', 'funded', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Project Documents Table if not exists
CREATE TABLE IF NOT EXISTS project_documents (
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
CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_status ON project_documents(status);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for project documents if not exists
INSERT INTO storage.buckets (id, name, public)
SELECT 'project-documents', 'project-documents', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'project-documents'
);

-- Create RLS policies
DROP POLICY IF EXISTS "Allow public insert on projects" ON projects;
DROP POLICY IF EXISTS "Allow public select on projects" ON projects;
DROP POLICY IF EXISTS "Allow public insert on project_documents" ON project_documents;
DROP POLICY IF EXISTS "Allow public select on project_documents" ON project_documents;

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