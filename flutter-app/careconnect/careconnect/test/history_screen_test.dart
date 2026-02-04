import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect/screens/health/history_screen.dart';

void main() {
  testWidgets('HistoryScreen renders and back pill navigates to /health', (
    tester,
  ) async {
    const healthHub = Scaffold(body: Center(child: Text('HEALTH HUB')));

    final router = GoRouter(
      initialLocation: '/health/history',
      routes: [
        GoRoute(path: '/health', builder: (_, __) => healthHub),
        GoRoute(
          path: '/health/history',
          builder: (_, __) => const HistoryScreen(),
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(child: MaterialApp.router(routerConfig: router)),
    );
    await tester.pumpAndSettle();

    // Static UI checks
    expect(find.text('History'), findsWidgets); // AppBar + card header
    expect(find.text('Your complete health and notes timeline'), findsWidgets);
    expect(find.text('Back to Notes & Health Logs'), findsOneWidget);
    expect(find.text('View All History (7 entries)'), findsOneWidget);

    // Back pill navigation
    await tester.tap(find.text('Back to Notes & Health Logs'));
    await tester.pumpAndSettle();

    expect(find.text('HEALTH HUB'), findsOneWidget);
  });
}
