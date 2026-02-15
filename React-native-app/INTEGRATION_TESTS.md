# Integration Tests for React Native App

## Overview

This document describes the integration tests that have been added to the React Native application using Jest and React Testing Library.

## Test Structure

Integration tests are located in the `__integration_tests__/` directory at the root of the React Native app project.

## Test Suites

### 1. Login to Dashboard Flow (`login-to-dashboard.integration.test.tsx`)
**Status: ✅ All tests passing (3/3)**

Tests the complete user authentication flow from login screen to dashboard navigation.

**Tests:**
- `completes full login flow and navigates to dashboard` - Verifies successful login with valid credentials
- `prevents login with invalid credentials` - Tests validation for empty username
- `prevents login with incomplete PIN` - Tests validation for incomplete PIN entry

### 2. Registration Flow (`registration-flow.integration.test.tsx`)
**Status: ✅ All tests passing (3/3)**

Tests the user registration process including form validation.

**Tests:**
- `completes full registration with valid inputs` - Verifies successful registration flow
- `validates required fields before submission` - Tests form validation
- `navigates back when back button is pressed` - Tests navigation

### 3. Theme Integration (`theme-integration.integration.test.tsx`)
**Status: ✅ All tests passing (3/3)**

Tests theme context integration across multiple screens.

**Tests:**
- `renders login screen with default theme` - Verifies theme provider works with login screen
- `renders dashboard with default theme` - Verifies theme provider works with dashboard
- `theme persists across screen changes` - Tests theme state persistence during navigation

### 4. Tasks Integration (`tasks-integration.integration.test.tsx`)
**Status: ⚠️ Partial (3/3 basic tests passing)**

Tests integration between TasksContext and task-related UI components.

**Tests:**
- `adds a new task through the form and navigates back` - Tests task creation workflow
- `validates required fields in add task form` - Tests form validation
- `displays today tasks screen` - Verifies task list rendering

### 5. Messages Integration (`messages-integration.integration.test.tsx`)
**Status: ⚠️ Partial**

Tests integration between MessagesContext and Communication screen.

### 6. Navigation Flow (`navigation-flow.integration.test.tsx`)
**Status: ⚠️ Partial**

Tests navigation between different tabs and screens in the application.

## Running Integration Tests

### Run all integration tests:
```bash
npm test -- __integration_tests__
```

### Run a specific integration test suite:
```bash
npm test -- __integration_tests__/login-to-dashboard.integration.test.tsx
```

### Run all tests (unit + integration):
```bash
npm test
```

## Test Configuration

Integration tests use the following mocks:

### AsyncStorage Mock
```javascript
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));
```

### Expo Router Mock
```javascript
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };
  
  return {
    __esModule: true,
    router,
    useRouter: jest.fn(() => router),
    usePathname: jest.fn(() => "/"),
    default: { router },
    __mock: { push, replace, back, router },
  };
});
```

## Key Integration Points Tested

1. **User Authentication Flow** - Login and registration processes
2. **Form Validation** - Client-side validation for user inputs
3. **Navigation** - Screen transitions and routing
4. **Context Providers** - State management across components
5. **Component Integration** - Multiple components working together

## Best Practices

- Mock external dependencies (AsyncStorage, expo-router) before imports
- Use relative imports for app components (`../app/...`)
- Test user interactions, not implementation details
- Focus on integration between multiple components
- Verify navigation and state changes
- Test error handling and validation flows

## Future Improvements

- Complete remaining partial test suites
- Add end-to-end user journey tests
- Test offline functionality
- Add accessibility integration tests
- Test performance under load
