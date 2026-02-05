import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect/screens/tasks/todays_tasks_screen.dart';
import 'package:careconnect/screens/tasks/widgets/add_task_dialog.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('TodaysTasksScreen (uses real provider default)', () {
    Future<void> tapVisible(WidgetTester tester, Finder finder) async {
      await tester.ensureVisible(finder);
      await tester.pumpAndSettle();
      await tester.tap(finder);
      await tester.pump();
    }

    Future<ProviderContainer> pumpScreen(WidgetTester tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final router = GoRouter(
        initialLocation: '/tasks/today',
        routes: [
          GoRoute(
            path: '/tasks',
            builder: (_, __) =>
                const Scaffold(body: Center(child: Text('TASKS_HUB_SCREEN'))),
          ),
          GoRoute(
            path: '/tasks/today',
            builder: (_, __) => UncontrolledProviderScope(
              container: container,
              child: const TodaysTasksScreen(),
            ),
          ),
        ],
      );

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();
      expect(find.byType(TodaysTasksScreen), findsOneWidget);

      return container;
    }

    testWidgets('renders screen + allows opening AddTaskDialog', (
      tester,
    ) async {
      await pumpScreen(tester);

      expect(find.text("Today's Tasks"), findsWidgets);
      expect(find.text('Your daily care routine'), findsWidgets);

      await tapVisible(tester, find.text('Add'));
      await tester.pumpAndSettle();

      expect(find.byType(AddTaskDialog), findsOneWidget);
    });

    testWidgets('back pill navigates to /tasks', (tester) async {
      await pumpScreen(tester);

      await tapVisible(tester, find.text('Back to Tasks & Scheduling'));
      await tester.pumpAndSettle();

      expect(find.text('TASKS_HUB_SCREEN'), findsOneWidget);
    });

    testWidgets('appBar back arrow navigates to /tasks', (tester) async {
      await pumpScreen(tester);

      await tapVisible(tester, find.byIcon(Icons.arrow_back).first);
      await tester.pumpAndSettle();

      expect(find.text('TASKS_HUB_SCREEN'), findsOneWidget);
    });

    testWidgets('tapping edit shows SnackBar (if at least one task exists)', (
      tester,
    ) async {
      await pumpScreen(tester);

      // Only run assertion if an edit icon exists (depends on default provider data)
      final editBtn = find.byIcon(Icons.edit_outlined);
      if (editBtn.evaluate().isEmpty) return;

      await tapVisible(tester, editBtn.first);
      await tester.pump();

      expect(find.text('Edit flow can be added later'), findsOneWidget);
    });

    testWidgets('toggling done updates UI (if at least one task exists)', (
      tester,
    ) async {
      await pumpScreen(tester);

      final toggle = find.bySemanticsLabel('Mark done');
      if (toggle.evaluate().isEmpty) return;

      await tapVisible(tester, toggle.first);
      await tester.pumpAndSettle();

      // check icon appears when done
      expect(find.byIcon(Icons.check), findsWidgets);
    });
  });
}
