import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Contact from "../pages/Contact";
import { websiteService } from "../lib/supabase";

// Mock the Supabase service
jest.mock("../lib/supabase", () => ({
  websiteService: {
    submitContactForm: jest.fn(),
  },
}));

describe("Contact Form Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render contact form with all fields", () => {
    render(<Contact />);

    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your full name/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/select a subject/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/tell us how we can help/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  test("should display contact information", () => {
    render(<Contact />);

    expect(screen.getByText("saifkhan@iwealthx.com")).toBeInTheDocument();
    expect(screen.getByText("+60 12-904-2153")).toBeInTheDocument();
    const locationTexts = screen.getAllByText("Kuala Lumpur, Malaysia");
    expect(locationTexts.length).toBeGreaterThan(0);
  });

  test("should display office hours", () => {
    render(<Contact />);

    expect(screen.getByText("Office Hours")).toBeInTheDocument();
    expect(screen.getByText("Monday - Friday")).toBeInTheDocument();
    expect(screen.getByText("9:00 AM - 6:00 PM")).toBeInTheDocument();
  });

  test("should handle form input changes", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const messageInput = screen.getByPlaceholderText(
      /tell us how we can help/i
    );

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.type(messageInput, "This is a test message");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");
    expect(messageInput).toHaveValue("This is a test message");
  });

  test("should handle subject selection", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const subjectSelect = screen.getByDisplayValue(/select a subject/i);
    await user.selectOptions(subjectSelect, "General Inquiry");

    expect(subjectSelect).toHaveValue("General Inquiry");
  });

  test("should submit form successfully", async () => {
    const user = userEvent.setup();
    websiteService.submitContactForm.mockResolvedValue({
      id: "test-uuid-123",
      created_at: new Date().toISOString(),
    });

    render(<Contact />);

    // Fill out the form
    await user.type(
      screen.getByPlaceholderText(/enter your full name/i),
      "John Doe"
    );
    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "john.doe@example.com"
    );
    await user.selectOptions(
      screen.getByDisplayValue(/select a subject/i),
      "General Inquiry"
    );
    await user.type(
      screen.getByPlaceholderText(/tell us how we can help/i),
      "This is a test message"
    );

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Wait for submission
    await waitFor(() => {
      expect(websiteService.submitContactForm).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john.doe@example.com",
        subject: "General Inquiry",
        message: "This is a test message",
      });
    });

    // Should show success message
    await waitFor(() => {
      expect(
        screen.getByText(/thank you for your message/i)
      ).toBeInTheDocument();
    });

    // Form should be cleared
    expect(screen.getByPlaceholderText(/enter your full name/i)).toHaveValue(
      ""
    );
    expect(screen.getByPlaceholderText(/enter your email/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/tell us how we can help/i)).toHaveValue(
      ""
    );
  });

  test("should handle form submission errors", async () => {
    const user = userEvent.setup();
    websiteService.submitContactForm.mockRejectedValue(
      new Error("Submission failed")
    );

    render(<Contact />);

    // Fill out the form
    await user.type(
      screen.getByPlaceholderText(/enter your full name/i),
      "John Doe"
    );
    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "john.doe@example.com"
    );
    await user.selectOptions(
      screen.getByDisplayValue(/select a subject/i),
      "General Inquiry"
    );
    await user.type(
      screen.getByPlaceholderText(/tell us how we can help/i),
      "This is a test message"
    );

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });

  test("should show loading state during submission", async () => {
    const user = userEvent.setup();
    // Mock a delayed response
    websiteService.submitContactForm.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ id: "test" }), 1000)
        )
    );

    render(<Contact />);

    // Fill out the form
    await user.type(
      screen.getByPlaceholderText(/enter your full name/i),
      "John Doe"
    );
    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "john.doe@example.com"
    );
    await user.selectOptions(
      screen.getByDisplayValue(/select a subject/i),
      "General Inquiry"
    );
    await user.type(
      screen.getByPlaceholderText(/tell us how we can help/i),
      "This is a test message"
    );

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Should show loading state
    expect(screen.getByText(/sending/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test("should validate required fields", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // HTML5 validation should prevent submission
    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    expect(nameInput).toBeInvalid();
  });

  test("should validate email format", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    await user.type(emailInput, "invalid-email");

    // HTML5 validation should catch this
    expect(emailInput).toBeInvalid();
  });
});
