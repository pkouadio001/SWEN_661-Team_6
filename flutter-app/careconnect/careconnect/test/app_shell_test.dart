import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect/screens/shell/app_shell.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('AppShell', () {
    testWidgets('selectedIndex matches current location', (tester) async {
      final router = _buildRouter(initialLocation: '/health');

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      final navBar = tester.widget<NavigationBar>(find.byType(NavigationBar));
      expect(navBar.selectedIndex, 2); // /health => index 2
    });

    testWidgets('tapping nav destinations navigates to correct routes', (
      tester,
    ) async {
      final router = _buildRouter(initialLocation: '/home');

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      // Tap Tasks
      await tester.tap(find.text('Tasks'));
      await tester.pumpAndSettle();
      expect(find.text('TASKS_SCREEN'), findsOneWidget);

      // Tap Health
      await tester.tap(find.text('Health'));
      await tester.pumpAndSettle();
      expect(find.text('HEALTH_SCREEN'), findsOneWidget);

      // Tap Messages
      await tester.tap(find.text('Messages'));
      await tester.pumpAndSettle();
      expect(find.text('COMM_SCREEN'), findsOneWidget);

      // Tap Alerts
      await tester.tap(find.text('Alerts'));
      await tester.pumpAndSettle();
      expect(find.text('ALERTS_SCREEN'), findsOneWidget);

      // Tap Profile
      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();
      expect(find.text('PROFILE_SETTINGS_SCREEN'), findsOneWidget);

      // Back to Home
      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();
      expect(find.text('HOME_SCREEN'), findsOneWidget);
    });

    testWidgets('selectedIndex updates after navigation', (tester) async {
      final router = _buildRouter(initialLocation: '/home');

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      // Initially Home
      NavigationBar navBar = tester.widget(find.byType(NavigationBar));
      expect(navBar.selectedIndex, 0);

      // Go to Alerts
      await tester.tap(find.text('Alerts'));
      await tester.pumpAndSettle();

      navBar = tester.widget(find.byType(NavigationBar));
      expect(navBar.selectedIndex, 4);
    });
  });
}

/// Builds a router that wraps each screen with AppShell(child: ...).
GoRouter _buildRouter({required String initialLocation}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: '/home',
        builder: (context, state) => AppShell(
          child: const Scaffold(body: Center(child: Text('HOME_SCREEN'))),
        ),
      ),
      GoRoute(
        path: '/tasks',
        builder: (context, state) => AppShell(
          child: const Scaffold(body: Center(child: Text('TASKS_SCREEN'))),
        ),
      ),
      GoRoute(
        path: '/health',
        builder: (context, state) => AppShell(
          child: const Scaffold(body: Center(child: Text('HEALTH_SCREEN'))),
        ),
      ),
      GoRoute(
        path: '/comm',
        builder: (context, state) => AppShell(
          child: const Scaffold(body: Center(child: Text('COMM_SCREEN'))),
        ),
      ),
      GoRoute(
        path: '/alerts',
        builder: (context, state) => AppShell(
          child: const Scaffold(body: Center(child: Text('ALERTS_SCREEN'))),
        ),
      ),
      GoRoute(
        path: '/profile-settings',
        builder: (context, state) => AppShell(
          child: const Scaffold(
            body: Center(child: Text('PROFILE_SETTINGS_SCREEN')),
          ),
        ),
      ),
    ],
  );
}
