-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public select on contact_submissions" ON contact_submissions;

-- Recreate policies with proper permissions
CREATE POLICY "Allow public insert on contact_submissions" 
ON contact_submissions 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on contact_submissions" 
ON contact_submissions 
FOR SELECT 
TO public
USING (true); 