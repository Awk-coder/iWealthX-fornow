import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Contact from "../pages/Contact";

// Mock fetch
global.fetch = jest.fn();

describe("Contact Form Tests", () => {
  beforeEach(() => {
    fetch.mockClear();
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
    expect(screen.getByText("Kuala Lumpur, Malaysia")).toBeInTheDocument();
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

  test("should validate required fields", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter your name")).toBeInTheDocument();
    });
  });

  test("should validate email format", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  test("should submit form successfully", async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
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
      expect(fetch).toHaveBeenCalledWith("https://formspree.io/f/mwppwdpj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          subject: "General Inquiry",
          message: "This is a test message",
          _replyto: "john.doe@example.com",
        }),
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
    fetch.mockRejectedValueOnce(new Error("Network error"));

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
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 1000))
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
});
