// ignore: unused_import
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:careconnect/main.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('CareConnect Integration Tests', () {
    testWidgets('Test 1: Login flow navigates to dashboard', (
      WidgetTester tester,
    ) async {
      // Start the app
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();

      // Verify we're on login screen
      expect(find.text('CareConnect'), findsOneWidget);
      expect(find.text('Login'), findsWidgets);

      // Tap login button (simplified - skips PIN entry)
      final loginButton = find.text('Login').last;
      await tester.tap(loginButton);
      await tester.pumpAndSettle(const Duration(seconds: 2));

      // Verify navigation to dashboard
      expect(find.text('Profile & Settings'), findsOneWidget);
      expect(find.text('SOS EMERGENCY'), findsOneWidget);
    });

    testWidgets('Test 2: Dashboard to Profile Settings navigation', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();

      // Quick login
      final loginButton = find.text('Login').last;
      await tester.tap(loginButton);
      await tester.pumpAndSettle(const Duration(seconds: 2));

      // Navigate to Profile Settings
      final profileTile = find.text('Profile & Settings');
      expect(profileTile, findsOneWidget);

      await tester.tap(profileTile);
      await tester.pumpAndSettle();

      // Verify we're on profile screen
      expect(find.text('Full Name'), findsOneWidget);
      expect(find.text('Email'), findsOneWidget);
    });

    testWidgets('Test 3: SOS button shows confirmation dialog', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();

      // Login
      final loginButton = find.text('Login').last;
      await tester.tap(loginButton);
      await tester.pumpAndSettle(const Duration(seconds: 2));

      // Tap SOS button
      final sosButton = find.text('SOS EMERGENCY');
      expect(sosButton, findsOneWidget);

      await tester.tap(sosButton);
      await tester.pumpAndSettle();

      // Verify dialog appears
      expect(find.text('Emergency Alert'), findsOneWidget);
      expect(find.text('Send SOS'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);

      // Tap Cancel
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      // Verify dialog is dismissed
      expect(find.text('Emergency Alert'), findsNothing);
    });

    testWidgets('Test 4: Bottom navigation works across tabs', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();

      // Login
      final loginButton = find.text('Login').last;
      await tester.tap(loginButton);
      await tester.pumpAndSettle(const Duration(seconds: 2));

      // Test Tasks tab
      final tasksTab = find.text('Tasks');
      await tester.tap(tasksTab);
      await tester.pumpAndSettle();
      expect(find.text('Tasks & Scheduling'), findsOneWidget);

      // Test Health tab
      final healthTab = find.text('Health');
      await tester.tap(healthTab);
      await tester.pumpAndSettle();
      expect(find.text('Notes & Health Logs'), findsOneWidget);

      // Test Home tab
      final homeTab = find.text('Home');
      await tester.tap(homeTab);
      await tester.pumpAndSettle();
      expect(find.text('SOS EMERGENCY'), findsOneWidget);
    });

    testWidgets(
      'Test 5: Accessibility - All interactive elements have semantic labels',
      (WidgetTester tester) async {
        await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
        await tester.pumpAndSettle();

        // Login
        final loginButton = find.text('Login').last;
        await tester.tap(loginButton);
        await tester.pumpAndSettle(const Duration(seconds: 2));

        // Check SOS button has proper semantics
        final sosButton = find.text('SOS EMERGENCY');
        expect(sosButton, findsOneWidget);

        final sosSemantics = tester.getSemantics(sosButton);
        expect(sosSemantics.label, isNotEmpty);

        // Check dashboard tiles have proper semantics
        final profileTile = find.text('Profile & Settings');
        expect(profileTile, findsOneWidget);

        final profileSemantics = tester.getSemantics(profileTile);
        expect(profileSemantics.label, contains('Profile'));

        // Verify bottom navigation has labels
        final tasksTab = find.text('Tasks');
        final tasksSemantics = tester.getSemantics(tasksTab);
        expect(tasksSemantics.label, isNotEmpty);
      },
    );
  });
}
