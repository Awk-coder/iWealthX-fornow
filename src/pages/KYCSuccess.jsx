import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Clock, Mail, ArrowLeft } from "lucide-react";

const KYCSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationId = location.state?.applicationId;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <CheckCircle className="w-20 h-20 text-accent-green mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            KYC Application Submitted Successfully!
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Thank you for completing your Know Your Customer (KYC) verification.
            Your application is now being reviewed by our compliance team.
          </p>
        </div>

        {applicationId && (
          <div className="bg-surface border border-gray-700/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Application ID:</span>
                <span className="text-text-primary ml-2 font-mono">
                  {applicationId}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Submission Date:</span>
                <span className="text-text-primary ml-2">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Status:</span>
                <span className="text-accent-amber ml-2">Under Review</span>
              </div>
              <div>
                <span className="text-text-secondary">
                  Expected Processing:
                </span>
                <span className="text-text-primary ml-2">
                  2-3 Business Days
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface border border-gray-700/50 rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-accent-amber mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Review Process
            </h3>
            <p className="text-text-secondary text-sm">
              Our compliance team will review your documents and information
              within 2-3 business days.
            </p>
          </div>

          <div className="bg-surface border border-gray-700/50 rounded-lg p-6 text-center">
            <Mail className="w-12 h-12 text-accent-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Email Updates
            </h3>
            <p className="text-text-secondary text-sm">
              You'll receive email notifications about your application status
              and any additional requirements.
            </p>
          </div>

          <div className="bg-surface border border-gray-700/50 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Account Activation
            </h3>
            <p className="text-text-secondary text-sm">
              Once approved, your account will be activated and you can start
              investing in Shariah-compliant opportunities.
            </p>
          </div>
        </div>

        <div className="bg-accent-amber/10 border border-accent-amber/20 rounded-lg p-6 mb-8">
          <h3 className="text-accent-amber font-semibold mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-accent-amber/90 text-sm">
            <li>• Our compliance team will verify your identity documents</li>
            <li>• We may contact you if additional information is required</li>
            <li>
              • You'll receive an email confirmation once your KYC is approved
            </li>
            <li>
              • Your investment account will be activated for Shariah-compliant
              opportunities
            </li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gold text-background px-8 py-3 rounded-lg font-medium hover:bg-gold/90 transition-all inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Homepage
          </button>

          <p className="text-text-secondary text-sm">
            Questions about your application? Contact us at{" "}
            <a
              href="mailto:support@iwealthx.com"
              className="text-gold hover:underline"
            >
              support@iwealthx.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCSuccess;
