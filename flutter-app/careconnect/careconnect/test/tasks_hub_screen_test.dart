import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect/screens/tasks/tasks_hub_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('TasksHubScreen', () {
    Future<void> pumpApp(
      WidgetTester tester, {
      String initialLocation = '/tasks',
    }) async {
      final router = GoRouter(
        initialLocation: initialLocation,
        routes: [
          GoRoute(
            path: '/home',
            builder: (_, __) =>
                const Scaffold(body: Center(child: Text('HOME_SCREEN'))),
          ),
          GoRoute(path: '/tasks', builder: (_, __) => const TasksHubScreen()),
          GoRoute(
            path: '/tasks/today',
            builder: (_, __) =>
                const Scaffold(body: Center(child: Text('TODAY_TASKS_SCREEN'))),
          ),
          GoRoute(
            path: '/tasks/appointments',
            builder: (_, __) => const Scaffold(
              body: Center(child: Text('APPOINTMENTS_SCREEN')),
            ),
          ),
        ],
      );

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      expect(find.byType(TasksHubScreen), findsOneWidget);
    }

    Future<void> tapVisible(WidgetTester tester, Finder finder) async {
      await tester.ensureVisible(finder);
      await tester.pumpAndSettle();
      await tester.tap(finder);
      await tester.pumpAndSettle();
    }

    testWidgets('renders main content', (tester) async {
      await pumpApp(tester);

      expect(find.text('Tasks & Scheduling'), findsOneWidget);
      expect(find.text('Manage your daily routine'), findsOneWidget);

      expect(find.text("Today's Tasks"), findsOneWidget);
      expect(find.text('Upcoming Appointments'), findsOneWidget);

      expect(find.text('Back to Dashboard'), findsOneWidget);
    });

    testWidgets('AppBar back button navigates to /home', (tester) async {
      await pumpApp(tester);

      // AppBar back IconButton is wrapped in Semantics(label: 'Back')
      await tapVisible(tester, find.byIcon(Icons.arrow_back).first);

      expect(find.text('HOME_SCREEN'), findsOneWidget);
    });

    testWidgets('Back to Dashboard pill navigates to /home', (tester) async {
      await pumpApp(tester);

      await tapVisible(tester, find.text('Back to Dashboard'));

      expect(find.text('HOME_SCREEN'), findsOneWidget);
    });

    testWidgets('tapping Today\'s Tasks navigates to /tasks/today', (
      tester,
    ) async {
      await pumpApp(tester);

      await tapVisible(tester, find.text("Today's Tasks"));

      expect(find.text('TODAY_TASKS_SCREEN'), findsOneWidget);
    });

    testWidgets(
      'tapping Upcoming Appointments navigates to /tasks/appointments',
      (tester) async {
        await pumpApp(tester);

        await tapVisible(tester, find.text('Upcoming Appointments'));

        expect(find.text('APPOINTMENTS_SCREEN'), findsOneWidget);
      },
    );
  });
}
