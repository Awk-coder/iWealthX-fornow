# 🚀 Final KYC Setup Guide

## ✅ What's Already Done

- ✅ Environment file (`.env.local`) created with your Supabase credentials
- ✅ Database schema files created
- ✅ Test scripts created

## 📋 Step-by-Step Setup

### 1. Database Setup (Manual - Required)

**Go to your Supabase Dashboard:**

1. Visit: https://supabase.com/dashboard
2. Select your project: `xmsvychorllkbluktgmt`
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the entire content of `kyc_tables.sql`
5. Click **Run** to execute the script

### 2. Set Edge Function Environment Variables

**In your Supabase Dashboard:**

1. Go to **Settings** > **Edge Functions**
2. Add these environment variables:
   ```
   DIDIT_API_KEY=your_didit_api_key_here
   DIDIT_WORKFLOW_ID=your_workflow_id_here
   DIDIT_WEBHOOK_SECRET=your_webhook_secret_here
   ```

### 3. Deploy Edge Functions

Run these commands in your terminal:

```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref xmsvychorllkbluktgmt

# Deploy all Edge Functions
npx supabase functions deploy create-kyc-session
npx supabase functions deploy get-didit-session-status
npx supabase functions deploy kyc-webhook-simple
npx supabase functions deploy get-kyc-status
```

### 4. Test the Setup

```bash
# Test database connection
node test_connection.js

# Start your React app
npm start
```

Then navigate to `/kyc` route to test the KYC flow.

## 🔧 Troubleshooting

### If you get "Failed to load resource" errors:

1. Check that Edge Functions are deployed
2. Verify environment variables are set in Supabase Dashboard
3. Ensure the database tables exist

### If you get "Didit API key not configured":

1. Add the `DIDIT_API_KEY` environment variable in Supabase Dashboard
2. Get a Didit API key from https://didit.me

### If you get "Session not found" errors:

1. Run the `kyc_tables.sql` script in Supabase SQL Editor
2. Verify the tables were created successfully

## 🎯 Next Steps

Once the basic setup is working:

1. Get a Didit API key from https://didit.me
2. Configure the webhook URL in Didit dashboard: `https://xmsvychorllkbluktgmt.supabase.co/functions/v1/kyc-webhook-simple`
3. Test the full KYC flow

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Edge Function logs in Supabase Dashboard
3. Verify all environment variables are set correctly
4. Ensure database schema is properly created

---

**Your Supabase Project Details:**

- **URL:** https://xmsvychorllkbluktgmt.supabase.co
- **Project Ref:** xmsvychorllkbluktgmt
- **Environment File:** ✅ Created
