import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import HowItWorks from "./components/sections/HowItWorks";
import Benefits from "./components/sections/Benefits";
import Features from "./components/sections/Features";
import GetStarted from "./components/sections/GetStarted";
import Testimonials from "./components/sections/Testimonials";
import Investor from "./pages/Investor";
import AssetOwner from "./pages/AssetOwner";
import InvestorForm from "./pages/InvestorForm";
import PartnerForm from "./pages/PartnerForm";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import ProjectDetails from "./pages/ProjectDetails";
import Team from "./pages/Team";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import Wallet from "./pages/Wallet";
import IssuerPortal from "./pages/IssuerPortal";
import KYCFlow from "./pages/KYCFlow";
import KYCProtectedRoute from "./components/KYCProtectedRoute";

function AppContent() {
  const location = useLocation();

  // Define dashboard routes where Header should not be shown
  const dashboardRoutes = [
    "/dashboard",
    "/opportunities",
    "/wallet",
    "/issuer",
    "/kyc",
  ];
  const isDashboardPage = dashboardRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <ScrollToTop />
      {!isDashboardPage && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <HowItWorks />
              <Benefits />
              <Features />
              <GetStarted />
              <Testimonials />
            </main>
          }
        />
        <Route path="/investor" element={<Investor />} />
        <Route path="/asset-owner" element={<AssetOwner />} />
        <Route path="/investor-form" element={<InvestorForm />} />
        <Route path="/partner-form" element={<PartnerForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects/:category/:id" element={<ProjectDetails />} />
        <Route path="/team" element={<Team />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/kyc" element={<KYCFlow />} />
        <Route
          path="/dashboard"
          element={
            <KYCProtectedRoute>
              <Dashboard />
            </KYCProtectedRoute>
          }
        />
        <Route
          path="/opportunities"
          element={
            <KYCProtectedRoute>
              <Opportunities />
            </KYCProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <KYCProtectedRoute>
              <Wallet />
            </KYCProtectedRoute>
          }
        />
        <Route
          path="/issuer"
          element={
            <KYCProtectedRoute>
              <IssuerPortal />
            </KYCProtectedRoute>
          }
        />
      </Routes>
      {!isDashboardPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
