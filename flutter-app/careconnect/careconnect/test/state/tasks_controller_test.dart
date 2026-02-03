import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/state/tasks_controller.dart';
import 'package:careconnect/models/task.dart';

void main() {
  group('TasksController', () {
    late TasksController controller;

    setUp(() {
      controller = TasksController();
    });

    test('initial state is empty list', () {
      expect(controller.state, isEmpty);
    });

    test('seed populates tasks', () {
      controller.seed();

      expect(controller.state, isNotEmpty);
      expect(controller.state.length, 4);
      expect(controller.state[0].title, 'Take morning medication');
      expect(controller.state[0].done, true);
      expect(controller.state[1].title, 'Blood pressure check');
      expect(controller.state[1].done, false);
    });

    test('toggleDone toggles task completion status', () {
      controller.seed();
      final taskId = controller.state[1].id;
      final initialDoneStatus = controller.state[1].done;

      controller.toggleDone(taskId);

      final updatedTask = controller.state.firstWhere((t) => t.id == taskId);
      expect(updatedTask.done, !initialDoneStatus);
    });

    test('toggleDone only affects target task', () {
      controller.seed();
      final taskId = controller.state[0].id;
      final otherTask = controller.state[1];

      controller.toggleDone(taskId);

      final unchangedTask = controller.state.firstWhere((t) => t.id == otherTask.id);
      expect(unchangedTask.done, otherTask.done);
      expect(unchangedTask.title, otherTask.title);
    });

    test('toggleDone can be called multiple times on same task', () {
      controller.seed();
      final taskId = controller.state[0].id;
      final initialStatus = controller.state[0].done;

      controller.toggleDone(taskId);
      controller.toggleDone(taskId);

      final task = controller.state.firstWhere((t) => t.id == taskId);
      expect(task.done, initialStatus);
    });

    test('addTask adds new task to beginning of list', () {
      controller.seed();
      final initialCount = controller.state.length;
      final newTaskTitle = 'New Test Task';
      final newTaskDate = DateTime.now().add(const Duration(hours: 2));

      controller.addTask(newTaskTitle, newTaskDate);

      expect(controller.state.length, initialCount + 1);
      expect(controller.state.first.title, newTaskTitle);
      expect(controller.state.first.dateTime, newTaskDate);
      expect(controller.state.first.done, false);
    });

    test('addTask creates task with unique id', () {
      controller.seed();

      controller.addTask('Task 1', DateTime.now());
      final task1Id = controller.state.first.id;

      controller.addTask('Task 2', DateTime.now());
      final task2Id = controller.state.first.id;

      expect(task1Id, isNot(equals(task2Id)));
    });

    test('addTask works with empty state', () {
      final taskTitle = 'First Task';
      final taskDate = DateTime.now();

      controller.addTask(taskTitle, taskDate);

      expect(controller.state.length, 1);
      expect(controller.state.first.title, taskTitle);
      expect(controller.state.first.done, false);
    });
  });
}
