# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

📦 1. Install Dependencies

Before running tests, make sure all dependencies are installed:

npm install

or if using yarn:

yarn install
▶️ 2. Run All Tests

To run all tests once:

npm test

or:

npx jest
🔁 3. Run Tests in Watch Mode (Recommended During Development)
npm test -- --watch

Jest will re-run tests automatically when files change.

📊 4. Generate Test Coverage Report

To see test coverage:

npm test -- --coverage

After running, Jest will generate a coverage summary in the terminal and create a /coverage folder.

To open the HTML report:

open coverage/lcov-report/index.html   # macOS
start coverage/lcov-report/index.html  # Windows
🧪 5. Run a Specific Test File

To run a single test file:

npx jest app/_tests_/tasks-context.test.tsx

You can also run by test name:

npx jest -t "adds a new task"
🧱 Test Structure

Test files are located in:

app/_tests_/

Test files follow this naming convention:

*.test.tsx

Example:

tasks-context.test.tsx
health-logs-context.test.tsx
theme-context.test.tsx
⚙️ Test Setup

The project uses:

jest.config.js

jest.setup.ts

The setup file includes:

AsyncStorage mock

React Native mocks

Testing Library configuration

🚨 Common Issues & Fixes
❌ AsyncStorage is null

Make sure AsyncStorage is mocked in jest.setup.ts:

jest.mock(
  "@react-native-async-storage/async-storage",
  () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
❌ Expo bundling error referencing testing-library

Make sure:

@testing-library/react-native is in devDependencies

You are NOT importing testing libraries inside app runtime code

Test files are NOT imported by production files

🧹 Reset Jest Cache (If Needed)

If tests behave strangely:

npx jest --clearCache

## ♿ Accessibility Testing

This app follows WCAG 2.1 Level AA accessibility standards. See [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) for comprehensive testing guidelines.

### Quick Start

**Automated Testing:**
```bash
# Run all accessibility tests
npm test -- accessibility.test.tsx

# Run all tests
npm test
```

**Manual Testing:**
- **Android TalkBack:** Enable in Settings → Accessibility → TalkBack
- **iOS VoiceOver:** Enable in Settings → Accessibility → VoiceOver (or Cmd+F5 in simulator)

See [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) for detailed instructions on:
- Using React Native Testing Library accessibility matchers
- Testing with TalkBack (Android)
- Testing with VoiceOver (iOS)
- Accessibility checklists and best practices