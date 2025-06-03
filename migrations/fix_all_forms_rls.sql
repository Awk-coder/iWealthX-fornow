-- Drop existing policies for all tables
DROP POLICY IF EXISTS "Allow public insert on newsletter_subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public select on newsletter_subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public insert on investment_interests" ON investment_interests;
DROP POLICY IF EXISTS "Allow public select on investment_interests" ON investment_interests;
DROP POLICY IF EXISTS "Allow public insert on kyc_applications" ON kyc_applications;
DROP POLICY IF EXISTS "Allow public select on kyc_applications" ON kyc_applications;

-- Newsletter Subscriptions policies
CREATE POLICY "Allow public insert on newsletter_subscriptions" 
ON newsletter_subscriptions 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on newsletter_subscriptions" 
ON newsletter_subscriptions 
FOR SELECT 
TO public
USING (true);

-- Investment Interests policies
CREATE POLICY "Allow public insert on investment_interests" 
ON investment_interests 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on investment_interests" 
ON investment_interests 
FOR SELECT 
TO public
USING (true);

-- KYC Applications policies
CREATE POLICY "Allow public insert on kyc_applications" 
ON kyc_applications 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on kyc_applications" 
ON kyc_applications 
FOR SELECT 
TO public
USING (true); 