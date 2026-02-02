import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/tasks_controller.dart';
import '../../widgets/app_card.dart';
import 'widgets/add_task_dialog.dart';

class TodaysTasksScreen extends ConsumerStatefulWidget {
  const TodaysTasksScreen({super.key});

  @override
  ConsumerState<TodaysTasksScreen> createState() => _TodaysTasksScreenState();
}

class _TodaysTasksScreenState extends ConsumerState<TodaysTasksScreen> {
  int tab = 0; // 0 schedule, 1 calendar

  @override
  Widget build(BuildContext context) {
    final tasks = ref.watch(tasksProvider);
    final pending = tasks.where((t) => !t.done).length;
    final completed = tasks.where((t) => t.done).length;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/tasks'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text("Today's Tasks"),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Your daily care routine',
              style: TextStyle(color: Color(0xFF6B7A90)),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
        child: Column(
          children: [
            _BackPill(
              text: 'Back to Tasks & Scheduling',
              onTap: () => context.go('/tasks'),
            ),
            const SizedBox(height: 14),

            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Today's Tasks",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Your daily care routine',
                              style: TextStyle(color: Color(0xFF6B7A90)),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(
                        height: 36,
                        child: FilledButton.icon(
                          onPressed: () => showDialog(
                            context: context,
                            builder: (_) => const AddTaskDialog(),
                          ),
                          icon: const Icon(Icons.add),
                          label: const Text('Add'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  Row(
                    children: [
                      // LEFT SIDE (can shrink)
                      Expanded(
                        child: Wrap(
                          crossAxisAlignment: WrapCrossAlignment.center,
                          spacing: 14,
                          children: const [
                            Text(
                              '•  Schedule',
                              style: TextStyle(fontWeight: FontWeight.w900),
                            ),
                            Text(
                              'Calendar',
                              style: TextStyle(fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(width: 8),

                      // RIGHT SIDE (must not overflow)
                      Flexible(
                        child: Text(
                          '$pending tasks pending  •  $completed completed',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textAlign: TextAlign.right,
                          style: const TextStyle(
                            color: Color(0xFF0E67FF),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // list
                  for (final t in tasks) ...[
                    _TaskRow(
                      title: t.title,
                      timeText: _fmt(t.dateTime),
                      done: t.done,
                      onToggle: () =>
                          ref.read(tasksProvider.notifier).toggleDone(t.id),
                      onEdit: () => ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Edit flow can be added later'),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static String _fmt(DateTime dt) {
    final h = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final m = dt.minute.toString().padLeft(2, '0');
    final ap = dt.hour >= 12 ? 'PM' : 'AM';
    return '${dt.month}/${dt.day}/${dt.year} at $h:$m $ap';
  }
}

class _BackPill extends StatelessWidget {
  final String text;
  final VoidCallback onTap;
  const _BackPill({required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: text,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE6EDF7)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.08),
                blurRadius: 18,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.arrow_back),
              SizedBox(width: 10),
              Text('Back to Tasks & Scheduling'),
            ],
          ),
        ),
      ),
    );
  }
}

class _TaskRow extends StatelessWidget {
  final String title;
  final String timeText;
  final bool done;
  final VoidCallback onToggle;
  final VoidCallback onEdit;

  const _TaskRow({
    required this.title,
    required this.timeText,
    required this.done,
    required this.onToggle,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    final bg = done ? const Color(0xFFEAFBEF) : Colors.white;
    final border = done ? const Color(0xFF9BE7B1) : const Color(0xFFE6EDF7);

    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: border),
      ),
      child: Row(
        children: [
          Semantics(
            button: true,
            label: done ? 'Mark not done' : 'Mark done',
            child: InkWell(
              onTap: onToggle,
              borderRadius: BorderRadius.circular(18),
              child: Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: done ? const Color(0xFF22C55E) : Colors.transparent,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFCBD5E1)),
                ),
                child: done
                    ? const Icon(Icons.check, size: 18, color: Colors.white)
                    : null,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    decoration: done
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
                    color: done
                        ? const Color(0xFF6B7A90)
                        : const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  timeText,
                  style: const TextStyle(color: Color(0xFF6B7A90)),
                ),
              ],
            ),
          ),
          Semantics(
            button: true,
            label: 'Edit task',
            child: IconButton(
              onPressed: onEdit,
              icon: const Icon(Icons.edit_outlined),
            ),
          ),
        ],
      ),
    );
  }
}
