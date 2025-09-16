# Environment Setup Guide

## Quick Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **API**
4. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 2. Create Frontend Environment File

Create a `.env.local` file in your project root:

```bash
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Edge Function Environment Variables

In your Supabase Dashboard:

1. Go to **Settings** > **Edge Functions**
2. Add these environment variables:

```bash
DIDIT_API_KEY=your_didit_api_key_here
DIDIT_WORKFLOW_ID=your_workflow_id_here
DIDIT_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4. Run Database Setup

1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy and paste the entire content of `complete_database_setup.sql`
3. Click **Run** to execute the script

### 5. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy create-kyc-session
supabase functions deploy get-didit-session-status
supabase functions deploy kyc-webhook-simple
supabase functions deploy get-kyc-status
```

## Testing the Setup

After completing the setup:

1. Start your React app: `npm start`
2. Navigate to `/kyc` route
3. Try the KYC flow

## Troubleshooting

If you get errors:

1. Check that all environment variables are set
2. Verify the database script ran successfully
3. Check Edge Function logs in Supabase Dashboard
4. Ensure Edge Functions are deployed

## Next Steps

Once the basic setup is working:

1. Get a Didit API key from https://didit.me
2. Configure the webhook URL in Didit dashboard
3. Test the full KYC flow
