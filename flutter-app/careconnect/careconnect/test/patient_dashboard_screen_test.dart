import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

// Update these imports if your paths differ:
import 'package:careconnect/screens/dashboard/patient_dashboard_screen.dart';

void main() {
  testWidgets('PatientDashboardScreen renders and tiles navigate', (
    tester,
  ) async {
    // Minimal placeholders for destination routes
    const tasksToday = Scaffold(body: Center(child: Text('TODAYS TASKS')));
    const messages = Scaffold(body: Center(child: Text('MESSAGES')));
    const patientInfo = Scaffold(body: Center(child: Text('PATIENT INFO')));
    const commSafety = Scaffold(body: Center(child: Text('COMM SAFETY')));

    final router = GoRouter(
      initialLocation: '/patient-home',
      routes: [
        GoRoute(
          path: '/patient-home',
          builder: (_, __) => const PatientDashboardScreen(),
        ),
        GoRoute(path: '/tasks/today', builder: (_, __) => tasksToday),
        GoRoute(path: '/comm/messages', builder: (_, __) => messages),
        GoRoute(path: '/patient', builder: (_, __) => patientInfo),
        GoRoute(path: '/comm', builder: (_, __) => commSafety),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    // ---- Render checks ----
    expect(find.text('Patient Dashboard'), findsOneWidget);
    expect(find.text('Welcome'), findsOneWidget);
    expect(find.text('Quick actions for patients'), findsOneWidget);

    // Tiles
    expect(find.text('Today’s Tasks'), findsOneWidget);
    expect(find.text('Messages'), findsOneWidget);
    expect(find.text('Patient Information'), findsOneWidget);
    expect(find.text('SOS Emergency'), findsOneWidget);

    // ---- Tap: Today’s Tasks ----
    await tester.tap(find.text('Today’s Tasks'));
    await tester.pumpAndSettle();
    expect(find.text('TODAYS TASKS'), findsOneWidget);

    // Go back to dashboard
    router.go('/patient-home');
    await tester.pumpAndSettle();

    // ---- Tap: Messages ----
    await tester.tap(find.text('Messages'));
    await tester.pumpAndSettle();
    expect(find.text('MESSAGES'), findsOneWidget);

    router.go('/patient-home');
    await tester.pumpAndSettle();

    // ---- Tap: Patient Information ----
    await tester.tap(find.text('Patient Information'));
    await tester.pumpAndSettle();
    expect(find.text('PATIENT INFO'), findsOneWidget);

    router.go('/patient-home');
    await tester.pumpAndSettle();

    // ---- Tap: SOS Emergency ----
    await tester.tap(find.text('SOS Emergency'));
    await tester.pumpAndSettle();
    expect(find.text('COMM SAFETY'), findsOneWidget);
  });
}
