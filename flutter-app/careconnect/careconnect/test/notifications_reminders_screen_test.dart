// notifications_reminders_screen_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect/screens/notifications/notifications_reminders_screen.dart';

void main() {
  group('NotificationsRemindersScreen', () {
    testWidgets('renders key UI sections and reminder items', (tester) async {
      await tester.pumpWidget(
        _wrapWithGoRouter(const NotificationsRemindersScreen()),
      );
      await tester.pumpAndSettle();

      // AppBar + subtitle
      expect(find.text('Notifications & Reminders'), findsOneWidget);
      expect(find.text('Stay on track with your care'), findsOneWidget);

      // Back pill + sections
      expect(find.text('Back to Dashboard'), findsOneWidget);
      expect(find.text('Upcoming This Week'), findsOneWidget);
      expect(find.text('Notification Settings'), findsOneWidget);

      // Week cards + a couple sample items
      expect(find.text('Tomorrow - Jan 26, 2026'), findsOneWidget);
      expect(find.text('Monday - Jan 27, 2026'), findsOneWidget);
      expect(find.text('Morning medication (9:00 AM)'), findsOneWidget);
      expect(find.text('Lab work appointment (8:00 AM)'), findsOneWidget);

      // Settings rows
      expect(find.text('Push Notifications'), findsOneWidget);
      expect(find.text('Configure'), findsOneWidget);
      expect(find.text('Normal Priority Vibration'), findsOneWidget);
      expect(find.text('Current: Medium'), findsOneWidget);
      expect(find.text('Urgent Priority Vibration'), findsOneWidget);
      expect(find.text('Current: High'), findsOneWidget);
    });

    testWidgets('AppBar back button navigates to /home', (tester) async {
      final router = _routerForTest(initialLocation: '/notifications');

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      // Start on the screen
      expect(find.text('Notifications & Reminders'), findsOneWidget);

      // Tap leading back arrow (AppBar IconButton)
      await tester.tap(find.byIcon(Icons.arrow_back).first);
      await tester.pumpAndSettle();

      // Should navigate to home placeholder
      expect(find.text('HOME_SCREEN'), findsOneWidget);
    });

    testWidgets('tapping "Back to Dashboard" pill navigates to /home', (
      tester,
    ) async {
      final router = _routerForTest(initialLocation: '/notifications');

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      expect(find.text('Notifications & Reminders'), findsOneWidget);

      // The pill contains the text "Back to Dashboard"
      await tester.tap(find.text('Back to Dashboard'));
      await tester.pumpAndSettle();

      expect(find.text('HOME_SCREEN'), findsOneWidget);
    });
  });
}

/// Wraps the screen with a minimal router (default initial route to /notifications).
Widget _wrapWithGoRouter(Widget child) {
  final router = GoRouter(
    initialLocation: '/notifications',
    routes: [
      GoRoute(
        path: '/home',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('HOME_SCREEN'))),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => Scaffold(body: child),
      ),
    ],
  );

  return MaterialApp.router(routerConfig: router);
}

/// Router helper when you want direct control over initialLocation.
GoRouter _routerForTest({required String initialLocation}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: '/home',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('HOME_SCREEN'))),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsRemindersScreen(),
      ),
    ],
  );
}
