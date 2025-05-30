# Manual Testing Script for iWealthX Supabase Integration

## Prerequisites

1. ✅ Supabase database is set up with all tables
2. ✅ Application is running locally (`npm start`)
3. ✅ Browser developer tools are open for monitoring network requests
4. ✅ Access to Supabase dashboard for verifying data storage

---

## Test 1: KYC Flow Complete Journey

### Setup

- Navigate to: `http://localhost:3000/kyc`
- Open browser developer tools (Network tab)
- Open Supabase dashboard (Table Editor)

### Test Steps

#### Step 1: Personal Information

1. **Fill out all required fields:**

   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe.test@example.com`
   - Phone Number: `+60123456789`
   - Date of Birth: `1990-01-01`
   - Nationality: `Malaysian`
   - Country of Residence: `Malaysia`
   - City: `Kuala Lumpur`
   - Postal Code: `50000`
   - Occupation: `Software Engineer`
   - Employer: `Tech Corp`
   - Source of Income: `Employment`
   - Address: `123 Test Street, Kuala Lumpur`

2. **Click "Next"**
   - ✅ Should advance to Step 2
   - ✅ Progress indicator should show "Step 2 of 4"

#### Step 2: Identity Verification

1. **Fill out identity fields:**

   - ID Type: `Malaysian NRIC`
   - ID Number: `901234567890`
   - ID Expiry Date: `2030-01-01`

2. **Upload test documents:**

   - ID Document: Upload any image file (JPG/PNG)
   - Proof of Address: Upload any image file (JPG/PNG)
   - Selfie with ID: Upload any image file (JPG/PNG)

3. **Verify uploads:**

   - ✅ Check Network tab for upload requests to Supabase storage
   - ✅ Should see "✓ Document uploaded" messages
   - ✅ Check Supabase Storage bucket for uploaded files

4. **Click "Next"**
   - ✅ Should advance to Step 3

#### Step 3: Financial Profile

1. **Fill out financial information:**

   - Annual Income: `RM 50,000 - RM 100,000`
   - Net Worth: `RM 100,000 - RM 500,000`
   - Investment Experience: `Intermediate (1-5 years)`
   - Risk Tolerance: `Moderate`
   - Investment Objectives: `Capital Growth`
   - Expected Investment Amount: `RM 10,000 - RM 50,000`
   - Source of Funds: `Salary/Employment Income`

2. **Check required checkboxes:**

   - ✅ "I confirm that I am not subject to any sanctions or restrictions"
   - ✅ "I agree to the Terms and Conditions"
   - ✅ "I agree to the Privacy Policy"

3. **Click "Next"**
   - ✅ Should advance to Step 4

#### Step 4: Review & Submit

1. **Verify all information is displayed correctly:**

   - ✅ Personal Information section shows correct data
   - ✅ Identity Verification section shows correct data
   - ✅ Financial Profile section shows correct data
   - ✅ Documents section shows "All documents uploaded ✓"

2. **Click "Submit KYC Application"**
   - ✅ Should show loading state with spinner
   - ✅ Check Network tab for POST request to Supabase
   - ✅ Should redirect to success page after 2 seconds

#### Step 5: Success Page Verification

1. **Verify success page elements:**
   - ✅ Green checkmark icon
   - ✅ "KYC Application Submitted Successfully!" heading
   - ✅ Application ID displayed (UUID format)
   - ✅ Current date shown
   - ✅ Status: "Under Review"
   - ✅ "Return to Homepage" button works

### Database Verification

1. **Check Supabase `kyc_applications` table:**

   - ✅ New record created with correct UUID
   - ✅ `personal_info` JSON contains all personal data
   - ✅ `identity_verification` JSON contains ID info and file URLs
   - ✅ `financial_profile` JSON contains financial data
   - ✅ `status` is set to "pending"
   - ✅ `created_at` and `updated_at` timestamps are correct

2. **Check Supabase Storage:**
   - ✅ Three files uploaded to `kyc-documents` bucket
   - ✅ Files are accessible via public URLs

---

## Test 2: Contact Form Submission

### Setup

- Navigate to: `http://localhost:3000/contact`
- Open Supabase dashboard (contact_submissions table)

### Test Steps

1. **Fill out contact form:**

   - Full Name: `Jane Smith`
   - Email Address: `jane.smith.test@example.com`
   - Subject: `General Inquiry`
   - Message: `This is a test message for the contact form functionality.`

2. **Click "Send Message"**

   - ✅ Should show loading state with spinner
   - ✅ Should show green success message
   - ✅ Form fields should be cleared after submission

3. **Test error handling:**
   - Fill form with invalid email: `invalid-email`
   - ✅ Should show HTML5 validation error
   - Try submitting empty form
   - ✅ Should show required field validation

### Database Verification

1. **Check Supabase `contact_submissions` table:**
   - ✅ New record created
   - ✅ All form data stored correctly
   - ✅ `status` is set to "new"
   - ✅ `created_at` timestamp is correct

---

## Test 3: Newsletter Subscription

### Setup

- Navigate to any page (footer is on all pages)
- Scroll to footer
- Open Supabase dashboard (newsletter_subscriptions table)

### Test Steps

1. **Subscribe with valid email:**

   - Enter email: `newsletter.test@example.com`
   - Click send button (arrow icon)
   - ✅ Should show green success message
   - ✅ Email field should be cleared

2. **Test duplicate subscription:**

   - Enter same email again: `newsletter.test@example.com`
   - Click send button
   - ✅ Should show message about already being subscribed

3. **Test invalid email:**
   - Enter invalid email: `invalid-email`
   - ✅ Should show HTML5 validation error

### Database Verification

1. **Check Supabase `newsletter_subscriptions` table:**
   - ✅ New record created with unique email
   - ✅ `status` is set to "active"
   - ✅ `subscribed_at` timestamp is correct
   - ✅ Duplicate email attempt should not create new record

---

## Test 4: Investment Interest Tracking

### Setup

- Navigate to: `http://localhost:3000/investor`
- Open Supabase dashboard (investment_interests table)

### Test Steps

1. **Click "Invest Now" on any project:**

   - ✅ Should show loading state
   - ✅ Should show "Interest Recorded!" success message
   - ✅ Should redirect to KYC page after 1.5 seconds

2. **Test multiple project interests:**
   - Go back to investor page
   - Click "Invest Now" on different projects
   - ✅ Each should create separate interest records

### Database Verification

1. **Check Supabase `investment_interests` table:**
   - ✅ New record created for each project interest
   - ✅ `project_id` and `project_name` stored correctly
   - ✅ `status` is set to "interested"
   - ✅ `created_at` timestamp is correct

---

## Test 5: Error Handling & Edge Cases

### Network Error Simulation

1. **Disconnect internet/block Supabase:**
   - Try submitting KYC form
   - ✅ Should show error message
   - Try submitting contact form
   - ✅ Should show error message
   - Try newsletter subscription
   - ✅ Should show error message

### File Upload Edge Cases

1. **Large file upload (>10MB):**

   - Try uploading large file in KYC
   - ✅ Should handle gracefully (may show error)

2. **Invalid file types:**
   - Try uploading non-image files
   - ✅ Should be restricted by file input accept attribute

### Form Validation Edge Cases

1. **XSS Prevention:**

   - Try entering `<script>alert('xss')</script>` in text fields
   - ✅ Should be safely stored as text, not executed

2. **SQL Injection Prevention:**
   - Try entering `'; DROP TABLE users; --` in text fields
   - ✅ Should be safely stored (Supabase handles this)

---

## Test 6: Performance & User Experience

### Loading States

1. **Verify all loading states work:**
   - ✅ KYC submission shows spinner
   - ✅ Contact form shows "Sending..." text
   - ✅ Newsletter shows spinner icon
   - ✅ Investment interest shows "Processing..."
   - ✅ File uploads show loading during upload

### Success/Error Messages

1. **Verify all feedback messages:**
   - ✅ Success messages are green and clear
   - ✅ Error messages are red and helpful
   - ✅ Messages disappear or are clearable
   - ✅ Form resets after successful submission

### Responsive Design

1. **Test on different screen sizes:**
   - ✅ Forms work on mobile devices
   - ✅ All buttons are clickable
   - ✅ Text is readable
   - ✅ File upload areas are accessible

---

## Test 7: Data Integrity & Security

### Data Validation

1. **Check stored data format:**
   - ✅ JSON fields are properly structured
   - ✅ Timestamps are in correct format
   - ✅ UUIDs are properly generated
   - ✅ No sensitive data is logged in browser console

### Security Checks

1. **Verify RLS policies:**
   - ✅ Can insert data (public insert allowed)
   - ✅ Cannot read other users' data (if implemented)
   - ✅ Cannot update/delete existing records

---

## Test Results Checklist

### KYC Flow

- [ ] All 4 steps complete successfully
- [ ] File uploads work and store URLs
- [ ] Data stored correctly in database
- [ ] Success page displays with application ID
- [ ] Error handling works for network issues

### Contact Form

- [ ] Form submission works
- [ ] Success/error messages display
- [ ] Data stored in database
- [ ] Form validation works

### Newsletter

- [ ] Subscription works
- [ ] Duplicate handling works
- [ ] Data stored in database
- [ ] Validation works

### Investment Interest

- [ ] Interest tracking works
- [ ] Redirects to KYC correctly
- [ ] Data stored in database

### General

- [ ] All loading states work
- [ ] Error handling is user-friendly
- [ ] No console errors
- [ ] Responsive design works
- [ ] Performance is acceptable

---

## Troubleshooting Common Issues

### Database Connection Issues

- Check Supabase URL and API key
- Verify RLS policies are set correctly
- Check network connectivity

### File Upload Issues

- Verify storage bucket exists
- Check file size limits
- Ensure proper file types

### Form Validation Issues

- Check HTML5 validation attributes
- Verify required field handling
- Test with different browsers

### Performance Issues

- Check network requests in dev tools
- Monitor Supabase dashboard for errors
- Verify efficient data queries

---

## Post-Testing Actions

1. **Clean up test data:**

   - Delete test records from all tables
   - Remove test files from storage
   - Reset any test configurations

2. **Document any issues found:**

   - Create bug reports for failures
   - Note performance concerns
   - Suggest improvements

3. **Verify production readiness:**
   - All tests pass
   - Error handling is robust
   - User experience is smooth
   - Security measures are in place
