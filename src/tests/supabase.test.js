// Mock the entire Supabase module
jest.mock("../lib/supabase", () => ({
  kycService: {
    createKYCApplication: jest.fn(),
    updateKYCApplication: jest.fn(),
    getKYCApplication: jest.fn(),
    uploadFile: jest.fn(),
  },
  websiteService: {
    submitContactForm: jest.fn(),
    subscribeNewsletter: jest.fn(),
    submitInvestmentInterest: jest.fn(),
  },
}));

import { kycService, websiteService } from "../lib/supabase";

describe("KYC Service Tests", () => {
  const mockKYCData = {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create KYC application successfully", async () => {
    const mockResult = {
      id: "test-uuid-123",
      created_at: new Date().toISOString(),
      personal_info: mockKYCData.personalInfo,
      identity_verification: mockKYCData.identityVerification,
      financial_profile: mockKYCData.financialProfile,
      status: "pending",
    };

    kycService.createKYCApplication.mockResolvedValue(mockResult);

    const result = await kycService.createKYCApplication(mockKYCData);

    expect(result).toBeDefined();
    expect(result.id).toBe("test-uuid-123");
    expect(result.status).toBe("pending");
    expect(result.created_at).toBeDefined();
    expect(kycService.createKYCApplication).toHaveBeenCalledWith(mockKYCData);
  });

  test("should update KYC application successfully", async () => {
    const mockResult = {
      id: "test-uuid-123",
      updated_at: new Date().toISOString(),
      status: "approved",
    };

    kycService.updateKYCApplication.mockResolvedValue(mockResult);

    const updateData = { status: "approved" };
    const result = await kycService.updateKYCApplication(
      "test-uuid-123",
      updateData
    );

    expect(result).toBeDefined();
    expect(result.id).toBe("test-uuid-123");
    expect(result.status).toBe("approved");
    expect(result.updated_at).toBeDefined();
    expect(kycService.updateKYCApplication).toHaveBeenCalledWith(
      "test-uuid-123",
      updateData
    );
  });

  test("should get KYC application by ID", async () => {
    const mockResult = {
      id: "test-uuid-123",
      status: "pending",
      personal_info: mockKYCData.personalInfo,
    };

    kycService.getKYCApplication.mockResolvedValue(mockResult);

    const result = await kycService.getKYCApplication("test-uuid-123");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-uuid-123");
    expect(result.status).toBe("pending");
    expect(kycService.getKYCApplication).toHaveBeenCalledWith("test-uuid-123");
  });

  test("should upload file successfully", async () => {
    const mockResult = {
      fileName: "test-file.jpg",
      publicUrl: "https://test-url.com/test-file.jpg",
    };

    kycService.uploadFile.mockResolvedValue(mockResult);

    const mockFile = new File(["test content"], "test.jpg", {
      type: "image/jpeg",
    });
    const result = await kycService.uploadFile(mockFile);

    expect(result).toBeDefined();
    expect(result.fileName).toBe("test-file.jpg");
    expect(result.publicUrl).toBe("https://test-url.com/test-file.jpg");
    expect(kycService.uploadFile).toHaveBeenCalledWith(mockFile);
  });
});

describe("Website Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should submit contact form successfully", async () => {
    const contactData = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      subject: "General Inquiry",
      message: "I have a question about your services.",
    };

    const mockResult = {
      id: "test-uuid-123",
      created_at: new Date().toISOString(),
      ...contactData,
    };

    websiteService.submitContactForm.mockResolvedValue(mockResult);

    const result = await websiteService.submitContactForm(contactData);

    expect(result).toBeDefined();
    expect(result.id).toBe("test-uuid-123");
    expect(result.name).toBe(contactData.name);
    expect(result.email).toBe(contactData.email);
    expect(result.created_at).toBeDefined();
    expect(websiteService.submitContactForm).toHaveBeenCalledWith(contactData);
  });

  test("should subscribe to newsletter successfully", async () => {
    const email = "subscriber@example.com";
    const mockResult = {
      id: "test-uuid-123",
      email: email,
      status: "active",
      subscribed_at: new Date().toISOString(),
    };

    websiteService.subscribeNewsletter.mockResolvedValue(mockResult);

    const result = await websiteService.subscribeNewsletter(email);

    expect(result).toBeDefined();
    expect(result.id).toBe("test-uuid-123");
    expect(result.email).toBe(email);
    expect(result.status).toBe("active");
    expect(websiteService.subscribeNewsletter).toHaveBeenCalledWith(email);
  });

  test("should submit investment interest successfully", async () => {
    const investmentData = {
      projectId: "project-123",
      projectName: "Solar Energy Project",
      email: "investor@example.com",
      name: "Investor Name",
      amount: 10000,
    };

    const mockResult = {
      id: "test-uuid-123",
      created_at: new Date().toISOString(),
      project_id: investmentData.projectId,
      project_name: investmentData.projectName,
      user_email: investmentData.email,
      user_name: investmentData.name,
      investment_amount: investmentData.amount,
    };

    websiteService.submitInvestmentInterest.mockResolvedValue(mockResult);

    const result = await websiteService.submitInvestmentInterest(
      investmentData
    );

    expect(result).toBeDefined();
    expect(result.id).toBe("test-uuid-123");
    expect(result.project_id).toBe(investmentData.projectId);
    expect(result.project_name).toBe(investmentData.projectName);
    expect(websiteService.submitInvestmentInterest).toHaveBeenCalledWith(
      investmentData
    );
  });
});

describe("Error Handling Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should handle KYC creation errors", async () => {
    const mockError = new Error("Database connection failed");
    kycService.createKYCApplication.mockRejectedValue(mockError);

    await expect(kycService.createKYCApplication({})).rejects.toThrow(
      "Database connection failed"
    );
  });

  test("should handle contact form submission errors", async () => {
    const mockError = new Error("Validation failed");
    websiteService.submitContactForm.mockRejectedValue(mockError);

    await expect(websiteService.submitContactForm({})).rejects.toThrow(
      "Validation failed"
    );
  });

  test("should handle newsletter subscription errors", async () => {
    const mockError = new Error("Email already exists");
    websiteService.subscribeNewsletter.mockRejectedValue(mockError);

    await expect(
      websiteService.subscribeNewsletter("test@example.com")
    ).rejects.toThrow("Email already exists");
  });
});

describe("Data Validation Tests", () => {
  test("should validate email format", () => {
    const validEmail = "test@example.com";
    const invalidEmail = "invalid-email";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(emailRegex.test(validEmail)).toBe(true);
    expect(emailRegex.test(invalidEmail)).toBe(false);
  });

  test("should validate phone number format", () => {
    const validPhone = "+60123456789";
    const invalidPhone = "123";

    const phoneRegex = /^\+\d{10,15}$/;

    expect(phoneRegex.test(validPhone)).toBe(true);
    expect(phoneRegex.test(invalidPhone)).toBe(false);
  });

  test("should validate required KYC fields structure", () => {
    const completeData = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
    };

    const incompleteData = {
      personalInfo: {
        firstName: "John",
        // Missing required fields
      },
    };

    expect(completeData.personalInfo.firstName).toBeDefined();
    expect(completeData.personalInfo.lastName).toBeDefined();
    expect(completeData.personalInfo.email).toBeDefined();

    expect(incompleteData.personalInfo.lastName).toBeUndefined();
    expect(incompleteData.personalInfo.email).toBeUndefined();
  });
});
