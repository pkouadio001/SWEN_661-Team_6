# CareConnect Flutter Application

A tremor-tolerant UI application for healthcare management.

## Project Structure

```
careconnect/
├── lib/              # Application source code
│   ├── models/       # Data models
│   ├── state/        # State management (Riverpod)
│   ├── services/     # Services (storage, etc.)
│   ├── widgets/      # Reusable widgets
│   ├── screens/      # App screens
│   └── theme/        # Theme configuration
└── test/             # Unit tests
    ├── models/       # Model tests
    ├── state/        # State controller tests
    ├── services/     # Service tests
    └── widgets/      # Widget tests
```

## Testing

Comprehensive unit tests have been added for the Flutter application.

### Quick Start
```bash
cd careconnect/careconnect

# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run specific test suite
flutter test test/models/
```

### Test Documentation
- **Detailed Testing Guide**: [test/README.md](careconnect/careconnect/test/README.md)
- **Test Summary**: [test/TEST_SUMMARY.md](careconnect/careconnect/test/TEST_SUMMARY.md)

### Test Coverage
- 12 test files created
- 60+ individual test cases
- Categories: Models, State Controllers, Services, Widgets

## Development

### Prerequisites
- Flutter SDK (^3.10.7)
- Dart SDK

### Setup
```bash
cd careconnect/careconnect
flutter pub get
flutter run
```

### Running Tests
See the [Testing Documentation](careconnect/careconnect/test/README.md) for comprehensive testing information.

