# iWealthX Testing Guide

This guide covers all testing functionality for the iWealthX Supabase integration, including automated tests, manual testing procedures, and best practices.

## 🧪 Test Suite Overview

Our testing suite includes:

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test actual database interactions with Supabase
3. **Component Tests** - Test React components with user interactions
4. **Manual Tests** - Step-by-step browser testing procedures

## 📁 Test File Structure

```
src/tests/
├── supabase.test.js          # Unit tests for Supabase service functions
├── KYCFlow.test.jsx          # Component tests for KYC flow
├── Contact.test.jsx          # Component tests for contact form
└── integration.test.js       # Integration tests with real database

Root files:
├── jest.config.js            # Jest configuration
├── test-runner.js            # Custom test runner script
├── manual-testing-script.md  # Manual testing procedures
└── TESTING-GUIDE.md          # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Unit Tests

```bash
npm run test:unit
```

### 3. Run All Tests

```bash
npm run test:all
```

### 4. Use Test Runner (Recommended)

```bash
node test-runner.js help
```

## 🛠️ Available Test Commands

### NPM Scripts

```bash
# Unit tests only (no database required)
npm run test:unit

# Integration tests (requires test database)
npm run test:integration

# All tests
npm run test:all

# Tests with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch

# Custom test runner with options
npm run test:runner
```

### Test Runner Options

```bash
# Show all available options
node test-runner.js help

# Run specific test types
node test-runner.js unit
node test-runner.js integration
node test-runner.js all
node test-runner.js coverage

# Show manual testing instructions
node test-runner.js manual

# Show setup instructions
node test-runner.js setup
```

## 📋 Test Categories

### Unit Tests (`src/tests/supabase.test.js`)

Tests the Supabase service functions in isolation using mocks:

- ✅ KYC application creation
- ✅ KYC application updates
- ✅ File upload functionality
- ✅ Contact form submission
- ✅ Newsletter subscription
- ✅ Investment interest tracking
- ✅ Error handling scenarios
- ✅ Data validation

**Run with:** `npm run test:unit`

### Component Tests

#### KYC Flow Tests (`src/tests/KYCFlow.test.jsx`)

- ✅ Multi-step form navigation
- ✅ Form input handling
- ✅ File upload interactions
- ✅ Form validation
- ✅ Submission flow
- ✅ Error states

#### Contact Form Tests (`src/tests/Contact.test.jsx`)

- ✅ Form rendering
- ✅ Input validation
- ✅ Submission handling
- ✅ Success/error states
- ✅ Loading states

**Run with:** `npm run test:unit`

### Integration Tests (`src/tests/integration.test.js`)

Tests actual database interactions with Supabase:

- ✅ Real database CRUD operations
- ✅ File storage operations
- ✅ Data integrity checks
- ✅ Constraint validation
- ✅ Performance testing
- ✅ Concurrent operations

**⚠️ Important:** Integration tests require a test database!

**Setup:**

1. Create a separate Supabase project for testing
2. Run the database schema setup
3. Set `SUPABASE_TEST_MODE=true`
4. Run: `npm run test:integration`

### Manual Tests (`manual-testing-script.md`)

Comprehensive browser-based testing procedures:

- 🔍 Complete KYC flow testing
- 🔍 Contact form functionality
- 🔍 Newsletter subscription
- 🔍 Investment interest tracking
- 🔍 Error handling scenarios
- 🔍 File upload edge cases
- 🔍 Performance validation
- 🔍 Security testing

**Run with:** `node test-runner.js manual`

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapping: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
  },
  testTimeout: 10000,
  verbose: true,
};
```

### Test Setup (`src/setupTests.js`)

Configures the testing environment with:

- DOM testing utilities
- Mock implementations for browser APIs
- File upload mocking
- Console warning suppression

## 📊 Coverage Reports

Generate coverage reports to see test coverage:

```bash
npm run test:coverage
```

Coverage reports include:

- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

Reports are generated in:

- Console output (summary)
- `coverage/lcov-report/index.html` (detailed HTML report)

## 🔒 Security Testing

### Automated Security Tests

Our tests include checks for:

- XSS prevention
- SQL injection prevention
- Input sanitization
- Data validation

### Manual Security Testing

Follow the manual testing script for:

- Malicious input testing
- File upload security
- Authentication bypass attempts
- Data access controls

## 🚨 Error Handling Tests

### Network Error Simulation

```javascript
// Example: Test network failures
test("should handle network errors gracefully", async () => {
  // Mock network failure
  kycService.createKYCApplication.mockRejectedValue(new Error("Network error"));

  // Test error handling
  await expect(submitKYC()).rejects.toThrow("Network error");
});
```

### Database Error Simulation

```javascript
// Example: Test database constraints
test("should handle duplicate email gracefully", async () => {
  // Test unique constraint violation
  await expect(subscribeNewsletter("existing@email.com")).rejects.toThrow();
});
```

## 📈 Performance Testing

### Load Testing

```javascript
test("should handle multiple concurrent submissions", async () => {
  const promises = Array(10)
    .fill()
    .map(() => createKYCApplication(testData));
  const results = await Promise.all(promises);
  expect(results).toHaveLength(10);
});
```

### File Upload Performance

```javascript
test("should handle large file uploads", async () => {
  const largeFile = new File(["A".repeat(5000000)], "large.jpg"); // 5MB
  const result = await uploadFile(largeFile);
  expect(result.publicUrl).toBeDefined();
});
```

## 🐛 Debugging Tests

### Debug Individual Tests

```bash
# Run specific test file
npm test -- --testNamePattern="KYC Flow"

# Run specific test case
npm test -- --testNamePattern="should submit form successfully"

# Run with verbose output
npm test -- --verbose
```

### Debug Integration Tests

```bash
# Enable debug logging
DEBUG=true SUPABASE_TEST_MODE=true npm run test:integration
```

### Common Issues and Solutions

#### Test Timeouts

```javascript
// Increase timeout for slow operations
test("slow operation", async () => {
  // test code
}, 15000); // 15 second timeout
```

#### Mock Issues

```javascript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### File Upload Issues

```javascript
// Proper file mocking
global.File = class File {
  constructor(fileBits, fileName, options) {
    this.name = fileName;
    this.size = fileBits.reduce((acc, bit) => acc + bit.length, 0);
    this.type = options?.type || "";
  }
};
```

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:coverage
```

## 📝 Writing New Tests

### Unit Test Template

```javascript
import { functionToTest } from "../lib/supabase";

describe("Function Name Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should handle success case", async () => {
    // Arrange
    const testData = {
      /* test data */
    };

    // Act
    const result = await functionToTest(testData);

    // Assert
    expect(result).toBeDefined();
    expect(result.property).toBe("expected value");
  });

  test("should handle error case", async () => {
    // Test error scenarios
    await expect(functionToTest(invalidData)).rejects.toThrow();
  });
});
```

### Component Test Template

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentToTest from "../components/ComponentToTest";

describe("Component Tests", () => {
  test("should render correctly", () => {
    render(<ComponentToTest />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  test("should handle user interaction", async () => {
    const user = userEvent.setup();
    render(<ComponentToTest />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Result")).toBeInTheDocument();
  });
});
```

## 🎯 Best Practices

### Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### Mock Strategy

- Mock external dependencies
- Use real implementations for unit logic
- Mock network calls and file operations
- Clear mocks between tests

### Data Management

- Use test-specific data prefixes
- Clean up test data after integration tests
- Use factories for test data generation
- Avoid hardcoded values

### Assertions

- Use specific matchers (`toBe`, `toEqual`, `toContain`)
- Test both success and failure cases
- Verify side effects (database changes, API calls)
- Check error messages and types

## 📞 Support and Troubleshooting

### Common Commands

```bash
# Check test file structure
node test-runner.js setup

# Run manual testing guide
node test-runner.js manual

# Get help with test runner
node test-runner.js help

# Debug specific test
npm test -- --testNamePattern="specific test name" --verbose
```

### Getting Help

1. Check this guide first
2. Review test error messages carefully
3. Check Supabase dashboard for integration test issues
4. Verify database schema is up to date
5. Ensure all dependencies are installed

### Reporting Issues

When reporting test issues, include:

- Test command used
- Full error message
- Environment details (Node version, OS)
- Steps to reproduce
- Expected vs actual behavior

---

## 🎉 Conclusion

This comprehensive testing suite ensures the reliability and quality of the iWealthX Supabase integration. Regular testing helps catch issues early and maintains confidence in the application's functionality.

For questions or improvements to the testing suite, please refer to the development team or create an issue in the project repository.
