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

const KYCFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",

    // Identity Verification
    idType: "",
    idNumber: "",
    idDocument: null,
    selfieDocument: null,

    // Financial Information
    occupation: "",
    monthlyIncome: "",
    investmentExperience: "",
    riskTolerance: "",
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
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

  const handleSubmit = () => {
    // Simulate KYC submission and mark as completed
    localStorage.setItem("kycCompleted", "true");
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep formData={formData} onChange={handleInputChange} />
        );
      case 2:
        return (
          <IdentityVerificationStep
            formData={formData}
            onChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <FinancialProfileStep
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 4:
        return <ReviewStep formData={formData} onSubmit={handleSubmit} />;
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
          <div className="relative flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1 relative"
                >
                  {/* Connecting line - only show if not the last step */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full h-0.5 z-0">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? "bg-accent-green" : "bg-gray-700"
                        }`}
                        style={{ width: "calc(100% - 3rem)" }}
                      />
                    </div>
                  )}

                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all relative z-10
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
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
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
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
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
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Nationality *
          </label>
          <select
            value={formData.nationality}
            onChange={(e) => onChange("nationality", e.target.value)}
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
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your city"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
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
            onChange={(e) => onChange("idType", e.target.value)}
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
            onChange={(e) => onChange("idNumber", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your ID number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Upload ID Document *
          </label>
          <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
            <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary text-sm mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-text-secondary text-xs">PNG, JPG up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileUpload("idDocument", e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Upload Selfie *
          </label>
          <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
            <Camera className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary text-sm mb-2">
              Take a selfie or upload photo
            </p>
            <p className="text-text-secondary text-xs">
              Clear photo of your face
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onFileUpload("selfieDocument", e.target.files[0])
              }
              className="hidden"
            />
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
            Occupation *
          </label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => onChange("occupation", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="Enter your occupation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Monthly Income *
          </label>
          <select
            value={formData.monthlyIncome}
            onChange={(e) => onChange("monthlyIncome", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select income range</option>
            <option value="below-3000">Below RM 3,000</option>
            <option value="3000-5000">RM 3,000 - RM 5,000</option>
            <option value="5000-10000">RM 5,000 - RM 10,000</option>
            <option value="10000-20000">RM 10,000 - RM 20,000</option>
            <option value="above-20000">Above RM 20,000</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Investment Experience *
          </label>
          <select
            value={formData.investmentExperience}
            onChange={(e) => onChange("investmentExperience", e.target.value)}
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
            onChange={(e) => onChange("riskTolerance", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
          >
            <option value="">Select risk tolerance</option>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
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

const ReviewStep = ({ formData, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit();
    }, 2000);
  };

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

      <div className="space-y-6">
        <div className="bg-background rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Full Name:</span>
              <span className="text-text-primary ml-2">
                {formData.fullName}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Email:</span>
              <span className="text-text-primary ml-2">{formData.email}</span>
            </div>
            <div>
              <span className="text-text-secondary">Phone:</span>
              <span className="text-text-primary ml-2">{formData.phone}</span>
            </div>
            <div>
              <span className="text-text-secondary">Nationality:</span>
              <span className="text-text-primary ml-2">
                {formData.nationality}
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
              <span className="text-text-primary ml-2">{formData.idType}</span>
            </div>
            <div>
              <span className="text-text-secondary">ID Number:</span>
              <span className="text-text-primary ml-2">
                {formData.idNumber}
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
              <span className="text-text-secondary">Occupation:</span>
              <span className="text-text-primary ml-2">
                {formData.occupation}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Monthly Income:</span>
              <span className="text-text-primary ml-2">
                {formData.monthlyIncome}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">
                Investment Experience:
              </span>
              <span className="text-text-primary ml-2">
                {formData.investmentExperience}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Risk Tolerance:</span>
              <span className="text-text-primary ml-2">
                {formData.riskTolerance}
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
          onClick={handleSubmit}
          className="bg-accent-green text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-green/90 transition-all"
        >
          Submit KYC Application
        </button>
      </div>
    </div>
  );
};

export default KYCFlow;
