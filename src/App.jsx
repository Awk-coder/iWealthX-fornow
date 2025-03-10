import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;