import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/models/task.dart';

void main() {
  group('TaskItem', () {
    final testDateTime = DateTime(2024, 1, 15, 10, 30);

    test('creates instance with required fields', () {
      final task = TaskItem(
        id: 't1',
        title: 'Test Task',
        dateTime: testDateTime,
        done: false,
      );

      expect(task.id, 't1');
      expect(task.title, 'Test Task');
      expect(task.dateTime, testDateTime);
      expect(task.done, false);
    });

    test('copyWith updates title', () {
      final original = TaskItem(
        id: 't1',
        title: 'Original Title',
        dateTime: testDateTime,
        done: false,
      );

      final updated = original.copyWith(title: 'Updated Title');

      expect(updated.id, 't1');
      expect(updated.title, 'Updated Title');
      expect(updated.dateTime, testDateTime);
      expect(updated.done, false);
    });

    test('copyWith updates dateTime', () {
      final original = TaskItem(
        id: 't1',
        title: 'Test Task',
        dateTime: testDateTime,
        done: false,
      );

      final newDateTime = DateTime(2024, 1, 16, 14, 0);
      final updated = original.copyWith(dateTime: newDateTime);

      expect(updated.id, 't1');
      expect(updated.title, 'Test Task');
      expect(updated.dateTime, newDateTime);
      expect(updated.done, false);
    });

    test('copyWith updates done status', () {
      final original = TaskItem(
        id: 't1',
        title: 'Test Task',
        dateTime: testDateTime,
        done: false,
      );

      final updated = original.copyWith(done: true);

      expect(updated.id, 't1');
      expect(updated.title, 'Test Task');
      expect(updated.dateTime, testDateTime);
      expect(updated.done, true);
    });

    test('copyWith maintains id field', () {
      final original = TaskItem(
        id: 't1',
        title: 'Test Task',
        dateTime: testDateTime,
        done: false,
      );

      final updated = original.copyWith(title: 'New Title');

      expect(updated.id, original.id);
    });

    test('copyWith with no parameters returns copy with same values', () {
      final original = TaskItem(
        id: 't1',
        title: 'Test Task',
        dateTime: testDateTime,
        done: false,
      );

      final copy = original.copyWith();

      expect(copy.id, original.id);
      expect(copy.title, original.title);
      expect(copy.dateTime, original.dateTime);
      expect(copy.done, original.done);
    });
  });
}
