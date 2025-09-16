# KYC Implementation Setup Guide

## Overview

This guide will help you fix the KYC implementation and make it work end-to-end. The current implementation has several missing pieces that need to be configured.

## Issues Identified

1. **Missing Environment Variables** - Critical for API connections
2. **Missing Database Schema** - Required tables don't exist
3. **Edge Functions Not Deployed** - Functions need to be deployed to Supabase
4. **Webhook Configuration** - Didit webhook needs proper setup

## Step-by-Step Setup

### 1. Environment Variables Setup

#### Frontend (.env.local)

Create a `.env.local` file in your project root:

```bash
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Supabase Edge Functions Environment Variables

In your Supabase Dashboard:

1. Go to **Settings** > **Edge Functions**
2. Add these environment variables:

```bash
DIDIT_API_KEY=your_didit_api_key_here
DIDIT_WORKFLOW_ID=your_workflow_id_here
DIDIT_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Database Schema Setup

1. Go to your Supabase Dashboard > **SQL Editor**
2. Run the SQL from `database_schema.sql` file
3. This creates all required tables with proper relationships and security policies

### 3. Deploy Edge Functions

Install Supabase CLI if you haven't:

```bash
npm install -g supabase
```

Login to Supabase:

```bash
supabase login
```

Link your project:

```bash
supabase link --project-ref your-project-ref
```

Deploy all Edge Functions:

```bash
supabase functions deploy create-kyc-session
supabase functions deploy get-didit-session-status
supabase functions deploy kyc-webhook-simple
supabase functions deploy get-kyc-status
```

### 4. Didit API Configuration

1. **Get Didit API Key**: Sign up at https://didit.me and get your API key
2. **Create Workflow**: Set up a verification workflow in Didit dashboard
3. **Configure Webhook**: Set webhook URL to: `https://your-project-ref.supabase.co/functions/v1/kyc-webhook-simple`

### 5. Test the Implementation

#### Test Edge Functions

```bash
# Test KYC session creation
curl -X POST https://your-project-ref.supabase.co/functions/v1/create-kyc-session \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"redirectUrl": "http://localhost:3000/dashboard", "userInfo": {"email": "test@example.com"}}'
```

#### Test Frontend

1. Start your React app: `npm start`
2. Navigate to `/kyc` route
3. Try the KYC flow

## Troubleshooting

### Common Issues

#### 1. "Failed to load resource: net::ERR_NAME_NOT_RESOLVED"

- **Cause**: Edge Functions not deployed or wrong URL
- **Solution**: Deploy Edge Functions and check environment variables

#### 2. "Didit API key not configured"

- **Cause**: Missing `DIDIT_API_KEY` environment variable
- **Solution**: Add the environment variable in Supabase Dashboard

#### 3. "Session not found" errors

- **Cause**: Database tables don't exist
- **Solution**: Run the database schema SQL

#### 4. Authentication errors

- **Cause**: Wrong Supabase credentials
- **Solution**: Check `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

### Debug Steps

1. **Check Edge Function Logs**:

   - Go to Supabase Dashboard > **Edge Functions** > **Logs**
   - Look for errors in function execution

2. **Check Browser Console**:

   - Open Developer Tools
   - Look for network errors and JavaScript errors

3. **Test Individual Components**:
   - Test Supabase connection
   - Test Edge Function calls
   - Test Didit API directly

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Row Level Security**: Database tables have RLS enabled
3. **Webhook Validation**: Implement webhook signature validation
4. **Environment Variables**: Use proper environment variable management

## Production Deployment

1. **Environment Variables**: Set production environment variables
2. **Domain Configuration**: Update redirect URLs for production domain
3. **SSL**: Ensure all endpoints use HTTPS
4. **Monitoring**: Set up error monitoring and logging

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Edge Function logs in Supabase Dashboard
3. Verify all environment variables are set correctly
4. Ensure database schema is properly created
