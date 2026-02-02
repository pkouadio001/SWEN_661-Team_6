import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/app_card.dart';
import 'push_settings_dialog.dart';

class NotificationsRemindersScreen extends StatelessWidget {
  const NotificationsRemindersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/home'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Notifications & Reminders'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Stay on track with your care',
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
              text: 'Back to Dashboard',
              onTap: () => context.go('/home'),
            ),
            const SizedBox(height: 14),

            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Upcoming This Week',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Scheduled reminders for the next 7 days',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                  const SizedBox(height: 12),

                  _WeekCard(
                    title: 'Tomorrow - Jan 26, 2026',
                    items: const [
                      'Morning medication (9:00 AM)',
                      'Physical therapy session (10:00 AM)',
                      'Lunch medication (12:00 PM)',
                    ],
                  ),
                  const SizedBox(height: 12),
                  _WeekCard(
                    title: 'Monday - Jan 27, 2026',
                    items: const [
                      'Lab work appointment (8:00 AM)',
                      'Daily medications (as scheduled)',
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),

            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Notification Settings',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Customize how you receive reminders',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                  const SizedBox(height: 12),

                  Container(
                    padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE6EDF7)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.notifications_none),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Text(
                            'Push Notifications',
                            style: TextStyle(fontWeight: FontWeight.w900),
                          ),
                        ),
                        OutlinedButton(
                          onPressed: () => showDialog(
                            context: context,
                            builder: (_) => const PushSettingsDialog(),
                          ),
                          child: const Text('Configure'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),
                  _ColorSetting(
                    title: 'Normal Priority Vibration',
                    subtitle: 'Current: Medium',
                    color: const Color(0xFFEAF2FF),
                    border: const Color(0xFF93C5FD),
                  ),
                  const SizedBox(height: 12),
                  _ColorSetting(
                    title: 'Urgent Priority Vibration',
                    subtitle: 'Current: High',
                    color: const Color(0xFFFFE4E6),
                    border: const Color(0xFFFDA4AF),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
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
            Text('Back to Dashboard'),
          ],
        ),
      ),
    );
  }
}

class _WeekCard extends StatelessWidget {
  final String title;
  final List<String> items;

  const _WeekCard({required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE6EDF7)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.calendar_month_outlined),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
            ],
          ),
          const SizedBox(height: 10),
          for (final it in items) ...[
            Row(
              children: [
                const Text(
                  '•  ',
                  style: TextStyle(fontWeight: FontWeight.w900),
                ),
                Expanded(child: Text(it)),
              ],
            ),
            const SizedBox(height: 6),
          ],
        ],
      ),
    );
  }
}

class _ColorSetting extends StatelessWidget {
  final String title;
  final String subtitle;
  final Color color;
  final Color border;

  const _ColorSetting({
    required this.title,
    required this.subtitle,
    required this.color,
    required this.border,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: border),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(color: Color(0xFF0F172A)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
