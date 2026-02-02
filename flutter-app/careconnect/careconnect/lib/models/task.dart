class TaskItem {
  final String id;
  final String title;
  final DateTime dateTime;
  final bool done;

  const TaskItem({
    required this.id,
    required this.title,
    required this.dateTime,
    required this.done,
  });

  TaskItem copyWith({String? title, DateTime? dateTime, bool? done}) {
    return TaskItem(
      id: id,
      title: title ?? this.title,
      dateTime: dateTime ?? this.dateTime,
      done: done ?? this.done,
    );
  }
}
