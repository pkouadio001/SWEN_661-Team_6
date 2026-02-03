import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:careconnect/screens/health/widgets/new_note_dialog.dart';

void main() {
  group('NewNoteDialog', () {
    testWidgets('renders dialog with title', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      expect(find.text('New Note'), findsOneWidget);
    });

    testWidgets('renders dialog with subtitle', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Add a new personal note'), findsOneWidget);
    });

    testWidgets('has close button', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
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
                      builder: (_) => NewNoteDialog(),
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

      expect(find.byType(NewNoteDialog), findsOneWidget);

      // Close dialog
      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();

      expect(find.byType(NewNoteDialog), findsNothing);
    });

    testWidgets('has title and note input fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Title'), findsOneWidget);
      expect(find.text('Note'), findsOneWidget);
      expect(find.byType(TextField), findsNWidgets(2));
    });

    testWidgets('has Add Note button', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Add Note'), findsOneWidget);
    });

    testWidgets('shows validation error for empty fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (context) => ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => NewNoteDialog(),
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

      // Try to add note with empty fields
      await tester.tap(find.text('Add Note'));
      await tester.pumpAndSettle();

      expect(find.text('Please enter title and note.'), findsOneWidget);
    });

    testWidgets('accepts text input in title field', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      final titleField = find.widgetWithText(TextField, 'Note title');
      await tester.enterText(titleField, 'Test Title');
      
      expect(find.text('Test Title'), findsOneWidget);
    });

    testWidgets('accepts text input in note field', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      final noteField = find.widgetWithText(TextField, 'Enter your note here');
      await tester.enterText(noteField, 'Test note body');
      
      expect(find.text('Test note body'), findsOneWidget);
    });

    testWidgets('closes dialog after successfully adding note', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (context) => ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => NewNoteDialog(),
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

      // Fill in fields
      final titleField = find.widgetWithText(TextField, 'Note title');
      await tester.enterText(titleField, 'Test Title');
      
      final noteField = find.widgetWithText(TextField, 'Enter your note here');
      await tester.enterText(noteField, 'Test note body');

      // Add note
      await tester.tap(find.text('Add Note'));
      await tester.pumpAndSettle();

      // Dialog should be closed
      expect(find.byType(NewNoteDialog), findsNothing);
    });
  });
}
