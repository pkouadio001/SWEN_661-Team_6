import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/state/notes_controller.dart';
import 'package:careconnect/models/note.dart';

void main() {
  group('NotesController', () {
    late NotesController controller;

    setUp(() {
      controller = NotesController();
    });

    test('initial state is empty list', () {
      expect(controller.state, isEmpty);
    });

    test('seed populates notes', () {
      controller.seed();

      expect(controller.state, isNotEmpty);
      expect(controller.state.length, 4);
      expect(controller.state[0].title, 'Feeling better today');
      expect(controller.state[0].body, contains('new medication'));
    });

    test('seed creates notes with proper structure', () {
      controller.seed();

      for (final note in controller.state) {
        expect(note.id, isNotEmpty);
        expect(note.title, isNotEmpty);
        expect(note.body, isNotEmpty);
        expect(note.dateTime, isNotNull);
      }
    });

    test('add creates new note at beginning of list', () {
      controller.seed();
      final initialCount = controller.state.length;
      final newTitle = 'Test Note Title';
      final newBody = 'Test note body content';

      controller.add(newTitle, newBody);

      expect(controller.state.length, initialCount + 1);
      expect(controller.state.first.title, newTitle);
      expect(controller.state.first.body, newBody);
    });

    test('add creates note with unique id', () {
      controller.seed();

      controller.add('Title 1', 'Body 1');
      final note1Id = controller.state.first.id;

      controller.add('Title 2', 'Body 2');
      final note2Id = controller.state.first.id;

      expect(note1Id, isNot(equals(note2Id)));
    });

    test('add sets current dateTime', () {
      final beforeAdd = DateTime.now();

      controller.add('Title', 'Body');

      final afterAdd = DateTime.now();
      final noteDateTime = controller.state.first.dateTime;

      expect(noteDateTime.isAfter(beforeAdd.subtract(const Duration(seconds: 1))), true);
      expect(noteDateTime.isBefore(afterAdd.add(const Duration(seconds: 1))), true);
    });

    test('add works with empty state', () {
      final noteTitle = 'First Note';
      final noteBody = 'First note body';

      controller.add(noteTitle, noteBody);

      expect(controller.state.length, 1);
      expect(controller.state.first.title, noteTitle);
      expect(controller.state.first.body, noteBody);
    });

    test('add handles empty strings', () {
      controller.add('', '');

      expect(controller.state.length, 1);
      expect(controller.state.first.title, '');
      expect(controller.state.first.body, '');
    });

    test('add handles multi-line body text', () {
      final multiLineBody = 'Line 1\nLine 2\nLine 3';

      controller.add('Multi-line Note', multiLineBody);

      expect(controller.state.first.body, multiLineBody);
    });
  });
}
