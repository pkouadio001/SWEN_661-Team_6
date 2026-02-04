import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

// Update imports if your paths differ:
import 'package:careconnect/screens/health/health_logs_screen.dart';

void main() {
  testWidgets('HealthLogsScreen renders key UI', (tester) async {
    const healthHub = Scaffold(body: Center(child: Text('HEALTH HUB')));

    final router = GoRouter(
      initialLocation: '/health/logs',
      routes: [
        GoRoute(path: '/health', builder: (_, __) => healthHub),
        GoRoute(
          path: '/health/logs',
          builder: (_, __) => const HealthLogsScreen(),
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(child: MaterialApp.router(routerConfig: router)),
    );
    await tester.pumpAndSettle();

    // AppBar title + subtitle
    expect(
      find.text('Health Logs'),
      findsWidgets,
    ); // appears in AppBar + card header
    expect(find.text('Recent vital measurements'), findsWidgets);

    // Back pill
    expect(find.text('Back to Notes & Health Logs'), findsOneWidget);

    // Chips
    expect(find.text('View All'), findsOneWidget);
    expect(find.text('Vital Measurements'), findsOneWidget);
    expect(find.text('Mood'), findsOneWidget);
    expect(find.text('Symptoms'), findsOneWidget);
    expect(find.text('Meals'), findsOneWidget);

    // "View All (X entries)" button exists
    expect(find.byType(OutlinedButton), findsWidgets);
    expect(find.textContaining('View All ('), findsOneWidget);
  });

  testWidgets('Tapping chips changes selection state', (tester) async {
    final router = GoRouter(
      initialLocation: '/health/logs',
      routes: [
        GoRoute(path: '/health', builder: (_, __) => const SizedBox.shrink()),
        GoRoute(
          path: '/health/logs',
          builder: (_, __) => const HealthLogsScreen(),
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(child: MaterialApp.router(routerConfig: router)),
    );
    await tester.pumpAndSettle();

    // Initially filter==0, so "View All" should be bold (w900)
    Text viewAllText() => tester.widget<Text>(find.text('View All'));
    expect(viewAllText().style?.fontWeight, FontWeight.w900);

    // Tap "Mood"
    await tester.tap(find.text('Mood'));
    await tester.pumpAndSettle();

    // Now "Mood" should be bold
    final moodText = tester.widget<Text>(find.text('Mood'));
    expect(moodText.style?.fontWeight, FontWeight.w900);

    // And "View All" should NOT be bold anymore
    final viewAllAfter = tester.widget<Text>(find.text('View All'));
    expect(viewAllAfter.style?.fontWeight, isNot(FontWeight.w900));
  });
}
