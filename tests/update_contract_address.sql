-- Update contract address in smart_contract_config table
-- Replace 'YOUR_CONTRACT_ADDRESS_HERE' with your actual contract address

UPDATE smart_contract_config 
SET 
    contract_address = '0xd1ace8676ac6cf0950e1ca6dbacae0fc3b01c587',
    updated_at = NOW()
WHERE contract_name = 'IWXToken';

-- If no rows were updated, insert a new record
INSERT INTO smart_contract_config (
    contract_address,
    contract_name,
    network_name,
    network_chain_id,
    rpc_url,
    block_explorer_url
)
SELECT 
    '0xd1ace8676ac6cf0950e1ca6dbacae0fc3b01c587',
    'IWXToken',
    'Polygon Amoy',
    80002,
    'https://rpc-amoy.polygon.technology',
    'https://amoy.polygonscan.com'
WHERE NOT EXISTS (
    SELECT 1 FROM smart_contract_config 
    WHERE contract_name = 'IWXToken'
);

-- Verify the update
SELECT * FROM smart_contract_config WHERE contract_name = 'IWXToken';
