import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/notes_controller.dart';
import '../../state/health_logs_controller.dart';
import '../../widgets/app_card.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notes = ref.watch(notesProvider);
    final logs = ref.watch(healthLogsProvider);

    // Simple merged list (placeholder timeline)
    final items = <_HistoryItem>[
      for (final n in notes.take(2))
        _HistoryItem(
          date: n.dateTime,
          title: n.title,
          subtitle: n.body,
          right: '',
        ),
      for (final h in logs.take(3))
        _HistoryItem(
          date: h.dateTime,
          title: h.label,
          subtitle: _fmtTime(h.dateTime),
          right: h.value,
        ),
    ]..sort((a, b) => b.date.compareTo(a.date));

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/health'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('History'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Your complete health and notes timeline',
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
              text: 'Back to Notes & Health Logs',
              onTap: () => context.go('/health'),
            ),
            const SizedBox(height: 14),

            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'History',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Your complete health and notes timeline',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                  const SizedBox(height: 12),

                  for (final it in items) ...[
                    _TimelineRow(item: it),
                    const SizedBox(height: 10),
                  ],

                  const SizedBox(height: 6),
                  Center(
                    child: OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.remove_red_eye_outlined),
                      label: const Text('View All History (7 entries)'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static String _fmtTime(DateTime dt) {
    final h = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final m = dt.minute.toString().padLeft(2, '0');
    final ap = dt.hour >= 12 ? 'PM' : 'AM';
    return '$h:$m $ap';
  }
}

class _HistoryItem {
  final DateTime date;
  final String title;
  final String subtitle;
  final String right;
  _HistoryItem({
    required this.date,
    required this.title,
    required this.subtitle,
    required this.right,
  });
}

class _BackPill extends StatelessWidget {
  final String text;
  final VoidCallback onTap;
  const _BackPill({required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
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
              color: Colors.black.withOpacity(0.08),
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
            Text('Back to Notes & Health Logs'),
          ],
        ),
      ),
    );
  }
}

class _TimelineRow extends StatelessWidget {
  final _HistoryItem item;
  const _TimelineRow({required this.item});

  @override
  Widget build(BuildContext context) {
    final day = '${_mon(item.date.month)} ${item.date.day}, ${item.date.year}';
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // left line
        Column(
          children: [
            Container(width: 2, height: 12, color: const Color(0xFF10C7A5)),
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: const Color(0xFF10C7A5),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            Container(width: 2, height: 80, color: const Color(0xFF10C7A5)),
          ],
        ),
        const SizedBox(width: 12),

        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                day,
                style: const TextStyle(
                  color: Color(0xFF6B7A90),
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE6EDF7)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.title,
                            style: const TextStyle(fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            item.subtitle,
                            style: const TextStyle(color: Color(0xFF6B7A90)),
                          ),
                        ],
                      ),
                    ),
                    if (item.right.isNotEmpty)
                      Text(
                        item.right,
                        style: const TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  static String _mon(int m) => const [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][m - 1];
}
