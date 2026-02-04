import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

// Update these imports if your paths differ:
import 'package:careconnect/screens/health/widgets/new_note_dialog.dart';
import 'package:careconnect/state/notes_controller.dart';

void main() {
  testWidgets('NewNoteDialog renders and validates empty fields', (
    tester,
  ) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) => Center(
                child: ElevatedButton(
                  onPressed: () => showDialog(
                    context: context,
                    builder: (_) => const NewNoteDialog(),
                  ),
                  child: const Text('Open'),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Open dialog
    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();

    // Render checks
    expect(find.text('New Note'), findsOneWidget);
    expect(find.text('Add a new personal note'), findsOneWidget);
    expect(find.text('Title'), findsOneWidget);
    expect(find.text('Note'), findsOneWidget);
    expect(find.text('Add Note'), findsOneWidget);

    // Tap Add Note with empty fields -> SnackBar
    await tester.tap(find.text('Add Note'));
    await tester.pump(); // start snackbar animation
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.text('Please enter title and note.'), findsOneWidget);

    // Dialog should still be open
    expect(find.byType(NewNoteDialog), findsOneWidget);
  });
  testWidgets('NewNoteDialog adds note and closes', (tester) async {
    // Create our own container so we can read provider state safely
    final container = ProviderContainer();
    addTearDown(container.dispose);

    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) => Center(
                child: ElevatedButton(
                  onPressed: () => showDialog(
                    context: context,
                    builder: (_) => const NewNoteDialog(),
                  ),
                  child: const Text('Open'),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Open dialog
    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();

    // Find fields by hint
    final titleField = find.byWidgetPredicate((w) {
      return w is TextField && w.decoration?.hintText == 'Note title';
    });
    final bodyField = find.byWidgetPredicate((w) {
      return w is TextField && w.decoration?.hintText == 'Enter your note here';
    });

    expect(titleField, findsOneWidget);
    expect(bodyField, findsOneWidget);

    // Enter valid text
    await tester.enterText(titleField, 'Doctor visit');
    await tester.enterText(bodyField, 'Need to discuss medication schedule.');
    await tester.pump();

    // Tap Add Note
    await tester.tap(find.text('Add Note'));
    await tester.pumpAndSettle();

    // Dialog closes
    expect(find.byType(NewNoteDialog), findsNothing);

    // verify provider state changed
    final notes = container.read(notesProvider);
    expect(notes.isNotEmpty, true);
  });
}
