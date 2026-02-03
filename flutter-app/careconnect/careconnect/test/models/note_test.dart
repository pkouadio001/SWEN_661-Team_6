import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/models/note.dart';

void main() {
  group('NoteItem', () {
    final testDateTime = DateTime(2024, 1, 15, 10, 30);

    test('creates instance with required fields', () {
      final note = NoteItem(
        id: 'n1',
        title: 'Test Note',
        body: 'This is a test note body',
        dateTime: testDateTime,
      );

      expect(note.id, 'n1');
      expect(note.title, 'Test Note');
      expect(note.body, 'This is a test note body');
      expect(note.dateTime, testDateTime);
    });

    test('creates note with empty body', () {
      final note = NoteItem(
        id: 'n2',
        title: 'Empty Body Note',
        body: '',
        dateTime: testDateTime,
      );

      expect(note.id, 'n2');
      expect(note.title, 'Empty Body Note');
      expect(note.body, '');
    });

    test('creates note with multi-line body', () {
      final note = NoteItem(
        id: 'n3',
        title: 'Multi-line Note',
        body: 'Line 1\nLine 2\nLine 3',
        dateTime: testDateTime,
      );

      expect(note.body, 'Line 1\nLine 2\nLine 3');
    });
  });
}
