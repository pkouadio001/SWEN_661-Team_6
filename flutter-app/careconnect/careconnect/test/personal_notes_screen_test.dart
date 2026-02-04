import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

// Update imports if your paths differ:
import 'package:careconnect/screens/health/personal_notes_screen.dart';
import 'package:careconnect/screens/health/widgets/new_note_dialog.dart';

void main() {
  testWidgets('PersonalNotesScreen renders and can open NewNoteDialog', (
    tester,
  ) async {
    const healthHub = Scaffold(body: Center(child: Text('HEALTH HUB')));

    final router = GoRouter(
      initialLocation: '/health/notes',
      routes: [
        GoRoute(path: '/health', builder: (_, __) => healthHub),
        GoRoute(
          path: '/health/notes',
          builder: (_, __) => const PersonalNotesScreen(),
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(child: MaterialApp.router(routerConfig: router)),
    );
    await tester.pumpAndSettle();

    // ---- Render checks ----
    expect(find.text('Personal Notes'), findsWidgets); // AppBar + card header
    expect(find.text('Track your thoughts and symptoms'), findsWidgets);
    expect(find.text('Back to Notes & Health Logs'), findsOneWidget);
    expect(find.text('New Note'), findsOneWidget);

    // ---- Open dialog ----
    await tester.tap(find.text('New Note'));
    await tester.pumpAndSettle();

    expect(find.byType(NewNoteDialog), findsOneWidget);
    expect(
      find.text('New Note'),
      findsWidgets,
    ); // dialog title + button text exists elsewhere
    expect(find.text('Add a new personal note'), findsOneWidget);
    expect(find.text('Add Note'), findsOneWidget);
  });

  testWidgets('Adding a note via NewNoteDialog closes dialog', (tester) async {
    const healthHub = Scaffold(body: Center(child: Text('HEALTH HUB')));

    final router = GoRouter(
      initialLocation: '/health/notes',
      routes: [
        GoRoute(path: '/health', builder: (_, __) => healthHub),
        GoRoute(
          path: '/health/notes',
          builder: (_, __) => const PersonalNotesScreen(),
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(child: MaterialApp.router(routerConfig: router)),
    );
    await tester.pumpAndSettle();

    // Open dialog
    await tester.tap(find.text('New Note'));
    await tester.pumpAndSettle();
    expect(find.byType(NewNoteDialog), findsOneWidget);

    // Find fields by hintText (matches your NewNoteDialog)
    final titleField = find.byWidgetPredicate((w) {
      return w is TextField && w.decoration?.hintText == 'Note title';
    });
    final bodyField = find.byWidgetPredicate((w) {
      return w is TextField && w.decoration?.hintText == 'Enter your note here';
    });

    expect(titleField, findsOneWidget);
    expect(bodyField, findsOneWidget);

    // Enter data
    await tester.enterText(titleField, 'Pain level');
    await tester.enterText(bodyField, 'Pain was mild today.');
    await tester.pump();

    // Tap Add Note
    await tester.tap(find.text('Add Note'));
    await tester.pumpAndSettle();

    // Dialog should close
    expect(find.byType(NewNoteDialog), findsNothing);
  });
}
