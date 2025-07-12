// Simple test for contact form
const testContactForm = async () => {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    subject: "General Inquiry",
    message: "This is a test message from the contact form",
    _replyto: "test@example.com",
  };

  try {
    console.log("Testing contact form submission...");

    const response = await fetch("https://formspree.io/f/mwppwdpj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      console.log("✅ Contact form test PASSED - Form submission successful");
      return true;
    } else {
      console.log(
        "❌ Contact form test FAILED - HTTP status:",
        response.status
      );
      return false;
    }
  } catch (error) {
    console.log("❌ Contact form test FAILED - Error:", error.message);
    return false;
  }
};

// Run the test
testContactForm();
