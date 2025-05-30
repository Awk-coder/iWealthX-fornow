/**
 * Integration Tests for Supabase Functionality
 *
 * These tests run against a real Supabase instance.
 * Make sure to use a test database, not production!
 *
 * To run: npm test -- --testNamePattern="Integration"
 */

import { kycService, websiteService, supabase } from "../lib/supabase";

// Test configuration
const TEST_CONFIG = {
  // Set to true to run integration tests against real Supabase
  // Make sure you're using a test database!
  ENABLE_INTEGRATION_TESTS:
    process.env.NODE_ENV === "test" &&
    process.env.SUPABASE_TEST_MODE === "true",

  // Test data cleanup - set to true to clean up test data after tests
  CLEANUP_TEST_DATA: true,

  // Test identifiers to help with cleanup
  TEST_EMAIL_PREFIX: "test.integration.",
  TEST_NAME_PREFIX: "TEST_",
};

// Skip integration tests if not enabled
const describeIntegration = TEST_CONFIG.ENABLE_INTEGRATION_TESTS
  ? describe
  : describe.skip;

describeIntegration("Supabase Integration Tests", () => {
  let testDataIds = {
    kycApplications: [],
    contactSubmissions: [],
    newsletterSubscriptions: [],
    investmentInterests: [],
  };

  // Cleanup function to remove test data
  const cleanupTestData = async () => {
    if (!TEST_CONFIG.CLEANUP_TEST_DATA) return;

    try {
      // Clean up KYC applications
      if (testDataIds.kycApplications.length > 0) {
        await supabase
          .from("kyc_applications")
          .delete()
          .in("id", testDataIds.kycApplications);
      }

      // Clean up contact submissions
      if (testDataIds.contactSubmissions.length > 0) {
        await supabase
          .from("contact_submissions")
          .delete()
          .in("id", testDataIds.contactSubmissions);
      }

      // Clean up newsletter subscriptions
      if (testDataIds.newsletterSubscriptions.length > 0) {
        await supabase
          .from("newsletter_subscriptions")
          .delete()
          .in("id", testDataIds.newsletterSubscriptions);
      }

      // Clean up investment interests
      if (testDataIds.investmentInterests.length > 0) {
        await supabase
          .from("investment_interests")
          .delete()
          .in("id", testDataIds.investmentInterests);
      }

      console.log("✅ Test data cleaned up successfully");
    } catch (error) {
      console.error("❌ Error cleaning up test data:", error);
    }
  };

  // Run cleanup after all tests
  afterAll(async () => {
    await cleanupTestData();
  });

  describe("KYC Service Integration", () => {
    const mockKYCData = {
      personalInfo: {
        firstName: `${TEST_CONFIG.TEST_NAME_PREFIX}John`,
        lastName: `${TEST_CONFIG.TEST_NAME_PREFIX}Doe`,
        email: `${TEST_CONFIG.TEST_EMAIL_PREFIX}john.doe@example.com`,
        phoneNumber: "+60123456789",
        dateOfBirth: "1990-01-01",
        nationality: "malaysian",
        countryOfResidence: "Malaysia",
        address: "123 Test Street",
        city: "Kuala Lumpur",
        postalCode: "50000",
        occupation: "Software Engineer",
        employer: "Tech Company",
        sourceOfIncome: "Employment",
      },
      identityVerification: {
        idType: "nric",
        idNumber: "901234567890",
        idExpiryDate: "2030-01-01",
        idDocumentUrl: "https://test-url.com/id.jpg",
        proofOfAddressUrl: "https://test-url.com/address.jpg",
        selfieWithIdUrl: "https://test-url.com/selfie.jpg",
      },
      financialProfile: {
        annualIncome: "50000-100000",
        netWorth: "100000-500000",
        investmentExperience: "intermediate",
        riskTolerance: "moderate",
        investmentObjectives: "capital-growth",
        expectedInvestmentAmount: "10000-50000",
        sourceOfFunds: "salary",
        politicallyExposed: false,
        sanctionsCheck: true,
        termsAccepted: true,
        privacyAccepted: true,
      },
    };

    test("should create KYC application in database", async () => {
      const result = await kycService.createKYCApplication(mockKYCData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe("string");
      expect(result.personal_info).toEqual(mockKYCData.personalInfo);
      expect(result.identity_verification).toEqual(
        mockKYCData.identityVerification
      );
      expect(result.financial_profile).toEqual(mockKYCData.financialProfile);
      expect(result.status).toBe("pending");
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();

      // Store ID for cleanup
      testDataIds.kycApplications.push(result.id);
    }, 10000);

    test("should submit contact form to database", async () => {
      const contactData = {
        name: `${TEST_CONFIG.TEST_NAME_PREFIX}Jane Smith`,
        email: `${TEST_CONFIG.TEST_EMAIL_PREFIX}jane.smith@example.com`,
        subject: "Test Inquiry",
        message: "This is a test message for integration testing.",
      };

      const result = await websiteService.submitContactForm(contactData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(contactData.name);
      expect(result.email).toBe(contactData.email);
      expect(result.subject).toBe(contactData.subject);
      expect(result.message).toBe(contactData.message);
      expect(result.created_at).toBeDefined();

      // Store ID for cleanup
      testDataIds.contactSubmissions.push(result.id);
    }, 10000);
  });
});
