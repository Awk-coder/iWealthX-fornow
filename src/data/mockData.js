// Mock data for iWealthX investment platform demo

// Import images from assets
import re1 from "../assets/re1.png";
import re2 from "../assets/re2.png";
import re3 from "../assets/re3.png";
import solarpanel from "../assets/solarpanel.png";
import solar from "../assets/solar.png";
import wind from "../assets/wind.png";
import hydro from "../assets/hydro.png";
import dinar from "../assets/dinar.png";
import waste from "../assets/waste.png";
import waqf from "../assets/waqf.png";
import health from "../assets/health.png";

export const mockUser = {
  name: "Ahmed Hassan",
  email: "ahmed@example.com",
  kycStatus: "verified",
  walletBalance: 8500,
  totalInvestment: 25000,
  totalReturns: 2100,
  monthlyReturn: 7.8,
  memberSince: "2023-06-15",
};

export const mockPortfolio = [
  {
    id: 1,
    name: "ENaaS Solar Project",
    type: "Energy",
    investedAmount: 10000,
    currentValue: 10820,
    return: 8.2,
    tokens: 100,
    status: "active",
    location: "Selangor, Malaysia",
    image: solar,
  },
  {
    id: 2,
    name: "Green Real Estate Fund",
    type: "Real Estate",
    investedAmount: 8000,
    currentValue: 8520,
    return: 6.5,
    tokens: 80,
    status: "active",
    location: "Kuala Lumpur, Malaysia",
    image: re2,
  },
  {
    id: 3,
    name: "Agro Waste to Energy",
    type: "Energy",
    investedAmount: 7000,
    currentValue: 7504,
    return: 7.2,
    tokens: 70,
    status: "active",
    location: "Putrajaya, Malaysia",
    image: waste,
  },
];

export const mockOpportunities = [
  // Green Energy Projects
  {
    id: 1,
    name: "ENaaS Solution",
    description:
      "Energy-as-a-Service provides residential and commercial customers with solar power, battery storage, or combined solutions without the burden of ownership. Our model follows a subscription-based approach where the assets remain company-owned.",
    type: "Energy",
    category: "Energy",
    expectedReturn: 7,
    duration: "5 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 3500000,
    currentFunding: 2450000,
    investorCount: 245,
    shariahCompliant: true,
    riskLevel: "Medium",
    location: "Malaysia",
    image: solar,
    highlights: [
      "No asset ownership required by customers",
      "Digitalized onboarding for seamless engagement",
      "Flexible options: NEM or SELCO (with battery)",
      "Minimum contracts of approximately 5 years",
    ],
    status: "active",
    isPilot: true,
  },
  {
    id: 2,
    name: "Agro Waste to Energy",
    description:
      "This innovative project converts agricultural waste into energy-efficient pellets, reducing carbon emissions while promoting renewable energy adoption. It creates a sustainable cycle that supports local farmers through additional income streams.",
    type: "Energy",
    category: "Energy",
    expectedReturn: 7.2,
    duration: "8 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 10000000,
    currentFunding: 7200000,
    investorCount: 360,
    shariahCompliant: true,
    riskLevel: "Medium",
    location: "Putrajaya, Malaysia",
    image: waste,
    highlights: [
      "Waste-to-energy technology",
      "Sustainable biomass fuel production",
      "Reduces agricultural waste",
      "Supports local farming communities",
    ],
    status: "active",
  },
  {
    id: 3,
    name: "Wind Rural Electrification",
    description:
      "Investing in wind power supports the global shift to renewable energy while offering steady returns. As technology improves and demand for clean energy rises, wind power stands out for its sustainability and growth potential.",
    type: "Energy",
    category: "Energy",
    expectedReturn: 6.8,
    duration: "7 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 3000000,
    currentFunding: 2040000,
    investorCount: 204,
    shariahCompliant: true,
    riskLevel: "Medium",
    location: "EcoEnergy",
    image: wind,
    highlights: [
      "Renewable energy infrastructure",
      "Government backed project",
      "Social impact investment",
      "Green energy credits",
    ],
    status: "active",
  },
  {
    id: 4,
    name: "Hydro Power Expansion",
    description:
      "This project focuses on expanding hydroelectric power generation in remote areas, supplying consistent electricity to villages, reducing emissions, and creating local jobs. It aims to improve living standards and support small businesses.",
    type: "Energy",
    category: "Energy",
    expectedReturn: 8,
    duration: "10 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 5000000,
    currentFunding: 4000000,
    investorCount: 200,
    shariahCompliant: true,
    riskLevel: "Low",
    location: "Malaysia",
    image: hydro,
    highlights: [
      "Established hydropower technology",
      "Guaranteed power offtake",
      "Environmental sustainability",
      "Government support",
    ],
    status: "active",
  },
  {
    id: 5,
    name: "SolarGrid Initiative",
    description:
      "SolarGrid aims to install off-grid solar power systems in rural communities across Kenya. This project provides sustainable, clean energy to over 10,000 households, reducing reliance on fossil fuels and improving quality of life.",
    type: "Energy",
    category: "Energy",
    expectedReturn: 7.5,
    duration: "8 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 4000000,
    currentFunding: 3000000,
    investorCount: 150,
    shariahCompliant: true,
    riskLevel: "Medium",
    location: "Africa & Asia",
    image: solarpanel,
    highlights: [
      "Multi-country deployment",
      "Advanced solar technology",
      "Diversified revenue streams",
      "Carbon credit benefits",
    ],
    status: "active",
  },
  // Real Estate Projects
  {
    id: 6,
    name: "Student Housing",
    description:
      "This project leverages state-of-the-art 3D printing technology to construct modern, affordable student housing near major universities in Selangor. Managed by a reputable property management firm, the development offers durable, cost-effective living spaces.",
    type: "Real Estate",
    category: "Real Estate",
    expectedReturn: 5,
    duration: "5 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 5000000,
    currentFunding: 2500000,
    investorCount: 125,
    shariahCompliant: true,
    riskLevel: "Low",
    location: "Selangor, Malaysia",
    image: re1,
    highlights: [
      "Strategic location near major universities",
      "Fully managed property",
      "High occupancy rates",
      "3D printing construction technology",
    ],
    status: "active",
  },
  {
    id: 7,
    name: "Viaa Residences",
    description:
      "Viaa Residences provides 5-star serviced apartments in the up-and-coming KL EcoCity. Managed by Five Senses, these luxury Airbnb units cater to business travelers and tourists. Investors can expect consistent rental income along with capital appreciation.",
    type: "Real Estate",
    category: "Real Estate",
    expectedReturn: 8.5,
    duration: "5 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 8000000,
    currentFunding: 6800000,
    investorCount: 340,
    shariahCompliant: true,
    riskLevel: "Medium",
    location: "KL EcoCity, Kuala Lumpur",
    image: re2,
    highlights: [
      "Prime location in KL EcoCity",
      "Integrated development",
      "Premium facilities",
      "High rental demand",
    ],
    status: "active",
  },
  {
    id: 8,
    name: "Face Suites",
    description:
      "Face Suites offers high-end 5-star Airbnb accommodation in the prestigious KLCC area, managed by luxury property manager Five Senses. Investors benefit from strong short-term rental income, with potential capital appreciation.",
    type: "Real Estate",
    category: "Real Estate",
    expectedReturn: 9,
    duration: "5 years",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 10000000,
    currentFunding: 9000000,
    investorCount: 450,
    shariahCompliant: true,
    riskLevel: "Medium",
    location: "KLCC, Kuala Lumpur",
    image: re3,
    highlights: [
      "Prime KLCC location",
      "Iconic development",
      "Luxury amenities",
      "International tenant pool",
    ],
    status: "active",
  },
  // Gold Investment
  {
    id: 9,
    name: "Gold Dinar",
    description:
      "The Gold Dinar represents a Shariah-compliant investment in physical gold, offering a hedge against inflation and currency fluctuations. This innovative product combines traditional Islamic finance principles with modern investment accessibility.",
    type: "Agriculture",
    category: "Agriculture",
    expectedReturn: 10.5,
    duration: "Flexible",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 10000000,
    currentFunding: 8500000,
    investorCount: 425,
    shariahCompliant: true,
    riskLevel: "Low",
    location: "Bursa Malaysia",
    image: dinar,
    highlights: [
      "Physical gold backing",
      "Daily liquidity",
      "Secure vault storage",
      "Shariah-compliant structure",
    ],
    status: "active",
  },
  // Healthcare/Charity Projects
  {
    id: 10,
    name: "Waqf Solar for Surau",
    description:
      "This Waqf initiative funds solar panel installations for a surau in Bangi, reducing electricity costs and promoting sustainable energy use. Contributors support a long-term charitable cause with no expected financial returns.",
    type: "Healthcare",
    category: "Healthcare",
    expectedReturn: 0,
    duration: "N/A",
    minInvestment: 100,
    tokenPrice: 10,
    targetAmount: 500000,
    currentFunding: 350000,
    investorCount: 175,
    shariahCompliant: true,
    riskLevel: "Low",
    location: "Bangi, Malaysia",
    image: waqf,
    highlights: [
      "Islamic Waqf-based charity",
      "Funds renewable energy for surau",
      "No financial returns expected",
      "Supports community sustainability",
    ],
    status: "active",
  },
  {
    id: 11,
    name: "Mujtaba Helping Foundation",
    description:
      "Founded in 2018 by Mr. SM Mustafa Ahmed, MHF emerged from personal tragedy to become a mission-driven organization focused on making healthcare accessible and affordable for underprivileged families.",
    type: "Healthcare",
    category: "Healthcare",
    expectedReturn: 0,
    duration: "1 year",
    minInvestment: 1000,
    tokenPrice: 100,
    targetAmount: 500000,
    currentFunding: 350000,
    investorCount: 175,
    shariahCompliant: true,
    riskLevel: "Low",
    location: "Hyderabad, India",
    image: health,
    highlights: [
      "38,000+ families impacted",
      "2,500+ health camps conducted",
      "₹9.5 crore in medical savings",
      "Coverage for entire family",
    ],
    status: "active",
  },
];

export const mockTransactions = [
  {
    id: 1,
    type: "investment",
    description: "Investment in ENaaS Solar Project",
    asset: "ENaaS Solar Project",
    amount: 2000,
    tokens: 20,
    date: "2024-01-15",
    status: "completed",
    transactionId: "TXN-001-2024",
  },
  {
    id: 2,
    type: "return",
    description: "Monthly returns from Green Real Estate Fund",
    asset: "Green Real Estate Fund",
    amount: 125,
    date: "2024-01-10",
    status: "completed",
    transactionId: "DIV-002-2024",
  },
  {
    id: 3,
    type: "investment",
    description: "Investment in Agro Waste to Energy",
    asset: "Agro Waste to Energy",
    amount: 1500,
    tokens: 15,
    date: "2024-01-08",
    status: "completed",
    transactionId: "TXN-003-2024",
  },
  {
    id: 4,
    type: "deposit",
    description: "Wallet top-up via bank transfer",
    asset: "Wallet",
    amount: 5000,
    date: "2024-01-05",
    status: "completed",
    transactionId: "DEP-004-2024",
  },
  {
    id: 5,
    type: "return",
    description: "Monthly returns from ENaaS Solar Project",
    asset: "ENaaS Solar Project",
    amount: 82,
    date: "2024-01-01",
    status: "completed",
    transactionId: "DIV-005-2024",
  },
];

export const mockChartData = {
  labels: [
    "ENaaS Solar Project",
    "Green Real Estate Fund",
    "Agro Waste to Energy",
  ],
  datasets: [
    {
      data: [10820, 8520, 7504],
      backgroundColor: [
        "#10B981", // Green for energy
        "#3B82F6", // Blue for real estate
        "#F59E0B", // Amber for agriculture
      ],
      borderWidth: 2,
      borderColor: "#ffffff",
    },
  ],
};

export const mockIssuerProjects = [
  {
    id: 1,
    name: "Solar Farm Phase 2",
    status: "funding",
    targetAmount: 5000000,
    currentFunding: 3250000,
    investorCount: 325,
    expectedLaunch: "2024-03-15",
    description: "Expansion of existing solar energy infrastructure",
  },
  {
    id: 2,
    name: "Green Residential Complex",
    status: "planning",
    targetAmount: 8000000,
    currentFunding: 0,
    investorCount: 0,
    expectedLaunch: "2024-06-01",
    description: "Sustainable residential development project",
  },
];

// Helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

export const getFundingPercentage = (current, target) => {
  return Math.round((current / target) * 100);
};

// Central mockData export object
export const mockData = {
  user: mockUser,
  investments: mockPortfolio,
  opportunities: mockOpportunities,
  transactions: mockTransactions,
  chartData: mockChartData,
  issuerProjects: mockIssuerProjects,
  formatCurrency,
  formatPercentage,
  getFundingPercentage,
};
