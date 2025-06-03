import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import DashboardLayout from "../components/layout/DashboardLayout";
import { projectService } from "../lib/supabase";
import { Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DOCUMENT_TYPES = [
  "Business Plan",
  "Financial Projections",
  "Legal Documents",
  "Property Documents",
  "Other Documents",
];

const UploadDocuments = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projectService.getProjects();
      setProjects(data || []);
    } catch (error) {
      setError("Failed to load projects. Please try again.");
    }
  };

  const onDrop = (acceptedFiles) => {
    setUploadedFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => ({
        file,
        status: "pending",
        progress: 0,
      })),
    ]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: true,
  });

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!selectedProject) {
      setError("Please select a project");
      return;
    }

    if (!documentType) {
      setError("Please select a document type");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const { file } = uploadedFiles[i];
        setUploadedFiles((prev) =>
          prev.map((f, index) =>
            index === i ? { ...f, status: "uploading", progress: 0 } : f
          )
        );

        await projectService.uploadProjectDocument(
          file,
          selectedProject,
          documentType
        );

        setUploadedFiles((prev) =>
          prev.map((f, index) =>
            index === i ? { ...f, status: "completed", progress: 100 } : f
          )
        );
      }

      setSuccess("All files uploaded successfully!");
      setTimeout(() => {
        setUploadedFiles([]);
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError("Failed to upload some files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout
      title="Upload Documents"
      subtitle="Upload and manage project documents"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
          {/* Project Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-background text-text-primary border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-gold"
            >
              <option value="">Select a project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-background text-text-primary border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-gold"
            >
              <option value="">Select document type...</option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-gold bg-gold/10"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gold" />
            <p className="text-text-primary font-medium mb-2">
              {isDragActive
                ? "Drop the files here..."
                : "Drag & drop files here, or click to select files"}
            </p>
            <p className="text-text-secondary text-sm">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX
            </p>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-background rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-text-primary font-medium">
                        {file.file.name}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {file.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="mt-4 flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 flex items-center space-x-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <p>{success}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={uploadFiles}
              disabled={uploadedFiles.length === 0 || uploading}
              className={`flex-1 bg-gold text-background py-3 px-4 rounded-lg font-medium ${
                uploadedFiles.length === 0 || uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gold/90"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-700 text-text-primary py-3 px-4 rounded-lg font-medium hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocuments;
