import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/task.dart';

final tasksProvider = StateNotifierProvider<TasksController, List<TaskItem>>((
  ref,
) {
  return TasksController()..seed();
});

class TasksController extends StateNotifier<List<TaskItem>> {
  TasksController() : super(const []);

  void seed() {
    final now = DateTime.now();
    state = [
      TaskItem(
        id: 't1',
        title: 'Take morning medication',
        dateTime: now,
        done: true,
      ),
      TaskItem(
        id: 't2',
        title: 'Blood pressure check',
        dateTime: now.add(const Duration(hours: 1)),
        done: false,
      ),
      TaskItem(
        id: 't3',
        title: 'Physical therapy session',
        dateTime: now.add(const Duration(hours: 5)),
        done: false,
      ),
      TaskItem(
        id: 't4',
        title: 'Take evening medication',
        dateTime: now.add(const Duration(hours: 10)),
        done: false,
      ),
    ];
  }

  void toggleDone(String id) {
    state = [
      for (final t in state)
        if (t.id == id) t.copyWith(done: !t.done) else t,
    ];
  }

  void addTask(String title, DateTime dt, {String? notes}) {
    final id = DateTime.now().microsecondsSinceEpoch.toString();
    state = [
      TaskItem(id: id, title: title, dateTime: dt, done: false),
      ...state,
    ];
  }
}
