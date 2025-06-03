import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../lib/supabase";

const CreateProject = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    investmentType: "real_estate", // default value
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const project = await projectService.createProject(formData);
      navigate(`/upload-documents/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-8">
          Create New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Project Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label
              htmlFor="targetAmount"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Target Amount (USD) *
            </label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              required
              value={formData.targetAmount}
              onChange={handleInputChange}
              min="0"
              step="1000"
              className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
              placeholder="Enter target amount"
            />
          </div>

          <div>
            <label
              htmlFor="investmentType"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Investment Type *
            </label>
            <select
              id="investmentType"
              name="investmentType"
              required
              value={formData.investmentType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-gray-700/50 rounded-lg text-text-primary focus:outline-none focus:border-gold/50"
            >
              <option value="real_estate">Real Estate</option>
              <option value="business">Business</option>
              <option value="startup">Startup</option>
              <option value="commodity">Commodity</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold text-background px-6 py-3 rounded-lg font-medium hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                Creating Project...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
