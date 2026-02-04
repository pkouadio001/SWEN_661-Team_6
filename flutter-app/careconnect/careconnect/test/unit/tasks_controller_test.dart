import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:careconnect/state/tasks_controller.dart';
import 'package:careconnect/models/task.dart';

void main() {
  group('TasksController (unit)', () {
    test('seed() populates initial tasks', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final tasks = container.read(tasksProvider);

      expect(tasks, isA<List<TaskItem>>());
      expect(tasks.length, 4);

      expect(tasks.first.id, 't1');
      expect(tasks.first.done, isTrue);
    });

    test('toggleDone() toggles task completion', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(tasksProvider.notifier);

      final before = container
          .read(tasksProvider)
          .firstWhere((t) => t.id == 't2');

      expect(before.done, isFalse);

      notifier.toggleDone('t2');

      final after = container
          .read(tasksProvider)
          .firstWhere((t) => t.id == 't2');

      expect(after.done, isTrue);
    });

    test('addTask() adds new task at top of list', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(tasksProvider.notifier);

      final now = DateTime(2026, 1, 1, 10);

      notifier.addTask('New Test Task', now);

      final tasks = container.read(tasksProvider);

      expect(tasks.first.title, 'New Test Task');
      expect(tasks.first.done, isFalse);
      expect(tasks.length, 5);
    });
  });
}
