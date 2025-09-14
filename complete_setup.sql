-- Complete setup script - creates tables AND sets contract address
-- Contract Address: 0xd1ace8676ac6cf0950e1ca6dbacae0fc3b01c587

-- Token transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    user_id UUID REFERENCES auth.users(id),
    transaction_hash TEXT NOT NULL UNIQUE,
    token_amount DECIMAL(20,8),
    investment_amount DECIMAL(15,2),
    block_number BIGINT,
    gas_used BIGINT,
    gas_price BIGINT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    transaction_type TEXT DEFAULT 'mint' CHECK (transaction_type IN ('mint', 'transfer', 'approve')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project token metadata table
CREATE TABLE IF NOT EXISTS project_token_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) UNIQUE,
    blockchain_project_id BIGINT NOT NULL,
    token_contract_address TEXT NOT NULL,
    token_symbol TEXT,
    token_price DECIMAL(15,2) NOT NULL,
    total_supply DECIMAL(20,8),
    minted_amount DECIMAL(20,8) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_erc20_payment BOOLEAN DEFAULT false,
    payment_token_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User token balances table
CREATE TABLE IF NOT EXISTS user_token_balances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    wallet_address TEXT NOT NULL,
    token_balance DECIMAL(20,8) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id, wallet_address)
);

-- Smart contract configuration table
CREATE TABLE IF NOT EXISTS smart_contract_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_address TEXT NOT NULL UNIQUE,
    contract_name TEXT NOT NULL,
    network_name TEXT NOT NULL,
    network_chain_id INTEGER NOT NULL,
    rpc_url TEXT NOT NULL,
    block_explorer_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_token_transactions_project_id ON token_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_hash ON token_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_token_transactions_status ON token_transactions(status);
CREATE INDEX IF NOT EXISTS idx_token_transactions_created_at ON token_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_project_token_metadata_project_id ON project_token_metadata(project_id);
CREATE INDEX IF NOT EXISTS idx_project_token_metadata_blockchain_id ON project_token_metadata(blockchain_project_id);
CREATE INDEX IF NOT EXISTS idx_project_token_metadata_contract ON project_token_metadata(token_contract_address);

CREATE INDEX IF NOT EXISTS idx_user_token_balances_user_id ON user_token_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_token_balances_project_id ON user_token_balances(project_id);
CREATE INDEX IF NOT EXISTS idx_user_token_balances_wallet ON user_token_balances(wallet_address);

-- Enable Row Level Security (RLS)
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_token_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_contract_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for token_transactions
CREATE POLICY "Allow public insert on token_transactions" 
ON token_transactions 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on token_transactions" 
ON token_transactions 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Allow public update on token_transactions" 
ON token_transactions 
FOR UPDATE 
TO public
USING (true);

-- Create RLS policies for project_token_metadata
CREATE POLICY "Allow public insert on project_token_metadata" 
ON project_token_metadata 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on project_token_metadata" 
ON project_token_metadata 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Allow public update on project_token_metadata" 
ON project_token_metadata 
FOR UPDATE 
TO public
USING (true);

-- Create RLS policies for user_token_balances
CREATE POLICY "Allow public insert on user_token_balances" 
ON user_token_balances 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on user_token_balances" 
ON user_token_balances 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Allow public update on user_token_balances" 
ON user_token_balances 
FOR UPDATE 
TO public
USING (true);

-- Create RLS policies for smart_contract_config
CREATE POLICY "Allow public select on smart_contract_config" 
ON smart_contract_config 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Allow authenticated insert on smart_contract_config" 
ON smart_contract_config 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on smart_contract_config" 
ON smart_contract_config 
FOR UPDATE 
TO authenticated
USING (true);

-- Insert contract configuration with your actual address
INSERT INTO smart_contract_config (
    contract_address,
    contract_name,
    network_name,
    network_chain_id,
    rpc_url,
    block_explorer_url
) VALUES (
    '0xd1ace8676ac6cf0950e1ca6dbacae0fc3b01c587',
    'IWXToken',
    'Polygon Amoy',
    80002,
    'https://rpc-amoy.polygon.technology',
    'https://amoy.polygonscan.com'
) ON CONFLICT (contract_address) DO UPDATE SET
    contract_address = EXCLUDED.contract_address,
    updated_at = NOW();

-- Verify the setup
SELECT 'Tables created successfully!' as status;
SELECT * FROM smart_contract_config WHERE contract_name = 'IWXToken';
