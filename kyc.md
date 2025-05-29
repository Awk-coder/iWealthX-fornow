# Didit KYC Integration Plan for iWealthX

## Overview

This document outlines the comprehensive plan to integrate Didit's KYC (Know Your Customer) service into the iWealthX platform. This integration will allow us to verify user identities securely and efficiently, meeting regulatory requirements for financial investment platforms.

## System Architecture

### Integration Components

1. **Frontend Components:**
   - KYC initiation component on investment forms
   - KYC status display component
   - KYC completion modal/page
   - KYC verification status indicators

2. **Backend Components:**
   - Supabase database to store:
     - User verification status
     - Session IDs
     - Verification results (with consideration for data privacy)
   - Serverless functions to handle:
     - Authentication with Didit API
     - Session creation
     - Webhook processing
     - Status updates

3. **External Services:**
   - Didit API for identity verification
   - Supabase for backend storage and serverless functions

### Architecture Diagram 


## Integration Flow

### Authentication Flow

1. Store Didit Client ID and Client Secret securely in Supabase environment variables
2. Create a dedicated serverless function to obtain the authentication token:
   - Encode Client ID and Client Secret in Base64
   - Request access token from Didit's `/auth/v2/token/` endpoint
   - Cache the token (it expires in 24 hours according to docs)
   - Implement token refresh mechanism

### User Verification Flow

1. **Initiation:**
   - User reaches investment form or KYC requirement point
   - System checks if user has completed KYC
   - If not verified, present KYC initiation UI

2. **Session Creation:**
   - Backend creates verification session via Didit API
   - Receives session ID and verification URL/token
   - Stores session data in Supabase

3. **Verification Process:**
   - User is directed to verification flow (embedded or redirect)
   - User completes document upload, face verification, etc.
   - Didit processes verification

4. **Completion and Status Update:**
   - Didit sends webhook notification when verification completes
   - Backend updates user verification status in database
   - User is notified of verification result
   - UI updates to reflect verification status

## Implementation Steps

### 1. Supabase Setup

1. Create new Supabase project for iWealthX
2. Set up database tables:
   ```sql
   -- Users table (extends existing users if applicable)
   CREATE TABLE user_verification (
     user_id UUID PRIMARY KEY REFERENCES auth.users(id),
     verification_status VARCHAR NOT NULL DEFAULT 'unverified',
     verification_session_id VARCHAR,
     verification_completed_at TIMESTAMP,
     verification_details JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   
   -- KYC Sessions table
   CREATE TABLE kyc_sessions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES auth.users(id),
     didit_session_id VARCHAR NOT NULL,
     session_url VARCHAR,
     session_status VARCHAR NOT NULL DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

3. Create RLS (Row Level Security) policies
4. Configure environment variables:
   - `DIDIT_CLIENT_ID`
   - `DIDIT_CLIENT_SECRET`
   - `DIDIT_API_URL`

### 2. Serverless Functions Setup

Create the following Edge Functions in Supabase:

1. **getDiditToken.js**
   - Retrieves and caches authentication token

2. **createKycSession.js**
   - Creates new verification session for a user
   - Parameters: userId, redirectUrl

3. **getKycStatus.js**
   - Retrieves current verification status
   - Parameters: userId or sessionId

4. **webhookHandler.js**
   - Processes incoming webhooks from Didit
   - Updates verification status

### 3. Frontend Components

1. **KYC Status Component**
   - Shows current verification status
   - Conditionally renders based on verification state

2. **KYC Initiation Button/Modal**
   - Starts verification process
   - Displays terms and conditions

3. **KYC Process Wrapper**
   - Either embeds Didit's interface or redirects to it
   - Handles callbacks after completion

4. **KYC Result Display**
   - Shows verification outcome
   - Provides next steps based on result

### 4. API Integration

1. Implement API client for Didit in Supabase functions
2. Configure webhook endpoints
3. Set up error handling and retries
4. Implement logging for troubleshooting

## Security Considerations

1. **Data Protection:**
   - Store minimum required PII (Personally Identifiable Information)
   - Encrypt sensitive data at rest
   - Implement proper access controls

2. **Secure Communication:**
   - Use HTTPS for all API communication
   - Validate webhook signatures if supported
   - Implement rate limiting

3. **Credential Management:**
   - Store API credentials in environment variables only
   - Rotate credentials periodically
   - Implement least-privilege access principles

4. **User Consent:**
   - Obtain explicit consent for identity verification
   - Clearly explain data usage policies
   - Provide options to delete verification data when legally possible

## Testing Strategy

1. **Unit Testing:**
   - Test individual components in isolation
   - Mock API responses for predictable testing

2. **Integration Testing:**
   - Test API communication with Didit
   - Verify webhook processing

3. **End-to-End Testing:**
   - Complete user flows from initiation to completion
   - Test different verification scenarios

4. **Security Testing:**
   - Perform vulnerability assessment
   - Test for common security issues (OWASP Top 10)

5. **User Acceptance Testing:**
   - Test with real users before full launch
   - Collect feedback on UX

## Deployment Plan

1. **Development Environment:**
   - Implement and test in development environment
   - Use Didit's test mode if available

2. **Staging Environment:**
   - Deploy to staging for internal testing
   - Test with real documents but in sandbox mode

3. **Production Deployment:**
   - Gradual rollout to limit impact of issues
   - Monitor closely for errors
   - Have rollback plan ready

## Monitoring and Maintenance

1. **Monitoring:**
   - Set up alerts for verification failures
   - Monitor API response times
   - Track verification completion rates

2. **Logging:**
   - Implement comprehensive logging
   - Store logs securely
   - Exclude PII from logs

3. **Updates:**
   - Plan for Didit API changes
   - Regularly review security practices
   - Update based on user feedback

## Compliance Considerations

1. **Data Retention:**
   - Implement data retention policies
   - Automate data deletion when appropriate

2. **Regulatory Compliance:**
   - Ensure integration meets relevant regulations (GDPR, KYC/AML requirements)
   - Document compliance measures

3. **Audit Trail:**
   - Maintain records of verification activity
   - Make records available for audit when required

## Future Enhancements

1. **Multi-provider Strategy:**
   - Consider adding alternative KYC providers for redundancy
   - Implement adapter pattern for provider-agnostic code

2. **Advanced Features:**
   - Incorporate ongoing monitoring
   - Implement risk scoring
   - Add re-verification triggers based on activity

3. **User Experience:**
   - Optimize for mobile devices
   - Reduce friction in verification process
   - Add help resources for common issues

## Resources and Documentation

- [Didit API Documentation](https://docs.didit.me/identity-verification/api-reference/authentication)
- [Supabase Documentation](https://supabase.com/docs)
