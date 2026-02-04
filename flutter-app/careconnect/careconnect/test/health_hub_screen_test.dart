import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

// Update import path if needed:
import 'package:careconnect/screens/health/health_hub_screen.dart';

void main() {
  testWidgets('HealthHubScreen renders and tiles navigate', (tester) async {
    const home = Scaffold(body: Center(child: Text('HOME')));
    const logs = Scaffold(body: Center(child: Text('HEALTH LOGS')));
    const notes = Scaffold(body: Center(child: Text('PERSONAL NOTES')));
    const history = Scaffold(body: Center(child: Text('HISTORY')));

    final router = GoRouter(
      initialLocation: '/health',
      routes: [
        GoRoute(path: '/home', builder: (_, __) => home),
        GoRoute(
          path: '/health',
          builder: (_, __) => const HealthHubScreen(),
          routes: [
            GoRoute(path: 'logs', builder: (_, __) => logs),
            GoRoute(path: 'notes', builder: (_, __) => notes),
            GoRoute(path: 'history', builder: (_, __) => history),
          ],
        ),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    // ---- Render checks ----
    expect(find.text('Notes & Health Logs'), findsOneWidget);
    expect(find.text('Track your health and notes'), findsOneWidget);
    expect(find.text('Back to Dashboard'), findsOneWidget);

    expect(find.text('Health Logs'), findsOneWidget);
    expect(find.text('Personal Notes'), findsOneWidget);
    expect(find.text('History'), findsOneWidget);

    // ---- Navigate: Health Logs ----
    await tester.ensureVisible(find.text('Health Logs'));
    await tester.tap(find.text('Health Logs'));
    await tester.pumpAndSettle();
    expect(find.text('HEALTH LOGS'), findsOneWidget);

    router.go('/health');
    await tester.pumpAndSettle();

    // ---- Navigate: Personal Notes ----
    await tester.ensureVisible(find.text('Personal Notes'));
    await tester.tap(find.text('Personal Notes'));
    await tester.pumpAndSettle();
    expect(find.text('PERSONAL NOTES'), findsOneWidget);

    router.go('/health');
    await tester.pumpAndSettle();

    // ---- Navigate: History ----
    await tester.ensureVisible(find.text('History')); // ✅ key fix
    await tester.tap(find.text('History'));
    await tester.pumpAndSettle();
    expect(find.text('HISTORY'), findsOneWidget);

    // ---- Back to hub and then to /home ----
    router.go('/health');
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Back to Dashboard'));
    await tester.tap(find.text('Back to Dashboard'));
    await tester.pumpAndSettle();
    expect(find.text('HOME'), findsOneWidget);
  });
}
