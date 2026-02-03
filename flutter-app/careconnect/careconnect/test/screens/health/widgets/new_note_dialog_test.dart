import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:careconnect/screens/health/widgets/new_note_dialog.dart';

void main() {
  group('NewNoteDialog Widget Tests', () {
    testWidgets('renders dialog with title and description', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      expect(find.text('New Note'), findsOneWidget);
      expect(find.text('Add a new personal note'), findsOneWidget);
    });

    testWidgets('displays close button', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.close), findsOneWidget);
    });

    testWidgets('displays title and note input fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
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

    testWidgets('displays add note button', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      expect(find.text('Add Note'), findsOneWidget);
    });

    testWidgets('title field accepts text input', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      final titleField = find.byType(TextField).first;
      await tester.enterText(titleField, 'Test Title');
      await tester.pump();

      expect(find.text('Test Title'), findsOneWidget);
    });

    testWidgets('note field accepts text input', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      final noteField = find.byType(TextField).last;
      await tester.enterText(noteField, 'Test note content');
      await tester.pump();

      expect(find.text('Test note content'), findsOneWidget);
    });

    testWidgets('shows snackbar when fields are empty', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      // Tap the Add Note button without entering any text
      await tester.tap(find.text('Add Note'));
      await tester.pumpAndSettle();

      expect(find.text('Please enter title and note.'), findsOneWidget);
    });

    testWidgets('shows snackbar when only title is entered', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      // Enter only title
      final titleField = find.byType(TextField).first;
      await tester.enterText(titleField, 'Test Title');
      await tester.pump();

      // Tap the Add Note button
      await tester.tap(find.text('Add Note'));
      await tester.pumpAndSettle();

      expect(find.text('Please enter title and note.'), findsOneWidget);
    });

    testWidgets('shows snackbar when only note is entered', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      // Enter only note
      final noteField = find.byType(TextField).last;
      await tester.enterText(noteField, 'Test note content');
      await tester.pump();

      // Tap the Add Note button
      await tester.tap(find.text('Add Note'));
      await tester.pumpAndSettle();

      expect(find.text('Please enter title and note.'), findsOneWidget);
    });

    testWidgets('note field allows multiple lines', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewNoteDialog(),
            ),
          ),
        ),
      );

      final noteField = tester.widget<TextField>(find.byType(TextField).last);
      expect(noteField.maxLines, 3);
    });
  });
}
