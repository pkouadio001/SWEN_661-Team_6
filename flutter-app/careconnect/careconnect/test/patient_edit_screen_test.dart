import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect/screens/patient/patient_edit_screen.dart';

void main() {
  // A helper function to wrap the widget with necessary providers and routing
  Widget createTestWidget({required ProviderContainer container}) {
    final router = GoRouter(
      initialLocation: '/edit',
      routes: [
        GoRoute(
          path: '/edit',
          builder: (context, state) => const PatientEditScreen(),
        ),
        GoRoute(
          path: '/patient',
          builder: (context, state) =>
              const Scaffold(body: Text('Patient View')),
        ),
        GoRoute(
          path: '/home',
          builder: (context, state) => const Scaffold(body: Text('Home View')),
        ),
      ],
    );

    return UncontrolledProviderScope(
      container: container,
      child: MaterialApp.router(routerConfig: router),
    );
  }

  testWidgets('Back to Dashboard pill navigates home', (
    WidgetTester tester,
  ) async {
    final container = ProviderContainer();
    await tester.pumpWidget(createTestWidget(container: container));

    await tester.tap(find.text('Back to Dashboard'));
    await tester.pumpAndSettle();

    expect(find.text('Home View'), findsOneWidget);
  });
}
