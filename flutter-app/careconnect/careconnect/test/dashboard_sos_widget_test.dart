import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

// Update imports if your paths differ
import 'package:careconnect/screens/dashboard/dashboard_screen.dart';

void main() {
  testWidgets('Dashboard renders and SOS flow works', (tester) async {
    final router = GoRouter(
      initialLocation: '/home',
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const DashboardScreen()),
        GoRoute(
          path: '/profile-settings',
          builder: (_, __) =>
              const Scaffold(body: Center(child: Text('PROFILE SETTINGS'))),
        ),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    // ---- Render checks ----
    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.text('Welcome, John Doe'), findsOneWidget);
    expect(find.text('Select a module to continue'), findsOneWidget);

    // Tiles
    expect(find.text('Profile & Settings'), findsOneWidget);
    expect(find.text('Notifications'), findsOneWidget);
    expect(find.text('Patient Information'), findsOneWidget);

    // SOS button label
    expect(find.text('SOS EMERGENCY'), findsOneWidget);

    // ---- Tap SOS -> dialog opens ----
    await tester.tap(find.text('SOS EMERGENCY'));
    await tester.pumpAndSettle();

    expect(find.text('Emergency Alert'), findsOneWidget);
    expect(
      find.textContaining('notify your emergency contacts'),
      findsOneWidget,
    );
    expect(find.text('Cancel'), findsOneWidget);
    expect(find.text('Send SOS'), findsOneWidget);

    // ---- Cancel closes dialog ----
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();

    expect(find.text('Emergency Alert'), findsNothing);

    // ---- Open again ----
    await tester.tap(find.text('SOS EMERGENCY'));
    await tester.pumpAndSettle();
    expect(find.text('Emergency Alert'), findsOneWidget);

    // ---- Send SOS closes dialog and shows SnackBar ----
    await tester.tap(find.text('Send SOS'));
    await tester.pump(); // start snackbar animation
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.text('Emergency Alert'), findsNothing);
    expect(find.text('Emergency alert sent!'), findsOneWidget);
  });

  testWidgets('Tapping Profile & Settings navigates to /profile-settings', (
    tester,
  ) async {
    final router = GoRouter(
      initialLocation: '/home',
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const DashboardScreen()),
        GoRoute(
          path: '/profile-settings',
          builder: (_, __) =>
              const Scaffold(body: Center(child: Text('PROFILE SETTINGS'))),
        ),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Profile & Settings'));
    await tester.pumpAndSettle();

    expect(find.text('PROFILE SETTINGS'), findsOneWidget);
  });
}
