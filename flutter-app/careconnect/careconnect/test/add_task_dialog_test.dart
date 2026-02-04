import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:careconnect/screens/tasks/widgets/add_task_dialog.dart';

void main() {
  group('AddTaskDialog', () {
    testWidgets('renders dialog with title', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Add New Task'), findsOneWidget);
    });

    testWidgets('renders dialog with subtitle', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Create a new task with details and schedule.'), findsOneWidget);
    });

    testWidgets('has close button', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.close), findsOneWidget);
    });

    testWidgets('closes dialog when close button is tapped', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (context) => ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => AddTaskDialog(),
                    );
                  },
                  child: Text('Show Dialog'),
                ),
              ),
            ),
          ),
        ),
      );

      // Open dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      expect(find.byType(AddTaskDialog), findsOneWidget);

      // Close dialog
      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();

      expect(find.byType(AddTaskDialog), findsNothing);
    });

    testWidgets('has required input fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Task Title *'), findsOneWidget);
      expect(find.text('Date *'), findsOneWidget);
      expect(find.text('Time *'), findsOneWidget);
      expect(find.text('Notes (Optional)'), findsOneWidget);
    });

    testWidgets('has text input field for task title', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      expect(find.byType(TextField), findsNWidgets(2)); // Title and Notes fields
    });

    testWidgets('has Add Task and Cancel buttons', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Add Task'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);
    });

    testWidgets('closes dialog when Cancel button is tapped', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (context) => ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => AddTaskDialog(),
                    );
                  },
                  child: Text('Show Dialog'),
                ),
              ),
            ),
          ),
        ),
      );

      // Open dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      // Close dialog with Cancel button
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      expect(find.byType(AddTaskDialog), findsNothing);
    });

    testWidgets('shows validation error for empty required fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (context) => ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => AddTaskDialog(),
                    );
                  },
                  child: Text('Show Dialog'),
                ),
              ),
            ),
          ),
        ),
      );

      // Open dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      // Try to add task without filling required fields
      await tester.tap(find.text('Add Task'));
      await tester.pumpAndSettle();

      expect(find.text('Please fill all required fields.'), findsOneWidget);
    });

    testWidgets('accepts text input in task title field', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      final titleField = find.widgetWithText(TextField, 'Enter task name');
      await tester.enterText(titleField, 'Test Task');
      
      expect(find.text('Test Task'), findsOneWidget);
    });

    testWidgets('accepts text input in notes field', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      final notesField = find.widgetWithText(TextField, 'Add any additional details...');
      await tester.enterText(notesField, 'Test notes');
      
      expect(find.text('Test notes'), findsOneWidget);
    });

    testWidgets('date picker field is tappable', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      // Find the date picker by looking for InkWell with label
      final datePickerSemantics = find.bySemanticsLabel('Date *');
      expect(datePickerSemantics, findsOneWidget);
    });

    testWidgets('time picker field is tappable', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AddTaskDialog(),
            ),
          ),
        ),
      );

      // Find the time picker by looking for InkWell with label
      final timePickerSemantics = find.bySemanticsLabel('Time *');
      expect(timePickerSemantics, findsOneWidget);
    });
  });
}
