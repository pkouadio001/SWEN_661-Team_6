# Widget Tests for CareConnect Flutter App

This directory contains comprehensive widget tests for the CareConnect Flutter application.

## Test Structure

```
test/
├── widget_test.dart                          # Main app and smoke tests
├── widgets/                                  # Tests for reusable UI widgets
│   ├── app_card_test.dart                   # Tests for AppCard component
│   ├── gradient_button_test.dart            # Tests for GradientButton component
│   └── back_pill_test.dart                  # Tests for BackPill component
└── screens/                                  # Tests for screen widgets
    ├── dashboard/
    │   └── dashboard_screen_test.dart       # Tests for DashboardScreen
    └── health/
        └── widgets/
            └── new_note_dialog_test.dart    # Tests for NewNoteDialog

```

## Test Coverage

### Reusable Widgets
1. **AppCard** (`test/widgets/app_card_test.dart`)
   - Rendering child widgets
   - Default and custom padding
   - Visual properties (colors, borders, shadows)
   - Full-width behavior

2. **GradientButton** (`test/widgets/gradient_button_test.dart`)
   - Text rendering
   - onPressed callback functionality
   - Optional icon display
   - Size and width constraints
   - Gradient background styling
   - Text and icon styling

3. **BackPill** (`test/widgets/back_pill_test.dart`)
   - Text rendering
   - onTap callback functionality
   - Back arrow icon display
   - Semantic properties for accessibility
   - Full-width behavior
   - Visual styling

### Screen-Specific Widgets
1. **NewNoteDialog** (`test/screens/health/widgets/new_note_dialog_test.dart`)
   - Dialog rendering with title and description
   - Close button functionality
   - Input field rendering (title and note)
   - Text input acceptance
   - Validation (empty field handling)
   - Multi-line note support

### Screens
1. **DashboardScreen** (`test/screens/dashboard/dashboard_screen_test.dart`)
   - App bar with title
   - Welcome message display
   - Dashboard tiles rendering
   - Icon display for tiles
   - SOS emergency button
   - SOS confirmation dialog
   - Dialog cancellation
   - Emergency alert triggering
   - Chevron icons
   - Scrollable content
   - Accessibility semantic labels

### Main App
1. **CareConnectApp** (`test/widget_test.dart`)
   - App initialization smoke test
   - Title rendering in AppBar

## Running Tests

To run all widget tests:
```bash
flutter test
```

To run a specific test file:
```bash
flutter test test/widgets/app_card_test.dart
```

To run tests with coverage:
```bash
flutter test --coverage
```

## Test Patterns Used

- **Widget Testing**: Using `testWidgets` for UI component testing
- **WidgetTester**: Pumping widgets and simulating user interactions
- **Finders**: Using `find.text()`, `find.byType()`, `find.byIcon()` for element location
- **Matchers**: Using `expect()` with matchers like `findsOneWidget`, `findsNWidgets`, `isTrue`, etc.
- **Semantics Testing**: Verifying accessibility properties
- **User Interaction Simulation**: Tapping, entering text, and verifying callbacks

## Dependencies

All tests use the following Flutter testing packages:
- `flutter_test` - Flutter's testing framework (included in SDK)
- `flutter_riverpod` - For widgets that use Riverpod state management

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Descriptive Names**: Test names clearly describe what is being tested
3. **Grouping**: Related tests are grouped using `group()`
4. **Setup**: Tests create their own widget trees with MaterialApp wrapper
5. **Assertions**: Each test has clear expectations and assertions
6. **Accessibility**: Tests include semantic property verification where applicable

## Future Enhancements

Consider adding:
- Integration tests for multi-screen flows
- Golden tests for visual regression testing
- Performance tests for complex widgets
- Tests for remaining screens (auth, profile, patient info, etc.)
- Mock service tests for data layer interactions
