# iWealthX Database Setup Guide

## Prerequisites

- Supabase account and project created
- Access to Supabase SQL Editor

## Database Setup Instructions

### 1. Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section
3. Create a new query

### 2. Run the Database Schema

Copy and paste the contents of `database-schema.sql` into the SQL Editor and execute it. This will create:

- **kyc_applications** table for storing KYC form submissions
- **contact_submissions** table for contact form data
- **newsletter_subscriptions** table for email subscriptions
- **investment_interests** table for tracking user investment interests
- **kyc-documents** storage bucket for document uploads

### 3. Verify Tables Creation

After running the schema, verify that all tables are created by checking the "Table Editor" section in Supabase.

### 4. Configure Storage

1. Go to "Storage" section in Supabase
2. Verify that the "kyc-documents" bucket is created
3. The bucket should be configured as private (not public)

### 5. Row Level Security (RLS)

The schema automatically enables RLS and creates basic policies for public access. You may want to modify these policies based on your security requirements:

- **For Production**: Restrict access based on user authentication
- **For Development**: Current policies allow public insert operations

## Environment Variables

The application uses the following Supabase configuration (already set in `src/lib/supabase.js`):

```javascript
const supabaseUrl = "https://lrmsfhjpnschinvxhiya.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

## Testing the Integration

### 1. Test KYC Flow

1. Navigate to `/kyc` in your application
2. Fill out the KYC form with test data
3. Upload test documents (images)
4. Submit the form
5. Check the `kyc_applications` table in Supabase to verify data storage

### 2. Test Contact Form

1. Navigate to `/contact` in your application
2. Fill out and submit the contact form
3. Check the `contact_submissions` table in Supabase

### 3. Test Investment Interest

1. Navigate to `/investor` in your application
2. Click "Invest Now" on any project
3. Check the `investment_interests` table in Supabase

## Data Structure

### KYC Applications

```json
{
  "id": "uuid",
  "personal_info": {
    "firstName": "string",
    "lastName": "string",
    "email": "string"
    // ... other personal info fields
  },
  "identity_verification": {
    "idType": "string",
    "idNumber": "string",
    "idDocumentUrl": "string"
    // ... other verification fields
  },
  "financial_profile": {
    "annualIncome": "string",
    "netWorth": "string"
    // ... other financial fields
  },
  "status": "pending|approved|rejected|under_review",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Contact Submissions

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "text",
  "status": "new|read|responded",
  "created_at": "timestamp"
}
```

## Security Considerations

1. **File Upload Security**: The current implementation allows any file type. Consider adding file type validation and virus scanning for production.

2. **Data Validation**: Add server-side validation for all form inputs.

3. **Rate Limiting**: Implement rate limiting for form submissions to prevent spam.

4. **Authentication**: For production, implement proper user authentication and tie submissions to authenticated users.

5. **Data Encryption**: Consider encrypting sensitive PII data in the database.

## Monitoring and Analytics

You can monitor the application usage through Supabase dashboard:

- View submission counts in each table
- Monitor storage usage for document uploads
- Track API usage and performance

## Backup and Recovery

Supabase automatically handles backups for paid plans. For additional security:

1. Set up regular database exports
2. Monitor storage usage
3. Implement data retention policies as needed
