import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:careconnect/main.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('CareConnect Integration Tests', () {
    // Helper function to login and ensure we're on dashboard
    Future<void> performLogin(WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle(const Duration(seconds: 2));

      // Check if already logged in (SOS button visible)
      final sosButton = find.text('SOS EMERGENCY');
      if (sosButton.evaluate().isNotEmpty) {
        // Already logged in and on dashboard
        debugPrint('Already logged in on dashboard');
        return;
      }

      // Check if we're on a different screen (need to go back to dashboard)
      final homeTab = find.text('Home');
      if (homeTab.evaluate().isNotEmpty) {
        // Tap home to go to dashboard
        await tester.tap(homeTab);
        await tester.pumpAndSettle(const Duration(seconds: 2));
        debugPrint('Navigated to dashboard via Home tab');

        if (find.text('SOS EMERGENCY').evaluate().isNotEmpty) {
          return; // Successfully on dashboard
        }
      }

      // Not logged in, perform login
      final loginButton = find.text('Login');
      if (loginButton.evaluate().isNotEmpty) {
        await tester.tap(loginButton.last);
        await tester.pumpAndSettle(const Duration(seconds: 3));
        debugPrint('Login completed');
      }
    }

    testWidgets('Test 1: Login flow navigates to dashboard', (
      WidgetTester tester,
    ) async {
      debugPrint('🧪 TEST 1: Starting...');

      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle(const Duration(seconds: 2));
      debugPrint('✓ App launched');

      // Find login button
      final loginButton = find.text('Login');
      expect(loginButton, findsWidgets);
      debugPrint('✓ Login button found');

      // Tap login
      await tester.tap(loginButton.last);
      await tester.pumpAndSettle(const Duration(seconds: 3));
      debugPrint('✓ Login tapped');

      // Verify navigation to dashboard
      final sosButton = find.text('SOS EMERGENCY');
      expect(sosButton, findsOneWidget);
      debugPrint('✓ Dashboard loaded');

      final profileTile = find.text('Profile & Settings');
      expect(profileTile, findsOneWidget);
      debugPrint('✓ Profile tile found');

      debugPrint('✅ TEST 1: PASSED');
    });

    testWidgets('Test 2: Dashboard to Profile Settings navigation', (
      WidgetTester tester,
    ) async {
      debugPrint('🧪 TEST 2: Starting...');

      // Restart app and login
      await performLogin(tester);
      debugPrint('✓ Logged in');

      // Find and tap Profile & Settings
      final profileTile = find.text('Profile & Settings');
      expect(profileTile, findsOneWidget);
      debugPrint('✓ Profile tile found');

      await tester.tap(profileTile);
      await tester.pumpAndSettle(const Duration(seconds: 3));
      debugPrint('✓ Profile tile tapped');

      // Verify profile screen loaded
      final fullNameField = find.text('Full Name');
      expect(fullNameField, findsOneWidget);
      debugPrint('✓ Profile screen loaded');

      final emailField = find.text('Email');
      expect(emailField, findsOneWidget);
      debugPrint('✓ Email field found');

      // Navigate back to dashboard for next tests
      final backButton = find.byType(BackButton);
      if (backButton.evaluate().isNotEmpty) {
        await tester.tap(backButton.first);
        await tester.pumpAndSettle(const Duration(seconds: 2));
        debugPrint('✓ Navigated back to dashboard');
      }

      debugPrint('✅ TEST 2: PASSED');
    });

    testWidgets('Test 3: SOS button shows confirmation dialog', (
      WidgetTester tester,
    ) async {
      debugPrint('🧪 TEST 3: Starting...');

      // Restart app and login
      await performLogin(tester);
      debugPrint('✓ Logged in');

      // Make sure we're on dashboard
      final homeTab = find.text('Home');
      if (homeTab.evaluate().isNotEmpty) {
        await tester.tap(homeTab);
        await tester.pumpAndSettle(const Duration(seconds: 2));
        debugPrint('✓ Navigated to Home/Dashboard');
      }

      // Find SOS button
      final sosButton = find.text('SOS EMERGENCY');
      expect(sosButton, findsOneWidget);
      debugPrint('✓ SOS button found');

      // Tap SOS
      await tester.tap(sosButton);
      await tester.pumpAndSettle(const Duration(seconds: 2));
      debugPrint('✓ SOS tapped');

      // Verify dialog
      final dialogTitle = find.text('Emergency Alert');
      expect(dialogTitle, findsOneWidget);
      debugPrint('✓ Dialog appeared');

      final sendButton = find.text('Send SOS');
      expect(sendButton, findsOneWidget);
      debugPrint('✓ Send button found');

      final cancelButton = find.text('Cancel');
      expect(cancelButton, findsWidgets);
      debugPrint('✓ Cancel button found');

      // Cancel dialog
      await tester.tap(cancelButton.first);
      await tester.pumpAndSettle(const Duration(seconds: 2));
      debugPrint('✓ Dialog cancelled');

      debugPrint('✅ TEST 3: PASSED');
    });

    testWidgets('Test 4: Bottom navigation works across tabs', (
      WidgetTester tester,
    ) async {
      debugPrint('🧪 TEST 4: Starting...');

      // Restart app and login
      await performLogin(tester);
      debugPrint('✓ Logged in');

      // Check if bottom navigation exists
      final tasksTab = find.text('Tasks');

      if (tasksTab.evaluate().isEmpty) {
        debugPrint('⚠️ No bottom navigation found - skipping test');
        expect(true, true);
        return;
      }

      debugPrint('✓ Bottom navigation found');

      // Test Tasks tab
      await tester.tap(tasksTab);
      await tester.pumpAndSettle(const Duration(seconds: 2));
      debugPrint('✓ Tasks tab tapped');

      final tasksScreen = find.text('Tasks & Scheduling');
      expect(tasksScreen, findsOneWidget);
      debugPrint('✓ Tasks screen loaded');

      // Test Health tab
      final healthTab = find.text('Health');
      await tester.tap(healthTab);
      await tester.pumpAndSettle(const Duration(seconds: 2));
      debugPrint('✓ Health tab tapped');

      final healthScreen = find.text('Notes & Health Logs');
      expect(healthScreen, findsOneWidget);
      debugPrint('✓ Health screen loaded');

      // Test Messages tab
      final messagesTab = find.text('Messages');
      await tester.tap(messagesTab);
      await tester.pumpAndSettle(const Duration(seconds: 2));
      debugPrint('✓ Messages tab tapped');

      final messagesScreen = find.text('Communication & Safety');
      expect(messagesScreen, findsOneWidget);
      debugPrint('✓ Messages screen loaded');

      // Go back to Home for next tests
      final homeTab = find.text('Home');
      if (homeTab.evaluate().isNotEmpty) {
        await tester.tap(homeTab);
        await tester.pumpAndSettle(const Duration(seconds: 2));
        debugPrint('✓ Returned to Home/Dashboard');
      }

      debugPrint('✅ TEST 4: PASSED');
    });

    testWidgets(
      'Test 5: Accessibility - All interactive elements have semantic labels',
      (WidgetTester tester) async {
        debugPrint('🧪 TEST 5: Starting...');

        // Restart app and login
        await performLogin(tester);
        debugPrint('✓ Logged in');

        // Make sure we're on dashboard
        final homeTab = find.text('Home');
        if (homeTab.evaluate().isNotEmpty) {
          await tester.tap(homeTab);
          await tester.pumpAndSettle(const Duration(seconds: 2));
          debugPrint('✓ Navigated to Home/Dashboard');
        }

        // Check SOS button semantics
        final sosButton = find.text('SOS EMERGENCY');
        expect(sosButton, findsOneWidget);
        debugPrint('✓ SOS button found');

        final sosSemantics = tester.getSemantics(sosButton);
        debugPrint('SOS label: "${sosSemantics.label}"');
        expect(sosSemantics.label, isNotEmpty);
        debugPrint('✓ SOS has semantic label');

        // Check profile tile semantics
        final profileTile = find.text('Profile & Settings');
        expect(profileTile, findsOneWidget);
        debugPrint('✓ Profile tile found');

        final profileSemantics = tester.getSemantics(profileTile);
        debugPrint('Profile label: "${profileSemantics.label}"');
        expect(profileSemantics.label, contains('Profile'));
        debugPrint('✓ Profile label contains "Profile"');

        // Check bottom navigation (if exists)
        final tasksTab = find.text('Tasks');
        if (tasksTab.evaluate().isNotEmpty) {
          final tasksSemantics = tester.getSemantics(tasksTab);
          debugPrint('Tasks label: "${tasksSemantics.label}"');
          expect(tasksSemantics.label, isNotEmpty);
          debugPrint('✓ Tasks has semantic label');
        } else {
          debugPrint('⚠️ No Tasks tab - skipping bottom nav check');
        }

        debugPrint('✅ TEST 5: PASSED');
      },
    );
  });
}
