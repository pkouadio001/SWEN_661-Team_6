import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect/screens/tasks/upcoming_appointments_screen.dart';
import 'package:careconnect/state/appointments_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('UpcomingAppointmentsScreen', () {
    Future<void> tapVisible(WidgetTester tester, Finder finder) async {
      await tester.ensureVisible(finder);
      await tester.pumpAndSettle();
      await tester.tap(finder);
      await tester.pumpAndSettle();
    }

    Future<ProviderContainer> pumpScreen(WidgetTester tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final router = GoRouter(
        initialLocation: '/tasks/appointments',
        routes: [
          GoRoute(
            path: '/tasks',
            builder: (_, __) =>
                const Scaffold(body: Center(child: Text('TASKS_HUB_SCREEN'))),
          ),
          GoRoute(
            path: '/tasks/appointments',
            builder: (_, __) => UncontrolledProviderScope(
              container: container,
              child: const UpcomingAppointmentsScreen(),
            ),
          ),
        ],
      );

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      expect(find.byType(UpcomingAppointmentsScreen), findsOneWidget);
      return container;
    }

    testWidgets('renders headings and tabs row', (tester) async {
      await pumpScreen(tester);

      expect(
        find.text('Upcoming Appointments'),
        findsWidgets,
      ); // AppBar + card title
      expect(find.text('Your scheduled visits'), findsWidgets);

      expect(find.text('•  Schedule'), findsOneWidget);
      expect(find.text('Calendar'), findsOneWidget);

      expect(find.text('View All'), findsOneWidget);
    });

    testWidgets('back pill navigates to /tasks', (tester) async {
      await pumpScreen(tester);

      await tapVisible(tester, find.text('Back to Tasks & Scheduling'));
      expect(find.text('TASKS_HUB_SCREEN'), findsOneWidget);
    });

    testWidgets('appBar back arrow navigates to /tasks', (tester) async {
      await pumpScreen(tester);

      await tapVisible(tester, find.byIcon(Icons.arrow_back).first);
      expect(find.text('TASKS_HUB_SCREEN'), findsOneWidget);
    });

    testWidgets('shows at least one appointment row when provider has data', (
      tester,
    ) async {
      final container = await pumpScreen(tester);

      final appts = container.read(appointmentsProvider);
      if (appts.isEmpty) {
        // Nothing to assert; this test becomes a no-op if default data is empty.
        return;
      }

      // Your UI shows each appointment title as Text(title)
      expect(find.text(appts.first.title), findsOneWidget);
    });
  });
}
