import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/health_logs_controller.dart';
import '../../widgets/app_card.dart';

class HealthLogsScreen extends ConsumerStatefulWidget {
  const HealthLogsScreen({super.key});

  @override
  ConsumerState<HealthLogsScreen> createState() => _HealthLogsScreenState();
}

class _HealthLogsScreenState extends ConsumerState<HealthLogsScreen> {
  int filter = 0; // 0 all, 1 vitals etc (placeholder)

  @override
  Widget build(BuildContext context) {
    final logs = ref.watch(healthLogsProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/health'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Health Logs'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Recent vital measurements',
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
                    'Health Logs',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Recent vital measurements',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                  const SizedBox(height: 10),

                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _Chip(
                        text: 'View All',
                        selected: filter == 0,
                        onTap: () => setState(() => filter = 0),
                      ),
                      _Chip(
                        text: 'Vital Measurements',
                        selected: filter == 1,
                        onTap: () => setState(() => filter = 1),
                      ),
                      _Chip(
                        text: 'Mood',
                        selected: filter == 2,
                        onTap: () => setState(() => filter = 2),
                      ),
                      _Chip(
                        text: 'Symptoms',
                        selected: filter == 3,
                        onTap: () => setState(() => filter = 3),
                      ),
                      _Chip(
                        text: 'Meals',
                        selected: filter == 4,
                        onTap: () => setState(() => filter = 4),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  for (final h in logs) ...[
                    _HealthRow(
                      label: h.label,
                      value: h.value,
                      timeText: _fmt(h.dateTime),
                    ),
                    const SizedBox(height: 10),
                  ],

                  const SizedBox(height: 6),
                  Center(
                    child: OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.remove_red_eye_outlined),
                      label: Text('View All (${logs.length} entries)'),
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

class _Chip extends StatelessWidget {
  final String text;
  final bool selected;
  final VoidCallback onTap;

  const _Chip({
    required this.text,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: text,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: selected ? const Color(0xFFEAF2FF) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFE6EDF7)),
          ),
          child: Text(
            text,
            style: TextStyle(
              fontWeight: selected ? FontWeight.w900 : FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}

class _HealthRow extends StatelessWidget {
  final String label;
  final String value;
  final String timeText;

  const _HealthRow({
    required this.label,
    required this.value,
    required this.timeText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE6EDF7)),
      ),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: const Color(0xFFEAFBEF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.monitor_heart_outlined,
              color: Color(0xFF10B981),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 4),
                Text(
                  timeText,
                  style: const TextStyle(color: Color(0xFF6B7A90)),
                ),
              ],
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
          ),
        ],
      ),
    );
  }
}
