# CareConnect Testing Documentation

This document provides comprehensive information about the unit tests for the CareConnect Flutter application.

## Test Structure

The tests are organized into the following categories:

```
test/
├── models/              # Model class unit tests
│   ├── appointment_test.dart
│   ├── health_log_test.dart
│   ├── message_test.dart
│   ├── note_test.dart
│   ├── patient_test.dart
│   ├── task_test.dart
│   └── user_profile_test.dart
├── services/            # Service layer unit tests
│   └── storage_service_test.dart
├── state/               # State management tests
│   ├── notes_controller_test.dart
│   └── tasks_controller_test.dart
├── widgets/             # Widget unit tests
│   └── gradient_button_test.dart
└── widget_test.dart     # Main app widget test
```

## Running Tests

### Run All Tests
```bash
flutter test
```

### Run Specific Test File
```bash
flutter test test/models/user_profile_test.dart
```

### Run Tests in a Directory
```bash
flutter test test/models/
```

### Run Tests with Coverage
```bash
flutter test --coverage
```

## Test Coverage

### Models (7 test files)
- **UserProfile** - Tests for user profile model including copyWith and demo data
- **TaskItem** - Tests for task model including copyWith functionality
- **PatientInfo** - Tests for patient information model with comprehensive field updates
- **NoteItem** - Tests for note model with various content scenarios
- **AppointmentItem** - Tests for appointment model
- **MessageThread** - Tests for message thread model
- **HealthLogItem** - Tests for health log entries

### State Controllers (2 test files)
- **TasksController** - Tests for task state management including:
  - Seeding initial data
  - Toggling task completion
  - Adding new tasks
- **NotesController** - Tests for notes state management including:
  - Seeding initial data
  - Adding new notes with timestamps

### Services (1 test file)
- **StorageService** - Tests for persistent storage including:
  - High contrast mode settings
  - Push notification settings
  - Independent setting storage

### Widgets (1 test file)
- **GradientButton** - Tests for custom gradient button widget including:
  - Rendering with and without icons
  - Click interactions
  - Styling verification

## Test Conventions

### Naming
- Test files use the `_test.dart` suffix
- Test groups are named after the class being tested
- Individual tests have descriptive names explaining what they verify

### Structure
Each test file follows this pattern:
```dart
void main() {
  group('ClassName', () {
    // Setup if needed
    setUp(() {
      // Initialize test data
    });

    test('describes what is being tested', () {
      // Arrange
      // Act
      // Assert
    });
  });
}
```

### Assertions
- Use `expect()` for assertions
- Common matchers: `equals`, `isTrue`, `isFalse`, `isNotEmpty`, `findsOneWidget`

## Key Testing Features

### Mock Data
- SharedPreferences is mocked using `SharedPreferences.setMockInitialValues({})`
- State controllers include seed methods for consistent test data

### Widget Testing
- Uses `WidgetTester` for widget interaction
- `pumpWidget()` to render widgets
- `tap()`, `pump()` for simulating user interactions
- `find` API for locating widgets in the tree

### State Management Testing
- Tests use actual StateNotifier instances
- No mocking of Riverpod providers in basic tests
- Direct testing of state changes

## Best Practices

1. **Isolation** - Each test is independent and doesn't rely on other tests
2. **Cleanup** - Resources are cleaned up in `tearDown()` when necessary
3. **Descriptive Names** - Test names clearly describe what is being tested
4. **Arrange-Act-Assert** - Tests follow the AAA pattern
5. **Coverage** - Tests cover both happy paths and edge cases

## Future Enhancements

Potential areas for additional testing:
- Integration tests for complete user flows
- Widget tests for complex screen components
- Additional state controller tests as features are added
- Mock API service tests when backend integration is added
- Golden tests for visual regression testing

## Continuous Integration

These tests should be run automatically on:
- Every commit
- Pull request creation
- Before merging to main branch

## Dependencies

The following packages are used for testing:
- `flutter_test` - Core Flutter testing framework (included in SDK)
- `shared_preferences` - Provides mock support for testing storage

## Troubleshooting

### Tests Won't Run
- Ensure Flutter SDK is properly installed: `flutter doctor`
- Check that you're in the correct directory: `flutter-app/careconnect/careconnect`
- Clean and get packages: `flutter clean && flutter pub get`

### Failed Tests
- Check error messages carefully
- Ensure test data matches expected values
- Verify any time-dependent tests account for potential timing issues

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure existing tests still pass
3. Maintain test coverage above 70%
4. Follow the existing test structure and naming conventions
