import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:careconnect/state/notes_controller.dart';
import 'package:careconnect/models/note.dart';

void main() {
  group('NotesController (unit)', () {
    test('notesProvider seeds initial notes', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notes = container.read(notesProvider);

      expect(notes, isA<List<NoteItem>>());
      expect(notes.length, 4);

      expect(notes[0].id, 'n1');
      expect(notes[0].title, 'Feeling better today');

      expect(notes[1].id, 'n2');
      expect(notes[2].id, 'n3');
      expect(notes[3].id, 'n4');
    });

    test('notes are ordered newest to oldest after seed', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notes = container.read(notesProvider);

      for (int i = 0; i < notes.length - 1; i++) {
        expect(
          notes[i].dateTime.isAfter(notes[i + 1].dateTime) ||
              notes[i].dateTime.isAtSameMomentAs(notes[i + 1].dateTime),
          isTrue,
        );
      }
    });

    test('add() inserts a new note at the top', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(notesProvider.notifier);

      controller.add('Test Note', 'This is a test note.');

      final notes = container.read(notesProvider);

      expect(notes.length, 5);
      expect(notes.first.title, 'Test Note');
      expect(notes.first.body, 'This is a test note.');
    });

    test('add() adds notes to top and increases length', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(notesProvider.notifier);

      final beforeLen = container.read(notesProvider).length;

      controller.add('Note 1', 'Body 1');
      controller.add('Note 2', 'Body 2');

      final notes = container.read(notesProvider);

      // length increased by 2
      expect(notes.length, beforeLen + 2);

      // newest note is first (because you prepend in add())
      expect(notes.first.title, 'Note 2');
      expect(notes.first.body, 'Body 2');

      // previous note should be next
      expect(notes[1].title, 'Note 1');
      expect(notes[1].body, 'Body 1');
    });
  });
}
