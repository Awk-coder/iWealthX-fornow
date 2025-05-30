import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Shield,
  CheckCircle,
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { kycService } from "../lib/supabase";

const KYCFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      countryOfResidence: "",
      address: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
      email: "",
      occupation: "",
      employer: "",
      sourceOfIncome: "",
    },
    identityVerification: {
      idType: "",
      idNumber: "",
      idExpiryDate: "",
      idDocument: null,
      proofOfAddress: null,
      selfieWithId: null,
      idDocumentUrl: "",
      proofOfAddressUrl: "",
      selfieWithIdUrl: "",
    },
    financialProfile: {
      annualIncome: "",
      netWorth: "",
      investmentExperience: "",
      riskTolerance: "",
      investmentObjectives: "",
      expectedInvestmentAmount: "",
      sourceOfFunds: "",
      politicallyExposed: false,
      sanctionsCheck: false,
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      icon: User,
      description: "Basic personal details",
    },
    {
      id: 2,
      title: "Identity Verification",
      icon: FileText,
      description: "Upload identity documents",
    },
    {
      id: 3,
      title: "Financial Profile",
      icon: Shield,
      description: "Investment preferences",
    },
    {
      id: 4,
      title: "Review & Submit",
      icon: CheckCircle,
      description: "Confirm your information",
    },
  ];

  const handleInputChange = (field, value) => {
    const [section, key] = field.split(".");
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    try {
      setIsSubmitting(true);
      const { publicUrl } = await kycService.uploadFile(file);

      const [section, key] = field.split(".");
      const urlKey = key + "Url";

      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: file,
          [urlKey]: publicUrl,
        },
      }));
    } catch (error) {
      console.error("File upload error:", error);
      setSubmitError("Failed to upload file. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Submit KYC application to Supabase
      const result = await kycService.createKYCApplication(formData);

      console.log("KYC Application submitted successfully:", result);
      setSubmitSuccess(true);

      // Redirect to success page after a delay
      setTimeout(() => {
        navigate("/kyc-success", { state: { applicationId: result.id } });
      }, 2000);
    } catch (error) {
      console.error("KYC submission error:", error);
      setSubmitError("Failed to submit KYC application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData.personalInfo}
            onChange={handleInputChange}
          />
        );
      case 2:
        return (
          <IdentityVerificationStep
            formData={formData.identityVerification}
            onChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <FinancialProfileStep
            formData={formData.financialProfile}
            onChange={handleInputChange}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Complete Your KYC Verification
          </h1>
          <p className="text-text-secondary text-lg">
            We need to verify your identity to ensure secure investing
          </p>

          {/* Demo Skip Button */}
          <div className="mt-6">
            <button
              onClick={() => {
                localStorage.setItem("kycCompleted", "true");
                navigate("/dashboard");
              }}
              className="text-text-secondary hover:text-gold transition-colors text-sm underline"
            >
              Skip for Demo (Testing Only)
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                    ${
                      isCompleted
                        ? "bg-accent-green text-white"
                        : isActive
                        ? "bg-gold text-background"
                        : "bg-gray-700 text-text-secondary"
                    }
                  `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-gold"
                          : isCompleted
                          ? "text-accent-green"
                          : "text-text-secondary"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden md:block absolute h-0.5 w-24 mt-6 ml-24 ${
                        isCompleted ? "bg-accent-green" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-surface rounded-xl p-8 border border-gray-700/50 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-text-primary hover:bg-gray-600"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-gold text-background px-6 py-3 rounded-lg font-medium hover:bg-gold/90 transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-accent-green text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-green/90 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit KYC</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step Components
const PersonalInfoStep = ({ formData, onChange }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange("personalInfo.firstName", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange("personalInfo.lastName", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange("personalInfo.email", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              onChange("personalInfo.phoneNumber", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="+60 12-345-6789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              onChange("personalInfo.dateOfBirth", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Nationality *
          </label>
          <select
            value={formData.nationality}
            onChange={(e) =>
              onChange("personalInfo.nationality", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select nationality</option>
            <option value="malaysian">Malaysian</option>
            <option value="singaporean">Singaporean</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Country of Residence *
          </label>
          <input
            type="text"
            value={formData.countryOfResidence}
            onChange={(e) =>
              onChange("personalInfo.countryOfResidence", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your country of residence"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange("personalInfo.city", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) =>
              onChange("personalInfo.postalCode", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter postal code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Occupation *
          </label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) =>
              onChange("personalInfo.occupation", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your occupation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Employer *
          </label>
          <input
            type="text"
            value={formData.employer}
            onChange={(e) => onChange("personalInfo.employer", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your employer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Source of Income *
          </label>
          <input
            type="text"
            value={formData.sourceOfIncome}
            onChange={(e) =>
              onChange("personalInfo.sourceOfIncome", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your source of income"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => onChange("personalInfo.address", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your full address"
          />
        </div>
      </div>
    </div>
  );
};

const IdentityVerificationStep = ({ formData, onChange, onFileUpload }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Identity Verification
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            ID Type *
          </label>
          <select
            value={formData.idType}
            onChange={(e) =>
              onChange("identityVerification.idType", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select ID type</option>
            <option value="nric">Malaysian NRIC</option>
            <option value="passport">Passport</option>
            <option value="driving_license">Driving License</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            ID Number *
          </label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) =>
              onChange("identityVerification.idNumber", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your ID number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            ID Expiry Date *
          </label>
          <input
            type="date"
            value={formData.idExpiryDate}
            onChange={(e) =>
              onChange("identityVerification.idExpiryDate", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Upload ID Document *
          </label>
          <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center hover:border-gold/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary text-sm mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-text-secondary text-xs">PNG, JPG up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onFileUpload(
                  "identityVerification.idDocument",
                  e.target.files[0]
                )
              }
              className="hidden"
            />
            {formData.idDocumentUrl && (
              <p className="text-accent-green text-xs mt-2">
                ✓ Document uploaded
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Upload Proof of Address *
          </label>
          <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center hover:border-gold/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary text-sm mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-text-secondary text-xs">PNG, JPG up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onFileUpload(
                  "identityVerification.proofOfAddress",
                  e.target.files[0]
                )
              }
              className="hidden"
            />
            {formData.proofOfAddressUrl && (
              <p className="text-accent-green text-xs mt-2">
                ✓ Document uploaded
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Upload Selfie with ID *
          </label>
          <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center hover:border-gold/50 transition-colors cursor-pointer">
            <Camera className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary text-sm mb-2">
              Take a selfie or upload photo
            </p>
            <p className="text-text-secondary text-xs">
              Clear photo of your face with ID
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onFileUpload(
                  "identityVerification.selfieWithId",
                  e.target.files[0]
                )
              }
              className="hidden"
            />
            {formData.selfieWithIdUrl && (
              <p className="text-accent-green text-xs mt-2">
                ✓ Selfie uploaded
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-accent-amber/10 border border-accent-amber/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-accent-amber mt-0.5" />
          <div>
            <h4 className="text-accent-amber font-medium mb-1">Important</h4>
            <p className="text-accent-amber/80 text-sm">
              Ensure your documents are clear, unedited, and all information is
              visible. This helps us verify your identity quickly and securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialProfileStep = ({ formData, onChange }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Financial Profile
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Annual Income *
          </label>
          <select
            value={formData.annualIncome}
            onChange={(e) =>
              onChange("financialProfile.annualIncome", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select income range</option>
            <option value="below-50000">Below RM 50,000</option>
            <option value="50000-100000">RM 50,000 - RM 100,000</option>
            <option value="100000-200000">RM 100,000 - RM 200,000</option>
            <option value="200000-500000">RM 200,000 - RM 500,000</option>
            <option value="above-500000">Above RM 500,000</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Net Worth *
          </label>
          <select
            value={formData.netWorth}
            onChange={(e) =>
              onChange("financialProfile.netWorth", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select net worth range</option>
            <option value="below-100000">Below RM 100,000</option>
            <option value="100000-500000">RM 100,000 - RM 500,000</option>
            <option value="500000-1000000">RM 500,000 - RM 1,000,000</option>
            <option value="1000000-5000000">RM 1,000,000 - RM 5,000,000</option>
            <option value="above-5000000">Above RM 5,000,000</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Investment Experience *
          </label>
          <select
            value={formData.investmentExperience}
            onChange={(e) =>
              onChange("financialProfile.investmentExperience", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner (0-1 years)</option>
            <option value="intermediate">Intermediate (1-5 years)</option>
            <option value="experienced">Experienced (5+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Risk Tolerance *
          </label>
          <select
            value={formData.riskTolerance}
            onChange={(e) =>
              onChange("financialProfile.riskTolerance", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select risk tolerance</option>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Investment Objectives *
          </label>
          <select
            value={formData.investmentObjectives}
            onChange={(e) =>
              onChange("financialProfile.investmentObjectives", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select investment objectives</option>
            <option value="capital-preservation">Capital Preservation</option>
            <option value="income-generation">Income Generation</option>
            <option value="capital-growth">Capital Growth</option>
            <option value="speculation">Speculation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Expected Investment Amount *
          </label>
          <select
            value={formData.expectedInvestmentAmount}
            onChange={(e) =>
              onChange(
                "financialProfile.expectedInvestmentAmount",
                e.target.value
              )
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select investment amount</option>
            <option value="below-10000">Below RM 10,000</option>
            <option value="10000-50000">RM 10,000 - RM 50,000</option>
            <option value="50000-100000">RM 50,000 - RM 100,000</option>
            <option value="100000-500000">RM 100,000 - RM 500,000</option>
            <option value="above-500000">Above RM 500,000</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Source of Funds *
          </label>
          <select
            value={formData.sourceOfFunds}
            onChange={(e) =>
              onChange("financialProfile.sourceOfFunds", e.target.value)
            }
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select source of funds</option>
            <option value="salary">Salary/Employment Income</option>
            <option value="business">Business Income</option>
            <option value="investments">Investment Returns</option>
            <option value="inheritance">Inheritance</option>
            <option value="savings">Personal Savings</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="politicallyExposed"
            checked={formData.politicallyExposed}
            onChange={(e) =>
              onChange("financialProfile.politicallyExposed", e.target.checked)
            }
            className="w-4 h-4 text-gold bg-background border-gray-700 rounded focus:ring-gold focus:ring-2"
          />
          <label
            htmlFor="politicallyExposed"
            className="text-text-secondary text-sm"
          >
            I am a Politically Exposed Person (PEP) or related to one
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="sanctionsCheck"
            checked={formData.sanctionsCheck}
            onChange={(e) =>
              onChange("financialProfile.sanctionsCheck", e.target.checked)
            }
            className="w-4 h-4 text-gold bg-background border-gray-700 rounded focus:ring-gold focus:ring-2"
          />
          <label
            htmlFor="sanctionsCheck"
            className="text-text-secondary text-sm"
          >
            I confirm that I am not subject to any sanctions or restrictions
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={(e) =>
              onChange("financialProfile.termsAccepted", e.target.checked)
            }
            className="w-4 h-4 text-gold bg-background border-gray-700 rounded focus:ring-gold focus:ring-2"
          />
          <label
            htmlFor="termsAccepted"
            className="text-text-secondary text-sm"
          >
            I agree to the Terms and Conditions *
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={(e) =>
              onChange("financialProfile.privacyAccepted", e.target.checked)
            }
            className="w-4 h-4 text-gold bg-background border-gray-700 rounded focus:ring-gold focus:ring-2"
          />
          <label
            htmlFor="privacyAccepted"
            className="text-text-secondary text-sm"
          >
            I agree to the Privacy Policy *
          </label>
        </div>
      </div>

      <div className="mt-8 p-6 bg-surface border border-gray-700/50 rounded-lg">
        <h4 className="text-lg font-semibold text-text-primary mb-4">
          Shariah Compliance
        </h4>
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-gold" />
          <div>
            <p className="text-text-primary font-medium">
              All investments on iWealthX are Shariah-compliant
            </p>
            <p className="text-text-secondary text-sm">
              Our Shariah advisory board ensures all opportunities meet Islamic
              finance principles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewStep = ({
  formData,
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) => {
  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          KYC Application Submitted Successfully!
        </h3>
        <p className="text-text-secondary">
          Your application is being processed. You will receive an email
          confirmation shortly.
        </p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          Processing Your KYC Application
        </h3>
        <p className="text-text-secondary">
          Please wait while we verify your information...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Review & Submit
      </h3>

      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <h4 className="text-red-500 font-medium">Submission Error</h4>
              <p className="text-red-500/80 text-sm">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-background rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">First Name:</span>
              <span className="text-text-primary ml-2">
                {formData.personalInfo.firstName}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Last Name:</span>
              <span className="text-text-primary ml-2">
                {formData.personalInfo.lastName}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Email:</span>
              <span className="text-text-primary ml-2">
                {formData.personalInfo.email}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Phone:</span>
              <span className="text-text-primary ml-2">
                {formData.personalInfo.phoneNumber}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Nationality:</span>
              <span className="text-text-primary ml-2">
                {formData.personalInfo.nationality}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Country of Residence:</span>
              <span className="text-text-primary ml-2">
                {formData.personalInfo.countryOfResidence}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Identity Verification
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">ID Type:</span>
              <span className="text-text-primary ml-2">
                {formData.identityVerification.idType}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">ID Number:</span>
              <span className="text-text-primary ml-2">
                {formData.identityVerification.idNumber}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Documents:</span>
              <span className="text-text-primary ml-2">
                {formData.identityVerification.idDocumentUrl &&
                formData.identityVerification.proofOfAddressUrl &&
                formData.identityVerification.selfieWithIdUrl
                  ? "All documents uploaded ✓"
                  : "Missing documents"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Financial Profile
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Annual Income:</span>
              <span className="text-text-primary ml-2">
                {formData.financialProfile.annualIncome}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Net Worth:</span>
              <span className="text-text-primary ml-2">
                {formData.financialProfile.netWorth}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">
                Investment Experience:
              </span>
              <span className="text-text-primary ml-2">
                {formData.financialProfile.investmentExperience}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Risk Tolerance:</span>
              <span className="text-text-primary ml-2">
                {formData.financialProfile.riskTolerance}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-accent-green/10 border border-accent-green/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-accent-green" />
          <div>
            <h4 className="text-accent-green font-medium">Ready to Submit</h4>
            <p className="text-accent-green/80 text-sm">
              Your KYC application is complete and ready for verification.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-accent-green text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit KYC Application"}
        </button>
      </div>
    </div>
  );
};

export default KYCFlow;
