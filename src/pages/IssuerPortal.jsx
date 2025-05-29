import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Upload,
  Bell,
  FileText,
  Calendar,
  Target,
} from "lucide-react";

const IssuerPortal = () => {
  const [showAddProject, setShowAddProject] = useState(false);

  const issuerStats = {
    totalRaised: 2500000,
    activeProjects: 3,
    totalInvestors: 156,
    averageReturn: 7.8,
  };

  const projects = [
    {
      id: 1,
      name: "ENaaS Solar Project",
      category: "Green Energy",
      targetAmount: 1000000,
      raisedAmount: 750000,
      investors: 45,
      status: "Active",
      deadline: "2024-06-30",
    },
    {
      id: 2,
      name: "Green Real Estate Fund",
      category: "Real Estate",
      targetAmount: 2000000,
      raisedAmount: 1200000,
      investors: 78,
      status: "Active",
      deadline: "2024-08-15",
    },
    {
      id: 3,
      name: "Agro Waste Energy",
      category: "Agriculture",
      targetAmount: 500000,
      raisedAmount: 500000,
      investors: 33,
      status: "Completed",
      deadline: "2024-03-31",
    },
  ];

  const recentActivity = [
    {
      type: "investment",
      description: "New investment of RM 5,000 in ENaaS Solar Project",
      time: "2 hours ago",
      project: "ENaaS Solar Project",
    },
    {
      type: "milestone",
      description: "Green Real Estate Fund reached 60% funding",
      time: "1 day ago",
      project: "Green Real Estate Fund",
    },
    {
      type: "document",
      description: "Quarterly report uploaded for Agro Waste Energy",
      time: "3 days ago",
      project: "Agro Waste Energy",
    },
    {
      type: "investor",
      description: "5 new investors joined Green Real Estate Fund",
      time: "1 week ago",
      project: "Green Real Estate Fund",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Completed":
        return "bg-blue-500/20 text-blue-400";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "investment":
        return <DollarSign className="w-4 h-4 text-green-400" />;
      case "milestone":
        return <Target className="w-4 h-4 text-blue-400" />;
      case "document":
        return <FileText className="w-4 h-4 text-purple-400" />;
      case "investor":
        return <Users className="w-4 h-4 text-gold" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout
      title="Issuer Portal"
      subtitle="Manage your projects and track fundraising progress"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Raised"
          value={`RM ${issuerStats.totalRaised.toLocaleString()}`}
          trend="+15.3%"
          icon={DollarSign}
          trendUp={true}
        />
        <StatCard
          title="Active Projects"
          value={issuerStats.activeProjects.toString()}
          trend="+1 this month"
          icon={Building2}
          trendUp={true}
        />
        <StatCard
          title="Total Investors"
          value={issuerStats.totalInvestors.toString()}
          trend="+12 this week"
          icon={Users}
          trendUp={true}
        />
        <StatCard
          title="Average Return"
          value={`${issuerStats.averageReturn}%`}
          trend="+0.5%"
          icon={TrendingUp}
          trendUp={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Your Projects
              </h3>
              <button
                onClick={() => setShowAddProject(true)}
                className="flex items-center space-x-2 bg-gold text-background px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-background rounded-lg p-6 border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary mb-1">
                        {project.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                          {project.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {project.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <ProgressBar
                      current={project.raisedAmount}
                      target={project.targetAmount}
                      label="Funding Progress"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-text-secondary">Raised</p>
                      <p className="text-text-primary font-semibold">
                        RM {project.raisedAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Target</p>
                      <p className="text-text-primary font-semibold">
                        RM {project.targetAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Investors</p>
                      <p className="text-text-primary font-semibold">
                        {project.investors}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-gray-700 text-text-primary py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Update Investors
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowAddProject(true)}
                className="w-full bg-gold text-background py-3 px-4 rounded-lg font-medium hover:bg-gold/90 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Project</span>
              </button>
              <button className="w-full bg-gray-700 text-text-primary py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Documents</span>
              </button>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Send Update</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-text-secondary text-xs">
                        {activity.time}
                      </p>
                      <span className="text-text-secondary text-xs">•</span>
                      <p className="text-text-secondary text-xs">
                        {activity.project}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-gold hover:text-gold/80 text-sm font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md border border-gray-700/50">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Create New Project
            </h3>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gold" />
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  Project Creation Wizard
                </h4>
                <p className="text-text-secondary text-sm mb-6">
                  Our team will guide you through the project creation process,
                  including documentation review, compliance checks, and
                  platform setup.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>Business plan review</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>Shariah compliance verification</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>Legal documentation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>Platform integration</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    alert("Project creation wizard would be implemented here");
                    setShowAddProject(false);
                  }}
                  className="flex-1 bg-gold text-background py-3 rounded-lg font-medium hover:bg-gold/90 transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setShowAddProject(false)}
                  className="flex-1 bg-gray-700 text-text-primary py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default IssuerPortal;
